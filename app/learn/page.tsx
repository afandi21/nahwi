import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Book, ChevronRight, Star, Clock } from 'lucide-react'
import { Curriculum } from '@/types'
import ThemeToggle from '@/components/ThemeToggle'
import LogoutButton from '@/components/auth/LogoutButton'

export default async function CurriculumPage() {
  const supabase = createClient()
  
  const { data: curricula, error } = await supabase
    .from('curriculum')
    .select('*')
    .eq('is_published', true)
    .order('order_index')

  const displayCurricula = curricula || []

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-12 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">Kurikulum Belajar</h1>
            <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
              Pilih jalur pembelajaran Anda untuk mulai menguasai tata bahasa Arab.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <LogoutButton />
          </div>
        </header>

        <div className="grid gap-6">
          {displayCurricula.map((item) => (
            <Link 
              key={item.id} 
              href={`/learn/${item.slug}`}
              className="group bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-indigo-100 dark:hover:border-indigo-900 transition-all flex flex-col md:flex-row md:items-center gap-6"
            >
              <div className="bg-indigo-600 h-20 w-20 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform shadow-lg shadow-indigo-100 dark:shadow-none">
                <Book className="h-10 w-10 text-white" />
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="bg-amber-100 text-amber-700 text-xs font-bold px-2.5 py-1 rounded-lg flex items-center gap-1">
                    <Star className="h-3 w-3 fill-amber-500" />
                    Terpopuler
                  </span>
                  <span className="text-slate-400 text-sm flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    ~12 Jam
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {item.title}
                </h2>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed max-w-xl">
                  {item.description}
                </p>
              </div>

              <div className="flex items-center justify-end">
                <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-xl group-hover:bg-indigo-50 dark:group-hover:bg-indigo-950 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-all">
                  <ChevronRight className="h-6 w-6" />
                </div>
              </div>
            </Link>
          ))}

          {displayCurricula.length === 0 && !error && (
            <div className="text-center py-20 bg-white rounded-[2.5rem] border border-dashed border-slate-200">
              <Book className="h-12 w-12 text-slate-200 mx-auto mb-4" />
              <p className="text-slate-400 font-medium">Belum ada kurikulum yang dipublikasikan.</p>
            </div>
          )}
        </div>

        {error && (
          <div className="mt-8 p-6 bg-rose-50 border border-rose-100 rounded-[2rem] text-rose-800 shadow-sm">
            <h3 className="font-bold mb-2 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-rose-500 animate-ping" />
              Koneksi Database Bermasalah
            </h3>
            <p className="text-sm opacity-80">
              Gagal mengambil data dari Supabase. Pastikan tabel `curriculum` sudah dibuat dan variabel lingkungan sudah benar.
            </p>
            <p className="text-[10px] mt-4 font-mono bg-white/50 p-2 rounded-lg">
              Error: {error.message}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
