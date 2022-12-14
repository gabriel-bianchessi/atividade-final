import React, { PropsWithChildren } from "react"
import { useAuth } from "../../context/AuthProvider/useAuth"
import { Navigate } from "react-router-dom"

export const ProtectedLayout = ( {children}: {children: PropsWithChildren<any>} ) => {
  const auth = useAuth()

  if(!auth.email) {
    return <Navigate to="/login" />
  }

  return (
    children
  )
}