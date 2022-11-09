import React from "react" 
import { useAuth } from "../../context/AuthProvider/useAuth"

export default function Login() {
  const auth = useAuth()
  const navigate = 

  async function onFinish (values: {email: string, password: string}) {
    try {
      await auth.authenticate(values.email, values.password)
    } catch(error: any) {
      console.log("Usuário ou senha inválidos")
    }
  }

  return (
    <>
      <h1>Login</h1>
      <label htmlFor="email">Email</label>
      <input type="email" name="email" id="email" />
      <label htmlFor="password">Senha</label>
      <input type="password" name="password" id="password" />
      <button>Entrar</button>
    </>
  )
}