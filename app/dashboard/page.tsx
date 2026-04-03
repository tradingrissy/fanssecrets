'use client'
import { useEffect, useState, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  LayoutDashboard, BarChart3, Users, DollarSign,
  Settings, Image, Video, Lock, Send, LogOut, Plus,
  Wallet, Camera, TrendingUp, Heart, Eye, Share2
} from 'lucide-react'
import Link from 'next/link'

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [stats, setStats] = useState({ earnings: 0, subscribers: 0, posts: 0, views: 0 })
  const [transactions, setTransactions] = useState<any[]>([])
  const [tiers, setTiers] = useState<any[]>([])
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [displayName, setDisplayName] = useState('')
  const [bio, setBio] = useState('')
  const [username, setUsername] = useState('')
  const [showAddTier, setShowAddTier] = useState(false)
  const [tierName, setTierName] = useState('')
  const [tierPrice, setTierPrice] = useState('')
  const [tierDesc, setTierDesc] = useState('')
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const [uploadingBanner, setUploadingBanner] = useState(false)
  const avatarRef = useRef<HTMLInputElement>(null)
  const bannerRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/'); return }
      setUser(user)
      const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      setProfile(profile)
      setDisplayName(profile?.display_name || '')
      setBio(profile?.bio || '')
      setUsername(profile?.username || '')
      const { count: subCount } = await supabase.from('user_subscriptions').select('*', { count: 'exact', head: true }).eq('creator_id', user.id).eq('status', 'active')
      const { count: postCount } = await supabase.from('content').select('*', { count: 'exact', head: true }).eq('creator_id', user.id)
      const { data: txData } = await supabase.from('transactions').select('*').eq('creator_id', user.id).order('created_at', { ascending: false }).limit(10)
      const totalEarnings = txData?.reduce((sum: number, t: any) => sum + (t.creator_payout || 0), 0) || 0
      setTransactions(txData || [])
      setStats({ earnings: totalEarnings, subscribers: subCount || 0, posts: postCount || 0, views: 0 })
      const { data: tiersData } = await supabase.from('subscription_tiers').select('*').eq('creator_id', user.id).order('price')
      setTiers(tiersData || [])
      const { data: postsData } = await supabase.from('content').select('*').eq('creator_id', user.id).order('created_at', { ascending: false }).limit(6)
      setPosts(postsData || [])
      setLoading(false)
    }
    load()
  }, [])

  async function uploadAvatar(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file || !user) return
    setUploadingAvatar(true)
    const filePath = `avatars/${user.id}/avatar.${file.name.split('.').pop()}`
    await supabase.storage.from('avatars').upload(filePath, file, { upsert: true })
    const { data } = supabase.storage.from('avatars').getPublicUrl(filePath)
    await supabase.from('profiles').update({ avatar_url: data.publicUrl }).eq('id', user.id)
    setProfile({ ...profile, avatar_url: data.publicUrl })
    setUploadingAvatar(false)
  }

  async function uploadBanner(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file || !user) return
    setUploadingBanner(true)
    const filePath = `avatars/${user.id}/banner.${file.name.split('.').pop()}`
    await supabase.storage.from('avatars').upload(filePath, file, { upsert: true })
    const { data } = supabase.storage.from('avatars').getPublicUrl(filePath)
    await supabase.from('profiles').update({ banner_url: data.publicUrl }).eq('id', user.id)
    setProfile({ ...profile, banner_url: data.publicUrl })
    setUploadingBanner(false)
  }

  async function saveProfile() {
    if (!user) return
    setSaving(true)
    await supabase.from('profiles').update({ display_name: displayName, bio, username }).eq('id', user.id)
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
    setTierName(''); setTierPrice(''); setTierDesc(''); setShowAddTier(false)
  }

  async function deleteTier(id: string) {
    await supabase.from('subscription_tiers').delete().eq('id', id)
    setTiers(tiers.filter(t => t.id !== id))
  }

  async function deletePost(id: string) {
    await supabase.from('content').delete().eq('id', id)
    setPosts(posts.filter(p => p.id !== id))
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
    { id: 'content', icon: Image, label: 'My Content' },
    { id: 'tiers', icon: DollarSign, label: 'Subscription Tiers' },
    { id: 'earnings', icon: Wallet, label: 'Earnings' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ]

  const externalLinks = [
    { icon: BarChart3, label: 'Analytics', href: '/analytics' },
    { icon: Share2, label: 'Referrals', href: '/referral' },
  ]

  return (
    <div className="min-h-screen bg-background flex">
      <aside className="w-64 bg-card border-r border-border flex flex-col shrink-0">
        <div className="p-6 border-b border-border">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">F</span>
            </div>
            <span className="text-xl font-bold text-foreground">FansSecrets</span>
          </Link>
        </div>
        <nav className="flex-1 p-4">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.id}>
                <button onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === item.id ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              </li>
            ))}
            <li><div className="border-t border-border my-2" /></li>
            {externalLinks.map((item) => (
              <li key={item.href}>
                <button onClick={() => router.push(item.href)}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-muted-foreground hover:text-foreground hover:bg-secondary"
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
            <div className="w-10 h-10 rounded-full overflow-hidden bg-primary flex items-center justify-center text-white font-bold shrink-0">
              {profile?.avatar_url ? <img src={profile.avatar_url} className="w-full h-full object-cover" /> : profile?.display_name?.[0]?.toUpperCase() || '?'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-foreground truncate">{profile?.display_name || profile?.username}</p>
              <p className="text-sm text-muted-foreground">@{profile?.username}</p>
            </div>
            <button onClick={signOut} className="p-2 rounded-lg hover:bg-secondary">
              <LogOut className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-lg border-b border-border px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">{navItems.find(n => n.id === activeTab)?.label || 'Dashboard'}</h1>
            <p className="text-muted-foreground text-sm">Welcome back, {profile?.display_name || profile?.username}</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => router.push(`/profile/${profile?.username}`)}>View Profile</Button>
            <Button className="bg-primary hover:bg-primary/90" onClick={() => router.push('/dashboard/upload')}>
              <Plus className="h-4 w-4 mr-2" />New Post
            </Button>
          </div>
        </header>

        <div className="p-8">
          {activeTab === 'overview' && (
            <>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {[
                  { label: 'Total Earnings', value: `$${(stats.earnings/100).toFixed(2)}`, icon: DollarSign, color: 'text-green-500' },
                  { label: 'Subscribers', value: stats.subscribers, icon: Users, color: 'text-blue-500' },
                  { label: 'Total Posts', value: stats.posts, icon: Image, color: 'text-purple-500' },
                  { label: 'Pending Payout', value: `$${(stats.earnings*0.8/100).toFixed(2)}`, icon: Wallet, color: 'text-yellow-500' },
                ].map((stat, i) => (
                  <div key={i} className="p-6 rounded-2xl bg-card border border-border">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
                      <stat.icon className={`h-5 w-5 ${stat.color}`} />
                    </div>
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="rounded-2xl bg-card border border-border p-6">
                  <h2 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h2>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { icon: Image, label: 'Photo', action: () => router.push('/dashboard/upload') },
                      { icon: Video, label: 'Video', action: () => router.push('/dashboard/upload') },
                      { icon: Lock, label: 'PPV', action: () => router.push('/dashboard/upload') },
                      { icon: Send, label: 'Message', action: () => router.push('/messages') },
                      { icon: DollarSign, label: 'Add Tier', action: () => setActiveTab('tiers') },
                      { icon: BarChart3, label: 'Analytics', action: () => router.push('/analytics') },
                    ].map((action, i) => (
                      <button key={i} onClick={action.action} className="flex flex-col items-center gap-2 p-3 rounded-xl bg-secondary hover:bg-secondary/80 transition-colors">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <action.icon className="h-5 w-5 text-primary" />
                        </div>
                        <span className="text-xs font-medium text-foreground">{action.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="rounded-2xl bg-card border border-border p-6">
                  <h2 className="text-lg font-semibold text-foreground mb-4">Recent Transactions</h2>
                  {transactions.length === 0 ? (
                    <div className="text-center py-8">
                      <DollarSign className="h-10 w-10 mx-auto mb-2 text-muted-foreground opacity-30" />
                      <p className="text-muted-foreground text-sm">No transactions yet</p>
                    </div>
                  ) : transactions.map((tx) => (
                    <div key={tx.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <DollarSign className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground text-sm capitalize">{tx.type}</p>
                          <p className="text-xs text-muted-foreground">{new Date(tx.created_at).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <p className="font-semibold text-green-500 text-sm">+${(tx.creator_payout/100).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {activeTab === 'content' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <p className="text-muted-foreground">Manage your posts</p>
                <Button className="bg-primary hover:bg-primary/90" onClick={() => router.push('/dashboard/upload')}>
                  <Plus className="h-4 w-4 mr-2" />Upload New
                </Button>
              </div>
              {posts.length === 0 ? (
                <div className="text-center py-16 bg-card border border-border rounded-2xl">
                  <Image className="h-12 w-12 mx-auto mb-3 text-muted-foreground opacity-30" />
                  <p className="font-semibold text-foreground mb-1">No posts yet</p>
                  <p className="text-muted-foreground text-sm mb-4">Start sharing content with your subscribers</p>
                  <Button className="bg-primary hover:bg-primary/90" onClick={() => router.push('/dashboard/upload')}>Upload First Post</Button>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {posts.map(post => (
                    <div key={post.id} className="group relative rounded-xl overflow-hidden bg-card border border-border aspect-square">
                      {post.media_urls?.[0] ? (
                        <img src={post.media_urls[0]} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-secondary">
                          <Image className="h-8 w-8 text-muted-foreground" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                        <p className="text-white text-xs font-medium px-2 text-center truncate w-full">{post.title}</p>
                        {post.is_ppv && <span className="text-xs bg-primary px-2 py-0.5 rounded-full text-white">${(post.ppv_price/100).toFixed(2)} PPV</span>}
                        <button onClick={() => deletePost(post.id)} className="text-red-400 text-xs hover:text-red-300">Delete</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'tiers' && (
            <div className="max-w-2xl">
              <div className="flex items-center justify-between mb-6">
                <p className="text-muted-foreground">Set your subscription prices</p>
                <Button className="bg-primary hover:bg-primary/90" onClick={() => setShowAddTier(!showAddTier)}>
                  <Plus className="h-4 w-4 mr-2" />{showAddTier ? 'Cancel' : 'Add Tier'}
                </Button>
              </div>
              {showAddTier && (
                <form onSubmit={addTier} className="bg-card border border-primary/30 rounded-2xl p-6 mb-6 space-y-4">
                  <h3 className="font-semibold text-foreground">New Subscription Tier</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-muted-foreground block mb-1">Tier Name</label>
                      <Input value={tierName} onChange={e => setTierName(e.target.value)} placeholder="e.g. Basic Fan" required className="bg-secondary" />
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground block mb-1">Price (USD/month)</label>
                      <Input type="number" value={tierPrice} onChange={e => setTierPrice(e.target.value)} placeholder="9.99" min="4.99" step="0.01" required className="bg-secondary" />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground block mb-1">Description</label>
                    <Input value={tierDesc} onChange={e => setTierDesc(e.target.value)} placeholder="Access to all my exclusive content" className="bg-secondary" />
                  </div>
                  <Button type="submit" className="bg-primary hover:bg-primary/90">Save Tier</Button>
                </form>
              )}
              {tiers.length === 0 ? (
                <div className="text-center py-12 bg-card border border-border rounded-2xl">
                  <DollarSign className="h-12 w-12 mx-auto mb-3 text-muted-foreground opacity-30" />
                  <p className="font-semibold text-foreground mb-1">No tiers yet</p>
                  <p className="text-muted-foreground text-sm">Add subscription tiers to start earning</p>
                </div>
              ) : tiers.map(tier => (
                <div key={tier.id} className="bg-card border border-border rounded-xl p-4 flex items-center justify-between mb-3">
                  <div>
                    <p className="font-semibold text-foreground">{tier.name}</p>
                    <p className="text-primary font-bold">${(tier.price/100).toFixed(2)}/mo</p>
                    {tier.description && <p className="text-sm text-muted-foreground">{tier.description}</p>}
                  </div>
                  <button onClick={() => deleteTier(tier.id)} className="text-red-500 hover:text-red-400 text-sm px-3 py-1 border border-red-500/30 rounded-lg">Delete</button>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'earnings' && (
            <div className="max-w-2xl space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-6 rounded-2xl bg-card border border-border">
                  <p className="text-sm text-muted-foreground mb-1">Available Balance</p>
                  <p className="text-3xl font-bold text-foreground">${(stats.earnings*0.8/100).toFixed(2)}</p>
                </div>
                <div className="p-6 rounded-2xl bg-card border border-border">
                  <p className="text-sm text-muted-foreground mb-1">All Time Earnings</p>
                  <p className="text-3xl font-bold text-foreground">${(stats.earnings/100).toFixed(2)}</p>
                </div>
              </div>
              <div className="bg-card border border-border rounded-2xl p-6">
                <p className="text-sm text-muted-foreground mb-2">Platform fee</p>
                <p className="text-foreground">You keep <span className="text-primary font-bold">80%</span> of all earnings. FansSecrets takes 20%.</p>
              </div>
              <Button className="bg-primary hover:bg-primary/90 w-full py-3">
                <Wallet className="h-4 w-4 mr-2" />Withdraw Funds
              </Button>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="max-w-2xl space-y-6">
              <div className="bg-card border border-border rounded-2xl overflow-hidden">
                <div className="relative h-32">
                  {profile?.banner_url ? (
                    <img src={profile.banner_url} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary/30 to-purple-900" />
                  )}
                  <button onClick={() => bannerRef.current?.click()} className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 transition-opacity">
                    <div className="flex items-center gap-2 text-white text-sm font-medium">
                      <Camera className="h-4 w-4" />
                      {uploadingBanner ? 'Uploading...' : 'Change Banner'}
                    </div>
                  </button>
                  <input ref={bannerRef} type="file" accept="image/*" className="hidden" onChange={uploadBanner} />
                </div>
                <div className="px-6 pb-6">
                  <div className="relative -mt-8 mb-4 w-fit">
                    <div className="w-16 h-16 rounded-full overflow-hidden border-4 border-card bg-primary flex items-center justify-center text-white font-bold text-xl">
                      {profile?.avatar_url ? <img src={profile.avatar_url} className="w-full h-full object-cover" /> : profile?.display_name?.[0]?.toUpperCase() || '?'}
                    </div>
                    <button onClick={() => avatarRef.current?.click()} className="absolute inset-0 rounded-full flex items-center justify-center bg-black/50 opacity-0 hover:opacity-100 transition-opacity">
                      <Camera className="h-4 w-4 text-white" />
                    </button>
                    <input ref={avatarRef} type="file" accept="image/*" className="hidden" onChange={uploadAvatar} />
                  </div>
                  <p className="text-xs text-muted-foreground mb-4">Hover over your photo or banner to change them</p>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-muted-foreground block mb-1">Display Name</label>
                      <Input value={displayName} onChange={e => setDisplayName(e.target.value)} placeholder="Your name" className="bg-secondary" />
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground block mb-1">Username</label>
                      <Input value={username} onChange={e => setUsername(e.target.value)} placeholder="@username" className="bg-secondary" />
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground block mb-1">Bio</label>
                      <textarea value={bio} onChange={e => setBio(e.target.value)} placeholder="Tell fans about yourself..." rows={3}
                        className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-foreground text-sm outline-none focus:border-primary resize-none" />
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-secondary rounded-lg cursor-pointer"
                      onClick={async () => {
                        const newVal = !profile?.is_creator
                        await supabase.from('profiles').update({ is_creator: newVal }).eq('id', user.id)
                        setProfile({ ...profile, is_creator: newVal })
                      }}>
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${profile?.is_creator ? 'bg-primary border-primary' : 'border-gray-600'}`}>
                        {profile?.is_creator && <span className="text-white text-xs">✓</span>}
                      </div>
                      <div>
                        <p className="text-foreground text-sm font-medium">{profile?.is_creator ? 'You are a creator ✓' : 'Become a creator'}</p>
                        <p className="text-muted-foreground text-xs">Creators can post content and earn money</p>
                      </div>
                    </div>
                    <Button onClick={saveProfile} disabled={saving} className={`${saved ? 'bg-green-500' : 'bg-primary'} hover:opacity-90 text-white`}>
                      {saving ? 'Saving...' : saved ? 'Saved! ✓' : 'Save Changes'}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}