import { Star, Quote } from "lucide-react"

const testimonials = [
  {
    name: "Jessica Rivera",
    role: "Fitness Creator",
    avatar: "JR",
    rating: 5,
    quote: "Switching to FansSecrets was the best decision for my business. The 85% payout is unmatched, and my subscribers love the platform.",
    earnings: "$45K/month"
  },
  {
    name: "David Kim",
    role: "Music Producer",
    avatar: "DK",
    rating: 5,
    quote: "The live streaming feature has transformed how I connect with fans. Tips during streams alone have doubled my income.",
    earnings: "$28K/month"
  },
  {
    name: "Mia Thompson",
    role: "Artist & Illustrator",
    avatar: "MT",
    rating: 5,
    quote: "Content protection here is incredible. I feel safe sharing my work knowing it&apos;s protected from unauthorized distribution.",
    earnings: "$18K/month"
  }
]

export function Testimonials() {
  return (
    <section className="py-24 bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">Testimonials</span>
          <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground text-balance">
            Loved by Creators Worldwide
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            See what successful creators are saying about their experience with FansSecrets.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="relative p-8 rounded-2xl bg-background border border-border"
            >
              {/* Quote Icon */}
              <Quote className="absolute top-6 right-6 h-8 w-8 text-primary/20" />

              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                ))}
              </div>

              {/* Quote */}
              <p className="text-muted-foreground leading-relaxed mb-6">
                {`"${testimonial.quote}"`}
              </p>

              {/* Author */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold">
                  {testimonial.avatar}
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">{testimonial.name}</h4>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
                <div className="ml-auto">
                  <span className="text-primary font-bold">{testimonial.earnings}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
