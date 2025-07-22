import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://lhkmyiqvmgmkhrudvifv.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your_anon_key_here'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          user_id: string
          full_name: string | null
          position: string | null
          about_me: string | null
          profile_image: string | null
          phone: string | null
          email: string | null
          github: string | null
          linkedin: string | null
          location: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          full_name?: string | null
          position?: string | null
          about_me?: string | null
          profile_image?: string | null
          phone?: string | null
          email?: string | null
          github?: string | null
          linkedin?: string | null
          location?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          full_name?: string | null
          position?: string | null
          about_me?: string | null
          profile_image?: string | null
          phone?: string | null
          email?: string | null
          github?: string | null
          linkedin?: string | null
          location?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      cv_data: {
        Row: {
          id: string
          user_id: string
          cv_data: any
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          cv_data: any
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          cv_data?: any
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}