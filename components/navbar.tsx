"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Globe, Search, Plus, Users, Home, LogOut } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { FirebaseAuthService } from "@/lib/firebase-auth"

export function Navbar() {
  const [user, setUser] = useState(null)
  const router = useRouter()

  useEffect(() => {
    const authService = FirebaseAuthService.getInstance()
    setUser(authService.getCurrentUser())
  }, [])

  const handleLogout = async () => {
    const authService = FirebaseAuthService.getInstance()
    await authService.logout()
    setUser(null)
    router.push("/")
  }

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-stone-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href={user ? "/dashboard" : "/"} className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-600 to-teal-700 rounded-full flex items-center justify-center">
              <Globe className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-stone-800">Zuetani Earth Tribe</h1>
              <p className="text-xs text-stone-600">Conscious Travel Community</p>
            </div>
          </Link>

          {user ? (
            <nav className="hidden md:flex items-center space-x-6">
              <Link
                href="/dashboard"
                className="flex items-center space-x-1 text-stone-700 hover:text-emerald-600 transition-colors"
              >
                <Home className="w-4 h-4" />
                <span>Feed</span>
              </Link>
              <Link
                href="/search"
                className="flex items-center space-x-1 text-stone-700 hover:text-emerald-600 transition-colors"
              >
                <Search className="w-4 h-4" />
                <span>Discover</span>
              </Link>
              <Link
                href="/groups"
                className="flex items-center space-x-1 text-stone-700 hover:text-emerald-600 transition-colors"
              >
                <Users className="w-4 h-4" />
                <span>Groups</span>
              </Link>
            </nav>
          ) : (
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#" className="text-stone-700 hover:text-emerald-600 transition-colors">
                Explore
              </a>
              <a href="#" className="text-stone-700 hover:text-emerald-600 transition-colors">
                Community
              </a>
              <a href="#" className="text-stone-700 hover:text-emerald-600 transition-colors">
                Stories
              </a>
              <a href="#" className="text-stone-700 hover:text-emerald-600 transition-colors">
                About
              </a>
            </nav>
          )}

          <div className="flex items-center space-x-3">
            {user ? (
              <>
                <Link href="/create-post">
                  <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    Share Story
                  </Button>
                </Link>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                        <AvatarFallback>
                          {user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuItem asChild>
                      <Link href="/profile" className="flex items-center">
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" className="text-stone-700">
                    Sign In
                  </Button>
                </Link>
                <Link href="/register">
                  <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">Join Tribe</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
