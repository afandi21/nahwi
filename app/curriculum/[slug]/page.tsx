import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { ChevronLeft, Lock, PlayCircle, BookOpen, CheckCircle2, ArrowRight, Star, Sparkles } from 'lucide-react'
import { notFound, redirect } from 'next/navigation'

const FREE_CHALLENGE_LIMIT = 3

export default async function PublicCurriculumDetailPage({ params }: { params: { slug: string } }) {
  const supabase = createClient()

  // Jika sudah login, redirect ke /learn/[slug] yang punya progress tracking
  const { data: { user } } = await supabase.auth.getUser()
  if (user) redirect(`/learn/${params.slug}`)

  // Fetch curriculum
  const { data: curriculum } = await supabase
    .from('curriculum')
    .select('id, title, description, slug')
    .eq('slug', params.slug)
    .eq('is_published', true)
    .single()

  if (!curriculum) notFound()

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
    .eq('curriculum_id', curriculum.id)
    .order('order_index')

  if (sectionsError) {
    console.error('Error fetching sections:', sectionsError)
  }


  const { data: settings } = await supabase
    .from('site_settings')
    .select('site_name, logo_url')
    .eq('id', 'main')
    .single()

  const siteName = settings?.site_name || 'Rumah Nahwu'

  // Number challenges globally to apply the 3-free rule across all sections
  let globalChallengeIndex = 0
  const sections = (rawSections || []).map((section: any) => {
    const challenges = (section.challenges || [])
      .sort((a: any, b: any) => a.order_index - b.order_index)
      .map((challenge: any) => {
        globalChallengeIndex++
        const isFree = globalChallengeIndex <= FREE_CHALLENGE_LIMIT
        return { ...challenge, isFree, globalIndex: globalChallengeIndex }
      })
    return { ...section, challenges }
  })

  const totalChallenges = globalChallengeIndex
  const freeChallenges = Math.min(FREE_CHALLENGE_LIMIT, totalChallenges)

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      {/* Navbar */}
      <nav className="border-b border-slate-100 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/curriculum" className="flex items-center gap-2 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-semibold text-sm transition-colors">
            <ChevronLeft className="h-4 w-4" />
            Semua Kurikulum
          </Link>
          <div className="flex items-center gap-3">
            {user ? (
              <Link href="/learn" className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all">
                Lanjut Belajar
              </Link>
            ) : (
              <>
                <Link href="/auth/login" className="text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Masuk
                </Link>
                <Link href="/auth/register" className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all">
                  Daftar Gratis
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-3">
            {curriculum.title}
          </h1>
          {curriculum.description && (
            <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed max-w-2xl">
              {curriculum.description}
            </p>
          )}

          {/* Free preview banner */}
          {!user && (
            <div className="mt-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-100 dark:border-indigo-900 p-4 rounded-2xl">
              <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-400">
                <Star className="h-5 w-5 fill-indigo-500" />
                <span className="font-bold text-sm">{freeChallenges} tantangan pertama gratis!</span>
              </div>
              <span className="text-slate-400 text-sm hidden sm:block">|</span>
              <span className="text-slate-600 dark:text-slate-400 text-sm">
                Tantangan ke-{FREE_CHALLENGE_LIMIT + 1} dan seterusnya memerlukan akun.
              </span>
              <Link href="/auth/register" className="ml-auto text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 flex items-center gap-1 shrink-0 transition-colors">
                Daftar Sekarang <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          )}
        </div>

        {/* Sections & Challenges */}
        <div className="space-y-10">
          {sections.map((section: any, sIdx: number) => (
            <div key={section.id} className="relative">
              {/* Section connector line */}
              {sIdx < sections.length - 1 && (
                <div className="absolute left-[27px] top-[60px] bottom-[-40px] w-0.5 bg-slate-200 dark:bg-slate-800" />
              )}

              {/* Section Header */}
              <div className="flex items-center gap-4 mb-5">
                <div className="h-14 w-14 rounded-2xl bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 flex items-center justify-center shadow-sm shrink-0">
                  <BookOpen className="h-6 w-6 text-slate-400 dark:text-slate-500" />
                </div>
                <h2 className="text-xl font-bold text-slate-800 dark:text-white">{section.title}</h2>
              </div>

              {/* Challenges */}
              <div className="ml-14 space-y-3">
                {section.challenges.map((challenge: any) => {
                  const isLocked = !user && !challenge.isFree

                  if (isLocked) {
                    // Locked card — clicking shows the paywall modal via link to /curriculum/[slug]/locked
                    return (
                      <Link
                        key={challenge.id}
                        href={`/auth/register?from=/curriculum/${params.slug}`}
                        className="flex items-center justify-between p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 group hover:border-indigo-200 dark:hover:border-indigo-800 hover:shadow-sm transition-all"
                      >
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                            <Lock className="h-5 w-5 text-slate-400 dark:text-slate-500" />
                          </div>
                          <div>
                            <h3 className="font-bold text-slate-400 dark:text-slate-500 text-sm">{challenge.title}</h3>
                            <span className="text-xs text-slate-400 dark:text-slate-600 uppercase tracking-wider font-bold">{challenge.type}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-xs font-bold bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 px-3 py-1.5 rounded-lg group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900 transition-colors flex items-center gap-1">
                            <Lock className="h-3 w-3" /> Daftar untuk Buka
                          </span>
                        </div>
                      </Link>
                    )
                  }

                  // Free / logged-in challenge — clickable
                  const href = user
                    ? `/learn/${params.slug}/${challenge.id}`
                    : `/curriculum/${params.slug}/try/${challenge.id}`

                  return (
                    <Link
                      key={challenge.id}
                      href={href}
                      className="flex items-center justify-between p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 group hover:border-indigo-200 dark:hover:border-indigo-800 hover:shadow-md transition-all"
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-xl bg-indigo-50 dark:bg-indigo-950 flex items-center justify-center shrink-0 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900 transition-colors">
                          <PlayCircle className="h-5 w-5 text-indigo-500 dark:text-indigo-400" />
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-800 dark:text-white text-sm">{challenge.title}</h3>
                          <span className="text-xs text-slate-400 dark:text-slate-500 uppercase tracking-wider font-bold">{challenge.type}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {!user && challenge.isFree && (
                          <span className="text-xs font-bold bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 px-3 py-1.5 rounded-lg flex items-center gap-1">
                            <Sparkles className="h-3 w-3" /> Gratis
                          </span>
                        )}
                        <span className="text-xs font-bold bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 px-3 py-1.5 rounded-lg group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900 transition-colors flex items-center gap-1">
                          Mulai <ArrowRight className="h-3 w-3" />
                        </span>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}
          {sections.length === 0 && (

            <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
              <BookOpen className="h-12 w-12 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
              <p className="text-slate-400 dark:text-slate-500 font-medium italic">Belum ada materi tersedia untuk kurikulum ini.</p>
            </div>
          )}
        </div>


        {/* Bottom CTA for guests */}
        {!user && (
          <div className="mt-16 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl p-10 text-center text-white">
            <h3 className="text-2xl font-black mb-2">Tertarik? Lanjutkan belajarnya!</h3>
            <p className="text-indigo-200 mb-6">Buat akun gratis sekarang dan akses seluruh {totalChallenges} tantangan dalam kurikulum ini.</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href={`/auth/register?from=/learn/${params.slug}`}
                className="bg-white text-indigo-700 px-8 py-3.5 rounded-2xl font-black hover:bg-indigo-50 transition-all shadow-xl"
              >
                Buat Akun Gratis →
              </Link>
              <Link
                href={`/auth/login?from=/learn/${params.slug}`}
                className="bg-white/10 border border-white/20 text-white px-8 py-3.5 rounded-2xl font-bold hover:bg-white/20 transition-all"
              >
                Sudah punya akun? Masuk
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
