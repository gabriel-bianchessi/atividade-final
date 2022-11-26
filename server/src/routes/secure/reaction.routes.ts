import { Request, Response, Router } from "express"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

const router = Router()

router.post("/:id", async (req: Request, res: Response) => {
  const user = req.currentUser
  const postId = req.params.id
  let { reaction } = req.body

  if (!reaction) reaction = "like"

  const post = await prisma.post.findFirst({
    where: {
      id: postId,
      visible: true,
    },
    select: {
      id: true,
    },
  })

  if (!post) {
    return res.status(400).json({ message: "Post not found" })
  }

  const reactionExists = await prisma.reaction.findFirst({
    where: {
      postId,
      authorId: user?.id,
    }
  })

  if (reactionExists) {
    return res.status(400).json({ message: "Reaction already exists" })
  }

  const newReaction = await prisma.reaction.create({
    data: {
      author: {
        connect: {
          id: user?.id,
        }
      },
      post: {
        connect: {
          id: postId,
        }
      },
      type: reaction,
    },
    select: {
      id: true,
      type: true,
    }
  })

  return res.status(201).json(newReaction)
})

export default router
