export interface SignUpData {
  email: string
  password: string
  displayName: string
  username: string
}

export interface SignInData {
  email: string
  password: string
}

export interface ResetPasswordData {
  email: string
}

export interface UpdatePasswordData {
  currentPassword: string
  newPassword: string
}

export interface AuthUser {
  uid: string
  email: string
  displayName: string
  photoURL?: string
  emailVerified: boolean
}

export interface AuthError {
  code: string
  message: string
}

export interface AuthResult {
  user?: AuthUser
  error?: AuthError
}