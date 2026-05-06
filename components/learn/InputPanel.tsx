'use client'

import React, { useRef } from 'react'
import ArabicKeyboard from './ArabicKeyboard'

interface InputPanelProps {
  value: string
  onChange: (newValue: string) => void
  placeholder?: string
}

export default function InputPanel({ value, onChange, placeholder = 'Ketik jawaban Anda di sini...' }: InputPanelProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleKeyPress = (char: string) => {
    const input = inputRef.current
    if (!input) return

    const start = input.selectionStart || 0
    const end = input.selectionEnd || 0
    
    const newValue = value.substring(0, start) + char + value.substring(end)
    onChange(newValue)
    
    // Set cursor position after React re-render
    setTimeout(() => {
      input.setSelectionRange(start + char.length, start + char.length)
      input.focus()
    }, 0)
  }

  const handleDelete = () => {
    const input = inputRef.current
    if (!input) return

    const start = input.selectionStart || 0
    const end = input.selectionEnd || 0

    let newValue = value
    let newPos = start

    if (start !== end) {
      // Delete selection
      newValue = value.substring(0, start) + value.substring(end)
      newPos = start
    } else if (start > 0) {
      // Delete one character before cursor
      newValue = value.substring(0, start - 1) + value.substring(start)
      newPos = start - 1
    }

    onChange(newValue)
    
    setTimeout(() => {
      input.setSelectionRange(newPos, newPos)
      input.focus()
    }, 0)
  }

  const handleClear = () => {
    onChange('')
    inputRef.current?.focus()
  }

  const [showKeyboard, setShowKeyboard] = React.useState(true)

  return (
    <div className="flex flex-col gap-8 w-full max-w-2xl mx-auto pb-10">
      {/* Input Field Container */}
      <div className="relative group">
        <div className="absolute inset-0 bg-indigo-500/5 blur-2xl rounded-full -z-10 opacity-0 group-focus-within:opacity-100 transition-opacity" />
        
        <input
          ref={inputRef}
          type="text"
          dir="rtl"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-white dark:bg-slate-900 py-12 px-8 rounded-3xl shadow-sm border-2 border-slate-200 dark:border-slate-800 focus:border-indigo-500 dark:focus:border-indigo-400 outline-none text-5xl font-arabic text-slate-900 dark:text-white leading-[2.5] text-center transition-all placeholder:text-slate-300 dark:placeholder:text-slate-700 placeholder:text-lg placeholder:font-sans placeholder:italic"
        />
        
        {/* Floating Label for guidance */}
        <div className="absolute -top-3 left-6 px-2 bg-slate-50 dark:bg-slate-950 text-[10px] font-bold text-slate-400 dark:text-slate-600 uppercase tracking-[0.2em]">
          Area Input Arab
        </div>

        {/* Toggle Keyboard Button */}
        <button
          onClick={() => setShowKeyboard(!showKeyboard)}
          className={`absolute bottom-4 right-4 p-2 rounded-xl transition-all ${
            showKeyboard ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500'
          }`}
          title={showKeyboard ? "Sembunyikan Keyboard" : "Tampilkan Keyboard"}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2" ry="2"/><path d="M6 8h.01"/><path d="M10 8h.01"/><path d="M14 8h.01"/><path d="M18 8h.01"/><path d="M6 12h.01"/><path d="M18 12h.01"/><path d="M10 12h.01"/><path d="M14 12h.01"/><path d="M6 16h.01"/><path d="M18 16h.01"/><rect width="8" height="2" x="8" y="16" rx="1"/></svg>
        </button>
      </div>

      {/* Keyboard Interface */}
      {showKeyboard && (
        <div className="animate-in fade-in slide-in-from-top-4 duration-300">
          <ArabicKeyboard 
            onKeyPress={handleKeyPress}
            onDelete={handleDelete}
            onClear={handleClear}
          />
        </div>
      )}

      <div className="flex justify-between text-[10px] font-bold text-slate-400 dark:text-slate-600 px-4 uppercase tracking-wider">
        <div className="flex items-center gap-2">
          <div className={`h-1.5 w-1.5 rounded-full ${showKeyboard ? 'bg-indigo-500 animate-pulse' : 'bg-slate-300 dark:bg-slate-800'}`} />
          {showKeyboard ? 'Virtual Keyboard Aktif' : 'Keyboard Disembunyikan'}
        </div>
        <span>{value.length} Karakter Terinput</span>
      </div>
    </div>

  )
}
