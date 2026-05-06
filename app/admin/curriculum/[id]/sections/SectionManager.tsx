'use client'

import { useState } from 'react'
import { Plus, Trash2, Save, Loader2, GripVertical, AlertCircle, Layers } from 'lucide-react'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

interface Section {
  id: string
  title: string
  order_index: number
  curriculum_id: string
}


export default function SectionManager({ 
  curriculumId, 
  initialSections 
}: { 
  curriculumId: string, 
  initialSections: Section[] 
}) {
  const [sections, setSections] = useState<Section[]>(initialSections)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()
  const router = useRouter()

  const addSection = () => {
    const newSection: Section = {
      id: crypto.randomUUID(),
      title: '',
      order_index: sections.length + 1,
      curriculum_id: curriculumId
    }
    setSections([...sections, newSection])
  }

  const removeSection = (id: string) => {
    setSections(sections.filter(s => s.id !== id))
  }

  const handleSave = async () => {
    setIsSaving(true)
    setError(null)

    try {
      // Basic validation
      if (sections.some(s => !s.title.trim())) {
        throw new Error('Semua judul Bab harus diisi!')
      }

      // We need to delete sections that are no longer in the list
      const initialIds = initialSections.map(s => s.id)
      const currentIds = sections.map(s => s.id)
      const idsToDelete = initialIds.filter(id => !currentIds.includes(id))

      if (idsToDelete.length > 0) {
        const { error: delError } = await supabase
          .from('sections')
          .delete()
          .in('id', idsToDelete)
        if (delError) throw delError
      }

      // Upsert current sections
      const { error: upsertError } = await supabase
        .from('sections')
        .upsert(sections.map((s, idx) => ({ ...s, order_index: idx + 1 })))
      
      if (upsertError) throw upsertError

      router.refresh()
      alert('Berhasil menyimpan Bab!')
    } catch (e: any) {
      setError(e.message)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm p-10 space-y-8">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-black text-slate-900">Daftar Bab</h3>
        <button 
          onClick={addSection}
          className="bg-slate-100 text-slate-600 hover:bg-slate-200 px-6 py-2.5 rounded-2xl font-bold text-sm flex items-center gap-2 transition-all"
        >
          <Plus className="h-4 w-4" />
          Tambah Bab Baru
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-2xl flex items-center gap-3 text-sm font-bold">
          <AlertCircle className="h-5 w-5" />
          {error}
        </div>
      )}

      <div className="space-y-4">
        {sections.map((section, index) => (
          <div key={section.id} className="group flex items-center gap-4 p-6 bg-slate-50 border border-slate-100 rounded-[2rem] hover:border-indigo-200 hover:bg-white transition-all shadow-sm">
            <div className="text-slate-300">
              <GripVertical className="h-6 w-6 cursor-grab" />
            </div>
            
            <div className="flex-1">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Judul Bab</label>
                <input 
                  type="text"
                  value={section.title}
                  onChange={(e) => {
                    const newSections = [...sections]
                    newSections[index].title = e.target.value
                    setSections(newSections)
                  }}
                  placeholder="Contoh: Pengenalan Isim"
                  className="w-full px-5 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:border-indigo-500 font-bold"
                />
              </div>
            </div>

            <button 
              onClick={() => removeSection(section.id)}
              className="p-3 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-2xl transition-all opacity-0 group-hover:opacity-100"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </div>
        ))}

        {sections.length === 0 && (
          <div className="text-center py-20 bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2.5rem]">
            <Layers className="h-12 w-12 text-slate-200 mx-auto mb-4" />
            <p className="text-slate-400 font-bold italic">Belum ada Bab. Klik tombol di atas untuk menambah.</p>
          </div>
        )}
      </div>

      <div className="pt-8 border-t border-slate-100 flex justify-end">
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="bg-indigo-600 text-white px-10 py-4 rounded-2xl font-black text-sm flex items-center gap-2 hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-500/20 disabled:opacity-50 active:scale-95"
        >
          {isSaving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
          {isSaving ? 'Menyimpan...' : 'Simpan Semua Bab'}
        </button>
      </div>
    </div>
  )
}
