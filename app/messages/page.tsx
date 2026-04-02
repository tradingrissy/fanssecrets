'use client'
import { useEffect, useState, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Search, Send, ArrowLeft, Check, CheckCheck, Lock,
  DollarSign, Gift, Smile, MoreVertical, Phone, Video as VideoIcon,
  Image as ImageIcon, Mic, Plus, Settings, Users, X
} from 'lucide-react'
import Link from 'next/link'

export default function MessagesPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [conversations, setConversations] = useState<any[]>([])
  const [activeChat, setActiveChat] = useState<any>(null)
  const [messages, setMessages] = useState<any[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [showMobileChat, setShowMobileChat] = useState(false)
  const [showTipModal, setShowTipModal] = useState(false)
  const [tipAmount, setTipAmount] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/'); return }
      setUser(user)
      const { data } = await supabase
        .from('messages')
        .select('*, sender:profiles!sender_id(*), receiver:profiles!receiver_id(*)')
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .order('created_at', { ascending: false })
      const seen = new Set()
      const convos: any[] = []
      data?.forEach(msg => {
        const other = msg.sender_id === user.id ? msg.receiver : msg.sender
        if (other && !seen.has(other.id)) {
          seen.add(other.id)
          convos.push({ other, lastMsg: msg })
        }
      })
      setConversations(convos)
      setLoading(false)
    }
    load()
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function loadMessages(otherUser: any) {
    setActiveChat(otherUser)
    setShowMobileChat(true)
    const { data } = await supabase
      .from('messages')
      .select('*')
      .or(`and(sender_id.eq.${user.id},receiver_id.eq.${otherUser.id}),and(sender_id.eq.${otherUser.id},receiver_id.eq.${user.id})`)
      .order('created_at', { ascending: true })
    setMessages(data || [])
    await supabase.from('messages').update({ is_read: true }).eq('receiver_id', user.id).eq('sender_id', otherUser.id)
  }

  async function sendMessage() {
    if (!newMessage.trim() || !activeChat || !user) return
    const msg = { sender_id: user.id, receiver_id: activeChat.id, body: newMessage, is_read: false }
    setMessages(prev => [...prev, { ...msg, id: Date.now().toString(), created_at: new Date().toISOString() }])
    setNewMessage('')
    await supabase.from('messages').insert(msg)
  }

  if (loading) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="h-screen bg-background flex flex-col">
      <header className="border-b border-border p-4 shrink-0 bg-card">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/home">
              <Button variant="ghost" size="icon"><ArrowLeft className="w-5 h-5" /></Button>
            </Link>
            <span className="font-bold text-xl text-foreground">Messages</span>
          </div>
          <Button variant="outline" size="sm">
            <Users className="w-4 h-4 mr-2" />
            New Message
          </Button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden max-w-7xl mx-auto w-full">
        <div className={`w-full md:w-96 border-r border-border flex flex-col bg-card ${showMobileChat ? 'hidden md:flex' : 'flex'}`}>
          <div className="p-4 border-b border-border">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input placeholder="Search messages..." className="pl-10 bg-secondary border-0" />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {conversations.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center px-6">
                <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-4">
                  <Send className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="font-semibold text-foreground mb-1">No messages yet</h3>
                <p className="text-sm text-muted-foreground">Messages from creators and fans will appear here</p>
              </div>
            ) : (
              conversations.map(({ other, lastMsg }) => (
                <div
                  key={other?.id}
                  onClick={() => loadMessages(other)}
                  className={`flex items-center gap-3 p-4 cursor-pointer transition-colors border-b border-border/50 ${
                    activeChat?.id === other?.id ? 'bg-primary/10' : 'hover:bg-secondary/50'
                  }`}
                >
                  <div className="relative shrink-0">
                    <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white font-bold overflow-hidden">
                      {other?.avatar_url ? (
                        <img src={other.avatar_url} className="w-full h-full object-cover" />
                      ) : (
                        other?.display_name?.[0]?.toUpperCase() || other?.username?.[0]?.toUpperCase() || '?'
                      )}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-foreground truncate">{other?.display_name || other?.username}</p>
                    <p className="text-sm text-muted-foreground truncate">{lastMsg?.body}</p>
                  </div>
                  <span className="text-xs text-muted-foreground shrink-0">
                    {new Date(lastMsg?.created_at).toLocaleDateString()}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className={`flex-1 flex flex-col bg-background ${!showMobileChat ? 'hidden md:flex' : 'flex'}`}>
          {activeChat ? (
            <>
              <div className="flex items-center gap-3 p-4 border-b border-border bg-card shrink-0">
                <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setShowMobileChat(false)}>
                  <ArrowLeft className="w-5 h-5" />
                </Button>
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold overflow-hidden">
                  {activeChat?.avatar_url ? (
                    <img src={activeChat.avatar_url} className="w-full h-full object-cover" />
                  ) : (
                    activeChat?.display_name?.[0]?.toUpperCase() || activeChat?.username?.[0]?.toUpperCase() || '?'
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-foreground">{activeChat?.display_name || activeChat?.username}</p>
                  <p className="text-sm text-muted-foreground">@{activeChat?.username}</p>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon"><Phone className="w-5 h-5" /></Button>
                  <Button variant="ghost" size="icon"><VideoIcon className="w-5 h-5" /></Button>
                  <Button variant="ghost" size="icon"><MoreVertical className="w-5 h-5" /></Button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0">
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[70%] rounded-2xl px-4 py-2.5 ${
                      msg.sender_id === user?.id ? 'bg-primary text-primary-foreground rounded-br-sm' : 'bg-secondary text-foreground rounded-bl-sm'
                    }`}>
                      <p className="whitespace-pre-wrap text-sm">{msg.body}</p>
                      <p className={`text-xs mt-1 ${msg.sender_id === user?.id ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                        {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              <div className="p-4 border-t border-border bg-card shrink-0">
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" className="text-muted-foreground">
                    <ImageIcon className="w-5 h-5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-muted-foreground" onClick={() => setShowTipModal(true)}>
                    <Gift className="w-5 h-5" />
                  </Button>
                  <Input
                    value={newMessage}
                    onChange={e => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 bg-secondary border-0 rounded-full"
                    onKeyDown={e => e.key === 'Enter' && sendMessage()}
                  />
                  <Button size="icon" className="bg-primary text-primary-foreground" onClick={sendMessage}>
                    <Send className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
              <div className="w-24 h-24 rounded-full bg-secondary flex items-center justify-center mb-6">
                <Send className="w-12 h-12 text-muted-foreground" />
              </div>
              <h2 className="text-2xl font-semibold text-foreground mb-2">Your Messages</h2>
              <p className="text-muted-foreground max-w-sm">Select a conversation to start chatting</p>
            </div>
          )}
        </div>
      </div>

      {showTipModal && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowTipModal(false)}>
          <div className="w-full max-w-sm bg-card border border-border rounded-2xl p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold flex items-center gap-2"><Gift className="w-5 h-5 text-yellow-500" />Send a Tip</h2>
              <Button variant="ghost" size="icon" onClick={() => setShowTipModal(false)}><X className="w-5 h-5" /></Button>
            </div>
            <div className="grid grid-cols-3 gap-2 mb-4">
              {[5, 10, 20, 50, 100, 200].map(amount => (
                <Button key={amount} variant={tipAmount === String(amount) ? 'default' : 'outline'} onClick={() => setTipAmount(String(amount))}>
                  ${amount}
                </Button>
              ))}
            </div>
            <div className="relative mb-4">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input type="number" placeholder="Custom amount" value={tipAmount} onChange={e => setTipAmount(e.target.value)} className="pl-9" />
            </div>
            <Button className="w-full bg-primary" disabled={!tipAmount} onClick={() => setShowTipModal(false)}>
              Send ${tipAmount || '0'} Tip
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}