import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Heart, Users, MapPin, Compass, Leaf, Mountain, Globe, Star, ArrowRight, Play } from "lucide-react"
import Image from "next/image"

export default function ZuetaniEarthTribe() {
  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-stone-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-600 to-teal-700 rounded-full flex items-center justify-center">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-stone-800">Zuetani Earth Tribe</h1>
                <p className="text-xs text-stone-600">Conscious Travel Community</p>
              </div>
            </div>

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

            <div className="flex items-center space-x-3">
              <Button variant="ghost" className="text-stone-700">
                Sign In
              </Button>
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">Join Tribe</Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-teal-50"></div>
        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-6 bg-emerald-100 text-emerald-800 hover:bg-emerald-100">
              <Leaf className="w-4 h-4 mr-2" />
              Digital Campfire for Conscious Travelers
            </Badge>

            <h1 className="text-5xl md:text-6xl font-bold text-stone-800 mb-6 leading-tight">
              Travel with{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">
                Purpose
              </span>
              <br />
              Connect with{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">Soul</span>
            </h1>

            <p className="text-xl text-stone-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              Join a global community of mindful travelers sharing transformative experiences, sustainable adventures,
              and deep connections with our beautiful Earth.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3">
                <Users className="w-5 h-5 mr-2" />
                Join Our Tribe
              </Button>
              <Button size="lg" variant="outline" className="border-stone-300 text-stone-700 px-8 py-3 bg-transparent">
                <Play className="w-5 h-5 mr-2" />
                Watch Our Story
              </Button>
            </div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-emerald-200/30 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-teal-200/30 rounded-full blur-xl"></div>
      </section>

      {/* Community Stats */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-600 mb-2">12K+</div>
              <div className="text-stone-600">Conscious Travelers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-600 mb-2">89</div>
              <div className="text-stone-600">Countries Connected</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-600 mb-2">2.3K</div>
              <div className="text-stone-600">Shared Stories</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-600 mb-2">450+</div>
              <div className="text-stone-600">Eco Experiences</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Experiences */}
      <section className="py-20 bg-stone-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-stone-800 mb-4">Transformative Experiences</h2>
            <p className="text-xl text-stone-600 max-w-2xl mx-auto">
              Discover soul-stirring adventures curated by our global community of conscious travelers
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Sacred Valley Meditation Retreat",
                location: "Peru",
                image: "/placeholder.svg?height=300&width=400",
                rating: 4.9,
                reviews: 127,
                price: "$890",
                tags: ["Spiritual", "Meditation", "Nature"],
              },
              {
                title: "Sustainable Farm Stay Experience",
                location: "Costa Rica",
                image: "/placeholder.svg?height=300&width=400",
                rating: 4.8,
                reviews: 89,
                price: "$320",
                tags: ["Eco-friendly", "Farm Life", "Community"],
              },
              {
                title: "Northern Lights & Sami Culture",
                location: "Norway",
                image: "/placeholder.svg?height=300&width=400",
                rating: 4.9,
                reviews: 156,
                price: "$1,240",
                tags: ["Culture", "Nature", "Adventure"],
              },
            ].map((experience, index) => (
              <Card
                key={index}
                className="overflow-hidden hover:shadow-lg transition-shadow duration-300 border-0 shadow-md"
              >
                <div className="relative">
                  <Image
                    src={experience.image || "/placeholder.svg"}
                    alt={experience.title}
                    width={400}
                    height={300}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-4 right-4">
                    <Button size="sm" variant="secondary" className="bg-white/90 hover:bg-white">
                      <Heart className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="w-4 h-4 text-stone-500" />
                    <span className="text-sm text-stone-600">{experience.location}</span>
                  </div>

                  <h3 className="text-xl font-semibold text-stone-800 mb-3">{experience.title}</h3>

                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium text-stone-700 ml-1">{experience.rating}</span>
                    </div>
                    <span className="text-sm text-stone-500">({experience.reviews} reviews)</span>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {experience.tags.map((tag, tagIndex) => (
                      <Badge key={tagIndex} variant="secondary" className="bg-emerald-100 text-emerald-700">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold text-emerald-600">{experience.price}</div>
                    <Button className="bg-emerald-600 hover:bg-emerald-700">Learn More</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Community Stories */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-stone-800 mb-4">Stories from the Tribe</h2>
            <p className="text-xl text-stone-600 max-w-2xl mx-auto">
              Real experiences shared by our community of conscious travelers
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                author: "Maya Chen",
                location: "Bali, Indonesia",
                avatar: "/placeholder.svg?height=60&width=60",
                story:
                  "The sunrise yoga session overlooking the rice terraces was pure magic. I found a piece of my soul I didn't know was missing.",
                image: "/placeholder.svg?height=200&width=300",
              },
              {
                author: "Carlos Rodriguez",
                location: "Patagonia, Chile",
                avatar: "/placeholder.svg?height=60&width=60",
                story:
                  "Hiking with the local Mapuche guide opened my eyes to a completely different way of seeing nature and our place in it.",
                image: "/placeholder.svg?height=200&width=300",
              },
              {
                author: "Aisha Patel",
                location: "Kerala, India",
                avatar: "/placeholder.svg?height=60&width=60",
                story:
                  "Living with the fishing community taught me that happiness isn't about what you have, but who you share it with.",
                image: "/placeholder.svg?height=200&width=300",
              },
            ].map((story, index) => (
              <Card key={index} className="border-0 shadow-md hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6">
                  <Image
                    src={story.image || "/placeholder.svg"}
                    alt={`Story from ${story.location}`}
                    width={300}
                    height={200}
                    className="w-full h-40 object-cover rounded-lg mb-4"
                  />

                  <p className="text-stone-700 mb-4 italic leading-relaxed">"{story.story}"</p>

                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={story.avatar || "/placeholder.svg"} alt={story.author} />
                      <AvatarFallback>
                        {story.author
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold text-stone-800">{story.author}</div>
                      <div className="text-sm text-stone-600 flex items-center">
                        <MapPin className="w-3 h-3 mr-1" />
                        {story.location}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-br from-emerald-600 to-teal-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <Mountain className="w-16 h-16 mx-auto mb-6 text-emerald-200" />
          <h2 className="text-4xl font-bold mb-4">Ready to Begin Your Journey?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-emerald-100">
            Join thousands of conscious travelers who are exploring the world with purpose, creating meaningful
            connections, and leaving positive footprints wherever they go.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" className="bg-white text-emerald-600 hover:bg-stone-100 px-8 py-3">
              <Compass className="w-5 h-5 mr-2" />
              Start Your Adventure
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white/10 px-8 py-3 bg-transparent"
            >
              Learn More
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-stone-800 text-stone-300 py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-emerald-600 to-teal-700 rounded-full flex items-center justify-center">
                  <Globe className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-white">Zuetani Earth Tribe</h3>
                </div>
              </div>
              <p className="text-stone-400 mb-4">
                Connecting conscious travelers worldwide through meaningful experiences and sustainable adventures.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Explore</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="hover:text-emerald-400 transition-colors">
                    Destinations
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-emerald-400 transition-colors">
                    Experiences
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-emerald-400 transition-colors">
                    Local Guides
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-emerald-400 transition-colors">
                    Eco Stays
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Community</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="hover:text-emerald-400 transition-colors">
                    Travel Stories
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-emerald-400 transition-colors">
                    Forums
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-emerald-400 transition-colors">
                    Events
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-emerald-400 transition-colors">
                    Meetups
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Support</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="hover:text-emerald-400 transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-emerald-400 transition-colors">
                    Safety
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-emerald-400 transition-colors">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-emerald-400 transition-colors">
                    About
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-stone-700 mt-12 pt-8 text-center">
            <p className="text-stone-400">© 2024 Zuetani Earth Tribe. Made with ❤️ for conscious travelers worldwide.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
