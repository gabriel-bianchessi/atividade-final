import { Request, Response, NextFunction } from "express"
import { JwtPayload, verify } from "jsonwebtoken"
import fs from "fs"
import { PrismaClient } from "@prisma/client"
import { JwtDecoded } from "../@types/jwtDecoded"
import path from "path"
const prisma = new PrismaClient()

const publicKey = fs.readFileSync(path.join(__dirname, "../../",  "certs", "jwtRS256.key.pub") , {
  encoding: "utf-8",
})

async function ensureAuthenticated (req: Request, res: Response, next: NextFunction): Promise<Response| void> {
  const token = req.headers.authorization?.split(" ")[1]
  if (!token) {
    return res.status(401).json({ message: "Missing authorization header" })
  }
  try {
    const decoded: JwtPayload | string = verify(token, publicKey, {
      algorithms: ["RS256"],
    })
    const userId = (decoded as JwtDecoded).id
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    })

    if (!user) {
      return res.status(401).json({ message: "Invalid token" })
    }

    req.currentUser = user
    return next()
  } catch (error) {
    res.json("Erro de autenticação")
  }
}

export default ensureAuthenticated