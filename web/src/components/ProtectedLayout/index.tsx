import React, { PropsWithChildren } from "react"
import { useAuth } from "../../context/AuthProvider/useAuth"
import { Navigate } from "react-router-dom"

export const ProtectedLayout = ( {children}: {children: PropsWithChildren<any>} ) => {
  const auth = useAuth()

  if(!auth.access_token) {
    console.log(auth.access_token)
    return <Navigate to="/login" />
  }

  return (
    children
  )
}