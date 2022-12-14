import { BrowserRouter, Routes, Route } from "react-router-dom"
import "./App.css"
import { ProtectedLayout } from "./components/ProtectedLayout"
import { AuthProvider } from "./context/AuthProvider"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Register from "./pages/Register"

function App() {
  return (
    <>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="" element={
              <ProtectedLayout>
                <Home />
              </ProtectedLayout>
            }/>
            <Route path="/register" element={<Register />}></Route>
            <Route path="/login" element={<Login />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </>
  )
}

export default App
