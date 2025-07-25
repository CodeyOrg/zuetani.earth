"use client"

import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth'
import { 
  doc, 
  setDoc, 
  getDoc, 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  orderBy, 
  serverTimestamp,
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
    // Listen for authentication state changes
    if (typeof window !== "undefined") {
      onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) {
          await this.loadUserProfile(firebaseUser.uid)
        } else {
          this.currentUser = null
        }
      })
    }
  }

  private async loadUserProfile(uid: string): Promise<void> {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid))
      if (userDoc.exists()) {
        this.currentUser = userDoc.data() as User
      }
    } catch (error) {
      console.error('Error loading user profile:', error)
    }
  }

  async login(email: string, password: string): Promise<User> {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const uid = userCredential.user.uid
      
      // Load user profile from Firestore
      const userDoc = await getDoc(doc(db, 'users', uid))
      if (!userDoc.exists()) {
        throw new Error('User profile not found')
      }
      
      const userData = userDoc.data() as User
      this.currentUser = userData
      return userData
    } catch (error) {
      console.error('Login error:', error)
      throw new Error('Invalid email or password')
    }
  }

  async register(email: string, password: string, name: string): Promise<User> {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const uid = userCredential.user.uid
      
      // Create user profile in Firestore
      const newUser: User = {
        id: uid,
        email,
        name,
        interests: [],
        joinedAt: new Date().toISOString(),
        bio: "",
      }
      
      await setDoc(doc(db, 'users', uid), newUser)
      this.currentUser = newUser
      return newUser
    } catch (error) {
      console.error('Registration error:', error)
      throw new Error('Failed to create account')
    }
  }

  async logout(): Promise<void> {
    try {
      await signOut(auth)
      this.currentUser = null
    } catch (error) {
      console.error('Logout error:', error)
      throw new Error('Failed to logout')
    }
  }

  getCurrentUser(): User | null {
    return this.currentUser
  }

  async updateProfile(updates: Partial<User>): Promise<User> {
    if (!this.currentUser) throw new Error("Not authenticated")
    
    try {
      const updatedUser = { ...this.currentUser, ...updates }
      await setDoc(doc(db, 'users', this.currentUser.id), updatedUser)
      this.currentUser = updatedUser
      return updatedUser
    } catch (error) {
      console.error('Profile update error:', error)
      throw new Error('Failed to update profile')
    }
  }
}

export class FirebaseDataService {
  static async createPost(post: Omit<Post, "id" | "createdAt" | "likes" | "comments">): Promise<Post> {
    try {
      const newPost = {
        ...post,
        createdAt: serverTimestamp(),
        likes: [],
        comments: [],
      }
      
      const docRef = await addDoc(collection(db, 'posts'), newPost)
      
      // Return the post with the generated ID and current timestamp
      const createdPost: Post = {
        ...post,
        id: docRef.id,
        createdAt: new Date().toISOString(),
        likes: [],
        comments: [],
      }
      
      return createdPost
    } catch (error) {
      console.error('Error creating post:', error)
      throw new Error('Failed to create post')
    }
  }

  static async getPosts(): Promise<Post[]> {
    try {
      const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'))
      const querySnapshot = await getDocs(q)
      
      const posts: Post[] = []
      querySnapshot.forEach((doc) => {
        const data = doc.data()
        posts.push({
          ...data,
          id: doc.id,
          createdAt: data.createdAt instanceof Timestamp 
            ? data.createdAt.toDate().toISOString()
            : data.createdAt
        } as Post)
      })
      
      return posts
    } catch (error) {
      console.error('Error fetching posts:', error)
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
}