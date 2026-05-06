import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = createClient()
  
  const { data: curricula } = await supabase.from('curriculum').select('id, title, slug, is_published')

  const { data: sections } = await supabase.from('sections').select('id, title, curriculum_id')
  const { data: challenges } = await supabase.from('challenges').select('id, title, section_id, valid_answers, tests, type')


  return NextResponse.json({
    curricula,
    sections,
    challenges
  })
}
