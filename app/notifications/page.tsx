'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Bell, Heart, Users, DollarSign, MessageCircle } from 'lucide-react'
import Link from 'next/link'

export default function NotificationsPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [notifications, setNotifications] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/'); return }
      setUser(user)
      const { data } = await supabase
        .from('notifications')
        .select('*, related_user:profiles!related_user_id(*)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50)
      setNotifications(data || [])
      await supabase.from('notifications').update({ is_read: true }).eq('user_id', user.id).eq('is_read', false)
      setLoading(false)
    }
    load()
  }, [])

  function getIcon(type: string) {
    switch(type) {
      case 'new_subscriber': return <Users className="w-5 h-5 text-blue-500" />
      case 'new_tip': return <DollarSign className="w-5 h-5 text-yellow-500" />
      case 'new_like': return <Heart className="w-5 h-5 text-red-500" />
      case 'new_message': return <MessageCircle className="w-5 h-5 text-green-500" />
      default: return <Bell className="w-5 h-5 text-primary" />
    }
  }

  function getColor(type: string) {
    switch(type) {
      case 'new_subscriber': return 'bg-blue-500/10'
      case 'new_tip': return 'bg-yellow-500/10'
      case 'new_like': return 'bg-red-500/10'
      case 'new_message': return 'bg-green-500/10'
      default: return 'bg-primary/10'
    }
  }

  if (loading) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-3">
          <Link href="/home">
            <Button variant="ghost" size="icon"><ArrowLeft className="w-5 h-5" /></Button>
          </Link>
          <h1 className="text-xl font-bold text-foreground">Notifications</h1>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6">
        {notifications.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4">
              <Bell className="w-10 h-10 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold text-foreground mb-2">No notifications yet</h2>
            <p className="text-muted-foreground">When fans subscribe, tip, or like your content you'll see it here</p>
          </div>
        ) : (
          <div className="space-y-2">
            {notifications.map(notif => (
              <div key={notif.id} className={`flex items-center gap-4 p-4 rounded-2xl border transition-all ${notif.is_read ? 'bg-card border-border' : 'bg-primary/5 border-primary/20'}`}>
                <div className={`w-12 h-12 rounded-full ${getColor(notif.type)} flex items-center justify-center shrink-0`}>
                  {getIcon(notif.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground">{notif.title}</p>
                  <p className="text-sm text-muted-foreground">{notif.body}</p>
                  <p className="text-xs text-muted-foreground mt-1">{new Date(notif.created_at).toLocaleString()}</p>
                </div>
                {!notif.is_read && <div className="w-2 h-2 rounded-full bg-primary shrink-0" />}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}