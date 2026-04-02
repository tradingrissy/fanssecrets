'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { Lock, Eye, EyeOff } from 'lucide-react'
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [isCreator, setIsCreator] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (mode === 'signup') {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { username, is_creator: isCreator }
        }
      })
      if (error) { setError(error.message); setLoading(false); return }
      if (data.user) {
        await supabase.from('profiles').upsert({
          id: data.user.id,
          username,
          display_name: username,
          is_creator: isCreator
        })
      }
      setMessage('Check your email to confirm your account!')
      setLoading(false)
      return
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) { setError(error.message); setLoading(false); return }
    router.push('/home')
    setLoading(false)
  }

  const creators = [
    { username: '@creator1', bg: '#1a1a2e' },
    { username: '@creator2', bg: '#16213e' },
    { username: '@creator3', bg: '#0f3460' },
    { username: '@creator4', bg: '#533483' },
    { username: '@creator5', bg: '#e94560' },
  ]

  return (
    <div className="min-h-screen bg-black flex">
      {/* Left side - Creator previews */}
      <div className="hidden lg:flex flex-col justify-center flex-1 p-12 relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
              <Lock className="w-6 h-6 text-white" />
            </div>
            <span className="text-3xl font-bold text-white">fanssecrets</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">Sign up to support your favorite creators</h1>
          <p className="text-gray-400 text-lg mb-12">Exclusive content, direct messaging, and more.</p>
          <div className="flex gap-4 overflow-hidden">
            {creators.map((c, i) => (
              <div key={i} className="w-44 h-64 rounded-2xl flex-shrink-0 flex items-end p-3" style={{ background: c.bg }}>
                <span className="text-white text-sm font-medium bg-black/40 px-2 py-1 rounded-lg">{c.username}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right side - Auth form */}
      <div className="w-full lg:w-[480px] flex flex-col justify-between bg-[#0a0a0a] p-8">
        <div className="flex justify-end">
          <Link href="/home" className="text-gray-400 hover:text-white text-sm transition-colors">
            Skip for now
          </Link>
        </div>

        <div className="w-full max-w-sm mx-auto">
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Lock className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold text-white">fanssecrets</span>
          </div>

          <div className="flex mb-8 bg-[#1a1a1a] rounded-xl p-1">
            <button
              onClick={() => setMode('login')}
              className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${mode === 'login' ? 'bg-primary text-white' : 'text-gray-400'}`}
            >
              Log in
            </button>
            <button
              onClick={() => setMode('signup')}
              className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${mode === 'signup' ? 'bg-primary text-white' : 'text-gray-400'}`}
            >
              Sign up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label className="text-sm text-gray-400 block mb-1.5">Username</label>
                <input
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder="@yourhandle"
                  required
                  className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-primary transition-colors"
                />
              </div>
            )}
            <div>
              <label className="text-sm text-gray-400 block mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@email.com"
                required
                className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-primary transition-colors"
              />
            </div>
            <div>
              <label className="text-sm text-gray-400 block mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Min. 8 characters"
                  required
                  className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-4 py-3 pr-12 text-white text-sm outline-none focus:border-primary transition-colors"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {mode === 'signup' && (
              <div className="flex items-center gap-3 p-3 bg-[#1a1a1a] rounded-xl cursor-pointer" onClick={() => setIsCreator(!isCreator)}>
                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${isCreator ? 'bg-primary border-primary' : 'border-gray-600'}`}>
                  {isCreator && <span className="text-white text-xs">✓</span>}
                </div>
                <div>
                  <p className="text-white text-sm font-medium">I want to be a creator</p>
                  <p className="text-gray-500 text-xs">Start earning from your content</p>
                </div>
              </div>
            )}

            {error && <p className="text-red-500 text-sm">{error}</p>}
            {message && <p className="text-primary text-sm">{message}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-50"
            >
              {loading ? 'Loading...' : mode === 'login' ? 'LOG IN' : 'CREATE ACCOUNT'}
            </button>
          </form>

          {mode === 'login' && (
            <p className="text-center text-sm text-gray-400 mt-4">
              <button onClick={() => setMode('signup')} className="text-primary hover:underline">Sign up for FansSecrets</button>
            </p>
          )}

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#2a2a2a]" />
            </div>
            <div className="relative flex justify-center text-xs text-gray-500 bg-[#0a0a0a] px-4">OR CONTINUE WITH</div>
          </div>

          <div className="space-y-3">
            <button className="w-full flex items-center justify-center gap-3 bg-[#1a1a1a] hover:bg-[#2a2a2a] border border-[#2a2a2a] rounded-xl py-3 text-white text-sm font-medium transition-colors">
              <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="currentColor" d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.259 5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              SIGN IN WITH X
            </button>
            <button
              onClick={async () => {
                await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: `${window.location.origin}/home` } })
              }}
              className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-100 rounded-xl py-3 text-black text-sm font-medium transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
              SIGN IN WITH GOOGLE
            </button>
          </div>

          <p className="text-center text-xs text-gray-600 mt-6">
            By logging in and using FansSecrets, you agree to our{' '}
            <Link href="#" className="text-primary hover:underline">Terms of Service</Link> and{' '}
            <Link href="#" className="text-primary hover:underline">Privacy Policy</Link>,
            and confirm that you are at least 18 years old.
          </p>
        </div>

        <div className="text-center text-xs text-gray-600">
          © 2026 FansSecrets · <Link href="#" className="hover:text-gray-400">Privacy</Link> · <Link href="#" className="hover:text-gray-400">Terms</Link> · <Link href="#" className="hover:text-gray-400">DMCA</Link>
        </div>
      </div>
    </div>
  )
}