'use client'

import { Loader2 } from 'lucide-react'

export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-4">
      <div className="relative">
        <div className="h-16 w-16 border-4 border-slate-200 rounded-full" />
        <Loader2 className="h-16 w-16 text-indigo-600 animate-spin absolute top-0 left-0" />
      </div>
      <p className="text-slate-500 font-medium animate-pulse">Memuat konten Nahwi...</p>
    </div>
  )
}
