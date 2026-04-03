'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ArrowLeft, DollarSign, Users, Heart, TrendingUp, Image, Eye } from 'lucide-react'
import Link from 'next/link'

export default function AnalyticsPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [stats, setStats] = useState<any>({ earnings: 0, subscribers: 0, posts: 0, likes: 0 })
  const [topPosts, setTopPosts] = useState<any[]>([])
  const [transactions, setTransactions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/'); return }
      setUser(user)
      const { count: subCount } = await supabase.from('user_subscriptions').select('*', { count: 'exact', head: true }).eq('creator_id', user.id).eq('status', 'active')
      const { count: postCount } = await supabase.from('content').select('*', { count: 'exact', head: true }).eq('creator_id', user.id)
      const { data: txData } = await supabase.from('transactions').select('*').eq('creator_id', user.id).order('created_at', { ascending: false })
      const totalEarnings = txData?.reduce((sum, t) => sum + (t.creator_payout || 0), 0) || 0
      const { data: postsData } = await supabase.from('content').select('*').eq('creator_id', user.id).order('likes', { ascending: false }).limit(5)
      const totalLikes = postsData?.reduce((sum, p) => sum + (p.likes || 0), 0) || 0
      setStats({ earnings: totalEarnings, subscribers: subCount || 0, posts: postCount || 0, likes: totalLikes })
      setTopPosts(postsData || [])
      setTransactions(txData?.slice(0, 10) || [])
      setLoading(false)
    }
    load()
  }, [])

  const earningsByType = {
    subscription: transactions.filter(t => t.type === 'subscription').reduce((sum, t) => sum + (t.creator_payout || 0), 0),
    tip: transactions.filter(t => t.type === 'tip').reduce((sum, t) => sum + (t.creator_payout || 0), 0),
    ppv: transactions.filter(t => t.type === 'ppv').reduce((sum, t) => sum + (t.creator_payout || 0), 0),
  }

  if (loading) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-3">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon"><ArrowLeft className="w-5 h-5" /></Button>
          </Link>
          <h1 className="text-xl font-bold text-foreground">Analytics</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Total Earnings', value: `$${(stats.earnings/100).toFixed(2)}`, icon: DollarSign, color: 'text-green-500' },
            { label: 'Subscribers', value: stats.subscribers, icon: Users, color: 'text-blue-500' },
            { label: 'Total Posts', value: stats.posts, icon: Image, color: 'text-purple-500' },
            { label: 'Total Likes', value: stats.likes, icon: Heart, color: 'text-red-500' },
          ].map((stat, i) => (
            <div key={i} className="bg-card border border-border rounded-2xl p-5">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-card border border-border rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-primary" />
              Earnings Breakdown
            </h2>
            <div className="space-y-4">
              {[
                { label: 'Subscriptions', value: earningsByType.subscription, color: 'bg-blue-500' },
                { label: 'Tips', value: earningsByType.tip, color: 'bg-yellow-500' },
                { label: 'PPV Content', value: earningsByType.ppv, color: 'bg-purple-500' },
              ].map((item, i) => {
                const total = stats.earnings || 1
                const percent = Math.round((item.value / total) * 100)
                return (
                  <div key={i}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-foreground">{item.label}</span>
                      <span className="text-sm font-semibold text-foreground">${(item.value/100).toFixed(2)}</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div className={`${item.color} h-2 rounded-full`} style={{ width: `${percent}%` }} />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{percent}% of total</p>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="bg-card border border-border rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Top Posts
            </h2>
            {topPosts.length === 0 ? (
              <div className="text-center py-8">
                <Image className="w-10 h-10 mx-auto mb-2 text-muted-foreground opacity-30" />
                <p className="text-muted-foreground text-sm">No posts yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {topPosts.map((post, i) => (
                  <div key={post.id} className="flex items-center gap-3 p-3 bg-secondary/50 rounded-xl">
                    <span className="text-lg font-bold text-muted-foreground w-6 shrink-0">#{i+1}</span>
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-secondary shrink-0">
                      {post.media_urls?.[0] ? (
                        <img src={post.media_urls[0]} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Image className="w-5 h-5 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground truncate text-sm">{post.title || 'Untitled'}</p>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><Heart className="w-3 h-3" />{post.likes || 0}</span>
                        <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{post.views || 0}</span>
                      </div>
                    </div>
                    {post.is_ppv && <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full shrink-0">PPV</span>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Recent Transactions</h2>
          {transactions.length === 0 ? (
            <div className="text-center py-8">
              <DollarSign className="w-10 h-10 mx-auto mb-2 text-muted-foreground opacity-30" />
              <p className="text-muted-foreground text-sm">No transactions yet</p>
            </div>
          ) : (
            <div className="space-y-2">
              {transactions.map(tx => (
                <div key={tx.id} className="flex items-center justify-between p-3 bg-secondary/50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      tx.type === 'tip' ? 'bg-yellow-500/10' : tx.type === 'ppv' ? 'bg-purple-500/10' : 'bg-blue-500/10'
                    }`}>
                      <DollarSign className={`w-4 h-4 ${
                        tx.type === 'tip' ? 'text-yellow-500' : tx.type === 'ppv' ? 'text-purple-500' : 'text-blue-500'
                      }`} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground capitalize">{tx.type}</p>
                      <p className="text-xs text-muted-foreground">{new Date(tx.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <p className="font-semibold text-green-500">+${(tx.creator_payout/100).toFixed(2)}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}