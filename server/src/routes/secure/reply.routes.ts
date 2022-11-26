import { Router, Request, Response } from  "express"
import { PrismaClient } from "@prisma/client"

const router = Router()
const prisma = new PrismaClient()

router.post('/:commentId', async (req: Request, res: Response) => {
  const user = req.currentUser
  const {commentId} = req.params
  const {content, postId} = req.body

  if(!content || !postId ) { 
    return res.json({"message": "Faltam parâmetros"})
  }

  const commentExists = await prisma.comment.findFirst({
    where: {
      id: commentId
    }
  })

  if(!commentExists) return res.json({"message": "O comentário que você está tentando responder não existe"})

  const reply = await prisma.comment.create({
    data: {
      content,
      post: {
        connect: {
          id: postId
        }
      },
      author: {
        connect: {
          id: user?.id
        }
      },
      replyTo: commentId,
    },
    select: {
      id: true,
      content: true,
      replyTo: true,
      author: {
        select: {
          id: true,
          name: true,
        },
      }
    }
  })

  if(!reply) return res.json({"message": "Erro ao criar a resposta ao comentário"})

  return res.json({reply})
})

export default router