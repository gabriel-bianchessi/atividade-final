import axios, { AxiosRequestConfig } from 'axios'
import { getUserLocalStorage } from '../context/AuthProvider/util'

export const api = axios.create({
  baseURL: "http://localhost:8080/",
})

api.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    config.headers = config.headers ?? {}
    const user = getUserLocalStorage()
    if (!user) return config 
    config.headers['Authorization'] = `Bearer ${user.access_token}`
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)