"use client"

import { useEffect } from 'react'
import Auth from '@/components/Auth'
import { testSupabaseConnection } from '@/lib/supabase'

export default function AuthPage() {
  useEffect(() => {
    testSupabaseConnection()
  }, [])

  return (
    <div className="container mx-auto px-4 py-8 max-w-md">
      <h1 className="text-3xl font-bold mb-6 text-center">Login / Sign Up</h1>
      <Auth />
    </div>
  )
}