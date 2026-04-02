import { UserPlus, Palette, Upload, DollarSign } from "lucide-react"

const steps = [
  {
    number: "01",
    icon: UserPlus,
    title: "Create Your Account",
    description: "Sign up in minutes with just your email. Verify your identity to start earning."
  },
  {
    number: "02",
    icon: Palette,
    title: "Customize Your Profile",
    description: "Build your brand with custom themes, bio, and profile settings that reflect you."
  },
  {
    number: "03",
    icon: Upload,
    title: "Share Exclusive Content",
    description: "Upload photos, videos, and go live. Set your subscription price and start posting."
  },
  {
    number: "04",
    icon: DollarSign,
    title: "Get Paid",
    description: "Receive earnings directly to your bank, PayPal, or crypto wallet. Fast and secure."
  }
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">How It Works</span>
          <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground text-balance">
            Start Earning in 4 Simple Steps
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Getting started is quick and easy. Join thousands of creators already earning on FansSecrets.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-[60%] w-full h-0.5 bg-border" />
              )}
              
              <div className="relative z-10 text-center">
                {/* Number Badge */}
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-card border border-border mb-6">
                  <step.icon className="w-10 h-10 text-primary" />
                </div>
                
                <div className="absolute top-0 right-1/2 translate-x-12 -translate-y-2">
                  <span className="text-5xl font-bold text-muted/30">{step.number}</span>
                </div>

                <h3 className="text-xl font-semibold text-foreground mb-3">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
