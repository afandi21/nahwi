import React from 'react'

interface MateriPanelProps {
  title: string
  content: string
  sentence: string
  translation?: string
}

export default function MateriPanel({ title, content, sentence, translation }: MateriPanelProps) {
  return (
    <div className="prose prose-slate dark:prose-invert max-w-none">
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">{title}</h2>
      <div className="text-slate-600 dark:text-slate-400 leading-relaxed mb-8 whitespace-pre-wrap">
        {content}
      </div>

      <div className="bg-indigo-50 dark:bg-indigo-950/40 rounded-2xl p-6 border border-indigo-100 dark:border-indigo-900/50">
        <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mb-4">
          Tantangan
        </h3>
        <p className="text-3xl font-arabic text-slate-900 dark:text-white mb-2 leading-[2]" dir="rtl">
          {sentence}
        </p>
        {translation && (
          <p className="text-sm text-slate-500 dark:text-slate-500 italic mt-2">
            "{translation}"
          </p>
        )}
      </div>
    </div>

  )
}
