import { Router, Request, Response } from "express"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()
const router = Router()

router.post('/', async (req: Request, res: Response) => {
  const user = req.currentUser
  const {content, postId} = req.body

  if(!content || !postId) {
    return res.status(400).json({"messsage": "O conteúdo não pode estar vazio"})
  }

  const comment = await prisma.comment.create({
    data: {
      content,
      author: {
        connect: { id: user?.id }
      },
      post: {
        connect: { id: postId }
      }
    },
    select: {
      id: true,
      content: true,
      post: true,
      author: true,
      createdAt: true
    }
  })

  if(!comment) {
    return res.json({"message": "Erro ao criar o comentário"})
  }

  return res.json(comment)
})

router.delete('/:commentId', async (req: Request, res: Response) => {
  const { commentId} = req.params
  const { postId } = req.body
  const user = req.currentUser

  if(!user) {
    return res.json({"message": "Usuário não autenticado"})
  }

  const commentBelongsPostAndUser = await prisma.comment.findFirst({
    where: {
      id: commentId,
      postId: postId,
      authorId: user.id
    }
  })

  if(!commentBelongsPostAndUser) {
    return res.json({"message": "Comment doesn't belongs to this Post/User"})
  }

  const deletedComment = await prisma.comment.update({
    data: {
      visible: false
    },
    where: {
      id: commentId
    }
  })

  return res.json({deletedComment})
})

export default router