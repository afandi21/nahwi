import { createClient } from '@/lib/supabase/server'
import { Plus, Edit2, Trash2, Search, Filter, HelpCircle, Book } from 'lucide-react'
import Link from 'next/link'


export default async function AdminChallenges() {
  const supabase = createClient()

  const { data: challenges } = await supabase
    .from('challenges')
    .select('*, sections(title)')
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">Materi & Soal</h2>
          <p className="text-slate-500 mt-2 font-medium">Kelola pustaka tantangan belajar Nahwi secara terpusat.</p>
        </div>
        <Link 
          href="/admin/challenges/new"
          className="bg-indigo-600 text-white px-8 py-4 rounded-[2rem] font-black text-sm flex items-center gap-2 hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-500/20 active:scale-95"
        >
          <Plus className="h-5 w-5" />
          Buat Tantangan Baru
        </Link>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-100 flex flex-col md:flex-row gap-4 items-center justify-between bg-slate-50/50">
          <div className="relative flex-1 max-w-md w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Cari judul soal..."
              className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all"
            />
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <button className="flex-1 md:flex-none px-6 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-600 flex items-center gap-2 hover:bg-slate-50 transition-all shadow-sm">
              <Filter className="h-4 w-4" />
              Filter Bab
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Tantangan</th>
                <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Tipe Konten</th>
                <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Bab / Section</th>
                <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Manajemen</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {challenges?.map((challenge) => (
                <tr key={challenge.id} className="hover:bg-indigo-50/30 transition-colors group">
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-6">
                      <div className="h-14 w-14 bg-white rounded-2xl border border-slate-200 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300">
                        <HelpCircle className="h-6 w-6 text-indigo-600" />
                      </div>
                      <div>
                        <p className="font-black text-slate-900 text-lg leading-none mb-2">{challenge.title}</p>
                        <p className="text-xs text-slate-400 font-arabic tracking-wide" dir="rtl">{challenge.arabic_sentence}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-8">
                    <span className={`inline-flex items-center gap-1.5 text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-wider ${
                      challenge.type === 'harakat' ? 'bg-amber-100 text-amber-700' :
                      challenge.type === 'multiple_choice' ? 'bg-purple-100 text-purple-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      <span className="h-1.5 w-1.5 rounded-full bg-current" />
                      {challenge.type === 'harakat' ? 'Harakat' : 
                       challenge.type === 'multiple_choice' ? 'Pilihan Ganda' : 'Isi Titik'}
                    </span>
                  </td>
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-2 text-sm font-bold text-slate-600">
                      <Book className="h-4 w-4 text-slate-300" />
                      {challenge.sections?.title || 'Umum'}
                    </div>
                  </td>
                  <td className="px-10 py-8 text-right">
                    <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
                      <Link 
                        href={`/admin/challenges/${challenge.id}`}
                        className="p-3 text-slate-400 hover:text-indigo-600 hover:bg-white rounded-xl transition-all shadow-sm border border-transparent hover:border-slate-100"
                      >
                        <Edit2 className="h-5 w-5" />
                      </Link>
                      <button className="p-3 text-slate-400 hover:text-red-600 hover:bg-white rounded-xl transition-all shadow-sm border border-transparent hover:border-slate-100">
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {(!challenges || challenges.length === 0) && (
                <tr>
                  <td colSpan={4} className="px-10 py-24 text-center">
                    <div className="max-w-xs mx-auto">
                      <div className="bg-slate-50 h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <HelpCircle className="h-10 w-10 text-slate-200" />
                      </div>
                      <p className="text-slate-400 font-bold italic">Belum ada soal yang dibuat.</p>
                      <p className="text-xs text-slate-400 mt-2">Mulai dengan membuat tantangan baru untuk kurikulum Anda.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
