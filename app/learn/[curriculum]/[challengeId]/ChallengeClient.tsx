'use client'

import { useState } from 'react'
import ThreePanelLayout from '@/components/learn/ThreePanelLayout'
import MateriPanel from '@/components/learn/MateriPanel'
import InputPanel from '@/components/learn/InputPanel'
import TestSuite from '@/components/learn/TestSuite'
import { Challenge } from '@/types'
import { ArrowRight, ChevronLeft, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { saveProgress } from '@/app/actions/progress'
import { useRouter } from 'next/navigation'
import ThemeToggle from '@/components/ThemeToggle'

export default function ChallengeClient({ 
  challenge, 
  curriculumSlug 
}: { 
  challenge: Challenge, 
  curriculumSlug: string 
}) {
  const [userAnswer, setUserAnswer] = useState('')
  const [isPassed, setIsPassed] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const router = useRouter()

  const handleNext = async () => {
    if (!isPassed) return
    
    setIsSaving(true)
    const result = await saveProgress(challenge.id, userAnswer)
    
    if (result.success) {
      router.push(`/learn/${curriculumSlug}`)
      router.refresh()
    } else {
      alert('Gagal menyimpan progress: ' + result.error)
      setIsSaving(false)
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      {/* Header */}
      <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md sticky top-0 z-50 flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-4">
          <Link href={`/learn/${curriculumSlug}`} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500 dark:text-slate-400 transition-colors">
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <div className="h-4 w-[1px] bg-slate-200 dark:bg-slate-700" />
          <h1 className="text-sm font-bold text-slate-700 dark:text-slate-300 truncate max-w-[200px]">
            {challenge.title}
          </h1>
        </div>
       
        <div className="flex-1 max-w-md mx-8 flex items-center gap-4">
          <div className="flex-1 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-indigo-500 w-1/3 transition-all" />
          </div>
          <ThemeToggle />
        </div>

        <button 
          onClick={handleNext}
          disabled={!isPassed || isSaving}
          className={`flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-bold transition-all ${
            isPassed 
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-indigo-950/20 hover:bg-indigo-700' 
              : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed'
          }`}
        >
         {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Lanjut'}
          {!isSaving && <ArrowRight className="h-4 w-4" />}
        </button>
      </header>

      {/* Main Content */}
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
    </div>
  )
}
