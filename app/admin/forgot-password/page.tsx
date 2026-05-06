'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { ShieldAlert, Mail, Loader2, ArrowRight, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'

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
    
    // The redirectTo URL should be the page where users actually type their new password
    // Usually this is handled by Supabase redirecting to a page that calls updateUser()
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/admin/reset-password`,
    })

    if (resetError) {
      setError(resetError.message)
    } else {
      setSuccess(true)
    }
    
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center h-20 w-20 rounded-3xl bg-amber-500 text-white mb-6 shadow-2xl shadow-amber-500/20">
            <ShieldAlert className="h-10 w-10" />
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">Lupa Password</h1>
          <p className="text-slate-400 mt-2">Masukkan email Anda untuk mereset password</p>
        </div>

        <div className="bg-slate-800 p-8 rounded-[2rem] border border-slate-700 shadow-2xl">
          {success ? (
            <div className="text-center space-y-6">
              <div className="flex justify-center">
                <CheckCircle2 className="h-16 w-16 text-emerald-500" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Email Terkirim!</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Kami telah mengirimkan instruksi reset password ke <br/>
                  <span className="text-white font-medium">{email}</span>
                </p>
              </div>
              <Link 
                href="/admin/login"
                className="block w-full bg-slate-700 hover:bg-slate-600 text-white font-bold py-4 rounded-2xl transition-all"
              >
                Kembali ke Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleReset} className="space-y-6">
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-2xl text-sm font-medium">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-900/50 border border-slate-700 text-white pl-12 pr-4 py-4 rounded-2xl focus:ring-2 focus:ring-amber-500 outline-none transition-all placeholder:text-slate-600"
                    placeholder="admin@nahwi.com"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-4 rounded-2xl transition-all shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    Kirim Link Reset
                    <ArrowRight className="h-5 w-5" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        <div className="mt-8 text-center">
          <Link href="/admin/login" className="text-slate-500 hover:text-slate-300 text-sm font-medium transition-colors">
            &larr; Kembali ke Login
          </Link>
        </div>
      </div>
    </div>
  )
}
