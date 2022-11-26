import { Router, Request, Response, NextFunction } from "express"
import ensureAuthenticated from '../../middlewares/ensureAuthenticated'
import postRoutes from './post.routes'
import commentRoutes from './comments.routes'
import replyRoutes from "./reply.routes"
import reactionRoutes from "./reaction.routes"

const router = Router()

router.use("/", ensureAuthenticated)
router.use('/posts', postRoutes)
router.use('/comments', commentRoutes)
router.use('/reply', replyRoutes)
router.use('/reactions', reactionRoutes)

export default router