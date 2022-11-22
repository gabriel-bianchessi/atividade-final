import { Router } from 'express'
import authRoutes from './auth.routes'
import secureRoutes from './secure'
const router = Router()

router.use('/auth', authRoutes)
router.use('/secure', secureRoutes)

export default router