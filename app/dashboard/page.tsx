'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  LayoutDashboard, BarChart3, MessageSquare, Users, DollarSign,
  Settings, Image, Video, Lock, Send, Eye, Heart, TrendingUp,
  Calendar, Bell, LogOut, Plus, Filter, Download, Clock, Wallet,
  CreditCard, ArrowUpRight, ArrowDownRight, FileText, Mic, Radio,
  MoreHorizontal
} from 'lucide-react'
import Link from 'next/link'

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [stats, setStats] = useState({ earnings: 0, subscribers: 0, views: 0, posts: 0 })
  const [transactions, setTransactions] = useState<any[]>([])
  const [tiers, setTiers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [displayName, setDisplayName] = useState('')
  const [bio, setBio] = useState('')
  const [showAddTier, setShowAddTier] = useState(false)
  const [tierName, setTierName] = useState('')
  const [tierPrice, setTierPrice] = useState('')
  const [tierDesc, setTierDesc] = useState('')

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/'); return }
      setUser(user)
      const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      setProfile(profile)
      setDisplayName(profile?.display_name || '')
      setBio(profile?.bio || '')
      const { count: subCount } = await supabase.from('user_subscriptions').select('*', { count: 'exact', head: true }).eq('creator_id', user.id).eq('status', 'active')
      const { count: postCount } = await supabase.from('content').select('*', { count: 'exact', head: true }).eq('creator_id', user.id)
      const { data: txData } = await supabase.from('transactions').select('*').eq('creator_id', user.id).order('created_at', { ascending: false }).limit(10)
      const totalEarnings = txData?.reduce((sum, t) => sum + (t.creator_payout || 0), 0) || 0
      setTransactions(txData || [])
      setStats({ earnings: totalEarnings, subscribers: subCount || 0, views: 0, posts: postCount || 0 })
      const { data: tiersData } = await supabase.from('subscription_tiers').select('*').eq('creator_id', user.id).order('price')
      setTiers(tiersData || [])
      setLoading(false)
    }
    load()
  }, [])

  async function saveProfile() {
    if (!user) return
    setSaving(true)
    await supabase.from('profiles').update({ display_name: displayName, bio }).eq('id', user.id)
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  async function addTier(e: React.FormEvent) {
    e.preventDefault()
    if (!user) return
    await supabase.from('subscription_tiers').insert({
      creator_id: user.id,
      name: tierName,
      price: Math.round(parseFloat(tierPrice) * 100),
      interval: 'month',
      description: tierDesc,
    })
    const { data } = await supabase.from('subscription_tiers').select('*').eq('creator_id', user.id).order('price')
    setTiers(data || [])
    setTierName('')
    setTierPrice('')
    setTierDesc('')
    setShowAddTier(false)
  }

  async function deleteTier(id: string) {
    await supabase.from('subscription_tiers').delete().eq('id', id)
    setTiers(tiers.filter(t => t.id !== id))
  }

  async function signOut() {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (loading) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  )

  const navItems = [
    { id: 'overview', icon: LayoutDashboard, label: 'Overview' },
    { id: 'content', icon: Image, label: 'Content' },
    { id: 'tiers', icon: DollarSign, label: 'Subscription Tiers' },
    { id: 'earnings', icon: Wallet, label: 'Earnings' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ]

  return (
    <div className="min-h-screen bg-background flex">
      <aside className="w-64 bg-card border-r border-border flex flex-col">
        <div className="p-6 border-b border-border">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">F</span>
            </div>
            <span className="text-xl font-bold text-foreground">FansSecrets</span>
          </Link>
        </div>
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === item.id ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">
              {profile?.display_name?.[0]?.toUpperCase() || profile?.username?.[0]?.toUpperCase() || '?'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-foreground truncate">{profile?.display_name || profile?.username}</p>
              <p className="text-sm text-muted-foreground">@{profile?.username}</p>
            </div>
            <button onClick={signOut} className="p-2 rounded-lg hover:bg-secondary transition-colors">
              <LogOut className="h-5 w-5 text-muted-foreground" />
            </button>
          </div>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-lg border-b border-border">
          <div className="flex items-center justify-between px-8 py-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                {navItems.find(n => n.id === activeTab)?.label || 'Dashboard'}
              </h1>
              <p className="text-muted-foreground">Welcome back, {profile?.display_name || profile?.username}!</p>
            </div>
            <div className="flex items-center gap-4">
              <Button className="bg-primary hover:bg-primary/90" onClick={() => router.push(`/profile/${profile?.username}`)}>
                View Profile
              </Button>
            </div>
          </div>
        </header>

        <div className="p-8">
          {activeTab === 'overview' && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {[
                  { label: 'Total Earnings', value: `$${(stats.earnings/100).toFixed(2)}`, icon: DollarSign, color: 'text-green-500' },
                  { label: 'Subscribers', value: stats.subscribers, icon: Users, color: 'text-blue-500' },
                  { label: 'Total Posts', value: stats.posts, icon: Image, color: 'text-purple-500' },
                  { label: 'Pending Payout', value: `$${(stats.earnings*0.8/100).toFixed(2)}`, icon: Wallet, color: 'text-yellow-500' },
                ].map((stat, i) => (
                  <div key={i} className="p-6 rounded-2xl bg-card border border-border">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                        <stat.icon className={`h-6 w-6 ${stat.color}`} />
                      </div>
                    </div>
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="rounded-2xl bg-card border border-border p-6">
                  <h2 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h2>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { icon: Image, label: 'Upload Photo', action: () => router.push('/dashboard/upload') },
                      { icon: Video, label: 'Upload Video', action: () => router.push('/dashboard/upload') },
                      { icon: Radio, label: 'Go Live', action: () => {} },
                      { icon: Lock, label: 'PPV Content', action: () => router.push('/dashboard/upload') },
                      { icon: Send, label: 'Mass Message', action: () => router.push('/messages') },
                      { icon: DollarSign, label: 'Add Tier', action: () => setActiveTab('tiers') },
                    ].map((action, i) => (
                      <button key={i} onClick={action.action} className="flex flex-col items-center gap-2 p-4 rounded-xl bg-secondary hover:bg-secondary/80 transition-colors">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <action.icon className="h-5 w-5 text-primary" />
                        </div>
                        <span className="text-sm font-medium text-foreground">{action.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl bg-card border border-border p-6">
                  <h2 className="text-lg font-semibold text-foreground mb-4">Recent Transactions</h2>
                  {transactions.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <DollarSign className="h-10 w-10 mx-auto mb-2 opacity-30" />
                      <p>No transactions yet</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {transactions.map((tx) => (
                        <div key={tx.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                              <DollarSign className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium text-foreground capitalize">{tx.type}</p>
                              <p className="text-xs text-muted-foreground">{new Date(tx.created_at).toLocaleDateString()}</p>
                            </div>
                          </div>
                          <p className="font-semibold text-green-500">+${(tx.creator_payout/100).toFixed(2)}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {activeTab === 'tiers' && (
            <div className="max-w-2xl">
              <div className="flex items-center justify-between mb-6">
                <p className="text-muted-foreground">Manage your subscription tiers</p>
                <Button className="bg-primary hover:bg-primary/90" onClick={() => setShowAddTier(!showAddTier)}>
                  <Plus className="h-4 w-4 mr-2" />
                  {showAddTier ? 'Cancel' : 'Add Tier'}
                </Button>
              </div>

              {showAddTier && (
                <form onSubmit={addTier} className="bg-card border border-primary/30 rounded-2xl p-6 mb-6">
                  <h3 className="font-semibold text-foreground mb-4">New Tier</h3>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="text-sm text-muted-foreground block mb-1">Tier Name</label>
                      <Input value={tierName} onChange={e => setTierName(e.target.value)} placeholder="e.g. Basic Fan" required className="bg-secondary" />
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground block mb-1">Price (USD/month)</label>
                      <Input type="number" value={tierPrice} onChange={e => setTierPrice(e.target.value)} placeholder="9.99" min="4.99" step="0.01" required className="bg-secondary" />
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="text-sm text-muted-foreground block mb-1">Description</label>
                    <Input value={tierDesc} onChange={e => setTierDesc(e.target.value)} placeholder="What do fans get?" className="bg-secondary" />
                  </div>
                  <Button type="submit" className="bg-primary hover:bg-primary/90">Save Tier</Button>
                </form>
              )}

              {tiers.length === 0 ? (
                <div className="text-center py-12 bg-card border border-border rounded-2xl">
                  <DollarSign className="h-12 w-12 mx-auto mb-3 text-muted-foreground opacity-30" />
                  <p className="font-semibold text-foreground mb-1">No tiers yet</p>
                  <p className="text-muted-foreground text-sm">Add your first subscription tier to start earning</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {tiers.map((tier) => (
                    <div key={tier.id} className="bg-card border border-border rounded-xl p-4 flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-foreground">{tier.name}</p>
                        <p className="text-primary font-bold">${(tier.price/100).toFixed(2)}/mo</p>
                        {tier.description && <p className="text-sm text-muted-foreground">{tier.description}</p>}
                      </div>
                      <button onClick={() => deleteTier(tier.id)} className="text-red-500 hover:text-red-400 text-sm">Delete</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="max-w-2xl">
              <div className="bg-card border border-border rounded-2xl p-6">
                <h2 className="text-lg font-semibold text-foreground mb-6">Profile Settings</h2>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-muted-foreground block mb-1">Display Name</label>
                    <Input value={displayName} onChange={e => setDisplayName(e.target.value)} placeholder="Your name" className="bg-secondary" />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground block mb-1">Bio</label>
                    <textarea
                      value={bio}
                      onChange={e => setBio(e.target.value)}
                      placeholder="Tell fans about yourself..."
                      rows={4}
                      className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-foreground text-sm outline-none focus:border-primary resize-none"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground block mb-1">Make me a creator</label>
                    <div
                      className="flex items-center gap-3 p-3 bg-secondary rounded-lg cursor-pointer"
                      onClick={async () => {
                        await supabase.from('profiles').update({ is_creator: !profile?.is_creator }).eq('id', user.id)
                        setProfile({ ...profile, is_creator: !profile?.is_creator })
                      }}
                    >
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${profile?.is_creator ? 'bg-primary border-primary' : 'border-gray-600'}`}>
                        {profile?.is_creator && <span className="text-white text-xs">✓</span>}
                      </div>
                      <span className="text-foreground text-sm">{profile?.is_creator ? 'You are a creator' : 'Become a creator'}</span>
                    </div>
                  </div>
                  <Button
                    onClick={saveProfile}
                    disabled={saving}
                    className={`${saved ? 'bg-green-500' : 'bg-primary'} hover:opacity-90 text-white`}
                  >
                    {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Changes'}
                  </Button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'content' && (
            <div className="text-center py-12">
              <Image className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-30" />
              <h2 className="text-xl font-semibold text-foreground mb-2">Upload Content</h2>
              <p className="text-muted-foreground mb-6">Share photos and videos with your subscribers</p>
              <Button className="bg-primary hover:bg-primary/90" onClick={() => router.push('/dashboard/upload')}>
                <Plus className="h-4 w-4 mr-2" />
                Upload New Content
              </Button>
            </div>
          )}

          {activeTab === 'earnings' && (
            <div className="max-w-2xl">
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="p-6 rounded-2xl bg-card border border-border">
                  <p className="text-sm text-muted-foreground mb-1">Available Balance</p>
                  <p className="text-3xl font-bold text-foreground">${(stats.earnings*0.8/100).toFixed(2)}</p>
                </div>
                <div className="p-6 rounded-2xl bg-card border border-border">
                  <p className="text-sm text-muted-foreground mb-1">All Time Earnings</p>
                  <p className="text-3xl font-bold text-foreground">${(stats.earnings/100).toFixed(2)}</p>
                </div>
              </div>
              <Button className="bg-primary hover:bg-primary/90 w-full">
                <Wallet className="h-4 w-4 mr-2" />
                Withdraw Funds
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}