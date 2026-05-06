'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  BookOpen, 
  Layers, 
  Users, 
  Settings, 
  Award,
  ChevronRight,
} from 'lucide-react'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function AdminSidebar() {
  const pathname = usePathname()
  const [logoUrl, setLogoUrl] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    async function loadLogo() {
      const { data } = await supabase
        .from('site_settings')
        .select('logo_url')
        .eq('id', 'main')
        .single()
      if (data?.logo_url) setLogoUrl(data.logo_url)
    }
    loadLogo()
  }, [])

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/admin' },
    { icon: BookOpen, label: 'Kurikulum', href: '/admin/curriculum' },
    { icon: Layers, label: 'Materi & Soal', href: '/admin/challenges' },
    { icon: Award, label: 'Kelola Sertifikat', href: '/admin/certificates' },
    { icon: Users, label: 'Peserta', href: '/admin/users' },
    { icon: Settings, label: 'Pengaturan', href: '/admin/settings' },
  ]

  return (
    <aside className="w-72 bg-slate-900 dark:bg-slate-900 text-white shrink-0 hidden lg:flex flex-col shadow-2xl z-20 border-r border-slate-800">
      <div className="p-8">
        <div className="flex items-center gap-4">
          {logoUrl ? (
            <img src={logoUrl} alt="Logo" className="h-16 w-auto object-contain rounded-xl" />
          ) : (
            <div className="bg-indigo-600 p-3 rounded-xl shadow-lg shadow-indigo-500/20 shrink-0">
              <BookOpen className="h-8 w-8 text-white" />
            </div>
          )}
          <div>
            <h2 className="text-xl font-black tracking-tight leading-tight text-white">Rumah Nahwu</h2>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1 block">Admin Control</span>
          </div>
        </div>
      </div>

      <nav className="flex-1 mt-4 px-4 space-y-1">
        {navItems.map((item) => {
          const isActive = item.href === '/admin' 
            ? pathname === '/admin' 
            : pathname.startsWith(item.href)

          return (
            <Link 
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all group ${
                isActive 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' 
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <item.icon className={`h-5 w-5 ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-indigo-400 transition-colors'}`} />
                <span className="font-bold text-sm">{item.label}</span>
              </div>
              {isActive && <ChevronRight className="h-4 w-4 opacity-50" />}
            </Link>
          )
        })}
      </nav>

      <div className="p-6 mt-auto">
        <div className="bg-slate-800/50 rounded-3xl p-6 border border-slate-700/50">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Sistem</p>
          <div className="flex items-center gap-3">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-medium text-slate-300">Server Terkoneksi</span>
          </div>
        </div>
      </div>
    </aside>
  )
}
