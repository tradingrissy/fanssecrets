"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, Users, CheckCircle, Star } from "lucide-react"

const categories = ["All", "Fitness", "Music", "Art", "Cooking", "Gaming", "Fashion"]

const creators = [
  {
    id: 1,
    name: "Sarah Martinez",
    username: "@sarahfit",
    category: "Fitness",
    subscribers: "125K",
    likes: "2.3M",
    price: "$9.99",
    verified: true,
    rating: 4.9,
    bio: "Personal trainer & wellness coach",
    avatar: "SM"
  },
  {
    id: 2,
    name: "Alex Chen",
    username: "@alexbeats",
    category: "Music",
    subscribers: "89K",
    likes: "1.8M",
    price: "$14.99",
    verified: true,
    rating: 4.8,
    bio: "Music producer & DJ lessons",
    avatar: "AC"
  },
  {
    id: 3,
    name: "Emma Wilson",
    username: "@emmaarts",
    category: "Art",
    subscribers: "67K",
    likes: "890K",
    price: "$7.99",
    verified: true,
    rating: 4.9,
    bio: "Digital artist & tutorials",
    avatar: "EW"
  },
  {
    id: 4,
    name: "Marcus Johnson",
    username: "@chefmarcus",
    category: "Cooking",
    subscribers: "156K",
    likes: "3.1M",
    price: "$12.99",
    verified: true,
    rating: 5.0,
    bio: "Professional chef & recipes",
    avatar: "MJ"
  },
  {
    id: 5,
    name: "Luna Park",
    username: "@lunagames",
    category: "Gaming",
    subscribers: "234K",
    likes: "4.5M",
    price: "$5.99",
    verified: true,
    rating: 4.7,
    bio: "Pro gamer & streaming tips",
    avatar: "LP"
  },
  {
    id: 6,
    name: "Tyler Brooks",
    username: "@tylerstyle",
    category: "Fashion",
    subscribers: "78K",
    likes: "1.2M",
    price: "$19.99",
    verified: true,
    rating: 4.8,
    bio: "Fashion designer & stylist",
    avatar: "TB"
  }
]

export function Creators() {
  const [activeCategory, setActiveCategory] = useState("All")

  const filteredCreators = activeCategory === "All" 
    ? creators 
    : creators.filter(c => c.category === activeCategory)

  return (
    <section id="creators" className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">Discover</span>
          <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground text-balance">
            Featured Creators
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore content from our top creators across various categories.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((category) => (
            <Button
              key={category}
              variant={activeCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveCategory(category)}
              className={activeCategory === category 
                ? "bg-primary text-primary-foreground" 
                : "border-border text-muted-foreground hover:text-foreground hover:bg-secondary"
              }
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Creators Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCreators.map((creator) => (
            <div 
              key={creator.id}
              className="group relative overflow-hidden rounded-2xl bg-card border border-border hover:border-primary/50 transition-all duration-300"
            >
              {/* Cover Image Placeholder */}
              <div className="h-32 bg-gradient-to-br from-primary/30 to-primary/10" />
              
              {/* Profile Section */}
              <div className="relative px-6 pb-6">
                {/* Avatar */}
                <div className="absolute -top-10 left-6">
                  <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center text-2xl font-bold text-primary-foreground border-4 border-card">
                    {creator.avatar}
                  </div>
                </div>

                {/* Price Badge */}
                <div className="absolute -top-4 right-6">
                  <Badge className="bg-primary text-primary-foreground px-3 py-1">
                    {creator.price}/mo
                  </Badge>
                </div>

                {/* Info */}
                <div className="pt-12">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold text-foreground">{creator.name}</h3>
                    {creator.verified && (
                      <CheckCircle className="h-4 w-4 text-primary fill-primary" />
                    )}
                  </div>
                  <p className="text-muted-foreground text-sm">{creator.username}</p>
                  <p className="text-muted-foreground text-sm mt-2">{creator.bio}</p>

                  {/* Stats */}
                  <div className="flex items-center gap-4 mt-4">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Users className="h-4 w-4" />
                      <span>{creator.subscribers}</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Heart className="h-4 w-4" />
                      <span>{creator.likes}</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                      <span>{creator.rating}</span>
                    </div>
                  </div>

                  {/* Subscribe Button */}
                  <Button className="w-full mt-4 bg-primary text-primary-foreground hover:bg-primary/90">
                    Subscribe
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Button variant="outline" size="lg" className="border-border text-foreground hover:bg-secondary">
            View All Creators
          </Button>
        </div>
      </div>
    </section>
  )
}
