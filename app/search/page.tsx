"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { AuthGuard } from "@/components/auth-guard"
import { Navbar } from "@/components/navbar"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, MapPin, Calendar, Users, FileText } from "lucide-react"
import { FirebaseDataService, type Post, type User } from "@/lib/firebase-auth"
import Image from "next/image"

export default function SearchPage() {
  const [query, setQuery] = useState("")
  const [posts, setPosts] = useState<Post[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [allUsers, setAllUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)

  useEffect(() => {
    const loadUsers = async () => {
      try {
        // TODO: Implement user search in Firebase
        // For now, we'll just have empty users list
        setAllUsers([])
      } catch (error) {
        console.error("Failed to load users:", error)
      }
    }
    loadUsers()
  }, [])

  const handleSearch = async () => {
    if (!query.trim()) return

    setIsLoading(true)
    setHasSearched(true)

    try {
      // TODO: Implement search functionality in Firebase
      // For now, get all posts and filter them client-side (not ideal for production)
      const postsData = await FirebaseDataService.getPosts()
      const filteredPosts = postsData.filter(post => 
        post.title.toLowerCase().includes(query.toLowerCase()) ||
        post.content.toLowerCase().includes(query.toLowerCase()) ||
        post.location.toLowerCase().includes(query.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
      )
      setPosts(filteredPosts)
      setUsers([]) // User search not implemented yet
    } catch (error) {
      console.error("Search failed:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  const getUserById = (userId: string) => {
    return allUsers.find((u) => u.id === userId)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-stone-50">
        <Navbar />

        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-stone-800 mb-2">Discover</h1>
              <p className="text-stone-600 mb-6">Find stories, travelers, and experiences that inspire you</p>

              <div className="flex gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-stone-400" />
                  <Input
                    placeholder="Search for stories, places, people, or topics..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="pl-10"
                  />
                </div>
                <Button onClick={handleSearch} className="bg-emerald-600 hover:bg-emerald-700" disabled={isLoading}>
                  {isLoading ? "Searching..." : "Search"}
                </Button>
              </div>
            </div>

            {hasSearched ? (
              <Tabs defaultValue="posts" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="posts" className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Stories ({posts.length})
                  </TabsTrigger>
                  <TabsTrigger value="users" className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Travelers ({users.length})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="posts" className="space-y-6 mt-6">
                  {posts.length > 0 ? (
                    posts.map((post) => {
                      const author = getUserById(post.userId)
                      if (!author) return null

                      return (
                        <Card key={post.id} className="overflow-hidden">
                          <CardContent className="p-6">
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

                            <h3 className="text-xl font-semibold text-stone-800 mb-3">{post.title}</h3>
                            <p className="text-stone-700 mb-4 leading-relaxed line-clamp-3">{post.content}</p>

                            {post.images.length > 0 && (
                              <div className="mb-4">
                                <Image
                                  src={post.images[0] || "/placeholder.svg"}
                                  alt={post.title}
                                  width={600}
                                  height={300}
                                  className="w-full h-48 object-cover rounded-lg"
                                />
                              </div>
                            )}

                            <div className="flex flex-wrap gap-2">
                              {post.tags.map((tag, index) => (
                                <Badge key={index} variant="secondary" className="bg-emerald-100 text-emerald-700">
                                  #{tag}
                                </Badge>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })
                  ) : (
                    <Card>
                      <CardContent className="p-12 text-center">
                        <FileText className="w-16 h-16 text-stone-400 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-stone-800 mb-2">No stories found</h3>
                        <p className="text-stone-600">
                          Try searching with different keywords or explore our community feed.
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                <TabsContent value="users" className="space-y-6 mt-6">
                  {users.length > 0 ? (
                    <div className="grid md:grid-cols-2 gap-6">
                      {users.map((user) => (
                        <Card key={user.id}>
                          <CardContent className="p-6">
                            <div className="flex items-center gap-4 mb-4">
                              <Avatar className="w-16 h-16">
                                <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                                <AvatarFallback className="text-lg">
                                  {user.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <h3 className="font-semibold text-stone-800 text-lg">{user.name}</h3>
                                {user.location && (
                                  <div className="flex items-center gap-1 text-stone-600 text-sm">
                                    <MapPin className="w-3 h-3" />
                                    <span>{user.location}</span>
                                  </div>
                                )}
                              </div>
                            </div>

                            {user.bio && <p className="text-stone-700 mb-4">{user.bio}</p>}

                            {user.interests.length > 0 && (
                              <div className="flex flex-wrap gap-2 mb-4">
                                {user.interests.map((interest, index) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    {interest}
                                  </Badge>
                                ))}
                              </div>
                            )}

                            <Button variant="outline" className="w-full bg-transparent">
                              View Profile
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <Card>
                      <CardContent className="p-12 text-center">
                        <Users className="w-16 h-16 text-stone-400 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-stone-800 mb-2">No travelers found</h3>
                        <p className="text-stone-600">Try searching with different keywords or browse our community.</p>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>
              </Tabs>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <Search className="w-16 h-16 text-stone-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-stone-800 mb-2">Start Exploring</h3>
                  <p className="text-stone-600">Search for stories, places, people, or topics that interest you.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}
