import React from "react" 
import { Link } from "react-router-dom"
import { useAuth } from "../../context/AuthProvider/useAuth"
import { Container } from "./styles"

export default function Login() {
  const auth = useAuth()

  async function onFinish (values: {email: string, password: string}) {
    try {
      await auth.authenticate(values.email, values.password)
    } catch(error: any) {
      console.log("Usuário ou senha inválidos")
    }
  }

  return (
    <>
      <Container>
        <form>
          <h1>Login</h1>
          <label htmlFor="email">Email</label>
          <input type="email" name="email" id="email" />
          <label htmlFor="password">Senha</label>
          <input type="password" name="password" id="password" />
          <button>Entrar</button>
        </form>
        <span>Ainda não tem uma conta? Clique <Link to={"/register"}>aqui</Link> para criar</span>
      </Container>
    </>
  )
}