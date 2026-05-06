import { createClient } from '@/lib/supabase/server'
import ChallengeEditor from '@/components/admin/ChallengeEditor'
import { notFound } from 'next/navigation'

export default async function EditChallengePage({ params }: { params: { id: string } }) {
  const supabase = createClient()

  // Fetch sections for the dropdown
  const { data: sections } = await supabase
    .from('sections')
    .select('id, title')
    .order('title')

  let challenge = null

  if (params.id !== 'new') {
    const { data } = await supabase
      .from('challenges')
      .select('*')
      .eq('id', params.id)
      .single()
    
    if (!data) notFound()
    challenge = data
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
          {params.id === 'new' ? 'Buat Soal Baru' : 'Edit Soal'}
        </h2>
        <p className="text-slate-500 mt-1">
          Konfigurasi materi, kalimat target, dan kriteria penilaian.
        </p>
      </div>

      <ChallengeEditor 
        challenge={challenge || {}} 
        sections={sections || []} 
      />
    </div>
  )
}
