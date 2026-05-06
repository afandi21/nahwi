import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import PublicChallengeClient from './PublicChallengeClient'

const FREE_CHALLENGE_LIMIT = 3

export default async function PublicTryChallengePage({
  params
}: {
  params: { slug: string; challengeId: string }
}) {
  const supabase = createClient()

  // If user is already logged in, redirect to the real learn page
  const { data: { user } } = await supabase.auth.getUser()
  if (user) {
    redirect(`/learn/${params.slug}/${params.challengeId}`)
  }

  // Fetch the curriculum to get its id
  const { data: curriculum } = await supabase
    .from('curriculum')
    .select('id, title, slug')
    .eq('slug', params.slug)
    .single()

  if (!curriculum) notFound()

  // Fetch all challenges for this curriculum to determine the global order
  const { data: allChallenges } = await supabase
    .from('challenges')
    .select('id, order_index, section_id, sections!inner(curriculum_id, order_index)')
    .eq('sections.curriculum_id', curriculum.id)
    .order('order_index')

  // Find the global index of this challenge (1-based)
  // We sort all challenges by section order then challenge order
  const sortedChallenges = (allChallenges || []).sort((a: any, b: any) => {
    const sA = a.sections?.order_index || 0
    const sB = b.sections?.order_index || 0
    if (sA !== sB) return sA - sB
    return (a.order_index || 0) - (b.order_index || 0)
  })

  const challengeGlobalIndex = sortedChallenges.findIndex((c: any) => c.id === params.challengeId) + 1

  // If challenge is beyond free limit, redirect to register
  if (challengeGlobalIndex > FREE_CHALLENGE_LIMIT || challengeGlobalIndex === 0) {
    redirect(`/auth/register?from=/curriculum/${params.slug}`)
  }

  // Fetch the actual challenge data
  const { data: challenge, error } = await supabase
    .from('challenges')
    .select('*')
    .eq('id', params.challengeId)
    .single()

  if (error || !challenge) notFound()

  return (
    <PublicChallengeClient
      challenge={challenge}
      curriculumSlug={params.slug}
      challengeGlobalIndex={challengeGlobalIndex}
      isLastFree={challengeGlobalIndex === FREE_CHALLENGE_LIMIT}
    />
  )
}
