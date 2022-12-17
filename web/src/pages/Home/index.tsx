import React, { useEffect, useState } from "react"
import { Container, Main } from "./styles"
import Header from "../../components/Header"
import { api } from "../../services/api"

export default function Home() {
  interface PostProps  {
    id: string
    title: string 
    content: string
    author: {
      id: string
      name: string
    }
  }

  const [loading, setLoading ] = useState(false)
  const [posts, setPosts] = useState<PostProps[]>([])

  async function loadPosts() {
    const response = await api.get('/secure/posts/all')
    const posts = response.data.map((result:any) => {
      let post: PostProps = result
      return {
        id: post.id,
        title: post.title,
        content: post.content,
        author: {
          name: post.author.name,
          id: post.author.id
        }
      }
    })

    setPosts(posts)
  }

  useEffect(() => {
    setLoading(true)
    loadPosts()
    setLoading(false)
  }, [])

  return (
    <>
      <Header></Header>
      <Container>
        <Main>
          { loading ? <h1>Loading</h1> : posts.map((post) => {
            return (
              <div key={post.id}>
                <h1>{post.title}</h1>
                <p>{post.content}</p>
              </div>
            )
          })}
        </Main>
      </Container>
    </>
  )
}