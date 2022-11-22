import { Router, Request, Response, NextFunction } from "express"
import ensureAuthenticated from '../../middlewares/ensureAuthenticated'
import postRoutes from './post.routes'

const router = Router()

router.use("/", ensureAuthenticated)
router.use('/posts', postRoutes)

export default router