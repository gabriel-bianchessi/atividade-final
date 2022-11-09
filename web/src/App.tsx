import { BrowserRouter, Routes, Route } from "react-router-dom"
import "./App.css"
import { ProtectedLayout } from "./components/ProtectedLayout"
import { AuthProvider } from "./context/AuthProvider"
import Login from "./pages/Login"

function App() {
  return (
    <>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route
              path="/profile"
              element={
                <ProtectedLayout>
                  <>
                    <h2>Perfil hehehe</h2>
                  </>
                </ProtectedLayout>
              }
            />
            <Route path="/login" element={<Login />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </>
  )
}

export default App
