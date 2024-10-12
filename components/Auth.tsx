"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from "@/components/ui/use-toast"
import { FcGoogle } from 'react-icons/fc'

export default function Auth() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createClientComponentClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      toast({
        title: "Login Error",
        description: error.message,
        variant: "destructive",
      })
    } else {
      router.push('/')
      router.refresh()
    }
    setLoading(false)
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const { data, error } = await supabase.auth.signUp({ 
      email, 
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`
      }
    })
    if (error) {
      let errorMessage = error.message
      if (error.status === 422 && error.message.includes('anonymous_provider_disabled')) {
        errorMessage = "Email/password sign-ups are currently disabled. Please use Google sign-in or contact the administrator."
      }
      toast({
        title: "Sign Up Error",
        description: errorMessage,
        variant: "destructive",
      })
    } else if (data.user && data.session) {
      toast({
        title: "Sign Up Successful",
        description: "You have been automatically logged in.",
      })
      router.push('/')
      router.refresh()
    } else {
      toast({
        title: "Sign Up Successful",
        description: "Please check your email for the confirmation link.",
      })
    }
    setLoading(false)
  }

  const handleGoogleSignIn = async () => {
    setLoading(true)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    })
    if (error) {
      toast({
        title: "Google Sign In Error",
        description: error.message,
        variant: "destructive",
      })
    }
    setLoading(false)
  }

  return (
    <div className="flex flex-col space-y-4">
      <Input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button onClick={handleLogin} disabled={loading}>
        {loading ? 'Loading...' : 'Login'}
      </Button>
      <Button onClick={handleSignUp} disabled={loading} variant="outline">
        {loading ? 'Loading...' : 'Sign Up'}
      </Button>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>
      <Button onClick={handleGoogleSignIn} disabled={loading} variant="outline" className="flex items-center justify-center">
        <FcGoogle className="mr-2 h-4 w-4" />
        Sign in with Google
      </Button>
    </div>
  )
}