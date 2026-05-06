import { createClient } from '@/lib/supabase/server'
import { 
  Users, 
  Search, 
  Filter, 
  Trophy, 
  BookOpen, 
  Clock, 
  ChevronRight,
  MoreVertical,
  Mail,
  UserCircle
} from 'lucide-react'

export default async function AdminUsers() {
  const supabase = createClient()

  // 1. Fetch Total Challenges for progress calculation
  const { count: totalChallenges } = await supabase
    .from('challenges')
    .select('*', { count: 'exact', head: true })

  // 2. Fetch Real Profiles and their progress
  const { data: participants } = await supabase
    .from('profiles')
    .select(`
      *,
      user_progress(is_completed)
    `)
    .order('updated_at', { ascending: false })

  const processedUsers = (participants || []).map(u => {
    const completedCount = u.user_progress?.filter((p: any) => p.is_completed).length || 0
    const progressPercent = totalChallenges ? Math.round((completedCount / totalChallenges) * 100) : 0
    
    return {
      ...u,
      challengesDone: completedCount,
      progress: progressPercent,
      lastActive: u.updated_at ? new Date(u.updated_at).toLocaleDateString('id-ID') : 'Belum aktif'
    }
  })

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">Peserta Belajar</h2>
          <p className="text-slate-500 mt-2 font-medium">Pantau aktivitas dan progres belajar seluruh pengguna secara real-time.</p>
        </div>
        <div className="flex gap-3">
          <div className="bg-white px-6 py-3 rounded-2xl border border-slate-200 flex items-center gap-3 shadow-sm">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-sm font-bold text-slate-700">{processedUsers.length} Siswa Terdaftar</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-100 flex flex-col md:flex-row gap-4 items-center justify-between bg-slate-50/50">
          <div className="relative flex-1 max-w-md w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Cari email atau nama siswa..."
              className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all"
            />
          </div>
          <button className="px-6 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-600 flex items-center gap-2 hover:bg-slate-50 transition-all shadow-sm">
            <Filter className="h-4 w-4" />
            Urutkan
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Identitas Peserta</th>
                <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Progres Belajar</th>
                <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Terakhir Update</th>
                <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Detail</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {processedUsers.map((user) => (
                <tr key={user.id} className="hover:bg-indigo-50/30 transition-colors group">
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-6">
                      <div className="h-14 w-14 bg-indigo-50 rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300">
                        <UserCircle className="h-7 w-7 text-indigo-400" />
                      </div>
                      <div>
                        <p className="font-black text-slate-900 text-lg leading-none mb-2">{user.full_name || 'Tanpa Nama'}</p>
                        <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
                          <Mail className="h-3 w-3" />
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-8">
                    <div className="space-y-2">
                      <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-wider">
                        <span>{user.challengesDone} / {totalChallenges} Selesai</span>
                        <span>{user.progress}%</span>
                      </div>
                      <div className="w-48 h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-indigo-500 rounded-full transition-all duration-1000" 
                          style={{ width: `${user.progress}%` }} 
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-2 text-sm font-bold text-slate-600">
                      <Clock className="h-4 w-4 text-slate-300" />
                      {user.lastActive}
                    </div>
                  </td>
                  <td className="px-10 py-8 text-right">
                    <button className="p-3 text-slate-400 hover:text-indigo-600 hover:bg-white rounded-xl transition-all shadow-sm border border-transparent hover:border-slate-100">
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
              {processedUsers.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-10 py-24 text-center">
                    <div className="max-w-xs mx-auto">
                      <Users className="h-12 w-12 text-slate-200 mx-auto mb-4" />
                      <p className="text-slate-400 font-bold italic">Belum ada peserta yang mendaftar.</p>
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
