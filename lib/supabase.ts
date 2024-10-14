import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export const testSupabaseConnection = async () => {
  try {
    const { data, error } = await supabase.from('prompts').select('count').single()
    if (error) throw error
    console.log('Supabase connection successful. Prompt count:', data.count)
    return true
  } catch (error) {
    console.error('Supabase connection error:', error)
    return false
  }
}

