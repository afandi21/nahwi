import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import React from 'react'
import { 
  BookOpen, 
  Search, 
  Menu,
} from 'lucide-react'
import Link from 'next/link'

import AdminSidebar from '@/components/admin/AdminSidebar'
import NotificationBell from '@/components/admin/NotificationBell'
import UserDropdown from '@/components/admin/UserDropdown'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()

  if (user && user.app_metadata?.role !== 'admin') {
    redirect('/learn')
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex font-sans transition-colors duration-300">
      {/* Dynamic Client Sidebar */}
      <AdminSidebar />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Modern Header */}
        <header className="h-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-10 shrink-0 z-10">
          <div className="flex items-center gap-8 flex-1">
            <button className="lg:hidden p-2 text-slate-500 dark:text-slate-400">
              <Menu className="h-6 w-6" />
            </button>
            <div className="relative max-w-md w-full hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Cari kurikulum atau peserta..." 
                className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-2xl py-2.5 pl-10 pr-4 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <NotificationBell />
            
            <div className="h-8 w-[1px] bg-slate-200 dark:bg-slate-700" />
            
            <UserDropdown userEmail={user?.email} />
          </div>
        </header>

        {/* Content Wrapper */}
        <div className="flex-1 overflow-y-auto p-10 bg-slate-50 dark:bg-slate-950">
          {children}
        </div>
      </main>
    </div>
  )
}
