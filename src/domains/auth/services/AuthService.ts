import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updatePassword,
  sendEmailVerification,
  User
} from 'firebase/auth'
import { auth } from '@/infrastructure/external-apis/firebase'
import { SignUpData, SignInData, ResetPasswordData, UpdatePasswordData, AuthResult, AuthUser } from '../types'
import { UsersService } from '@/domains/users/services/UsersService'

const usersService = new UsersService()

export class AuthService {
  private mapFirebaseUser(user: User): AuthUser {
    return {
      uid: user.uid,
      email: user.email!,
      displayName: user.displayName || '',
      photoURL: user.photoURL || undefined,
      emailVerified: user.emailVerified,
    }
  }

  async signUp(data: SignUpData): Promise<AuthResult> {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password)
      const firebaseUser = userCredential.user
      
      // Create user in database
      await usersService.create({
        uid: firebaseUser.uid,
        email: data.email,
        displayName: data.displayName,
        username: data.username,
      })
      
      // Send email verification
      await sendEmailVerification(firebaseUser)
      
      return {
        user: this.mapFirebaseUser(firebaseUser),
      }
    } catch (error: any) {
      return {
        error: {
          code: error.code,
          message: error.message,
        },
      }
    }
  }

  async signIn(data: SignInData): Promise<AuthResult> {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, data.email, data.password)
      
      return {
        user: this.mapFirebaseUser(userCredential.user),
      }
    } catch (error: any) {
      return {
        error: {
          code: error.code,
          message: error.message,
        },
      }
    }
  }

  async signOut(): Promise<{ error?: AuthError }> {
    try {
      await signOut(auth)
      return {}
    } catch (error: any) {
      return {
        error: {
          code: error.code,
          message: error.message,
        },
      }
    }
  }

  async resetPassword(data: ResetPasswordData): Promise<{ error?: AuthError }> {
    try {
      await sendPasswordResetEmail(auth, data.email)
      return {}
    } catch (error: any) {
      return {
        error: {
          code: error.code,
          message: error.message,
        },
      }
    }
  }

  async updatePassword(data: UpdatePasswordData): Promise<{ error?: AuthError }> {
    try {
      const user = auth.currentUser
      if (!user) {
        return {
          error: {
            code: 'auth/user-not-found',
            message: 'No user is currently signed in',
          },
        }
      }

      await updatePassword(user, data.newPassword)
      return {}
    } catch (error: any) {
      return {
        error: {
          code: error.code,
          message: error.message,
        },
      }
    }
  }

  async sendEmailVerification(): Promise<{ error?: AuthError }> {
    try {
      const user = auth.currentUser
      if (!user) {
        return {
          error: {
            code: 'auth/user-not-found',
            message: 'No user is currently signed in',
          },
        }
      }

      await sendEmailVerification(user)
      return {}
    } catch (error: any) {
      return {
        error: {
          code: error.code,
          message: error.message,
        },
      }
    }
  }

  getCurrentUser(): AuthUser | null {
    const user = auth.currentUser
    return user ? this.mapFirebaseUser(user) : null
  }
}