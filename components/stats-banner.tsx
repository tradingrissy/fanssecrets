"use client"

const stats = [
  { label: "Active Creators", value: "500K+" },
  { label: "Monthly Payouts", value: "$85M+" },
  { label: "Subscribers", value: "50M+" },
  { label: "Countries", value: "190+" },
  { label: "Content Posts", value: "10M+" },
  { label: "Creator Earnings", value: "85%" },
]

export function StatsBanner() {
  return (
    <section className="py-8 bg-primary overflow-hidden">
      <div className="relative">
        <div className="flex animate-marquee whitespace-nowrap">
          {[...stats, ...stats, ...stats].map((stat, index) => (
            <div key={index} className="flex items-center mx-12">
              <span className="text-2xl font-bold text-primary-foreground">{stat.value}</span>
              <span className="ml-2 text-primary-foreground/80">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
