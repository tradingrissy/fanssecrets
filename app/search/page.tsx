'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, X, TrendingUp, Users, MessageCircle } from 'lucide-react'
import Link from 'next/link'

export default function SearchPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('q') || '')
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  useEffect(() => {
    if (query) handleSearch()
  }, [])

  async function handleSearch() {
    if (!query.trim()) return
    setLoading(true)
    setSearched(true)
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .or(`username.ilike.%${query}%,display_name.ilike.%${query}%,bio.ilike.%${query}%`)
      .order('created_at', { ascending: false })
    setResults(data || [])
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Link href="/home">
              <Button variant="ghost" size="icon">
                <X className="w-5 h-5" />
              </Button>
            </Link>
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSearch()}
                placeholder="Search creators..."
                className="pl-10 bg-secondary border-0 rounded-full"
                autoFocus
              />
            </div>
            <Button className="bg-primary hover:bg-primary/90" onClick={handleSearch}>
              Search
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        {!searched && (
          <div className="text-center py-16">
            <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4">
              <Search className="w-10 h-10 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold text-foreground mb-2">Search FansSecrets</h2>
            <p className="text-muted-foreground">Find creators by name, username or category</p>
          </div>
        )}

        {loading && (
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {searched && !loading && results.length === 0 && (
          <div className="text-center py-16">
            <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4">
              <Users className="w-10 h-10 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold text-foreground mb-2">No results for "{query}"</h2>
            <p className="text-muted-foreground">Try searching with a different name or username</p>
          </div>
        )}

        {results.length > 0 && (
          <div>
            <p className="text-sm text-muted-foreground mb-4">{results.length} result{results.length !== 1 ? 's' : ''} for "{query}"</p>
            <div className="space-y-3">
              {results.map(creator => (
                <div
                  key={creator.id}
                  onClick={() => router.push(`/profile/${creator.username}`)}
                  className="flex items-center gap-4 p-4 bg-card border border-border rounded-2xl hover:border-primary/50 transition-all cursor-pointer"
                >
                  <div className="w-14 h-14 rounded-full overflow-hidden bg-primary flex items-center justify-center text-white font-bold text-xl shrink-0">
                    {creator.avatar_url ? (
                      <img src={creator.avatar_url} className="w-full h-full object-cover" />
                    ) : (
                      creator.display_name?.[0]?.toUpperCase() || creator.username?.[0]?.toUpperCase() || '?'
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-foreground">{creator.display_name || creator.username}</p>
                      {creator.is_verified && <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">✓ Verified</span>}
                      {creator.is_creator && <span className="text-xs bg-secondary text-muted-foreground px-2 py-0.5 rounded-full">Creator</span>}
                    </div>
                    <p className="text-sm text-muted-foreground">@{creator.username}</p>
                    {creator.bio && <p className="text-sm text-muted-foreground truncate mt-0.5">{creator.bio}</p>}
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <Button className="bg-primary hover:bg-primary/90 text-sm" onClick={e => { e.stopPropagation(); router.push(`/profile/${creator.username}`) }}>
                      View
                    </Button>
                    <Button variant="outline" size="icon" onClick={e => { e.stopPropagation(); router.push('/messages') }}>
                      <MessageCircle className="w-4 h-4" />
                    </Button>
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