export interface IUser {
  email?: string
  access_token?: string
  refresh_token?: string
}

export interface IContext extends IUser {
  authenticate: (email: string, password: string) => Promise<IUser | undefined>
  logout: () => void
}

export interface IAuthProvider {
  children: JSX.Element
}