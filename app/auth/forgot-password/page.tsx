'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { Mail, Loader2, KeyRound, CheckCircle2 } from 'lucide-react'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const supabase = createClient()

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    })

    if (resetError) {
      setError(resetError.message)
    } else {
      setSuccess(true)
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4 transition-colors duration-300">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-amber-500 rounded-xl flex items-center justify-center mb-4">
            <KeyRound className="h-6 w-6 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Lupa Password?</h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Kami akan mengirimkan instruksi untuk mengatur ulang password Anda.
          </p>
        </div>

        {success ? (
          <div className="text-center space-y-6 mt-8">
            <div className="flex justify-center">
              <CheckCircle2 className="h-16 w-16 text-emerald-500" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Cek Email Anda</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                Instruksi reset password telah dikirimkan ke <br/>
                <span className="font-semibold text-slate-900 dark:text-white">{email}</span>
              </p>
            </div>
            <Link 
              href="/auth/login"
              className="block w-full flex items-center justify-center py-3 px-4 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm text-sm font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            >
              Kembali ke Login
            </Link>
          </div>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleReset}>
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-lg text-sm border border-red-100 dark:border-red-900/30">
                {error}
              </div>
            )}
            
            <div className="space-y-4">
              <div className="relative">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1 block">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
                    placeholder="name@example.com"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-slate-900 transition-colors disabled:opacity-70"
            >
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Kirim Link Reset'}
            </button>

            <div className="text-center text-sm">
              <Link href="/auth/login" className="font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500">
                &larr; Kembali ke Login
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
