import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

async function debug() {
  const { data: curricula } = await supabase.from('curriculum').select('id, title, slug')
  console.log('Curricula:', curricula)

  const { data: sections } = await supabase.from('sections').select('id, title, curriculum_id')
  console.log('Sections:', sections)
  
  const { data: challenges } = await supabase.from('challenges').select('id, title, section_id')
  console.log('Challenges:', challenges)
}

debug()
