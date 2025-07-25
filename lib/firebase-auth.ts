"use client"

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  User as FirebaseUser,
  AuthError
} from 'firebase/auth'
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  where,
  limit,
  Timestamp
} from 'firebase/firestore'
import { auth, db } from './firebase'

export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  bio?: string
  interests: string[]
  joinedAt: string
  location?: string
}

export interface Post {
  id: string
  userId: string
  title: string
  content: string
  images: string[]
  location: string
  tags: string[]
  createdAt: string
  likes: string[]
  comments: Comment[]
}

export interface Comment {
  id: string
  userId: string
  content: string
  createdAt: string
}

export interface Group {
  id: string
  name: string
  description: string
  image: string
  memberCount: number
  posts: GroupPost[]
}

export interface GroupPost {
  id: string
  userId: string
  groupId: string
  title: string
  content: string
  createdAt: string
  replies: GroupReply[]
}

export interface GroupReply {
  id: string
  userId: string
  content: string
  createdAt: string
}

export class FirebaseAuthService {
  private static instance: FirebaseAuthService
  private currentUser: User | null = null

  static getInstance(): FirebaseAuthService {
    if (!FirebaseAuthService.instance) {
      FirebaseAuthService.instance = new FirebaseAuthService()
    }
    return FirebaseAuthService.instance
  }

  constructor() {
    // Listen to auth state changes
    onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // User is signed in, get user data from Firestore
        const userData = await this.getUserData(firebaseUser.uid)
        this.currentUser = userData
      } else {
        // User is signed out
        this.currentUser = null
      }
    })
  }

  private async getUserData(uid: string): Promise<User | null> {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid))
      if (userDoc.exists()) {
        return userDoc.data() as User
      }
      return null
    } catch (error) {
      console.error('Error fetching user data:', error)
      return null
    }
  }

  async login(email: string, password: string): Promise<User> {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const userData = await this.getUserData(userCredential.user.uid)
      
      if (!userData) {
        throw new Error('User data not found')
      }

      this.currentUser = userData
      return userData
    } catch (error) {
      const authError = error as AuthError
      throw new Error(authError.message)
    }
  }

  async register(email: string, password: string, name: string): Promise<User> {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const { user: firebaseUser } = userCredential

      // Update Firebase Auth profile
      await updateProfile(firebaseUser, { displayName: name })

      // Create user document in Firestore
      const newUser: User = {
        id: firebaseUser.uid,
        email: firebaseUser.email!,
        name,
        interests: [],
        joinedAt: new Date().toISOString(),
        bio: '',
      }

      await setDoc(doc(db, 'users', firebaseUser.uid), newUser)
      this.currentUser = newUser

      return newUser
    } catch (error) {
      const authError = error as AuthError
      throw new Error(authError.message)
    }
  }

  async logout(): Promise<void> {
    try {
      await signOut(auth)
      this.currentUser = null
    } catch (error) {
      console.error('Error signing out:', error)
      throw error
    }
  }

  getCurrentUser(): User | null {
    return this.currentUser
  }

  async updateProfile(updates: Partial<User>): Promise<User> {
    if (!this.currentUser || !auth.currentUser) {
      throw new Error('Not authenticated')
    }

    try {
      const updatedUser = { ...this.currentUser, ...updates }
      
      // Update Firestore document
      await updateDoc(doc(db, 'users', this.currentUser.id), updates)
      
      // Update Firebase Auth profile if name changed
      if (updates.name) {
        await updateProfile(auth.currentUser, { displayName: updates.name })
      }

      this.currentUser = updatedUser
      return updatedUser
    } catch (error) {
      console.error('Error updating profile:', error)
      throw error
    }
  }
}

export class FirebaseDataService {
  static async getPosts(): Promise<Post[]> {
    try {
      const postsQuery = query(
        collection(db, 'posts'),
        orderBy('createdAt', 'desc')
      )
      const querySnapshot = await getDocs(postsQuery)
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Post[]
    } catch (error) {
      console.error('Error fetching posts:', error)
      return []
    }
  }

  static async createPost(post: Omit<Post, 'id' | 'createdAt' | 'likes' | 'comments'>): Promise<Post> {
    try {
      const newPost = {
        ...post,
        createdAt: Timestamp.now().toDate().toISOString(),
        likes: [],
        comments: [],
      }

      const docRef = await addDoc(collection(db, 'posts'), newPost)
      
      return {
        id: docRef.id,
        ...newPost
      } as Post
    } catch (error) {
      console.error('Error creating post:', error)
      throw error
    }
  }

  static async getUsers(): Promise<User[]> {
    try {
      const usersQuery = query(collection(db, 'users'))
      const querySnapshot = await getDocs(usersQuery)
      
      return querySnapshot.docs.map(doc => doc.data()) as User[]
    } catch (error) {
      console.error('Error fetching users:', error)
      return []
    }
  }

  static async getUserById(id: string): Promise<User | null> {
    try {
      const userDoc = await getDoc(doc(db, 'users', id))
      if (userDoc.exists()) {
        return userDoc.data() as User
      }
      return null
    } catch (error) {
      console.error('Error fetching user:', error)
      return null
    }
  }

  static async getGroups(): Promise<Group[]> {
    try {
      const groupsQuery = query(collection(db, 'groups'))
      const querySnapshot = await getDocs(groupsQuery)
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Group[]
    } catch (error) {
      console.error('Error fetching groups:', error)
      return []
    }
  }

  static async searchPosts(searchQuery: string): Promise<Post[]> {
    try {
      // Note: Firestore doesn't support full-text search natively
      // You might want to use Algolia or similar for better search
      const postsQuery = query(collection(db, 'posts'))
      const querySnapshot = await getDocs(postsQuery)
      
      const lowercaseQuery = searchQuery.toLowerCase()
      return querySnapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }) as Post)
        .filter(post =>
          post.title.toLowerCase().includes(lowercaseQuery) ||
          post.content.toLowerCase().includes(lowercaseQuery) ||
          post.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery)) ||
          post.location.toLowerCase().includes(lowercaseQuery)
        )
    } catch (error) {
      console.error('Error searching posts:', error)
      return []
    }
  }

  static async searchUsers(searchQuery: string): Promise<User[]> {
    try {
      const usersQuery = query(collection(db, 'users'))
      const querySnapshot = await getDocs(usersQuery)
      
      const lowercaseQuery = searchQuery.toLowerCase()
      return querySnapshot.docs
        .map(doc => doc.data() as User)
        .filter(user =>
          user.name.toLowerCase().includes(lowercaseQuery) ||
          user.bio?.toLowerCase().includes(lowercaseQuery) ||
          user.interests.some(interest => interest.toLowerCase().includes(lowercaseQuery))
        )
    } catch (error) {
      console.error('Error searching users:', error)
      return []
    }
  }
}

// Export instances for backwards compatibility
export const AuthService = FirebaseAuthService
export const DataService = FirebaseDataService