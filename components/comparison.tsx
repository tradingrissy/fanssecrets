import { Check, X, Minus } from "lucide-react"

const features = [
  { name: "Multiple Subscription Tiers", fanssecrets: true, onlyfans: false, fansly: true },
  { name: "Free + Paid on Same Profile", fanssecrets: true, onlyfans: false, fansly: true },
  { name: "Built-in Discovery/FYP", fanssecrets: true, onlyfans: false, fansly: true },
  { name: "Max Subscription Price", fanssecrets: "$499/mo", onlyfans: "$50/mo", fansly: "$500/mo" },
  { name: "Max Tip Amount", fanssecrets: "$500", onlyfans: "$200", fansly: "$500" },
  { name: "Creator Revenue Share", fanssecrets: "85%", onlyfans: "80%", fansly: "80%" },
  { name: "Payout Processing", fanssecrets: "1-2 days", onlyfans: "3-7 days", fansly: "1-2 days" },
  { name: "Mass Messaging", fanssecrets: true, onlyfans: false, fansly: true },
  { name: "Custom Emojis", fanssecrets: true, onlyfans: false, fansly: true },
  { name: "Geo-Blocking", fanssecrets: true, onlyfans: false, fansly: true },
  { name: "Content Organization", fanssecrets: true, onlyfans: "partial", fansly: true },
  { name: "Live Streaming", fanssecrets: true, onlyfans: true, fansly: true },
  { name: "PPV Messages", fanssecrets: true, onlyfans: true, fansly: true },
  { name: "Crypto Payouts", fanssecrets: true, onlyfans: false, fansly: true },
  { name: "AI-Powered Tools", fanssecrets: true, onlyfans: false, fansly: false },
]

export function Comparison() {
  const renderCell = (value: boolean | string) => {
    if (typeof value === "string") {
      return <span className="text-foreground font-medium">{value}</span>
    }
    if (value === true) {
      return <Check className="h-5 w-5 text-green-500 mx-auto" />
    }
    if (value === false) {
      return <X className="h-5 w-5 text-red-500/50 mx-auto" />
    }
    return <Minus className="h-5 w-5 text-muted-foreground mx-auto" />
  }

  return (
    <section className="py-24 bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">Comparison</span>
          <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground text-balance">
            Why Creators Choose FansSecrets
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            See how we stack up against the competition. More features, better payouts, faster processing.
          </p>
        </div>

        {/* Comparison Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="py-4 px-6 text-left text-foreground font-semibold">Feature</th>
                <th className="py-4 px-6 text-center">
                  <div className="inline-flex flex-col items-center">
                    <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center mb-2">
                      <span className="text-primary-foreground font-bold text-lg">F</span>
                    </div>
                    <span className="text-primary font-bold">FansSecrets</span>
                  </div>
                </th>
                <th className="py-4 px-6 text-center">
                  <div className="inline-flex flex-col items-center">
                    <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center mb-2">
                      <span className="text-muted-foreground font-bold text-lg">O</span>
                    </div>
                    <span className="text-muted-foreground font-medium">OnlyFans</span>
                  </div>
                </th>
                <th className="py-4 px-6 text-center">
                  <div className="inline-flex flex-col items-center">
                    <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center mb-2">
                      <span className="text-muted-foreground font-bold text-lg">F</span>
                    </div>
                    <span className="text-muted-foreground font-medium">Fansly</span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {features.map((feature, index) => (
                <tr key={index} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                  <td className="py-4 px-6 text-muted-foreground">{feature.name}</td>
                  <td className="py-4 px-6 text-center bg-primary/5">{renderCell(feature.fanssecrets)}</td>
                  <td className="py-4 px-6 text-center">{renderCell(feature.onlyfans)}</td>
                  <td className="py-4 px-6 text-center">{renderCell(feature.fansly)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center">
          <p className="text-muted-foreground mb-4">
            Ready to maximize your earnings with better tools and higher payouts?
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-medium">
            <Check className="h-5 w-5" />
            Keep 85% of everything you earn
          </div>
        </div>
      </div>
    </section>
  )
}
