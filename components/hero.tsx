"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Play, Shield, DollarSign, Users } from "lucide-react"

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary border border-border mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            <span className="text-sm text-muted-foreground">
              Trusted by 500K+ creators worldwide
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-foreground leading-tight tracking-tight text-balance">
            Your Content,
            <br />
            <span className="text-primary">Your Rules</span>
          </h1>

          {/* Subheadline */}
          <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
            The premium platform where creators take control. Monetize your exclusive content, 
            connect authentically with fans, and keep 85% of your earnings.
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 text-lg px-8 py-6 h-auto">
              Start Creating
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="border-border text-foreground hover:bg-secondary text-lg px-8 py-6 h-auto">
              <Play className="mr-2 h-5 w-5" />
              Watch Demo
            </Button>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="flex flex-col items-center p-6 rounded-2xl bg-card border border-border">
              <DollarSign className="h-8 w-8 text-primary mb-3" />
              <span className="text-3xl font-bold text-foreground">$2.5B+</span>
              <span className="text-muted-foreground">Paid to Creators</span>
            </div>
            <div className="flex flex-col items-center p-6 rounded-2xl bg-card border border-border">
              <Users className="h-8 w-8 text-primary mb-3" />
              <span className="text-3xl font-bold text-foreground">50M+</span>
              <span className="text-muted-foreground">Active Subscribers</span>
            </div>
            <div className="flex flex-col items-center p-6 rounded-2xl bg-card border border-border">
              <Shield className="h-8 w-8 text-primary mb-3" />
              <span className="text-3xl font-bold text-foreground">85%</span>
              <span className="text-muted-foreground">Creator Earnings</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
