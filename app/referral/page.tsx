'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Copy, Check, Users, DollarSign, TrendingUp, Share2 } from 'lucide-react'
import Link from 'next/link'

export default function ReferralPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [referrals, setReferrals] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/'); return }
      setUser(user)
      const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      setProfile(profile)
      const { data: referralsData } = await supabase
        .from('referrals')
        .select('*, referred:profiles!referred_id(*)')
        .eq('referrer_id', user.id)
        .order('created_at', { ascending: false })
      setReferrals(referralsData || [])
      setLoading(false)
    }
    load()
  }, [])

  function copyLink() {
    const link = `${window.location.origin}/?ref=${profile?.referral_code}`
    navigator.clipboard.writeText(link)
    setCopied(true)
    setTimeout(() => setCopied(false), 3000)
  }

  const totalEarnings = referrals.reduce((sum, r) => sum + (r.earnings || 0), 0)

  if (loading) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-3">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon"><ArrowLeft className="w-5 h-5" /></Button>
          </Link>
          <h1 className="text-xl font-bold text-foreground">Referral Program</h1>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        <div className="bg-gradient-to-br from-primary/20 to-purple-900/20 border border-primary/30 rounded-2xl p-6 text-center">
          <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
            <Share2 className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Earn by referring creators</h2>
          <p className="text-muted-foreground mb-6">
            Earn <span className="text-primary font-bold">5%</span> of every transaction from creators you refer — forever.
          </p>
          <div className="bg-background/50 rounded-xl p-4 mb-4">
            <p className="text-xs text-muted-foreground mb-2">Your referral link</p>
            <p className="text-foreground font-mono text-sm break-all">
              {typeof window !== 'undefined' ? `${window.location.origin}/?ref=${profile?.referral_code}` : `fanssecrets.vercel.app/?ref=${profile?.referral_code}`}
            </p>
          </div>
          <Button className="bg-primary hover:bg-primary/90 w-full" onClick={copyLink}>
            {copied ? (
              <><Check className="w-4 h-4 mr-2" />Copied!</>
            ) : (
              <><Copy className="w-4 h-4 mr-2" />Copy Referral Link</>
            )}
          </Button>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Total Referrals', value: referrals.length, icon: Users, color: 'text-blue-500' },
            { label: 'Active Creators', value: referrals.filter(r => r.earnings > 0).length, icon: TrendingUp, color: 'text-green-500' },
            { label: 'Total Earned', value: `$${(totalEarnings/100).toFixed(2)}`, icon: DollarSign, color: 'text-yellow-500' },
          ].map((stat, i) => (
            <div key={i} className="bg-card border border-border rounded-2xl p-4 text-center">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-2">
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <p className="text-xl font-bold text-foreground">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="bg-card border border-border rounded-2xl p-6">
          <h3 className="font-semibold text-foreground mb-4">How it works</h3>
          <div className="space-y-4">
            {[
              { step: '1', title: 'Share your link', desc: 'Copy your unique referral link and share it with creators' },
              { step: '2', title: 'They sign up', desc: 'When a creator signs up using your link they are linked to you' },
              { step: '3', title: 'You earn 5%', desc: 'You automatically earn 5% of all their transactions forever' },
            ].map((item) => (
              <div key={item.step} className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm shrink-0">
                  {item.step}
                </div>
                <div>
                  <p className="font-medium text-foreground">{item.title}</p>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {referrals.length > 0 && (
          <div className="bg-card border border-border rounded-2xl p-6">
            <h3 className="font-semibold text-foreground mb-4">Your Referrals</h3>
            <div className="space-y-3">
              {referrals.map(ref => (
                <div key={ref.id} className="flex items-center gap-3 p-3 bg-secondary/50 rounded-xl">
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold overflow-hidden shrink-0">
                    {ref.referred?.avatar_url ? (
                      <img src={ref.referred.avatar_url} className="w-full h-full object-cover" />
                    ) : (
                      ref.referred?.display_name?.[0]?.toUpperCase() || '?'
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">{ref.referred?.display_name || ref.referred?.username}</p>
                    <p className="text-sm text-muted-foreground">@{ref.referred?.username}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-semibold text-green-500">${(ref.earnings/100).toFixed(2)}</p>
                    <p className="text-xs text-muted-foreground">earned</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}