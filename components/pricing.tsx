"use client"

import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"

const plans = [
  {
    name: "Starter",
    description: "Perfect for new creators just getting started",
    price: "Free",
    period: "to join",
    commission: "15%",
    youKeep: "85%",
    features: [
      "Unlimited posts & uploads",
      "Up to 3 subscription tiers",
      "Basic analytics dashboard",
      "Direct messaging",
      "PPV & tip support",
      "Standard payouts (3-5 days)"
    ],
    cta: "Start Free",
    popular: false
  },
  {
    name: "Creator Pro",
    description: "For creators ready to grow their audience",
    price: "$19.99",
    period: "/month",
    commission: "12%",
    youKeep: "88%",
    features: [
      "Everything in Starter",
      "Up to 5 subscription tiers",
      "Live streaming with tips",
      "Advanced analytics & insights",
      "Mass messaging (unlimited)",
      "Scheduled posts",
      "Custom emojis",
      "Fast payouts (1-2 days)"
    ],
    cta: "Go Pro",
    popular: true
  },
  {
    name: "Elite Creator",
    description: "For top creators who want maximum earnings",
    price: "$49.99",
    period: "/month",
    commission: "8%",
    youKeep: "92%",
    features: [
      "Everything in Pro",
      "Dedicated account manager",
      "Custom watermarks & branding",
      "Geo-blocking controls",
      "API access",
      "Priority discovery placement",
      "Verified badge",
      "Same-day payouts",
      "AI-powered fan insights"
    ],
    cta: "Go Elite",
    popular: false
  }
]

export function Pricing() {
  return (
    <section id="pricing" className="py-24 bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">Pricing</span>
          <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground text-balance">
            Keep More of What You Earn
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Industry-leading payouts with flexible plans designed for creators at every stage.
          </p>
        </div>

        {/* Pricing Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <div 
              key={index}
              className={`relative rounded-2xl p-8 ${
                plan.popular 
                  ? 'bg-primary text-primary-foreground border-2 border-primary scale-105' 
                  : 'bg-background border border-border'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-foreground text-background text-xs font-semibold px-3 py-1 rounded-full">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center">
                <h3 className={`text-xl font-bold ${plan.popular ? 'text-primary-foreground' : 'text-foreground'}`}>
                  {plan.name}
                </h3>
                <p className={`mt-2 text-sm ${plan.popular ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                  {plan.description}
                </p>
                
                <div className="mt-6">
                  <span className={`text-4xl font-bold ${plan.popular ? 'text-primary-foreground' : 'text-foreground'}`}>
                    {plan.price}
                  </span>
                  <span className={`${plan.popular ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                    {plan.period}
                  </span>
                </div>

                <div className={`mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${plan.popular ? 'bg-white/20' : 'bg-green-500/10'}`}>
                  <span className={`text-sm font-semibold ${plan.popular ? 'text-primary-foreground' : 'text-green-500'}`}>
                    You keep {plan.youKeep}
                  </span>
                </div>
                <p className={`mt-2 text-xs ${plan.popular ? 'text-primary-foreground/60' : 'text-muted-foreground'}`}>
                  Platform fee: {plan.commission}
                </p>
              </div>

              <ul className="mt-8 space-y-4">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center gap-3">
                    <Check className={`h-5 w-5 flex-shrink-0 ${plan.popular ? 'text-primary-foreground' : 'text-primary'}`} />
                    <span className={`text-sm ${plan.popular ? 'text-primary-foreground' : 'text-muted-foreground'}`}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <Button 
                className={`w-full mt-8 ${
                  plan.popular 
                    ? 'bg-foreground text-background hover:bg-foreground/90' 
                    : 'bg-primary text-primary-foreground hover:bg-primary/90'
                }`}
              >
                {plan.cta}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
