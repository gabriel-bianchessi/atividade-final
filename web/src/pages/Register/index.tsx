import { Link } from "react-router-dom";
import { Container } from "./styles";


export default function () {
  return (
    <>
      <Container>
        <form>
          <h1>Register</h1>
          <label htmlFor="name">Name</label>
          <input type="text" name="name" id="name" />
          <label htmlFor="username">Username</label>
          <input type="text" name="username" id="username" />
          <label htmlFor="birthDate">BirthDate</label>
          <input type="date" name="birthDate" id="birthDate" />
          <label htmlFor="email">Email</label>
          <input type="email" name="email" id="email" />
          <label htmlFor="password">Password</label>
          <input type="password" name="password" id="password" />
          <button type="submit">Register</button>
        </form>
        <span>Já tem uma conta? Clique <Link to="/login">aqui</Link> para fazer login</span>
      </Container>
    </>
  )
}
