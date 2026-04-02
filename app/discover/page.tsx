'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, TrendingUp, Flame, Star, Clock, SlidersHorizontal, Heart, Lock, MessageCircle, X } from 'lucide-react'
import Link from 'next/link'

const categories = ['All', 'Fitness', 'Music', 'Art', 'Gaming', 'Cooking', 'Fashion', 'Photography', 'Dance', 'Lifestyle', 'Education']

export default function DiscoverPage() {
  const router = useRouter()
  const [creators, setCreators] = useState<any[]>([])
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedSort, setSelectedSort] = useState('trending')
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadCreators() {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('is_creator', true)
        .order('created_at', { ascending: false })
      setCreators(data || [])
      setLoading(false)
    }
    loadCreators()
  }, [])

  const filtered = creators.filter(c =>
    c.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.display_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.bio?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">F</span>
              </div>
              <span className="text-xl font-bold text-foreground">FansSecrets</span>
            </Link>
            <div className="flex-1 max-w-xl mx-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Search creators..."
                  className="pl-10 bg-secondary border-border"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/home"><Button variant="ghost">Home</Button></Link>
              <Link href="/dashboard"><Button>Dashboard</Button></Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Discover Creators</h1>
          <p className="text-muted-foreground mt-2">Explore creators across all categories</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          <div className="flex-1 overflow-x-auto pb-2">
            <div className="flex gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                    selectedCategory === category ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4">
              <Search className="w-10 h-10 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold text-foreground mb-2">No creators yet</h2>
            <p className="text-muted-foreground mb-6">Be the first creator on FansSecrets</p>
            <Link href="/"><Button className="bg-primary hover:bg-primary/90">Become a Creator</Button></Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((creator) => (
              <div
                key={creator.id}
                onClick={() => router.push(`/profile/${creator.username}`)}
                className="group rounded-2xl bg-card border border-border overflow-hidden hover:border-primary/50 transition-all duration-300 cursor-pointer"
              >
                <div className="relative h-32">
                  {creator.banner_url ? (
                    <img src={creator.banner_url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary/20 to-purple-900/50" />
                  )}
                </div>
                <div className="relative px-4 -mt-10">
                  {creator.avatar_url ? (
                    <img src={creator.avatar_url} alt={creator.display_name} className="w-20 h-20 rounded-full border-4 border-card object-cover" />
                  ) : (
                    <div className="w-20 h-20 rounded-full border-4 border-card bg-primary flex items-center justify-center text-2xl font-bold text-white">
                      {creator.display_name?.[0]?.toUpperCase() || creator.username?.[0]?.toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="p-4 pt-2">
                  <h3 className="font-semibold text-foreground">{creator.display_name || creator.username}</h3>
                  <p className="text-sm text-muted-foreground">@{creator.username}</p>
                  {creator.bio && <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{creator.bio}</p>}
                  <div className="flex gap-2 mt-4">
                    <Button className="flex-1 bg-primary hover:bg-primary/90" onClick={e => { e.stopPropagation(); router.push(`/profile/${creator.username}`) }}>
                      Subscribe
                    </Button>
                    <Button variant="outline" size="icon" onClick={e => { e.stopPropagation(); router.push('/messages') }}>
                      <MessageCircle className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}