'use client'

import React, { useMemo } from 'react'
import { CheckCircle2, XCircle, HelpCircle } from 'lucide-react'
import { TestAssertion, ChallengeType } from '@/types'
import { runTests } from '@/lib/test-runner'

interface TestSuiteProps {
  userAnswer: string
  tests: TestAssertion[]
  validAnswers: string[]
  challengeType: ChallengeType
  onPassAll?: (isAllPassed: boolean) => void
}

export default function TestSuite({
  userAnswer,
  tests,
  validAnswers,
  challengeType,
  onPassAll
}: TestSuiteProps) {
  const results = useMemo(() => {
    const res = runTests(userAnswer, tests, validAnswers, challengeType)
    const allPassed = res.length > 0 && res.every(r => r.passed)
    onPassAll?.(allPassed)
    return res
  }, [userAnswer, tests, validAnswers, challengeType, onPassAll])

  return (
    <div className="space-y-6">
      <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
        Test Results
      </h3>
      
      <div className="space-y-3">
        {results.map((result) => (
          <div 
            key={result.id}
            className={`flex items-start gap-3 p-4 rounded-xl border transition-all ${
              userAnswer === '' 
                ? 'bg-slate-50 border-slate-200' 
                : result.passed 
                  ? 'bg-emerald-50 border-emerald-100' 
                  : 'bg-red-50 border-red-100'
            }`}
          >
            <div className="mt-0.5">
              {userAnswer === '' ? (
                <HelpCircle className="h-5 w-5 text-slate-300" />
              ) : result.passed ? (
                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
              ) : (
                <XCircle className="h-5 w-5 text-red-400" />
              )}
            </div>
            
            <div className="flex-1">
              <p className={`text-sm font-medium ${
                userAnswer === '' 
                  ? 'text-slate-500' 
                  : result.passed 
                    ? 'text-emerald-700' 
                    : 'text-red-700'
              }`}>
                {result.description}
              </p>
            </div>
          </div>
        ))}

        {results.length === 0 && (
          <p className="text-slate-400 text-sm italic">
            Tidak ada test yang didefinisikan untuk tantangan ini.
          </p>
        )}
      </div>

      {userAnswer !== '' && results.every(r => r.passed) && results.length > 0 && (
        <div className="bg-emerald-500 text-white p-4 rounded-xl shadow-lg shadow-emerald-200 animate-bounce text-center font-bold">
          ✨ Semua Test Berhasil!
        </div>
      )}
    </div>
  )
}
