'use client'

import React from 'react'

interface ArabicKeyboardProps {
  onKeyPress: (char: string) => void
  onDelete: () => void
  onClear: () => void
}

export default function ArabicKeyboard({ onKeyPress, onDelete, onClear }: ArabicKeyboardProps) {
  // Arabic Letters (Hijaiyah)
  const letters = [
    ['ذ', 'ض', 'ص', 'ث', 'ق', 'ف', 'غ', 'ع', 'ه', 'خ', 'ح', 'ج', 'د'],
    ['ش', 'س', 'ي', 'ب', 'ل', 'ا', 'ت', 'ن', 'م', 'ك', 'ط'],
    ['ئ', 'ء', 'ؤ', 'ر', 'لا', 'ى', 'ة', 'و', 'ز', 'ظ']
  ]

  // Harakat (Diacritics)
  const harakat = [
    { char: '\u064E', name: 'Fathah' },
    { char: '\u064F', name: 'Dhammah' },
    { char: '\u0650', name: 'Kasrah' },
    { char: '\u064B', name: 'Fathatain' },
    { char: '\u064C', name: 'Dhammatain' },
    { char: '\u064D', name: 'Kasratain' },
    { char: '\u0651', name: 'Syaddah' },
    { char: '\u0652', name: 'Sukun' },
  ]

  return (
    <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-inner border border-slate-200 dark:border-slate-800 select-none" dir="rtl">
      {/* Harakat Row */}
      <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2 mb-4 border-b border-slate-100 dark:border-slate-800 pb-4">
        {harakat.map((h, i) => (
          <button
            key={i}
            onClick={() => onKeyPress(h.char)}
            className="w-9 h-11 sm:w-10 sm:h-12 flex items-center justify-center text-xl sm:text-2xl font-arabic bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-400 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900 active:scale-95 transition-all border border-indigo-100 dark:border-indigo-900"
            title={h.name}
          >
            {/* Displaying harakat on a placeholder alef for visibility */}
            <span className="relative">
              ا<span className="absolute inset-0 flex items-center justify-center text-indigo-500 dark:text-indigo-400">{h.char}</span>
            </span>
          </button>
        ))}
      </div>

      {/* Letter Rows */}
      <div className="space-y-2">
        {letters.map((row, rowIndex) => (
          <div key={rowIndex} className="flex flex-wrap justify-center gap-1.5 sm:gap-2">
            {row.map((char) => (
              <button
                key={char}
                onClick={() => onKeyPress(char)}
                className="w-9 h-11 sm:w-10 sm:h-12 flex items-center justify-center text-lg sm:text-xl font-arabic bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-200 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-95 transition-all border border-slate-200 dark:border-slate-700"
              >
                {char}
              </button>
            ))}
            {/* Special buttons on the last row */}
            {rowIndex === 2 && (
              <div className="flex gap-1.5 sm:gap-2 w-full sm:w-auto justify-center mt-2 sm:mt-0">
                <button
                  onClick={onDelete}
                  className="px-3 sm:px-4 h-11 sm:h-12 flex items-center justify-center text-xs sm:text-sm font-semibold bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900 active:scale-95 transition-all border border-red-100 dark:border-red-900"
                >
                  Hapus
                </button>
                <button
                  onClick={onClear}
                  className="px-3 sm:px-4 h-11 sm:h-12 flex items-center justify-center text-xs sm:text-sm font-semibold bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 active:scale-95 transition-all border border-slate-300 dark:border-slate-700"
                >
                  Bersih
                </button>
              </div>
            )}
          </div>
        ))}
        {/* Space bar row */}
        <div className="flex justify-center mt-2">
          <button
            onClick={() => onKeyPress(' ')}
            className="w-2/3 h-12 flex items-center justify-center text-sm font-semibold bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-95 transition-all border border-slate-200 dark:border-slate-700"
          >
            Spasi
          </button>
        </div>
      </div>
    </div>

  )
}
