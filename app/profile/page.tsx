"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { AuthGuard } from "@/components/auth-guard"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { AuthService, type User } from "@/lib/auth"
import { useRouter } from "next/navigation"
import { UserIcon, MapPin, Calendar, Edit, Save, X, Plus } from "lucide-react"

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [name, setName] = useState("")
  const [bio, setBio] = useState("")
  const [location, setLocation] = useState("")
  const [interestInput, setInterestInput] = useState("")
  const [interests, setInterests] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const authService = AuthService.getInstance()
    const currentUser = authService.getCurrentUser()

    if (currentUser) {
      setUser(currentUser)
      setName(currentUser.name)
      setBio(currentUser.bio || "")
      setLocation(currentUser.location || "")
      setInterests(currentUser.interests || [])
    }
  }, [])

  const handleAddInterest = () => {
    if (interestInput.trim() && !interests.includes(interestInput.trim())) {
      setInterests([...interests, interestInput.trim()])
      setInterestInput("")
    }
  }

  const handleRemoveInterest = (interestToRemove: string) => {
    setInterests(interests.filter((interest) => interest !== interestToRemove))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleAddInterest()
    }
  }

  const handleSave = async () => {
    if (!user) return

    setIsLoading(true)
    try {
      const authService = AuthService.getInstance()
      const updatedUser = await authService.updateProfile({
        name,
        bio,
        location,
        interests,
      })
      setUser(updatedUser)
      setIsEditing(false)
    } catch (error) {
      console.error("Failed to update profile:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    if (user) {
      setName(user.name)
      setBio(user.bio || "")
      setLocation(user.location || "")
      setInterests(user.interests || [])
    }
    setIsEditing(false)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    })
  }

  if (!user) {
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
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl font-bold text-stone-800">My Profile</CardTitle>
                  {!isEditing ? (
                    <Button onClick={() => setIsEditing(true)} variant="outline">
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Profile
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button onClick={handleSave} disabled={isLoading} className="bg-emerald-600 hover:bg-emerald-700">
                        <Save className="w-4 h-4 mr-2" />
                        {isLoading ? "Saving..." : "Save"}
                      </Button>
                      <Button onClick={handleCancel} variant="outline" disabled={isLoading}>
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Avatar Section */}
                <div className="flex items-center gap-6">
                  <Avatar className="w-24 h-24">
                    <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                    <AvatarFallback className="text-2xl">
                      {user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    {isEditing ? (
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Your full name"
                        />
                      </div>
                    ) : (
                      <div>
                        <h2 className="text-2xl font-bold text-stone-800">{user.name}</h2>
                        <div className="flex items-center gap-4 mt-2 text-stone-600">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>Joined {formatDate(user.joinedAt)}</span>
                          </div>
                          {user.location && (
                            <div className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              <span>{user.location}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Location */}
                {isEditing && (
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-stone-400" />
                      <Input
                        id="location"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="Where are you based?"
                        className="pl-10"
                      />
                    </div>
                  </div>
                )}

                {/* Bio Section */}
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  {isEditing ? (
                    <Textarea
                      id="bio"
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="Tell the tribe about yourself, your travel philosophy, and what inspires your journeys..."
                      rows={4}
                    />
                  ) : (
                    <div className="p-4 bg-stone-50 rounded-lg">
                      <p className="text-stone-700">
                        {user.bio || "No bio added yet. Share your story with the tribe!"}
                      </p>
                    </div>
                  )}
                </div>

                {/* Interests Section */}
                <div className="space-y-2">
                  <Label>Interests & Passions</Label>
                  {isEditing ? (
                    <div>
                      <div className="flex gap-2 mb-3">
                        <Input
                          placeholder="Add an interest (e.g., yoga, photography, hiking)"
                          value={interestInput}
                          onChange={(e) => setInterestInput(e.target.value)}
                          onKeyPress={handleKeyPress}
                        />
                        <Button type="button" onClick={handleAddInterest} variant="outline">
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {interests.map((interest, index) => (
                          <Badge key={index} variant="secondary" className="bg-emerald-100 text-emerald-700">
                            {interest}
                            <button
                              type="button"
                              onClick={() => handleRemoveInterest(interest)}
                              className="ml-2 hover:text-emerald-900"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {user.interests.length > 0 ? (
                        user.interests.map((interest, index) => (
                          <Badge key={index} variant="outline">
                            {interest}
                          </Badge>
                        ))
                      ) : (
                        <p className="text-stone-500 italic">No interests added yet</p>
                      )}
                    </div>
                  )}
                </div>

                {/* Account Info */}
                <div className="pt-6 border-t border-stone-200">
                  <h3 className="font-semibold text-stone-800 mb-3">Account Information</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <UserIcon className="w-4 h-4 text-stone-500" />
                      <span className="text-stone-600">Email:</span>
                      <span className="text-stone-800">{user.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-stone-500" />
                      <span className="text-stone-600">Member since:</span>
                      <span className="text-stone-800">{formatDate(user.joinedAt)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}
