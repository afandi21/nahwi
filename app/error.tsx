'use client'

import { useEffect } from 'react'
import { AlertCircle, RotateCcw, Home } from 'lucide-react'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 px-4 text-center">
      <div className="bg-red-50 p-6 rounded-full mb-8">
        <AlertCircle className="h-16 w-16 text-red-600" />
      </div>
      
      <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
        Oops! Ada Masalah
      </h1>
      
      <p className="text-lg text-slate-600 max-w-md mx-auto mb-10 leading-relaxed">
        Terjadi kesalahan saat memproses permintaan Anda. Hal ini bisa terjadi karena koneksi terputus atau masalah server.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
        <button
          onClick={() => reset()}
          className="flex items-center gap-2 bg-indigo-600 text-white px-8 py-4 rounded-2xl text-lg font-bold hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100"
        >
          <RotateCcw className="h-5 w-5" />
          Coba Lagi
        </button>
        <Link 
          href="/"
          className="flex items-center gap-2 bg-white text-slate-600 px-8 py-4 rounded-2xl text-lg font-bold border border-slate-200 hover:bg-slate-50 transition-all"
        >
          <Home className="h-5 w-5" />
          Kembali Beranda
        </Link>
      </div>
      
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-12 p-4 bg-slate-100 rounded-xl text-left font-mono text-xs text-slate-500 overflow-auto max-w-2xl">
          {error.message}
        </div>
      )}
    </div>
  )
}
