'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function upsertCurriculum(formData: any) {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || user.app_metadata?.role !== 'admin') {
    return { error: 'Unauthorized' }
  }

  const { error } = await supabase
    .from('curriculum')
    .upsert({
      id: formData.id || undefined,
      title: formData.title,
      slug: formData.slug,
      description: formData.description,
      order_index: formData.order_index,
      is_published: formData.is_published
    })

  if (error) return { error: error.message }
  
  revalidatePath('/admin/curriculum')
  revalidatePath('/learn')
  return { success: true }
}

export async function upsertChallenge(challengeData: any) {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user || user.app_metadata?.role !== 'admin') {
    return { error: 'Unauthorized' }
  }

  const { error } = await supabase
    .from('challenges')
    .upsert({
      ...challengeData
    })

  if (error) return { error: error.message }

  revalidatePath('/admin/challenges')
  revalidatePath(`/learn/[curriculum]/${challengeData.id}`)
  return { success: true }
}
