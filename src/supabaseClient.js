import { createClient } from '@supabase/supabase-js'

// Get these from your Supabase Project Settings > API
const supabaseUrl = 'https://mgcpnvlkmulyzyuzbwxy.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1nY3BudmxrbXVseXp5dXpid3h5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA2NjUwMzEsImV4cCI6MjA4NjI0MTAzMX0.YxIbIFn40P5BdYZrA39y3eH53jzp76vq8eGgci6cXn8'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)