"use client"

import { useState, useEffect } from "react"
import { AuthGuard } from "@/components/auth-guard"
import { Navbar } from "@/components/navbar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Users, MessageCircle, Calendar, Plus } from "lucide-react"
import { type User } from "@/lib/firebase-auth"

// Groups functionality will be implemented later
type Group = {
  id: string
  name: string
  description: string
  image: string
  memberCount: number
  posts: any[]
}
import Image from "next/image"

export default function GroupsPage() {
  const [groups, setGroups] = useState<Group[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        // TODO: Implement groups functionality in Firebase
        setGroups([])
        setUsers([])
      } catch (error) {
        console.error("Failed to load groups:", error)
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
      hour: "numeric",
      minute: "2-digit",
    })
  }

  if (isLoading) {
    return (
      <AuthGuard>
        <div className="min-h-screen bg-stone-50">
          <Navbar />
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
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
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Groups List */}
            <div className="lg:col-span-1">
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-stone-800 mb-2">Discussion Groups</h1>
                <p className="text-stone-600">Connect with like-minded travelers</p>
              </div>

              <div className="space-y-4">
                {groups.map((group) => (
                  <Card
                    key={group.id}
                    className={`cursor-pointer transition-all ${
                      selectedGroup?.id === group.id ? "ring-2 ring-emerald-500" : "hover:shadow-md"
                    }`}
                    onClick={() => setSelectedGroup(group)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <Image
                          src={group.image || "/placeholder.svg"}
                          alt={group.name}
                          width={48}
                          height={48}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold text-stone-800">{group.name}</h3>
                          <div className="flex items-center gap-1 text-sm text-stone-600">
                            <Users className="w-3 h-3" />
                            <span>{group.memberCount.toLocaleString()} members</span>
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-stone-600 line-clamp-2">{group.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Group Details */}
            <div className="lg:col-span-2">
              {selectedGroup ? (
                <div>
                  <Card className="mb-6">
                    <CardHeader>
                      <div className="flex items-center gap-4">
                        <Image
                          src={selectedGroup.image || "/placeholder.svg"}
                          alt={selectedGroup.name}
                          width={80}
                          height={80}
                          className="w-20 h-20 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <CardTitle className="text-2xl">{selectedGroup.name}</CardTitle>
                          <p className="text-stone-600 mt-2">{selectedGroup.description}</p>
                          <div className="flex items-center gap-4 mt-3">
                            <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">
                              <Users className="w-3 h-3 mr-1" />
                              {selectedGroup.memberCount.toLocaleString()} members
                            </Badge>
                            <Button className="bg-emerald-600 hover:bg-emerald-700">Join Group</Button>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>

                  {/* Group Posts */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-semibold text-stone-800">Recent Discussions</h2>
                      <Button variant="outline" size="sm">
                        <Plus className="w-4 h-4 mr-2" />
                        New Post
                      </Button>
                    </div>

                    {selectedGroup.posts.map((post) => {
                      const author = getUserById(post.userId)
                      if (!author) return null

                      return (
                        <Card key={post.id}>
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
                                  <Calendar className="w-3 h-3" />
                                  <span>{formatDate(post.createdAt)}</span>
                                </div>
                              </div>
                            </div>

                            <h3 className="text-lg font-semibold text-stone-800 mb-3">{post.title}</h3>
                            <p className="text-stone-700 mb-4">{post.content}</p>

                            <div className="flex items-center gap-4 pt-4 border-t border-stone-200">
                              <Button variant="ghost" size="sm" className="text-stone-600 hover:text-emerald-600">
                                <MessageCircle className="w-4 h-4 mr-2" />
                                {post.replies.length} replies
                              </Button>
                            </div>

                            {/* Replies */}
                            {post.replies.length > 0 && (
                              <div className="mt-4 pl-4 border-l-2 border-stone-200 space-y-3">
                                {post.replies.map((reply) => {
                                  const replyAuthor = getUserById(reply.userId)
                                  if (!replyAuthor) return null

                                  return (
                                    <div key={reply.id} className="flex items-start gap-3">
                                      <Avatar className="w-8 h-8">
                                        <AvatarImage
                                          src={replyAuthor.avatar || "/placeholder.svg"}
                                          alt={replyAuthor.name}
                                        />
                                        <AvatarFallback className="text-xs">
                                          {replyAuthor.name
                                            .split(" ")
                                            .map((n) => n[0])
                                            .join("")}
                                        </AvatarFallback>
                                      </Avatar>
                                      <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                          <span className="font-medium text-stone-800 text-sm">{replyAuthor.name}</span>
                                          <span className="text-xs text-stone-500">{formatDate(reply.createdAt)}</span>
                                        </div>
                                        <p className="text-stone-700 text-sm">{reply.content}</p>
                                      </div>
                                    </div>
                                  )
                                })}
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      )
                    })}

                    {selectedGroup.posts.length === 0 && (
                      <Card>
                        <CardContent className="p-12 text-center">
                          <MessageCircle className="w-16 h-16 text-stone-400 mx-auto mb-4" />
                          <h3 className="text-xl font-semibold text-stone-800 mb-2">No discussions yet</h3>
                          <p className="text-stone-600 mb-6">Be the first to start a conversation in this group!</p>
                          <Button className="bg-emerald-600 hover:bg-emerald-700">Start Discussion</Button>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </div>
              ) : (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Users className="w-16 h-16 text-stone-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-stone-800 mb-2">Select a Group</h3>
                    <p className="text-stone-600">
                      Choose a group from the sidebar to view discussions and connect with fellow travelers.
                    </p>
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
