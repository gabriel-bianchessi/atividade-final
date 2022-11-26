import { Request, Response, Router } from "express"
import fs from "fs"
import { JwtPayload, verify } from "jsonwebtoken"
import { JwtDecoded } from "../../@types/jwtDecoded"
import { Post, PrismaClient } from "@prisma/client"
import path from "path"

const prisma = new PrismaClient()

const publicKey = fs.readFileSync(path.join(__dirname, "../../../",  "certs", "jwtRS256.key.pub") , {
  encoding: "utf-8",
})

const router = Router()

router.post("/create", async (req: Request, res: Response) => {
  const user = req.currentUser
  const { title, content } = req.body

  if (!title || !content) {
    return res.status(400).json({ message: "Missing title or content" })
  }

  const post = await prisma.post.create({
    data: {
      title,
      content,
      author: {
        connect: { id: user?.id },
      },
    },
    select: {
      id: true,
      title: true,
      content: true,
      createdAt: true,
      author: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  })

  return res.status(201).json(post)
})

router.get("/all", async (req: Request, res: Response) => {
  const token = req.headers.authorization?.split(" ")[1]
  if (!token) {
    return res.status(401).json({ message: "Missing authorization header" })
  }
  try {
    const decoded: JwtPayload | string = verify(token, publicKey, {
      algorithms: ["RS256"],
    })
    const userId = (decoded as JwtDecoded).id
    const userExists = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    })

    if (!userExists) {
      return res.status(401).json({ message: "Invalid token" })
    }

    const posts = await prisma.post.findMany({
      select: {
        id: true,
        title: true,
        content: true,
        createdAt: true,
        updatedAt: true,
        author: {
          select: {
            id: true,
            name: true,
          },
        },
        reactions: {
          select: {
            id: true,
            type: true,
          },
          where: {
            visible: true
          }
        },
        _count: {
          select: {
            comments: true,
            reactions: true
          }
        }
        },
        where: {
          visible: true
        },
        orderBy: {
          createdAt: "asc"
        }
      })

    return res.status(200).json(posts)
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" })
  }
})

router.get("/:postId", async (req: Request, res: Response) => {
  const token = req.headers.authorization?.split(" ")[1]
  if (!token) {
    return res.status(401).json({ message: "Missing authorization header" })
  }
  try {
    const decoded: JwtPayload | string = verify(token, publicKey, {
      algorithms: ["RS256"],
    })
    const userId = (decoded as JwtDecoded).id
    const userExists = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    })
    if (!userExists) {
      return res.status(401).json({ message: "Invalid token" })
    }
    const postId = req.params.postId

    const post = await prisma.post.findFirst({
      where: {
        id: postId,
        visible: true,
      },
      select: {
        id: true,
        title: true,
        content: true,
        createdAt: true,
        updatedAt: true,
        author: {
          select: {
            id: true,
            name: true,
          },
        },
        comments: {
          select: {
            id: true,
            content: true,
            createdAt: true,
            updatedAt: true,
            replyTo: true,
            author: {
              select: {
                id: true,
                name: true,
              },
            },
            reactions: {
              select: {
                id: true,
                type: true,
              },
            }
          },
          where: {
            visible: true,
          }
        },
        reactions: {
          select: {
            id: true,
            type: true,
          },
          where: {
            visible: true
          }
        },
        _count: {
          select: {
            comments: true,
            reactions: true
          }
        }
      },
    })

    return res.json(post)

  } catch (error) {
    return res.json({ Erro: error })
  }
})

router.put('/:id', async (req: Request, res: Response) => {
  const user = req.currentUser
  const {title, content} = req.body
  const postId = req.params.id

  const postBelongsUser = await prisma.post.findFirst({
    where: {
      id: postId,
      authorId: user?.id
    }
  })

  if(!postBelongsUser) {
    return res.status(401).json({message: 'Esse post não pertence ao usuário'})
  }

  const updatedPost = await prisma.post.update({
    where: { 
      id: postId,
    },
    data: {
      title,
      content,
      updatedAt: new Date()
    }
  })
  
  return res.json(updatedPost)
})

router.delete('/:id', async (req: Request, res: Response) => {
  const user = req.currentUser
  const postId = req.params.id

  const postBelongsUser = await prisma.post.findFirst({
    where: {
      id: postId,
      authorId: user?.id
    }
  })

  if(!postBelongsUser) {
    return res.status(401).json({message: 'Esse post não pertence ao usuário'})
  }

  const deletedPost = await prisma.post.update({
    where: {
      id: postId
    },
    data: {
      visible: false
    }
  })
  
  return res.json(deletedPost)
})

export default router
