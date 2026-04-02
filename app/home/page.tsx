'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import {
  Home, Search, Bell, MessageCircle, User, Heart, MessageSquare,
  Share2, Bookmark, MoreHorizontal, Lock, Play, DollarSign, Crown,
  TrendingUp, Users, Plus, Video, Gift, Settings, Menu, Flame,
  Sparkles, Zap
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export default function HomePage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [posts, setPosts] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState('foryou')
  const [likedPosts, setLikedPosts] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/'); return }
      setUser(user)
      const { data: profileData } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      setProfile(profileData)
      const { data: postsData } = await supabase
        .from('content')
        .select('*, creator:profiles!creator_id(*)')
        .order('created_at', { ascending: false })
        .limit(20)
      setPosts(postsData || [])
      setLoading(false)
    }
    load()
  }, [])

  async function handleLike(postId: string) {
    if (!user) return
    if (likedPosts.includes(postId)) {
      setLikedPosts(prev => prev.filter(id => id !== postId))
      await supabase.from('content_likes').delete().eq('user_id', user.id).eq('content_id', postId)
    } else {
      setLikedPosts(prev => [...prev, postId])
      await supabase.from('content_likes').insert({ user_id: user.id, content_id: postId })
    }
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

  return (
    <div className="min-h-screen bg-background">
      <header className="lg:hidden sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="flex items-center justify-between p-4">
          <Button variant="ghost" size="icon"><Menu className="w-6 h-6" /></Button>
          <Link href="/home" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <Lock className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg text-foreground">fanssecrets</span>
          </Link>
          <Link href="/messages">
            <Button variant="ghost" size="icon" className="relative">
              <MessageCircle className="w-6 h-6" />
            </Button>
          </Link>
        </div>
      </header>

      <div className="flex">
        <aside className="hidden lg:flex flex-col w-64 h-screen sticky top-0 border-r border-border p-4">
          <Link href="/home" className="flex items-center gap-3 p-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
              <Lock className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-xl text-foreground">fanssecrets</span>
          </Link>
          <nav className="flex-1 space-y-1">
            {[
              { icon: Home, label: 'Home', href: '/home', active: true },
              { icon: Search, label: 'Discover', href: '/discover' },
              { icon: MessageCircle, label: 'Messages', href: '/messages' },
              { icon: User, label: 'My Profile', href: `/profile/${profile?.username}` },
              { icon: Settings, label: 'Dashboard', href: '/dashboard' },
            ].map((item) => (
              <Link key={item.label} href={item.href}
                className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-colors ${
                  item.active ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                }`}
              >
                <item.icon className="w-6 h-6" />
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}
          </nav>
          <Button className="w-full bg-primary text-primary-foreground mb-4" onClick={() => router.push('/dashboard/upload')}>
            <Plus className="w-5 h-5 mr-2" />
            New Post
          </Button>
          <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-secondary cursor-pointer" onClick={() => router.push(`/profile/${profile?.username}`)}>
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">
              {profile?.display_name?.[0]?.toUpperCase() || profile?.username?.[0]?.toUpperCase() || '?'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-foreground truncate">{profile?.display_name || profile?.username}</p>
              <p className="text-sm text-muted-foreground">@{profile?.username}</p>
            </div>
            <button onClick={e => { e.stopPropagation(); signOut() }} className="text-muted-foreground hover:text-foreground">
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>
        </aside>

        <main className="flex-1 max-w-2xl mx-auto border-x border-border min-h-screen">
          <div className="sticky top-0 lg:top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
            <div className="flex">
              {[
                { id: 'following', label: 'Following', icon: Users },
                { id: 'foryou', label: 'For You', icon: Sparkles },
                { id: 'trending', label: 'Trending', icon: Flame },
              ].map((tab) => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-2 py-4 font-medium transition-colors relative ${
                    activeTab === tab.id ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                  {activeTab === tab.id && (
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-1 bg-primary rounded-full" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {posts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center px-8">
              <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mb-4">
                <Sparkles className="w-10 h-10 text-muted-foreground" />
              </div>
              <h2 className="text-xl font-semibold text-foreground mb-2">No posts yet</h2>
              <p className="text-muted-foreground mb-6">Follow creators to see their content here, or be the first to post!</p>
              <div className="flex gap-3">
                <Button className="bg-primary hover:bg-primary/90" onClick={() => router.push('/discover')}>
                  Discover Creators
                </Button>
                <Button variant="outline" onClick={() => router.push('/dashboard/upload')}>
                  Create Post
                </Button>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {posts.map((post) => (
                <article key={post.id} className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <Link href={`/profile/${post.creator?.username}`}>
                      <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white font-bold overflow-hidden">
                        {post.creator?.avatar_url ? (
                          <img src={post.creator.avatar_url} className="w-full h-full object-cover" />
                        ) : (
                          post.creator?.display_name?.[0]?.toUpperCase() || post.creator?.username?.[0]?.toUpperCase() || '?'
                        )}
                      </div>
                    </Link>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1">
                        <Link href={`/profile/${post.creator?.username}`} className="font-semibold text-foreground hover:underline">
                          {post.creator?.display_name || post.creator?.username}
                        </Link>
                        {post.creator?.is_verified && (
                          <span className="w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                            <Crown className="w-2.5 h-2.5 text-white" />
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">@{post.creator?.username} · {new Date(post.created_at).toLocaleDateString()}</p>
                    </div>
                    <Button variant="ghost" size="icon" className="text-muted-foreground">
                      <MoreHorizontal className="w-5 h-5" />
                    </Button>
                  </div>

                  {post.body && <p className="text-foreground mb-3 whitespace-pre-wrap">{post.body}</p>}

                  {post.media_urls?.[0] && (
                    <div className="relative rounded-xl overflow-hidden mb-3">
                      {post.is_ppv ? (
                        <div className="relative">
                          <img src={post.media_urls[0]} alt="" className="w-full object-cover blur-xl" />
                          <div className="absolute inset-0 bg-background/60 flex flex-col items-center justify-center">
                            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-3">
                              <Lock className="w-8 h-8 text-primary" />
                            </div>
                            <p className="text-foreground font-semibold mb-2">Premium Content</p>
                            <Button className="bg-primary text-primary-foreground">
                              <DollarSign className="w-4 h-4 mr-1" />
                              Unlock for ${(post.ppv_price/100).toFixed(2)}
                            </Button>
                          </div>
                        </div>
                      ) : post.content_type === 'video' ? (
                        <video src={post.media_urls[0]} controls className="w-full rounded-xl" />
                      ) : (
                        <img src={post.media_urls[0]} alt={post.title} className="w-full object-cover rounded-xl" />
                      )}
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost" size="sm"
                        className={`gap-2 ${likedPosts.includes(post.id) ? 'text-red-500' : 'text-muted-foreground'}`}
                        onClick={() => handleLike(post.id)}
                      >
                        <Heart className={`w-5 h-5 ${likedPosts.includes(post.id) ? 'fill-current' : ''}`} />
                        <span>{(post.likes || 0) + (likedPosts.includes(post.id) ? 1 : 0)}</span>
                      </Button>
                      <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground">
                        <MessageSquare className="w-5 h-5" />
                        <span>{post.comments || 0}</span>
                      </Button>
                      <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground">
                        <Share2 className="w-5 h-5" />
                      </Button>
                    </div>
                    <Button variant="ghost" size="sm" className="gap-2 text-primary">
                      <Gift className="w-5 h-5" />
                      <span>Tip</span>
                    </Button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </main>

        <aside className="hidden xl:block w-80 h-screen sticky top-0 p-4 space-y-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input placeholder="Search creators..." className="pl-10 bg-secondary border-0" onChange={e => { if (e.target.value) router.push(`/discover?q=${e.target.value}`) }} />
          </div>
          <div className="bg-card border border-border rounded-2xl p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-foreground">Quick Actions</h3>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" size="sm" className="justify-start" onClick={() => router.push('/dashboard/upload')}>
                <Plus className="w-4 h-4 mr-2" />Upload
              </Button>
              <Button variant="outline" size="sm" className="justify-start" onClick={() => router.push('/discover')}>
                <Search className="w-4 h-4 mr-2" />Discover
              </Button>
              <Button variant="outline" size="sm" className="justify-start" onClick={() => router.push('/messages')}>
                <MessageCircle className="w-4 h-4 mr-2" />Messages
              </Button>
              <Button variant="outline" size="sm" className="justify-start" onClick={() => router.push('/dashboard')}>
                <Settings className="w-4 h-4 mr-2" />Dashboard
              </Button>
            </div>
          </div>
          <div className="text-xs text-muted-foreground space-y-2">
            <div className="flex flex-wrap gap-x-2 gap-y-1">
              <Link href="#" className="hover:underline">Terms</Link>
              <Link href="#" className="hover:underline">Privacy</Link>
              <Link href="#" className="hover:underline">DMCA</Link>
              <Link href="#" className="hover:underline">Help</Link>
            </div>
            <p>© 2026 FansSecrets</p>
          </div>
        </aside>
      </div>

      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-background border-t border-border">
        <div className="flex items-center justify-around py-2">
          {[
            { icon: Home, label: 'Home', href: '/home' },
            { icon: Search, label: 'Discover', href: '/discover' },
            { icon: Plus, label: 'Create', href: '/dashboard/upload', special: true },
            { icon: Bell, label: 'Alerts', href: '#' },
            { icon: User, label: 'Profile', href: `/profile/${profile?.username}` },
          ].map((item) => (
            <Link key={item.label} href={item.href} className="flex flex-col items-center gap-1 p-2">
              {item.special ? (
                <div className="w-12 h-12 -mt-6 rounded-full bg-primary flex items-center justify-center shadow-lg">
                  <item.icon className="w-6 h-6 text-primary-foreground" />
                </div>
              ) : (
                <item.icon className="w-6 h-6 text-muted-foreground" />
              )}
              {!item.special && <span className="text-xs text-muted-foreground">{item.label}</span>}
            </Link>
          ))}
        </div>
      </nav>
    </div>
  )
}