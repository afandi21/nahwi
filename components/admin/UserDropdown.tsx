'use client'

import { useState } from 'react'
import { User, LogOut, Settings, ChevronDown } from 'lucide-react'
import Link from 'next/link'
import LogoutButton from '@/components/auth/LogoutButton'

interface UserDropdownProps {
  userEmail: string | undefined
}

export default function UserDropdown({ userEmail }: UserDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-4 group"
      >
        <div className="text-right hidden sm:block">
          <p className="text-sm font-bold text-slate-900 leading-none group-hover:text-indigo-600 transition-colors">
            {userEmail?.split('@')[0]}
          </p>
          <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest mt-1">Super Admin</p>
        </div>
        
        <div className="relative">
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 p-[2px] shadow-lg shadow-indigo-200 group-hover:scale-105 transition-transform duration-300">
            <div className="h-full w-full rounded-[14px] bg-white flex items-center justify-center text-indigo-600 font-black">
              {userEmail?.charAt(0).toUpperCase() || 'A'}
            </div>
          </div>
          <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm border border-slate-100">
            <ChevronDown className={`h-3 w-3 text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
          </div>
        </div>
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)} 
          />
          <div className="absolute right-0 mt-4 w-56 bg-white rounded-3xl shadow-2xl border border-slate-100 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-5 border-b border-slate-50 bg-slate-50/50">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Akun Terhubung</p>
              <p className="text-sm font-bold text-slate-900 truncate">{userEmail}</p>
            </div>

            <div className="p-2">
              <Link 
                href="/admin/settings" 
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition-all"
              >
                <Settings className="h-4 w-4" />
                Pengaturan Akun
              </Link>
              
              <div className="h-[1px] bg-slate-50 my-2 mx-2" />
              
              <LogoutButton className="w-full bg-transparent hover:bg-red-50 text-red-600 hover:text-red-700 border-none justify-start px-4 py-3 rounded-2xl text-sm font-bold transition-all" />
            </div>
          </div>
        </>
      )}
    </div>
  )
}
