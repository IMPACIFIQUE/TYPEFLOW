import { storage } from './api'
import { initials } from '../utils/format'

const USERS_KEY = 'users'
const SESSION_KEY = 'session'

const AVATAR_COLORS = [
  'linear-gradient(135deg, #6D4AFF, #A855F7)',
  'linear-gradient(135deg, #F59E0B, #DC2626)',
  'linear-gradient(135deg, #16A34A, #0D9488)',
  'linear-gradient(135deg, #6D4AFF, #0E7490)',
  'linear-gradient(135deg, #EC4899, #F59E0B)',
]

function readUsers() {
  const users = storage.get(USERS_KEY, [])
  return Array.isArray(users) ? users : []
}

function writeUsers(users) {
  storage.set(USERS_KEY, users)
}

function encodePassword(password) {
  try {
    return btoa(unescape(encodeURIComponent(`tf::${password}`)))
  } catch {
    return `tf::${password}`
  }
}

function publicUser(user) {
  if (!user) return null
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    avatarColor: user.avatarColor,
    initials: initials(user.name),
    createdAt: user.createdAt,
  }
}

function makeId() {
  return `u_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`
}

export function getCurrentUser() {
  const id = storage.get(SESSION_KEY, null)
  if (!id) return null
  const user = readUsers().find((item) => item.id === id)
  return publicUser(user)
}

export function signUp({ name, email, password }) {
  const cleanName = (name || '').trim()
  const cleanEmail = (email || '').trim().toLowerCase()

  if (cleanName.length < 2) throw new Error('Please enter your name (at least 2 characters).')
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) throw new Error('Please enter a valid email address.')
  if (!password || password.length < 6) throw new Error('Password must be at least 6 characters.')

  const users = readUsers()
  if (users.some((user) => user.email === cleanEmail)) {
    throw new Error('An account with that email already exists. Try signing in.')
  }

  const user = {
    id: makeId(),
    name: cleanName,
    email: cleanEmail,
    password: encodePassword(password),
    avatarColor: AVATAR_COLORS[users.length % AVATAR_COLORS.length],
    createdAt: new Date().toISOString(),
  }

  users.push(user)
  writeUsers(users)
  storage.set(SESSION_KEY, user.id)
  return publicUser(user)
}

export function signIn({ email, password }) {
  const cleanEmail = (email || '').trim().toLowerCase()
  const users = readUsers()
  const user = users.find((item) => item.email === cleanEmail)

  if (!user) throw new Error('No account found with that email. Create one to get started.')
  if (user.password !== encodePassword(password)) throw new Error('Incorrect password. Please try again.')

  storage.set(SESSION_KEY, user.id)
  return publicUser(user)
}

export function signOut() {
  storage.remove(SESSION_KEY)
}

export function updateProfile(userId, updates) {
  const users = readUsers()
  const index = users.findIndex((user) => user.id === userId)
  if (index === -1) throw new Error('Account not found.')

  const name = (updates.name ?? users[index].name).trim()
  if (name.length < 2) throw new Error('Please use a name with at least 2 characters.')

  users[index] = { ...users[index], name, avatarColor: updates.avatarColor || users[index].avatarColor }
  writeUsers(users)
  return publicUser(users[index])
}

export function accountCount() {
  return readUsers().length
}

/** Public account list for the local admin dashboard. Passwords are never exposed. */
export function listAccounts() {
  return readUsers().map(publicUser)
}
