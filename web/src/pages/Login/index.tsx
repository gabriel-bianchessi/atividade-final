import React from "react" 
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../../context/AuthProvider/useAuth"
import { Container } from "./styles"
import { useForm } from "react-hook-form"

export default function Login() {
  const auth = useAuth()
  const { register, handleSubmit } = useForm()
  const navigate = useNavigate()

  const onSubmit = handleSubmit(async (data) => {
    const { email, password } = data
    const response = await auth.authenticate(email, password)
    if (!response?.access_token) return
    navigate("/")
  })

  return (
    <>
      <Container>
        <form onSubmit={onSubmit}>
          <h1>Login</h1>
          <label htmlFor="email">Email</label>
          <input type="email" id="email" {...register("email")}/>
          <label htmlFor="password">Senha</label>
          <input type="password" id="password" {...register("password")} />
          <button>Entrar</button>
        </form>
        <span>Ainda não tem uma conta? Clique <Link to={"/register"}>aqui</Link> para criar</span>
      </Container>
    </>
  )
}