import React from 'react'

interface ThreePanelLayoutProps {
  panel1: React.ReactNode // Materi
  panel2: React.ReactNode // Input/Keyboard
  panel3: React.ReactNode // Test Suite/Progress
}

export default function ThreePanelLayout({ panel1, panel2, panel3 }: ThreePanelLayoutProps) {
  return (
    <div className="flex flex-col lg:flex-row bg-slate-50">
      {/* Panel 1: Materi (Left) */}
      <aside className="w-full lg:w-1/4 bg-white border-r border-slate-200 p-8">
        {panel1}
      </aside>

      {/* Panel 2: Input & Keyboard (Center/Main) */}
      <main className="flex-1 bg-slate-50 p-8">
        <div className="max-w-4xl mx-auto w-full">
          {panel2}
        </div>
      </main>

      {/* Panel 3: Test Suite & Feedback (Right) */}
      <aside className="w-full lg:w-1/4 bg-white border-l border-slate-200 p-8">
        {panel3}
      </aside>
    </div>
  )
}
