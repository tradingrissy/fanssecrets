import { 
  Lock, 
  MessageSquare, 
  Video, 
  CreditCard, 
  BarChart3, 
  Shield,
  Zap,
  Gift,
  Layers,
  Globe,
  Users,
  Search,
  Folder,
  Calendar,
  Smile,
  UserCheck
} from "lucide-react"

const features = [
  {
    icon: Layers,
    title: "Multiple Subscription Tiers",
    description: "Create up to 5 pricing levels on one profile. Basic to Ultimate, each with different benefits."
  },
  {
    icon: Lock,
    title: "Pay-Per-View Content",
    description: "Lock individual posts, photos, videos with blurred previews. Fans pay to unlock."
  },
  {
    icon: MessageSquare,
    title: "Direct & Mass Messaging",
    description: "Private DMs, mass messaging to all subscribers, and paid message options."
  },
  {
    icon: Video,
    title: "Live Streaming",
    description: "Go live with real-time tipping, exclusive streams for VIP tiers, and instant replays."
  },
  {
    icon: Search,
    title: "Discovery & For You Page",
    description: "Built-in discovery with trending creators, categories, and personalized recommendations."
  },
  {
    icon: CreditCard,
    title: "Free + Paid on Same Profile",
    description: "Post free teaser content alongside paid exclusives. No need for separate accounts."
  },
  {
    icon: BarChart3,
    title: "Advanced Analytics",
    description: "Track earnings, subscriber growth, engagement rates, and content performance."
  },
  {
    icon: Shield,
    title: "Content Protection",
    description: "Watermarking, anti-screenshot tech, geo-blocking, and DMCA takedown support."
  },
  {
    icon: Globe,
    title: "Geo-Blocking",
    description: "Block content or access by country/region for privacy and compliance."
  },
  {
    icon: Folder,
    title: "Content Organization",
    description: "Folders, series, tags, and better categorization for easy content browsing."
  },
  {
    icon: Zap,
    title: "Fast Payouts",
    description: "1-2 day processing. Bank transfer, PayPal, crypto, Paxum, and more options."
  },
  {
    icon: Gift,
    title: "Tips Up to $500",
    description: "Receive tips on posts, during streams, tip menus, and custom content requests."
  },
  {
    icon: Calendar,
    title: "Scheduled Posts",
    description: "Plan and schedule content in advance. Set it and forget it."
  },
  {
    icon: Smile,
    title: "Custom Emojis",
    description: "Upload and use personal emojis to make your profile unique."
  },
  {
    icon: Users,
    title: "Audience Segmentation",
    description: "Lists, segments, and filters to manage followers and target promotions."
  },
  {
    icon: UserCheck,
    title: "Age Verification",
    description: "Strong ID verification for creators and age checks for all users. 18+ only."
  }
]

export function Features() {
  return (
    <section id="features" className="py-24 bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">Features</span>
          <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground text-balance">
            Everything You Need to Succeed
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Powerful tools designed specifically for content creators to maximize earnings and fan engagement.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="group p-6 rounded-2xl bg-background border border-border hover:border-primary/50 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
