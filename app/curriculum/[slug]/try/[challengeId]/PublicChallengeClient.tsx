'use client'

import { useState } from 'react'
import ThreePanelLayout from '@/components/learn/ThreePanelLayout'
import MateriPanel from '@/components/learn/MateriPanel'
import InputPanel from '@/components/learn/InputPanel'
import TestSuite from '@/components/learn/TestSuite'
import { Challenge } from '@/types'
import { ArrowRight, ChevronLeft, Lock, Sparkles, X } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function PublicChallengeClient({
  challenge,
  curriculumSlug,
  challengeGlobalIndex,
  isLastFree,
}: {
  challenge: Challenge
  curriculumSlug: string
  challengeGlobalIndex: number
  isLastFree: boolean
}) {
  const [userAnswer, setUserAnswer] = useState('')
  const [isPassed, setIsPassed] = useState(false)
  const [showPaywall, setShowPaywall] = useState(false)
  const router = useRouter()

  const handleNext = () => {
    if (!isPassed) return
    if (isLastFree) {
      // Show paywall modal instead of navigating
      setShowPaywall(true)
    } else {
      router.push(`/curriculum/${curriculumSlug}`)
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      {/* Header */}
      <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-50 flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-4">
          <Link
            href={`/curriculum/${curriculumSlug}`}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500 dark:text-slate-400 transition-colors"
          >
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <div className="h-4 w-[1px] bg-slate-200 dark:bg-slate-700" />
          <h1 className="text-sm font-bold text-slate-700 dark:text-slate-300 truncate max-w-[200px]">
            {challenge.title}
          </h1>
        </div>

        {/* Progress bar */}
        <div className="flex-1 max-w-md mx-8">
          <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-500 transition-all"
              style={{ width: `${(challengeGlobalIndex / 3) * 100}%` }}
            />
          </div>
        </div>

        {/* Free badge + Next button */}
        <div className="flex items-center gap-3">
          <span className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-3 py-1.5 rounded-xl">
            <Sparkles className="h-3 w-3" />
            Gratis {challengeGlobalIndex}/3
          </span>
          <button
            onClick={handleNext}
            disabled={!isPassed}
            className={`flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-bold transition-all ${
              isPassed
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-indigo-900/20 hover:bg-indigo-700'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
            }`}
          >
            {isLastFree ? 'Selesai' : 'Lanjut'}
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </header>

      {/* Main Challenge Content */}
      <div className="flex-1 overflow-hidden">
        <ThreePanelLayout
          panel1={
            <MateriPanel
              title={challenge.title}
              content={challenge.materi_text}
              sentence={challenge.arabic_sentence}
              translation={challenge.translation}
            />
          }
          panel2={
            <InputPanel
              value={userAnswer}
              onChange={setUserAnswer}
              placeholder="Berikan harakat pada kalimat di samping..."
            />
          }
          panel3={
            <TestSuite
              userAnswer={userAnswer}
              tests={challenge.tests}
              validAnswers={challenge.valid_answers}
              challengeType={challenge.type}
              onPassAll={setIsPassed}
            />
          }
        />
      </div>

      {/* === PAYWALL MODAL === */}
      {showPaywall && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="relative bg-white dark:bg-slate-900 rounded-3xl shadow-2xl max-w-md w-full p-8 text-center animate-in fade-in zoom-in-95 duration-300">
            {/* Close button */}
            <button
              onClick={() => setShowPaywall(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Lock icon */}
            <div className="mx-auto h-20 w-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-indigo-200 dark:shadow-indigo-900/30">
              <Lock className="h-10 w-10 text-white" />
            </div>

            <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">
              Luar biasa! 🎉
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-2 font-medium">
              Kamu telah menyelesaikan 3 tantangan gratis!
            </p>
            <p className="text-slate-500 dark:text-slate-500 text-sm mb-8 leading-relaxed">
              Untuk melanjutkan ke tantangan berikutnya dan melacak progres belajarmu, daftar akun gratis sekarang.
            </p>

            <div className="space-y-3">
              <Link
                href={`/auth/register?from=/learn/${curriculumSlug}`}
                className="block w-full bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 dark:shadow-indigo-900/30"
              >
                Buat Akun Gratis Sekarang →
              </Link>
              <Link
                href={`/auth/login?from=/learn/${curriculumSlug}`}
                className="block w-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-8 py-4 rounded-2xl font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
              >
                Sudah punya akun? Masuk
              </Link>
              <button
                onClick={() => setShowPaywall(false)}
                className="block w-full text-slate-400 dark:text-slate-500 text-sm py-2 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
              >
                Kembali ke preview kurikulum
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
