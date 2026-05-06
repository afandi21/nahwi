'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function saveProgress(challengeId: string, userAnswer: string) {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  // Check current attempts
  const { data: existing } = await supabase
    .from('user_progress')
    .select('attempts')
    .eq('user_id', user.id)
    .eq('challenge_id', challengeId)
    .single()

  const attempts = (existing?.attempts || 0) + 1

  const { error } = await supabase
    .from('user_progress')
    .upsert({
      user_id: user.id,
      challenge_id: challengeId,
      is_completed: true,
      last_answer: userAnswer,
      attempts,
      completed_at: new Date().toISOString()
    })

  if (error) {
    console.error('Error saving progress:', error)
    return { error: error.message }
  }

  // Revalidate the curriculum page to update gating
  revalidatePath('/learn/[curriculum]', 'page')
  
  return { success: true }
}
