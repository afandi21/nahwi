import { createClient } from '@/lib/supabase/server'
import { 
  Book, 
  Layers, 
  HelpCircle, 
  Users, 
  TrendingUp, 
  ArrowRight,
  PlusCircle,
  FileText
} from 'lucide-react'
import Link from 'next/link'

export default async function AdminDashboard() {
  const supabase = createClient()

  // Fetch counts
  const { count: curriculumCount } = await supabase.from('curriculum').select('*', { count: 'exact', head: true })
  const { count: sectionCount } = await supabase.from('sections').select('*', { count: 'exact', head: true })
  const { count: challengeCount } = await supabase.from('challenges').select('*', { count: 'exact', head: true })
  const { count: userCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true })

  // Fetch latest activities (challenges updated)
  const { data: recentChallenges } = await supabase
    .from('challenges')
    .select('title')
    .limit(3)

  const stats = [
    { label: 'Total Kurikulum', value: curriculumCount || 0, icon: Book, color: 'text-indigo-600', bg: 'bg-indigo-50', trend: 'Live' },
    { label: 'Total Bab', value: sectionCount || 0, icon: Layers, color: 'text-emerald-600', bg: 'bg-emerald-50', trend: 'Live' },
    { label: 'Total Soal', value: challengeCount || 0, icon: HelpCircle, color: 'text-amber-600', bg: 'bg-amber-50', trend: 'Live' },
    { label: 'Total Siswa', value: userCount || 0, icon: Users, color: 'text-rose-600', bg: 'bg-rose-50', trend: 'Real-time' },
  ]

  return (
    <div className="space-y-10">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">Overview</h2>
          <p className="text-slate-500 mt-2 font-medium">Selamat datang kembali! Berikut adalah ringkasan platform Anda hari ini.</p>
        </div>
        <div className="flex gap-3">
          <div className="bg-white px-4 py-2 rounded-xl border border-slate-200 flex items-center gap-2 text-sm font-bold text-slate-600 shadow-sm">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Live System
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((stat, i) => (
          <div key={i} className="group bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300">
            <div className="flex justify-between items-start mb-6">
              <div className={`${stat.bg} h-14 w-14 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                <stat.icon className={`h-7 w-7 ${stat.color}`} />
              </div>
              <div className="bg-slate-50 px-2.5 py-1 rounded-full flex items-center gap-1 text-[10px] font-black text-slate-400 uppercase tracking-wider">
                <TrendingUp className="h-3 w-3" />
                {stat.trend}
              </div>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
              <p className="text-4xl font-black text-slate-900 tracking-tight">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-[2.5rem] border border-slate-200 shadow-sm p-10">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">Aktivitas Terakhir</h3>
            <button className="text-sm font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 group">
              Lihat Semua <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
          <div className="space-y-6">
            {recentChallenges?.map((challenge, index) => (
              <div key={index} className="flex items-center gap-6 p-4 rounded-2xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                <div className="h-12 w-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400">
                  <FileText className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-slate-900">Materi "{challenge.title}" diperbarui</p>
                  <p className="text-xs text-slate-500 font-medium">
                    Oleh Admin • Baru saja
                  </p>
                </div>
                <div className="h-2 w-2 rounded-full bg-indigo-500" />
              </div>
            ))}
            {(!recentChallenges || recentChallenges.length === 0) && (
              <div className="text-center py-12 text-slate-400 italic">
                Belum ada aktivitas konten terbaru.
              </div>
            )}
          </div>
        </div>

        <div className="bg-slate-900 rounded-[2.5rem] shadow-2xl p-10 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <PlusCircle className="h-32 w-32" />
          </div>
          
          <h3 className="text-2xl font-black mb-8 relative z-10 tracking-tight">Aksi Cepat</h3>
          <div className="space-y-4 relative z-10">
            <Link href="/admin/curriculum" className="w-full bg-white/10 hover:bg-white/20 p-5 rounded-3xl flex items-center justify-between group transition-all">
              <div className="flex items-center gap-4">
                <div className="bg-indigo-500 p-2 rounded-xl">
                  <PlusCircle className="h-5 w-5" />
                </div>
                <span className="font-bold">Tambah Kurikulum</span>
              </div>
              <ArrowRight className="h-5 w-5 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
            </Link>
            
            <Link href="/admin/challenges" className="w-full bg-white/10 hover:bg-white/20 p-5 rounded-3xl flex items-center justify-between group transition-all">
              <div className="flex items-center gap-4">
                <div className="bg-emerald-500 p-2 rounded-xl">
                  <FileText className="h-5 w-5" />
                </div>
                <span className="font-bold">Kelola Soal Baru</span>
              </div>
              <ArrowRight className="h-5 w-5 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
            </Link>
          </div>

          <div className="mt-12 bg-indigo-600/20 rounded-3xl p-6 border border-indigo-500/20">
            <p className="text-sm font-bold mb-2">Butuh Bantuan?</p>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">Pelajari cara mengelola konten Nahwu dengan panduan administrator.</p>
            <button className="text-xs font-black uppercase tracking-widest text-indigo-400 hover:text-indigo-300">
              Buka Dokumentasi &rarr;
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
