"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from "@/components/ui/use-toast"
import { FcGoogle } from 'react-icons/fc'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/client'

export default function Auth() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        },
        body: JSON.stringify({
          email: email,
          password: password
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error_description || 'Login failed');
      }

      const data = await response.json();
      // Handle successful login
      toast({
        title: "Login Successful",
        description: "You have been logged in successfully.",
      })
      // You might want to store the access token here
      // localStorage.setItem('access_token', data.access_token);
      router.push('/')
      router.refresh()
    } catch (error: any) {
      toast({
        title: "Login Error",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
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
      <p className="text-center text-sm">
        Don't have an account?{' '}
        <Link href="/signup" className="font-semibold text-primary hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  )
}
