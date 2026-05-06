import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import ChallengeClient from './ChallengeClient'

export default async function LessonPage({ 
  params 
}: { 
  params: { curriculum: string, challengeId: string } 
}) {
  const supabase = createClient()

  const { data: challenge, error } = await supabase
    .from('challenges')
    .select('*')
    .eq('id', params.challengeId)
    .single()

  if (error || !challenge) {
    console.error('Error fetching challenge:', error)
    return notFound()
  }

  return (
    <ChallengeClient 
      challenge={challenge} 
      curriculumSlug={params.curriculum} 
    />
  )
}
