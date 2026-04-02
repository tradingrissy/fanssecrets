'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ArrowLeft } from 'lucide-react'

export default function UploadPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [isPPV, setIsPPV] = useState(false)
  const [ppvPrice, setPpvPrice] = useState('')
  const [file, setFile] = useState<File|null>(null)
  const [preview, setPreview] = useState<string|null>(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) { router.push('/'); return }
      setUser(user)
    })
  }, [])

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    if (!f) return
    setFile(f)
    setPreview(URL.createObjectURL(f))
  }

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault()
    if (!user) return
    setLoading(true)
    setError('')
    let mediaUrls: string[] = []

    if (file) {
      const fileExt = file.name.split('.').pop()
      const filePath = `${user.id}/${Date.now()}.${fileExt}`
      const { data, error: uploadError } = await supabase.storage
        .from('content')
        .upload(filePath, file, { upsert: true })

      if (uploadError) {
        setError('Upload failed: ' + uploadError.message)
        setLoading(false)
        return
      }

      const { data: urlData } = supabase.storage.from('content').getPublicUrl(filePath)
      mediaUrls = [urlData.publicUrl]
    }

    const { error: insertError } = await supabase.from('content').insert({
      creator_id: user.id,
      title,
      body,
      media_urls: mediaUrls,
      content_type: file?.type.startsWith('video') ? 'video' : 'image',
      is_ppv: isPPV,
      ppv_price: isPPV ? Math.round(parseFloat(ppvPrice) * 100) : 0,
    })

    if (insertError) {
      setError('Post failed: ' + insertError.message)
      setLoading(false)
      return
    }

    setSuccess(true)
    setLoading(false)
    setTimeout(() => router.push('/dashboard'), 2000)
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-xl mx-auto">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
        <h1 className="text-2xl font-bold text-foreground mb-2">Upload Content</h1>
        <p className="text-muted-foreground mb-8">Share photos or videos with your subscribers</p>

        {success ? (
          <div className="bg-green-500/10 border border-green-500 rounded-xl p-6 text-center">
            <p className="text-green-500 font-semibold text-lg">Uploaded successfully!</p>
            <p className="text-muted-foreground text-sm mt-1">Redirecting to dashboard...</p>
          </div>
        ) : (
          <form onSubmit={handleUpload} className="space-y-5">
            <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
              <div>
                <label className="text-sm text-muted-foreground block mb-1.5">Title</label>
                <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="Post title" required className="bg-secondary" />
              </div>
              <div>
                <label className="text-sm text-muted-foreground block mb-1.5">Caption</label>
                <textarea
                  value={body}
                  onChange={e => setBody(e.target.value)}
                  placeholder="Write something..."
                  rows={3}
                  className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-foreground text-sm outline-none focus:border-primary resize-none"
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground block mb-1.5">Photo or Video</label>
                <input
                  type="file"
                  accept="image/*,video/*"
                  onChange={handleFileChange}
                  className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-foreground text-sm"
                />
              </div>
              {preview && (
                <div className="rounded-xl overflow-hidden">
                  <img src={preview} className="w-full object-cover max-h-64" />
                </div>
              )}
            </div>

            <div className="bg-card border border-border rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4" onClick={() => setIsPPV(!isPPV)}>
                <div>
                  <p className="font-medium text-foreground">Pay-per-view</p>
                  <p className="text-sm text-muted-foreground">Charge fans to unlock this post</p>
                </div>
                <div className={`w-10 h-6 rounded-full relative cursor-pointer transition-colors ${isPPV ? 'bg-primary' : 'bg-secondary'}`}>
                  <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-all ${isPPV ? 'left-5' : 'left-1'}`} />
                </div>
              </div>
              {isPPV && (
                <div>
                  <label className="text-sm text-muted-foreground block mb-1.5">Price (USD)</label>
                  <Input type="number" value={ppvPrice} onChange={e => setPpvPrice(e.target.value)} placeholder="9.99" min="1" step="0.01" required={isPPV} className="bg-secondary" />
                </div>
              )}
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <Button type="submit" disabled={loading} className="w-full bg-primary hover:bg-primary/90 text-white py-3">
              {loading ? 'Uploading...' : 'Upload Post'}
            </Button>
          </form>
        )}
      </div>
    </div>
  )
}