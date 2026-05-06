'use client'

import Link from 'next/link'
import { CheckCircle2, ArrowRight, BookOpen } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function VerifiedPage() {
  const [countdown, setCountdown] = useState(5)

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          window.location.href = '/auth/login'
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4 transition-colors duration-300">
      <div className="max-w-md w-full bg-white dark:bg-slate-900 p-10 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 text-center">

        {/* Animated success icon */}
        <div className="relative mx-auto w-24 h-24 mb-8">
          <div className="absolute inset-0 bg-emerald-100 dark:bg-emerald-900/30 rounded-full animate-ping opacity-30" />
          <div className="relative h-24 w-24 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center shadow-xl shadow-emerald-200 dark:shadow-emerald-900/30">
            <CheckCircle2 className="h-12 w-12 text-white" strokeWidth={2.5} />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-3">
          Email Berhasil Diverifikasi!
        </h1>
        <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-2">
          Akun Anda telah aktif. Sekarang Anda bisa masuk dan mulai belajar Nahwu.
        </p>

        {/* Platform badge */}
        <div className="inline-flex items-center gap-2 bg-indigo-50 dark:bg-indigo-950 border border-indigo-100 dark:border-indigo-900 px-4 py-2 rounded-full text-indigo-600 dark:text-indigo-400 text-xs font-bold mb-8">
          <BookOpen className="h-3.5 w-3.5" />
          Rumah Nahwu — Platform Belajar Nahwu Interaktif
        </div>

        {/* Main CTA */}
        <Link
          href="/auth/login"
          className="flex items-center justify-center gap-2 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-4 px-8 rounded-2xl transition-all shadow-xl shadow-indigo-200 dark:shadow-indigo-900/30 mb-4 text-base group"
        >
          Masuk Sekarang
          <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
        </Link>

        {/* Auto redirect countdown */}
        <p className="text-xs text-slate-400 dark:text-slate-500">
          Dialihkan otomatis dalam{' '}
          <span className="font-bold text-indigo-500 tabular-nums">{countdown}</span>{' '}
          detik...
        </p>

        {/* Progress bar */}
        <div className="mt-3 h-1 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-indigo-500 transition-all duration-1000 ease-linear"
            style={{ width: `${((5 - countdown) / 5) * 100}%` }}
          />
        </div>
      </div>
    </div>
  )
}
