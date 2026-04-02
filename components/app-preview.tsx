"use client"

import { Heart, MessageCircle, Share2, Bookmark, MoreHorizontal, Play, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"

export function AppPreview() {
  return (
    <section className="py-24 bg-background overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">Platform Preview</span>
          <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground text-balance">
            A Beautiful Experience for You and Your Fans
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Clean, intuitive design that puts your content first and makes monetization effortless.
          </p>
        </div>

        {/* App Preview Cards */}
        <div className="flex flex-col lg:flex-row items-center justify-center gap-8">
          {/* Profile Card */}
          <div className="w-full max-w-sm bg-card border border-border rounded-3xl overflow-hidden shadow-2xl">
            {/* Cover */}
            <div className="h-32 bg-gradient-to-br from-primary via-primary/80 to-primary/60 relative">
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2">
                <div className="w-24 h-24 rounded-full bg-primary border-4 border-card flex items-center justify-center text-3xl font-bold text-primary-foreground">
                  SM
                </div>
              </div>
            </div>
            
            {/* Profile Info */}
            <div className="pt-16 pb-6 px-6 text-center">
              <h3 className="text-xl font-bold text-foreground">Sarah Martinez</h3>
              <p className="text-muted-foreground">@sarahfit</p>
              <p className="mt-2 text-sm text-muted-foreground">Fitness coach & wellness expert sharing exclusive workouts and nutrition tips</p>
              
              <div className="flex justify-center gap-8 mt-4 text-sm">
                <div>
                  <span className="font-bold text-foreground">125K</span>
                  <span className="text-muted-foreground ml-1">Fans</span>
                </div>
                <div>
                  <span className="font-bold text-foreground">847</span>
                  <span className="text-muted-foreground ml-1">Posts</span>
                </div>
                <div>
                  <span className="font-bold text-foreground">2.3M</span>
                  <span className="text-muted-foreground ml-1">Likes</span>
                </div>
              </div>

              <Button className="w-full mt-6 bg-primary text-primary-foreground hover:bg-primary/90">
                Subscribe for $9.99/mo
              </Button>
            </div>
          </div>

          {/* Feed Card */}
          <div className="w-full max-w-sm bg-card border border-border rounded-3xl overflow-hidden shadow-2xl">
            {/* Post Header */}
            <div className="p-4 flex items-center gap-3 border-b border-border">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold">
                SM
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-foreground text-sm">Sarah Martinez</h4>
                <p className="text-xs text-muted-foreground">2 hours ago</p>
              </div>
              <button className="text-muted-foreground hover:text-foreground">
                <MoreHorizontal className="h-5 w-5" />
              </button>
            </div>

            {/* Post Content */}
            <div className="relative aspect-[4/3] bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center">
              <div className="absolute inset-0 backdrop-blur-xl flex flex-col items-center justify-center">
                <Lock className="h-12 w-12 text-primary mb-3" />
                <p className="text-foreground font-semibold">Exclusive Content</p>
                <p className="text-sm text-muted-foreground">Subscribe to view</p>
              </div>
            </div>

            {/* Post Actions */}
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-4">
                  <button className="flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors">
                    <Heart className="h-6 w-6" />
                    <span className="text-sm">2.4K</span>
                  </button>
                  <button className="flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors">
                    <MessageCircle className="h-6 w-6" />
                    <span className="text-sm">148</span>
                  </button>
                  <button className="text-muted-foreground hover:text-primary transition-colors">
                    <Share2 className="h-6 w-6" />
                  </button>
                </div>
                <button className="text-muted-foreground hover:text-primary transition-colors">
                  <Bookmark className="h-6 w-6" />
                </button>
              </div>
              <p className="text-sm text-foreground">
                <span className="font-semibold">sarahfit</span>{" "}
                New exclusive workout routine dropping tonight! Get ready to burn...
              </p>
            </div>
          </div>

          {/* Live Stream Card */}
          <div className="w-full max-w-sm bg-card border border-border rounded-3xl overflow-hidden shadow-2xl">
            {/* Live Banner */}
            <div className="relative aspect-video bg-gradient-to-br from-primary/40 to-primary/20 flex items-center justify-center">
              <div className="absolute top-4 left-4 flex items-center gap-2">
                <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-red-500 text-white text-xs font-semibold">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                  </span>
                  LIVE
                </span>
                <span className="px-2 py-1 rounded-full bg-background/80 text-foreground text-xs">
                  1.2K watching
                </span>
              </div>
              <button className="w-20 h-20 rounded-full bg-primary/90 flex items-center justify-center hover:bg-primary transition-colors">
                <Play className="h-10 w-10 text-primary-foreground fill-primary-foreground ml-1" />
              </button>
            </div>

            {/* Stream Info */}
            <div className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold">
                  MJ
                </div>
                <div>
                  <h4 className="font-semibold text-foreground text-sm">Marcus Johnson</h4>
                  <p className="text-xs text-muted-foreground">Live Cooking Session</p>
                </div>
              </div>
              
              <p className="text-sm text-muted-foreground mb-4">
                Making my famous pasta from scratch! Join and ask questions...
              </p>

              <div className="flex gap-2">
                <Button className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90">
                  Join Stream
                </Button>
                <Button variant="outline" className="border-border text-foreground">
                  Send Tip
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
