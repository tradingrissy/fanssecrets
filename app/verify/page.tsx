"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Shield, 
  CheckCircle2, 
  Camera, 
  FileText, 
  Lock, 
  ArrowRight, 
  AlertCircle,
  Smartphone,
  Globe,
  Clock,
  ShieldCheck,
  X
} from "lucide-react"

export default function VerifyPage() {
  const [step, setStep] = useState(1)
  const [verificationMethod, setVerificationMethod] = useState<string | null>(null)
  const [isVerifying, setIsVerifying] = useState(false)
  const [isComplete, setIsComplete] = useState(false)

  const handleStartVerification = (method: string) => {
    setVerificationMethod(method)
    setStep(2)
  }

  const handleVerify = () => {
    setIsVerifying(true)
    // Simulate verification process
    setTimeout(() => {
      setIsVerifying(false)
      setStep(3)
      setTimeout(() => {
        setIsComplete(true)
      }, 1500)
    }, 3000)
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <Lock className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-xl text-foreground">fanssecrets</span>
          </Link>
          <Link href="/">
            <Button variant="ghost" size="icon">
              <X className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-2xl">
          {/* Progress Steps */}
          <div className="flex items-center justify-center gap-4 mb-8">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                  step >= s 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-secondary text-muted-foreground'
                }`}>
                  {step > s ? <CheckCircle2 className="w-5 h-5" /> : s}
                </div>
                {s < 3 && (
                  <div className={`w-16 h-1 rounded-full transition-all ${
                    step > s ? 'bg-primary' : 'bg-secondary'
                  }`} />
                )}
              </div>
            ))}
          </div>

          {/* Step 1: Choose Verification Method */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-primary" />
                </div>
                <h1 className="text-2xl font-bold text-foreground">Age Verification Required</h1>
                <p className="text-muted-foreground max-w-md mx-auto">
                  To comply with regulations and ensure a safe platform, we require all users to verify they are 18 years or older.
                </p>
              </div>

              {/* Trust Badges */}
              <div className="flex items-center justify-center gap-6 py-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <ShieldCheck className="w-4 h-4 text-green-500" />
                  <span>256-bit Encryption</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Lock className="w-4 h-4 text-green-500" />
                  <span>GDPR Compliant</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Globe className="w-4 h-4 text-green-500" />
                  <span>Verified by Jumio</span>
                </div>
              </div>

              {/* Verification Methods */}
              <div className="grid gap-4">
                <Card 
                  className="cursor-pointer hover:border-primary transition-colors bg-card"
                  onClick={() => handleStartVerification('id')}
                >
                  <CardContent className="p-6 flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <FileText className="w-7 h-7 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">Government ID</h3>
                      <p className="text-sm text-muted-foreground">
                        Passport, Driver&apos;s License, or National ID Card
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm">~2 min</span>
                    </div>
                    <ArrowRight className="w-5 h-5 text-muted-foreground" />
                  </CardContent>
                </Card>

                <Card 
                  className="cursor-pointer hover:border-primary transition-colors bg-card"
                  onClick={() => handleStartVerification('selfie')}
                >
                  <CardContent className="p-6 flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <Camera className="w-7 h-7 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">ID + Selfie Match</h3>
                      <p className="text-sm text-muted-foreground">
                        Photo ID with a live selfie for biometric verification
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-green-500">
                      <CheckCircle2 className="w-4 h-4" />
                      <span className="text-sm">Recommended</span>
                    </div>
                    <ArrowRight className="w-5 h-5 text-muted-foreground" />
                  </CardContent>
                </Card>

                <Card 
                  className="cursor-pointer hover:border-primary transition-colors bg-card"
                  onClick={() => handleStartVerification('mobile')}
                >
                  <CardContent className="p-6 flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <Smartphone className="w-7 h-7 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">Mobile Verification</h3>
                      <p className="text-sm text-muted-foreground">
                        Continue on your phone for easier document scanning
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm">~3 min</span>
                    </div>
                    <ArrowRight className="w-5 h-5 text-muted-foreground" />
                  </CardContent>
                </Card>
              </div>

              {/* Info Notice */}
              <div className="bg-secondary/50 rounded-xl p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
                <div className="text-sm text-muted-foreground">
                  <p className="font-medium text-foreground mb-1">Your privacy is protected</p>
                  <p>
                    We use Jumio, a certified identity verification provider. Your documents are encrypted, 
                    processed securely, and deleted after verification. We only store your verification status, 
                    not your actual documents.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Verification Process */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <h1 className="text-2xl font-bold text-foreground">
                  {verificationMethod === 'selfie' ? 'ID + Selfie Verification' : 
                   verificationMethod === 'mobile' ? 'Mobile Verification' : 'ID Verification'}
                </h1>
                <p className="text-muted-foreground">
                  Follow the steps below to complete verification
                </p>
              </div>

              {/* Mock Verification UI */}
              <Card className="bg-card">
                <CardHeader>
                  <CardTitle className="text-lg">Upload Your Document</CardTitle>
                  <CardDescription>
                    Take a clear photo of your government-issued ID
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Document Upload Area */}
                  <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary transition-colors cursor-pointer">
                    <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4">
                      <Camera className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <p className="font-medium text-foreground mb-1">Click to upload or drag and drop</p>
                    <p className="text-sm text-muted-foreground">PNG, JPG up to 10MB</p>
                  </div>

                  {/* Requirements */}
                  <div className="space-y-3">
                    <p className="text-sm font-medium text-foreground">Requirements:</p>
                    <div className="grid gap-2 text-sm text-muted-foreground">
                      {[
                        "Full document must be visible",
                        "Photo must be clear and readable",
                        "No glare or shadows",
                        "Document must not be expired"
                      ].map((req, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-green-500" />
                          <span>{req}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {verificationMethod === 'selfie' && (
                    <>
                      <div className="border-t border-border pt-6">
                        <h3 className="font-medium text-foreground mb-4">Take a Selfie</h3>
                        <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary transition-colors cursor-pointer">
                          <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4">
                            <Camera className="w-10 h-10 text-muted-foreground" />
                          </div>
                          <p className="font-medium text-foreground mb-1">Take a live selfie</p>
                          <p className="text-sm text-muted-foreground">Position your face in the circle</p>
                        </div>
                      </div>
                    </>
                  )}

                  <div className="flex gap-3">
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => setStep(1)}
                    >
                      Back
                    </Button>
                    <Button 
                      className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                      onClick={handleVerify}
                    >
                      {isVerifying ? (
                        <span className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                          Verifying...
                        </span>
                      ) : (
                        'Submit for Verification'
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Powered By */}
              <div className="text-center text-sm text-muted-foreground">
                <p>Powered by <span className="font-semibold">Jumio</span> - Trusted by 1000+ platforms worldwide</p>
              </div>
            </div>
          )}

          {/* Step 3: Verification Complete */}
          {step === 3 && (
            <div className="text-center space-y-6">
              <div className={`w-24 h-24 rounded-full mx-auto flex items-center justify-center transition-all duration-500 ${
                isComplete ? 'bg-green-500/10' : 'bg-primary/10'
              }`}>
                {isComplete ? (
                  <CheckCircle2 className="w-12 h-12 text-green-500" />
                ) : (
                  <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
                )}
              </div>
              
              <div className="space-y-2">
                <h1 className="text-2xl font-bold text-foreground">
                  {isComplete ? 'Verification Complete!' : 'Verifying Your Identity...'}
                </h1>
                <p className="text-muted-foreground max-w-md mx-auto">
                  {isComplete 
                    ? 'Your age has been verified. You now have full access to FansSecrets.'
                    : 'This usually takes less than a minute. Please wait...'
                  }
                </p>
              </div>

              {isComplete && (
                <div className="space-y-4 pt-4">
                  <div className="bg-green-500/10 rounded-xl p-4 inline-flex items-center gap-3">
                    <ShieldCheck className="w-6 h-6 text-green-500" />
                    <span className="text-green-500 font-medium">Age Verified (18+)</span>
                  </div>
                  
                  <div className="pt-4">
                    <Link href="/home">
                      <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                        Enter FansSecrets
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </Button>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-center gap-6 text-sm text-muted-foreground">
          <span>Secure Verification</span>
          <span>|</span>
          <Link href="#" className="hover:text-foreground transition-colors">Privacy Policy</Link>
          <span>|</span>
          <Link href="#" className="hover:text-foreground transition-colors">Help</Link>
        </div>
      </footer>
    </div>
  )
}
