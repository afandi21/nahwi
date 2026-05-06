'use client'

import { useState, useEffect } from 'react'
import { Bell, UserPlus, HelpCircle, CheckCircle2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState<any[]>([])
  const [hasUnread, setHasUnread] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function fetchNotifications() {
      // Mock notifications based on real potential events
      // In a real app, you'd have a 'notifications' table
      // Here we'll fetch latest profiles and challenges as "events"
      
      const { data: newUsers } = await supabase
        .from('profiles')
        .select('full_name, email, created_at')
        .order('created_at', { ascending: false })
        .limit(3)

      const formatted = (newUsers || []).map(u => ({
        id: u.email,
        title: 'Siswa Baru Bergabung',
        desc: `${u.full_name || u.email} baru saja mendaftar.`,
        time: new Date(u.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        icon: UserPlus,
        color: 'text-emerald-500',
        bg: 'bg-emerald-50'
      }))

      setNotifications(formatted)
    }

    fetchNotifications()
  }, [])

  return (
    <div className="relative">
      <button 
        onClick={() => {
          setIsOpen(!isOpen)
          setHasUnread(false)
        }}
        className={`p-2.5 rounded-xl transition-all relative ${
          isOpen ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'text-slate-400 hover:text-indigo-600 hover:bg-indigo-50'
        }`}
      >
        <Bell className="h-5 w-5" />
        {hasUnread && (
          <span className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full border-2 border-white animate-bounce" />
        )}
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)} 
          />
          <div className="absolute right-0 mt-4 w-80 bg-white rounded-3xl shadow-2xl border border-slate-100 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-50 flex items-center justify-between">
              <h3 className="font-black text-slate-900">Notifikasi</h3>
              <span className="text-[10px] font-black bg-indigo-50 text-indigo-600 px-2 py-1 rounded-full uppercase tracking-widest">
                {notifications.length} Baru
              </span>
            </div>

            <div className="max-h-[400px] overflow-y-auto">
              {notifications.length > 0 ? (
                notifications.map((n, i) => (
                  <div key={i} className="p-5 hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0 flex gap-4">
                    <div className={`h-10 w-10 shrink-0 rounded-xl ${n.bg} flex items-center justify-center`}>
                      <n.icon className={`h-5 w-5 ${n.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-slate-900 truncate">{n.title}</p>
                      <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{n.desc}</p>
                      <p className="text-[10px] text-slate-400 font-medium mt-2">{n.time}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-12 text-center">
                  <Bell className="h-8 w-8 text-slate-200 mx-auto mb-3" />
                  <p className="text-sm text-slate-400 font-medium italic">Tidak ada notifikasi baru.</p>
                </div>
              )}
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 text-center">
              <button className="text-xs font-black text-indigo-600 hover:text-indigo-700 uppercase tracking-widest">
                Lihat Semua Aktivitas
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
