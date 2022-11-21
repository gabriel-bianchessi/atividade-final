import { Request, Response, Router } from 'express'
import bcrypt from 'bcrypt'
import {v4 as uuid} from 'uuid'
import { PrismaClient } from '@prisma/client'
import jwt , { sign, verify } from 'jsonwebtoken'
import fs from 'fs'
import Redis from 'ioredis'
import ms from 'ms'

const redis = new Redis({ port: 8000 })

const privateKey = fs.readFileSync(__dirname + '/../../certs/jwtRS256.key', {encoding: 'utf-8'})
const publicKey = fs.readFileSync(__dirname + '/../../certs/jwtRS256.key.pub', {encoding: 'utf-8'})

const createToken = (payload: any) => sign(payload, privateKey, { algorithm: 'RS256', expiresIn: '15m' })
const createRefreshToken = (payload: any) => sign(payload, privateKey + publicKey, { algorithm: 'RS256', expiresIn: '1d' })
const storeToken = (refres_token: string, access_token: string) => redis.set(refres_token, access_token, 'EX', ms('60d'))

const prisma = new PrismaClient()
const router = Router()

router.post('/signIn', async (req: Request, res: Response) => {
  const {
    name,
    username,
    email,
    password,
    birthDate,
  } = req.body

  if (!name || !username || !email || !password || !birthDate) {
    return res.status(400).json({
      message: 'Missing required fields',
    })
  }

  const encryptedPassword = await bcrypt.hash(password, 10)
  const parsedDate = new Date(birthDate)

  const createdUser = await prisma.user.create({
    data: {
      id: uuid(),
      name,
      username,
      email,
      password: encryptedPassword,
      birthDate: parsedDate,
    },
    select: {
      id: true,
      name: true,
      username: true,
      email: true,
      birthDate: true,
    },
  })

  return res.status(200).json(createdUser)
})

router.post('/login', async (req: Request, res: Response) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({
      message: 'Missing required fields',
    })
  }

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
    select: {
      id: true,
      username: true,
      email: true,
      password: true,
    },
  })

  if (!user) {
    return res.status(404).json({
      message: 'User or password incorrect',
    })
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password)

  if (!isPasswordCorrect) {
    return res.status(404).json({
      message: 'User or password incorrect',
    })
  }

  const access_token = createToken({ id: user.id })
  const refresh_token = createRefreshToken({ id: user.id })
  await storeToken(refresh_token, access_token)
  return res.json({access_token, refresh_token})
})

router.use('/validate/', async (req: Request, res: Response) => {
  const bearerHeader = req.headers['authorization']?.split(' ')
  if(!bearerHeader) {
    return res.status(401).json({message: 'Missing authorization header'})
  }
  if (bearerHeader[0] !== 'Bearer') {
    return res.status(401).json({message: 'Invalid authorization header'})
  }
  const token = bearerHeader[1] ?? ""
  try {
    const decoded = verify(token, publicKey, {algorithms: ['RS256']})
    return res.json(decoded)
  } catch (error) {
    return res.status(401).json({message: 'Invalid token'})
  }
})

router.post('/refresh', async (req: Request, res: Response) => {
  const oldToken = req.body.refresh_token

  if (!oldToken) {
    return res.status(401).json({message: 'Missing refresh token'})
  }

  const token = await redis.get(oldToken)
  await redis.del(oldToken)

  if (!token) {
    return res.status(401).json({message: 'Invalid refresh token'})
  }

  const oldData: any = jwt.decode(oldToken)

  delete oldData?.iat
  delete oldData?.exp
  
  const access_token = createToken(oldData)
  const refresh_token = createRefreshToken(oldData)
  await storeToken(refresh_token, access_token)
  return res.json({access_token, refresh_token})
})

router.post('/revoke', async (req: Request, res: Response) => {
  const oldToken = req.body.refresh_token

  if (!oldToken) {
    return res.status(401).json({message: 'Missing refresh token'})
  }

  await redis.del(oldToken)
  return res.json({message: 'Token revoked'})
})

export default router