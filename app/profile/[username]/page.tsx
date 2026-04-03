'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter, useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  Verified, Heart, MessageCircle, Share2, Lock,
  Image, Video, Grid3X3, List, Play, Bell, Gift, Check
} from 'lucide-react'
import Link from 'next/link'

export default function ProfilePage() {
  const router = useRouter()
  const params = useParams()
  const username = params.username as string
  const [creator, setCreator] = useState<any>(null)
  const [tiers, setTiers] = useState<any[]>([])
  const [posts, setPosts] = useState<any[]>([])
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [isFollowing, setIsFollowing] = useState(false)
  const [followerCount, setFollowerCount] = useState(0)
  const [showTipModal, setShowTipModal] = useState(false)
  const [tipAmount, setTipAmount] = useState('')
  const [tipping, setTipping] = useState(false)

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      setCurrentUser(user)

      const { data: creatorData } = await supabase
        .from('profiles')
        .select('*')
        .eq('username', username)
        .single()

      if (!creatorData) { router.push('/discover'); return }
      setCreator(creatorData)

      const { data: tiersData } = await supabase
        .from('subscription_tiers')
        .select('*')
        .eq('creator_id', creatorData.id)
        .order('price')
      setTiers(tiersData || [])

      const { data: postsData } = await supabase
        .from('content')
        .select('*')
        .eq('creator_id', creatorData.id)
        .order('created_at', { ascending: false })
      setPosts(postsData || [])

      const { count: fCount } = await supabase
        .from('follows')
        .select('*', { count: 'exact', head: true })
        .eq('following_id', creatorData.id)
      setFollowerCount(fCount || 0)

      if (user) {
        const { data: followData } = await supabase
          .from('follows')
          .select('*')
          .eq('follower_id', user.id)
          .eq('following_id', creatorData.id)
          .single()
        setIsFollowing(!!followData)
      }

      setLoading(false)
    }
    load()
  }, [username])

  async function toggleFollow() {
    if (!currentUser) { router.push('/'); return }
    if (isFollowing) {
      await supabase.from('follows').delete()
        .eq('follower_id', currentUser.id)
        .eq('following_id', creator.id)
      setIsFollowing(false)
      setFollowerCount(prev => prev - 1)
    } else {
      await supabase.from('follows').insert({
        follower_id: currentUser.id,
        following_id: creator.id
      })
      setIsFollowing(true)
      setFollowerCount(prev => prev + 1)
    }
  }

  async function subscribe(tierId: string) {
    if (!currentUser) { router.push('/'); return }
    const res = await fetch('/api/stripe/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tier_id: tierId, creator_id: creator.id, fan_id: currentUser.id })
    })
    const { url } = await res.json()
    if (url) window.location.href = url
  }

  async function sendTip() {
    if (!currentUser || !tipAmount) return
    setTipping(true)
    const res = await fetch('/api/tips', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fan_id: currentUser.id,
        creator_id: creator.id,
        amount: Math.round(parseFloat(tipAmount) * 100)
      })
    })
    const { url } = await res.json()
    if (url) window.location.href = url
    setTipping(false)
  }

  if (loading) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  )

  if (!creator) return null

  const isOwnProfile = currentUser?.id === creator.id

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/discover" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">F</span>
              </div>
              <span className="text-xl font-bold text-foreground hidden sm:block">FansSecrets</span>
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/discover"><Button variant="ghost">Discover</Button></Link>
              {isOwnProfile && <Link href="/dashboard"><Button>Dashboard</Button></Link>}
            </div>
          </div>
        </div>
      </header>

      <div className="relative h-64 md:h-80">
        {creator.banner_url ? (
          <img src={creator.banner_url} alt="Cover" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/30 to-purple-900" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex flex-col items-center md:items-start">
            <div className="relative">
              {creator.avatar_url ? (
                <img src={creator.avatar_url} alt={creator.display_name} className="w-36 h-36 rounded-full border-4 border-background object-cover" />
              ) : (
                <div className="w-36 h-36 rounded-full border-4 border-background bg-primary flex items-center justify-center text-4xl font-bold text-white">
                  {creator.display_name?.[0]?.toUpperCase() || creator.username?.[0]?.toUpperCase()}
                </div>
              )}
              {creator.is_verified && (
                <div className="absolute bottom-2 right-2 w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                  <Verified className="h-5 w-5 text-primary-foreground" />
                </div>
              )}
            </div>
          </div>

          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-2">
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">{creator.display_name || creator.username}</h1>
              <span className="text-muted-foreground">@{creator.username}</span>
            </div>

            {creator.bio && <p className="text-muted-foreground max-w-2xl mb-4">{creator.bio}</p>}

            <div className="flex justify-center md:justify-start gap-6 mb-6">
              <div className="text-center">
                <p className="text-xl font-bold text-foreground">{posts.length}</p>
                <p className="text-sm text-muted-foreground">Posts</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold text-foreground">{followerCount}</p>
                <p className="text-sm text-muted-foreground">Followers</p>
              </div>
            </div>

            <div className="flex flex-wrap justify-center md:justify-start gap-3">
              {!isOwnProfile && (
                <>
                  {tiers.length > 0 && (
                    <Button className="bg-primary hover:bg-primary/90" onClick={() => subscribe(tiers[0].id)}>
                      Subscribe from ${(tiers[0].price/100).toFixed(2)}/mo
                    </Button>
                  )}
                  <Button variant={isFollowing ? 'secondary' : 'outline'} onClick={toggleFollow}>
                    {isFollowing ? <><Check className="h-4 w-4 mr-2" />Following</> : <><Bell className="h-4 w-4 mr-2" />Follow</>}
                  </Button>
                  <Button variant="outline" onClick={() => router.push('/messages')}>
                    <MessageCircle className="h-4 w-4 mr-2" />Message
                  </Button>
                  <Button variant="outline" onClick={() => setShowTipModal(true)}>
                    <Gift className="h-4 w-4 mr-2" />Tip
                  </Button>
                </>
              )}
              {isOwnProfile && (
                <Link href="/dashboard"><Button className="bg-primary hover:bg-primary/90">Edit Profile</Button></Link>
              )}
              <Button variant="outline" size="icon"><Share2 className="h-4 w-4" /></Button>
            </div>
          </div>
        </div>

        {tiers.length > 0 && !isOwnProfile && (
          <div className="mt-12 mb-8">
            <h2 className="text-xl font-bold text-foreground mb-6">Subscription Tiers</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {tiers.map((tier, i) => (
                <div key={tier.id}
                  className={`relative rounded-2xl p-6 border transition-all cursor-pointer ${i === 1 ? 'border-primary/50 bg-card' : 'border-border bg-card hover:border-primary/30'}`}
                >
                  {i === 1 && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-semibold">
                      Most Popular
                    </span>
                  )}
                  <h3 className="font-bold text-foreground mb-2">{tier.name}</h3>
                  <p className="text-2xl font-bold text-primary mb-4">
                    ${(tier.price/100).toFixed(2)}<span className="text-sm text-muted-foreground font-normal">/mo</span>
                  </p>
                  {tier.description && <p className="text-sm text-muted-foreground mb-4">{tier.description}</p>}
                  <Button className="w-full bg-primary hover:bg-primary/90" onClick={() => subscribe(tier.id)}>
                    Subscribe
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="border-b border-border mb-6 mt-8">
          <div className="flex items-center justify-between">
            <div className="flex gap-1">
              {[
                { id: 'all', label: 'All', icon: Grid3X3 },
                { id: 'photos', label: 'Photos', icon: Image },
                { id: 'videos', label: 'Videos', icon: Video },
                { id: 'locked', label: 'Locked', icon: Lock },
              ].map((tab) => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${activeTab === tab.id ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
                >
                  <tab.icon className="h-4 w-4" />
                  {tab.label}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <Button variant={viewMode === 'grid' ? 'secondary' : 'ghost'} size="icon" onClick={() => setViewMode('grid')}>
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button variant={viewMode === 'list' ? 'secondary' : 'ghost'} size="icon" onClick={() => setViewMode('list')}>
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4">
              <Image className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">No posts yet</h3>
            <p className="text-muted-foreground">
              {isOwnProfile ? 'Start sharing your content' : 'This creator has not posted yet'}
            </p>
            {isOwnProfile && (
              <Link href="/dashboard">
                <Button className="mt-4 bg-primary hover:bg-primary/90">Upload Content</Button>
              </Link>
            )}
          </div>
        ) : (
          <div className={`grid gap-4 pb-12 ${viewMode === 'grid' ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4' : 'grid-cols-1 max-w-2xl'}`}>
            {posts
              .filter(post => {
                if (activeTab === 'photos') return post.content_type === 'image'
                if (activeTab === 'videos') return post.content_type === 'video'
                if (activeTab === 'locked') return post.is_ppv
                return true
              })
              .map((post) => (
                <div key={post.id} className="group relative rounded-xl overflow-hidden bg-card border border-border aspect-square">
                  {post.media_urls?.[0] ? (
                    <img src={post.media_urls[0]} alt={post.title}
                      className={`w-full h-full object-cover transition-transform group-hover:scale-105 ${post.is_ppv ? 'blur-lg' : ''}`} />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-secondary">
                      <Image className="h-10 w-10 text-muted-foreground" />
                    </div>
                  )}
                  {post.content_type === 'video' && (
                    <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/50 flex items-center justify-center">
                      <Play className="h-4 w-4 text-white fill-white" />
                    </div>
                  )}
                  {post.is_ppv && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50">
                      <Lock className="h-8 w-8 text-white mb-2" />
                      <span className="text-white font-medium text-sm">${(post.ppv_price/100).toFixed(2)}</span>
                      <Button size="sm" className="mt-2 bg-primary hover:bg-primary/90">Unlock</Button>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
                      <span className="flex items-center gap-1 text-sm"><Heart className="h-4 w-4" />{post.likes || 0}</span>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>

      {showTipModal && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowTipModal(false)}>
          <div className="w-full max-w-sm bg-card border border-border rounded-2xl p-6" onClick={e => e.stopPropagation()}>
            <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Gift className="w-5 h-5 text-yellow-500" />Send a Tip to {creator.display_name || creator.username}
            </h2>
            <div className="grid grid-cols-3 gap-2 mb-4">
              {[5, 10, 20, 50, 100, 200].map(amount => (
                <button key={amount}
                  onClick={() => setTipAmount(String(amount))}
                  className={`py-2 rounded-xl border text-sm font-semibold transition-colors ${tipAmount === String(amount) ? 'bg-primary text-white border-primary' : 'border-border text-foreground hover:border-primary/50'}`}>
                  ${amount}
                </button>
              ))}
            </div>
            <div className="relative mb-4">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
              <input type="number" placeholder="Custom amount" value={tipAmount} onChange={e => setTipAmount(e.target.value)}
                className="w-full bg-secondary border border-border rounded-xl pl-8 pr-4 py-3 text-foreground text-sm outline-none focus:border-primary" />
            </div>
            <Button className="w-full bg-primary hover:bg-primary/90" disabled={!tipAmount || tipping} onClick={sendTip}>
              {tipping ? 'Processing...' : `Send $${tipAmount || '0'} Tip`}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}