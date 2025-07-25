"use client"

import { useState, useEffect } from "react"
import { AuthGuard } from "@/components/auth-guard"
import { Navbar } from "@/components/navbar"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Heart, MessageCircle, MapPin, Calendar, Loader2 } from "lucide-react"
import { DataService, type Post, type User, AuthService } from "@/lib/auth"
import Link from "next/link"
import Image from "next/image"

export default function DashboardPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentUser, setCurrentUser] = useState<User | null>(null)

  useEffect(() => {
    const loadData = async () => {
      try {
        const [postsData, usersData] = await Promise.all([DataService.getPosts(), DataService.getUsers()])
        setPosts(postsData)
        setUsers(usersData)

        const authService = AuthService.getInstance()
        setCurrentUser(authService.getCurrentUser())
      } catch (error) {
        console.error("Failed to load data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  const getUserById = (userId: string) => {
    return users.find((u) => u.id === userId)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  if (isLoading) {
    return (
      <AuthGuard>
        <div className="min-h-screen bg-stone-50">
          <Navbar />
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
          </div>
        </div>
      </AuthGuard>
    )
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-stone-50">
        <Navbar />

        <div className="container mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <Card className="mb-6">
                <CardContent className="p-6">
                  <div className="text-center">
                    <Avatar className="w-20 h-20 mx-auto mb-4">
                      <AvatarImage src={currentUser?.avatar || "/placeholder.svg"} alt={currentUser?.name} />
                      <AvatarFallback className="text-lg">
                        {currentUser?.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <h3 className="font-semibold text-stone-800 mb-2">{currentUser?.name}</h3>
                    <p className="text-sm text-stone-600 mb-4">{currentUser?.bio || "Welcome to the tribe!"}</p>
                    <Link href="/profile">
                      <Button variant="outline" size="sm" className="w-full bg-transparent">
                        Edit Profile
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <h3 className="font-semibold text-stone-800">Quick Actions</h3>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Link href="/create-post">
                    <Button className="w-full bg-emerald-600 hover:bg-emerald-700">Share Your Story</Button>
                  </Link>
                  <Link href="/search">
                    <Button variant="outline" className="w-full bg-transparent">
                      Discover Travelers
                    </Button>
                  </Link>
                  <Link href="/groups">
                    <Button variant="outline" className="w-full bg-transparent">
                      Join Groups
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>

            {/* Main Feed */}
            <div className="lg:col-span-3">
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-stone-800 mb-2">Community Feed</h1>
                <p className="text-stone-600">Latest stories from your fellow travelers</p>
              </div>

              <div className="space-y-6">
                {posts.map((post) => {
                  const author = getUserById(post.userId)
                  if (!author) return null

                  return (
                    <Card key={post.id} className="overflow-hidden">
                      <CardContent className="p-6">
                        {/* Post Header */}
                        <div className="flex items-center gap-3 mb-4">
                          <Avatar>
                            <AvatarImage src={author.avatar || "/placeholder.svg"} alt={author.name} />
                            <AvatarFallback>
                              {author.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <h4 className="font-semibold text-stone-800">{author.name}</h4>
                            <div className="flex items-center gap-2 text-sm text-stone-600">
                              <MapPin className="w-3 h-3" />
                              <span>{post.location}</span>
                              <span>•</span>
                              <Calendar className="w-3 h-3" />
                              <span>{formatDate(post.createdAt)}</span>
                            </div>
                          </div>
                        </div>

                        {/* Post Content */}
                        <h3 className="text-xl font-semibold text-stone-800 mb-3">{post.title}</h3>
                        <p className="text-stone-700 mb-4 leading-relaxed">{post.content}</p>

                        {/* Post Images */}
                        {post.images.length > 0 && (
                          <div className="mb-4">
                            <Image
                              src={post.images[0] || "/placeholder.svg"}
                              alt={post.title}
                              width={600}
                              height={400}
                              className="w-full h-64 object-cover rounded-lg"
                            />
                          </div>
                        )}

                        {/* Tags */}
                        <div className="flex flex-wrap gap-2 mb-4">
                          {post.tags.map((tag, index) => (
                            <Badge key={index} variant="secondary" className="bg-emerald-100 text-emerald-700">
                              #{tag}
                            </Badge>
                          ))}
                        </div>

                        {/* Post Actions */}
                        <div className="flex items-center gap-4 pt-4 border-t border-stone-200">
                          <Button variant="ghost" size="sm" className="text-stone-600 hover:text-emerald-600">
                            <Heart className="w-4 h-4 mr-2" />
                            {post.likes.length} likes
                          </Button>
                          <Button variant="ghost" size="sm" className="text-stone-600 hover:text-emerald-600">
                            <MessageCircle className="w-4 h-4 mr-2" />
                            {post.comments.length} comments
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>

              {posts.length === 0 && (
                <Card>
                  <CardContent className="p-12 text-center">
                    <h3 className="text-xl font-semibold text-stone-800 mb-2">No stories yet</h3>
                    <p className="text-stone-600 mb-6">Be the first to share your travel experience!</p>
                    <Link href="/create-post">
                      <Button className="bg-emerald-600 hover:bg-emerald-700">Share Your First Story</Button>
                    </Link>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}
