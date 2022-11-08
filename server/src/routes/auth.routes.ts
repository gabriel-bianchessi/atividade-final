import { Request, Response, Router } from 'express'

const router = Router()

router.get('/login', (req: Request, res: Response) => {
  return res.json({"message": "Login"})
})

export default router