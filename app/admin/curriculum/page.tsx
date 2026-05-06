'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Plus, Edit2, Trash2, Globe, Lock, Book, ChevronRight, Layers } from 'lucide-react'
import Link from 'next/link'
import CurriculumModal from '@/components/admin/CurriculumModal'
import { useRouter } from 'next/navigation'

export default function AdminCurriculum() {
  const [curricula, setCurricula] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedCurriculum, setSelectedCurriculum] = useState<any>(null)
  const supabase = createClient()
  const router = useRouter()

  const loadCurricula = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('curriculum')
      .select('*')
      .order('order_index')
    if (data) setCurricula(data)
    setLoading(false)
  }

  useEffect(() => {
    loadCurricula()
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus kurikulum ini? Semua bab dan soal di dalamnya mungkin terdampak.')) return
    const { error } = await supabase.from('curriculum').delete().eq('id', id)
    if (error) alert('Gagal menghapus: ' + error.message)
    else loadCurricula()
  }

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Kurikulum</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Strukturkan jalur pembelajaran dan sertifikasi Nahwi.</p>
        </div>
        <button 
          onClick={() => {
            setSelectedCurriculum(null)
            setIsModalOpen(true)
          }}
          className="bg-indigo-600 text-white px-8 py-4 rounded-[2rem] font-black text-sm flex items-center gap-2 hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-500/20 active:scale-95"
        >
          <Plus className="h-5 w-5" />
          Tambah Kurikulum
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-800/50">
                <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Program Kurikulum</th>
                <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">ID Slug</th>
                <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</th>
                <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {curricula.map((item) => (
                <tr key={item.id} className="hover:bg-indigo-50/30 dark:hover:bg-indigo-900/10 transition-colors group">
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-6">
                      <div className="h-14 w-14 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300">
                        <Book className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                      </div>
                      <div>
                        <p className="font-black text-slate-900 dark:text-white text-lg leading-none mb-2">{item.title}</p>
                        <p className="text-xs text-slate-400 dark:text-slate-500 font-medium line-clamp-1 max-w-sm">{item.description}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-8">
                    <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-lg text-[10px] font-black font-mono uppercase">
                      {item.slug}
                    </span>
                  </td>
                  <td className="px-10 py-8">
                    {item.is_published ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-[10px] font-black uppercase tracking-wider">
                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Live
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[10px] font-black uppercase tracking-wider">
                        <div className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                        Draft
                      </span>
                    )}
                  </td>
                  <td className="px-10 py-8 text-right">
                    <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
                      <Link 
                        href={`/admin/curriculum/${item.id}/sections`}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl text-xs font-black hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-all border border-indigo-100 dark:border-indigo-800"
                      >
                        <Layers className="h-3.5 w-3.5" />
                        Kelola Bab
                      </Link>
                      <button 
                        onClick={() => {
                          setSelectedCurriculum(item)
                          setIsModalOpen(true)
                        }}
                        className="p-3 text-slate-400 hover:text-indigo-600 hover:bg-white dark:hover:bg-slate-800 rounded-xl transition-all shadow-sm border border-transparent hover:border-slate-100 dark:hover:border-slate-700"
                      >
                        <Edit2 className="h-5 w-5" />
                      </button>
                      <button 
                        onClick={() => handleDelete(item.id)}
                        className="p-3 text-slate-400 hover:text-red-600 hover:bg-white dark:hover:bg-slate-800 rounded-xl transition-all shadow-sm border border-transparent hover:border-slate-100 dark:hover:border-slate-700"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!loading && curricula.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-10 py-24 text-center">
                    <div className="max-w-xs mx-auto text-slate-400">
                      <Book className="h-12 w-12 mx-auto mb-4 opacity-20" />
                      <p className="font-bold italic">Belum ada kurikulum. Klik tombol di atas untuk membuat.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <CurriculumModal 
          curriculum={selectedCurriculum}
          onClose={() => setIsModalOpen(false)}
          onSuccess={loadCurricula}
        />
      )}
    </div>
  )
}
