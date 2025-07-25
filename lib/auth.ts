"use client"

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

// Mock data for MVP
const mockUsers: User[] = [
  {
    id: "1",
    email: "maya@example.com",
    name: "Maya Chen",
    avatar: "/placeholder.svg?height=100&width=100&text=MC",
    bio: "Yoga instructor and mindful traveler exploring sacred spaces around the world.",
    interests: ["Yoga", "Meditation", "Sacred Sites", "Wellness"],
    joinedAt: "2024-01-15",
    location: "Bali, Indonesia",
  },
  {
    id: "2",
    email: "carlos@example.com",
    name: "Carlos Rodriguez",
    avatar: "/placeholder.svg?height=100&width=100&text=CR",
    bio: "Adventure photographer documenting indigenous cultures and pristine landscapes.",
    interests: ["Photography", "Hiking", "Culture", "Conservation"],
    joinedAt: "2024-02-20",
    location: "Patagonia, Chile",
  },
]

const mockPosts: Post[] = [
  {
    id: "1",
    userId: "1",
    title: "Sunrise Yoga in the Rice Terraces",
    content:
      "This morning I practiced yoga as the sun rose over the ancient rice terraces of Jatiluwih. The mist rolling through the valleys and the sound of water flowing through the irrigation channels created the most peaceful meditation I've ever experienced. There's something magical about connecting with practices that have been happening in these spaces for thousands of years.",
    images: ["/placeholder.svg?height=400&width=600&text=Rice+Terraces+Yoga"],
    location: "Jatiluwih, Bali",
    tags: ["yoga", "meditation", "bali", "sunrise"],
    createdAt: "2024-03-15T06:30:00Z",
    likes: ["2", "3"],
    comments: [
      {
        id: "1",
        userId: "2",
        content: "This looks absolutely magical! I can almost feel the peace through your photo.",
        createdAt: "2024-03-15T08:15:00Z",
      },
    ],
  },
  {
    id: "2",
    userId: "2",
    title: "Learning from Mapuche Elders",
    content:
      'Spent three days with a Mapuche community in southern Chile, learning about their deep connection to the land. Their concept of "Newün" - the life force that flows through all things - has completely shifted how I see my relationship with nature. We participated in a traditional ceremony at dawn, and I felt more connected to the earth than ever before.',
    images: ["/placeholder.svg?height=400&width=600&text=Mapuche+Ceremony"],
    location: "Araucanía, Chile",
    tags: ["culture", "indigenous", "ceremony", "chile"],
    createdAt: "2024-03-10T14:20:00Z",
    likes: ["1"],
    comments: [],
  },
]

const mockGroups: Group[] = [
  {
    id: "1",
    name: "Sacred Sites & Spiritual Travel",
    description: "Exploring the world's most sacred and spiritually significant places",
    image: "/placeholder.svg?height=200&width=300&text=Sacred+Sites",
    memberCount: 1247,
    posts: [
      {
        id: "1",
        userId: "1",
        groupId: "1",
        title: "Best sacred sites in Southeast Asia?",
        content:
          "Planning a spiritual journey through Southeast Asia. Looking for recommendations for lesser-known sacred sites that welcome respectful visitors.",
        createdAt: "2024-03-14T10:00:00Z",
        replies: [
          {
            id: "1",
            userId: "2",
            content:
              "I highly recommend the hidden temples in Luang Prabang, Laos. Much more peaceful than the touristy ones.",
            createdAt: "2024-03-14T12:30:00Z",
          },
        ],
      },
    ],
  },
  {
    id: "2",
    name: "Sustainable Travel Tips",
    description: "Share tips and experiences for eco-friendly and sustainable travel",
    image: "/placeholder.svg?height=200&width=300&text=Sustainable+Travel",
    memberCount: 892,
    posts: [
      {
        id: "2",
        userId: "2",
        groupId: "2",
        title: "Zero-waste travel essentials",
        content:
          "What are your must-have zero-waste travel items? I'm trying to eliminate single-use plastics from my adventures.",
        createdAt: "2024-03-12T16:45:00Z",
        replies: [],
      },
    ],
  },
]

export class AuthService {
  private static instance: AuthService
  private currentUser: User | null = null

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService()
    }
    return AuthService.instance
  }

  constructor() {
    if (typeof window !== "undefined") {
      const savedUser = localStorage.getItem("currentUser")
      if (savedUser) {
        this.currentUser = JSON.parse(savedUser)
      }
    }
  }

  async login(email: string, password: string): Promise<User> {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const user = mockUsers.find((u) => u.email === email)
    if (!user) {
      throw new Error("User not found")
    }

    this.currentUser = user
    if (typeof window !== "undefined") {
      localStorage.setItem("currentUser", JSON.stringify(user))
    }

    return user
  }

  async register(email: string, password: string, name: string): Promise<User> {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const newUser: User = {
      id: Date.now().toString(),
      email,
      name,
      interests: [],
      joinedAt: new Date().toISOString(),
      bio: "",
    }

    mockUsers.push(newUser)
    this.currentUser = newUser

    if (typeof window !== "undefined") {
      localStorage.setItem("currentUser", JSON.stringify(newUser))
    }

    return newUser
  }

  logout(): void {
    this.currentUser = null
    if (typeof window !== "undefined") {
      localStorage.removeItem("currentUser")
    }
  }

  getCurrentUser(): User | null {
    return this.currentUser
  }

  async updateProfile(updates: Partial<User>): Promise<User> {
    if (!this.currentUser) throw new Error("Not authenticated")

    const updatedUser = { ...this.currentUser, ...updates }
    this.currentUser = updatedUser

    if (typeof window !== "undefined") {
      localStorage.setItem("currentUser", JSON.stringify(updatedUser))
    }

    return updatedUser
  }
}

export class DataService {
  static async getPosts(): Promise<Post[]> {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))
    return [...mockPosts].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }

  static async createPost(post: Omit<Post, "id" | "createdAt" | "likes" | "comments">): Promise<Post> {
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const newPost: Post = {
      ...post,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      likes: [],
      comments: [],
    }

    mockPosts.unshift(newPost)
    return newPost
  }

  static async getUsers(): Promise<User[]> {
    await new Promise((resolve) => setTimeout(resolve, 300))
    return mockUsers
  }

  static async getUserById(id: string): Promise<User | null> {
    await new Promise((resolve) => setTimeout(resolve, 300))
    return mockUsers.find((u) => u.id === id) || null
  }

  static async getGroups(): Promise<Group[]> {
    await new Promise((resolve) => setTimeout(resolve, 300))
    return mockGroups
  }

  static async searchPosts(query: string): Promise<Post[]> {
    await new Promise((resolve) => setTimeout(resolve, 400))
    const lowercaseQuery = query.toLowerCase()
    return mockPosts.filter(
      (post) =>
        post.title.toLowerCase().includes(lowercaseQuery) ||
        post.content.toLowerCase().includes(lowercaseQuery) ||
        post.tags.some((tag) => tag.toLowerCase().includes(lowercaseQuery)) ||
        post.location.toLowerCase().includes(lowercaseQuery),
    )
  }

  static async searchUsers(query: string): Promise<User[]> {
    await new Promise((resolve) => setTimeout(resolve, 400))
    const lowercaseQuery = query.toLowerCase()
    return mockUsers.filter(
      (user) =>
        user.name.toLowerCase().includes(lowercaseQuery) ||
        user.bio?.toLowerCase().includes(lowercaseQuery) ||
        user.interests.some((interest) => interest.toLowerCase().includes(lowercaseQuery)),
    )
  }
}
