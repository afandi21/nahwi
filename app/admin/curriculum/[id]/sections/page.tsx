import { createClient } from '@/lib/supabase/server'
import { Plus, Edit2, Trash2, ArrowLeft, Layers, Save, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import SectionManager from './SectionManager'

export default async function ManageSectionsPage({ params }: { params: { id: string } }) {
  const supabase = createClient()

  // Fetch curriculum details
  const { data: curriculum } = await supabase
    .from('curriculum')
    .select('id, title')
    .eq('id', params.id)
    .single()

  if (!curriculum) notFound()

  // Fetch existing sections
  const { data: sections } = await supabase
    .from('sections')
    .select('*')
    .eq('curriculum_id', params.id)
    .order('order_index')

  return (
    <div className="space-y-10">
      <div className="flex items-center gap-4">
        <Link 
          href="/admin/curriculum" 
          className="p-3 bg-white rounded-2xl border border-slate-200 text-slate-500 hover:text-slate-900 transition-all shadow-sm"
        >
          <ArrowLeft className="h-6 w-6" />
        </Link>
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Kelola Bab (Sections)</h2>
          <p className="text-slate-500 font-medium">Kurikulum: <span className="text-indigo-600">{curriculum.title}</span></p>
        </div>
      </div>

      <SectionManager 
        curriculumId={curriculum.id} 
        initialSections={sections || []} 
      />
    </div>
  )
}
