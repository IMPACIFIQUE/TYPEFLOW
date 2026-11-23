import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import {
  getCurrentUser,
  signIn as signInService,
  signOut as signOutService,
  signUp as signUpService,
  updateProfile as updateProfileService,
} from '../services/authService'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getCurrentUser())

  const signIn = useCallback((credentials) => {
    const nextUser = signInService(credentials)
    setUser(nextUser)
    return nextUser
  }, [])

  const signUp = useCallback((details) => {
    const nextUser = signUpService(details)
    setUser(nextUser)
    return nextUser
  }, [])

  const signOut = useCallback(() => {
    signOutService()
    setUser(null)
  }, [])

  const updateProfile = useCallback(
    (updates) => {
      if (!user) throw new Error('You need to be signed in to update your profile.')
      const nextUser = updateProfileService(user.id, updates)
      setUser(nextUser)
      return nextUser
    },
    [user]
  )

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      signIn,
      signUp,
      signOut,
      updateProfile,
    }),
    [user, signIn, signUp, signOut, updateProfile]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used inside an AuthProvider')
  return context
}

export default AuthContext
