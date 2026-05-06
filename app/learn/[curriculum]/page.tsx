import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { ChevronLeft, Lock, CheckCircle2, PlayCircle, BookOpen, User, Award, Download } from 'lucide-react'
import LogoutButton from '@/components/auth/LogoutButton'
import ThemeToggle from '@/components/ThemeToggle'

type SectionRow = {
  id: string
  title: string
  order_index: number
  challenges: {
    id: string
    title: string
    type: string
    order_index: number
  }[] | null
}

export default async function SectionsPage({ params }: { params: { curriculum: string } }) {
  const supabase = createClient()

  // Fetch curriculum details
  const { data: curriculum } = await supabase
    .from('curriculum')
    .select('id, title')
    .eq('slug', params.curriculum)
    .single()

  // Fetch sections and challenges
  const { data: rawSections, error: sectionsError } = await supabase
    .from('sections')
    .select(`
      id, 
      title, 
      order_index,
      challenges(
        id,
        title,
        type,
        order_index
      )
    `)
    .eq('curriculum_id', curriculum?.id)
    .order('order_index')

  if (sectionsError) {
    console.error('Error fetching sections:', sectionsError)
  }


  // Fetch user progress
  const { data: { user } } = await supabase.auth.getUser()
  const { data: progressData } = await supabase
    .from('user_progress')
    .select('challenge_id, is_completed, completed_at')
    .eq('user_id', user?.id)

  const { data: certificateTemplate } = await supabase
    .from('certificate_templates')
    .select('id')
    .eq('curriculum_id', curriculum?.id)
    .single()

  const completedIds = new Set(progressData?.map(p => p.challenge_id) || [])
  const totalChallengeCount = ((rawSections || []) as SectionRow[])
    .flatMap((section) => section.challenges || [])
    .length
  const completedChallengeCount = progressData?.filter((progress) => progress.is_completed).length || 0
  const curriculumCompleted = totalChallengeCount > 0 && completedChallengeCount >= totalChallengeCount

  // Process sections with gating logic
  let previousCompleted = true
  const displaySections = (rawSections || []).map(section => {
    const challenges = (section.challenges || []).sort((a: any, b: any) => a.order_index - b.order_index).map((challenge: any) => {
      const is_completed = completedIds.has(challenge.id)
      const is_unlocked = previousCompleted
      previousCompleted = is_completed
      return { ...challenge, is_completed, is_unlocked }
    })
    return { ...section, challenges }
  })

  const finalSections = displaySections

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <Link 
          href="/learn" 
          className="inline-flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 font-semibold mb-8 transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          Kembali ke Kurikulum
        </Link>

        <header className="mb-12 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {curriculum?.title || 'Nahwu Dasar'}
            </h1>
            <p className="mt-2 text-slate-600 dark:text-slate-400">Selesaikan setiap bab untuk membuka tantangan berikutnya.</p>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link href="/profile" className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
              <User className="h-6 w-6" />
            </Link>
            <LogoutButton />
          </div>
        </header>

        <div className="mb-10 rounded-[2.5rem] border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-4">
              <div className={`rounded-2xl p-4 ${curriculumCompleted ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                <Award className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-900 dark:text-white">Sertifikat Kurikulum</h2>
                <p className="mt-1 text-sm font-medium text-slate-500 dark:text-slate-400">
                  {curriculumCompleted
                    ? 'Semua materi selesai. Sertifikat siap diunduh.'
                    : `Selesaikan seluruh challenge untuk membuka sertifikat. Progress ${completedChallengeCount}/${totalChallengeCount}.`}
                </p>
              </div>
            </div>

            {curriculumCompleted && certificateTemplate ? (
              <a
                href={`/api/certificates/${params.curriculum}`}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-6 py-3 text-sm font-black text-white shadow-lg shadow-indigo-500/20 transition-all hover:bg-indigo-700"
              >
                <Download className="h-4 w-4" />
                Download Sertifikat
              </a>
            ) : (
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-3 text-sm font-bold text-slate-500">
                {!certificateTemplate ? 'Template sertifikat belum diunggah admin.' : 'Sertifikat masih terkunci.'}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-10">
          {finalSections.map((section: any, sectionIdx: number) => (
            <div key={section.id} className="relative">
              {sectionIdx < finalSections.length - 1 && (
                <div className="absolute left-[27px] top-[60px] bottom-[-40px] w-0.5 bg-slate-200" />
              )}

              <div className="flex items-center gap-4 mb-6">
                <div className="h-14 w-14 rounded-2xl bg-white border-2 border-slate-200 flex items-center justify-center shadow-sm">
                  <BookOpen className="h-6 w-6 text-slate-400" />
                </div>
                <h2 className="text-xl font-bold text-slate-800">{section.title}</h2>
              </div>

              <div className="ml-14 space-y-3">
                {section.challenges.map((challenge: any) => {
                  const content = (
                    <div className="flex items-center justify-between p-4 rounded-2xl border transition-all">
                      <div className="flex items-center gap-4">
                        {challenge.is_completed ? (
                          <CheckCircle2 className="h-6 w-6 text-emerald-500" />
                        ) : !challenge.is_unlocked ? (
                          <Lock className="h-6 w-6 text-slate-300" />
                        ) : (
                          <PlayCircle className="h-6 w-6 text-indigo-500" />
                        )}
                        <div>
                          <h3 className={`font-bold ${
                            !challenge.is_unlocked ? 'text-slate-400' : challenge.is_completed ? 'text-emerald-900' : 'text-slate-700'
                          }`}>
                            {challenge.title}
                          </h3>
                          <span className="text-xs text-slate-400 uppercase tracking-wider font-bold">
                            {challenge.type}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <div className={`text-xs font-bold px-2 py-1 rounded-lg ${
                          challenge.is_completed 
                            ? 'bg-emerald-100 text-emerald-700' 
                            : !challenge.is_unlocked
                              ? 'bg-slate-100 text-slate-400'
                              : 'bg-indigo-100 text-indigo-700'
                        }`}>
                          {challenge.is_completed ? 'Selesai' : !challenge.is_unlocked ? 'Terkunci' : 'Mulai'}
                        </div>
                      </div>
                    </div>
                  )

                  if (!challenge.is_unlocked) {
                    return (
                      <div key={challenge.id} className="cursor-not-allowed opacity-70 bg-slate-50 border-slate-200 rounded-2xl border">
                        {content}
                      </div>
                    )
                  }

                  return (
                    <Link
                      key={challenge.id}
                      href={`/learn/${params.curriculum}/${challenge.id}`}
                      className={`block rounded-2xl transition-all ${
                        challenge.is_completed
                          ? 'bg-emerald-50 border-emerald-100 hover:border-emerald-200'
                          : 'bg-white border-slate-200 hover:border-indigo-200 hover:shadow-md'
                      }`}
                    >
                      {content}
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}

          {finalSections.length === 0 && (
            <div className="text-center py-20 bg-white rounded-[2.5rem] border border-dashed border-slate-200">
              <BookOpen className="h-12 w-12 text-slate-200 mx-auto mb-4" />
              <p className="text-slate-400 font-medium">Belum ada materi tersedia untuk kurikulum ini.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
