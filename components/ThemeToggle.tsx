'use client'

import { useEffect, useState } from "react"
import { Sun, Moon } from "lucide-react"
import { useTheme } from "next-themes"

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false)
  const { resolvedTheme, setTheme } = useTheme()

  // Mencegah hydration mismatch
  useEffect(() => setMounted(true), [])
  if (!mounted) return null

  return (
    <button 
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500"
      aria-label="Toggle Theme"
    >
      {resolvedTheme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </button>
  )
}
