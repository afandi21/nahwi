import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { BookOpen, ChevronRight, Star, Clock, Lock, Users, ArrowRight } from 'lucide-react'
import { redirect } from 'next/navigation'
import ThemeToggle from '@/components/ThemeToggle'


export default async function PublicCurriculumPage() {
  const supabase = createClient()

  // Jika sudah login, langsung ke /learn yang punya progress tracking
  const { data: { user } } = await supabase.auth.getUser()
  if (user) redirect('/learn')

  const { data: curricula } = await supabase
    .from('curriculum')
    .select(`
      *,
      sections(
        id,
        challenges(id)
      )
    `)
    .eq('is_published', true)
    .order('order_index')

  const { data: settings } = await supabase
    .from('site_settings')
    .select('site_name, logo_url')
    .eq('id', 'main')
    .single()


  const siteName = settings?.site_name || 'Rumah Nahwu'


  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      {/* Navbar */}
      <nav className="border-b border-slate-100 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            {settings?.logo_url ? (
              <img src={settings.logo_url} alt="Logo" className="h-12 w-auto" />
            ) : (
              <div className="bg-indigo-600 p-2 rounded-xl">
                <BookOpen className="h-5 w-5 text-white" />
              </div>
            )}
            <span className="text-xl font-black text-slate-900 dark:text-white">{siteName}</span>
          </Link>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            {user ? (
              <Link
                href="/learn"
                className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all flex items-center gap-2"
              >
                Lanjut Belajar <ArrowRight className="h-4 w-4" />
              </Link>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors px-4 py-2"
                >
                  Masuk
                </Link>
                <Link
                  href="/auth/register"
                  className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all"
                >
                  Daftar Gratis
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Banner */}
      <div className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-700 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-6">
            <Star className="h-3.5 w-3.5 fill-yellow-300 text-yellow-300" />
            Coba Gratis — 3 Tantangan Pertama
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
            Kurikulum Belajar Nahwu
          </h1>
          <p className="text-indigo-200 text-lg max-w-2xl mx-auto">
            Jelajahi kurikulum kami secara gratis. Coba 3 tantangan pertama tanpa perlu mendaftar. Suka? Daftar dan lanjutkan perjalanan belajar Anda!
          </p>


        </div>
      </div>

      {/* Curriculum List */}
      <main className="max-w-4xl mx-auto px-4 py-16">
        <div className="grid gap-8">
          {(curricula || []).map((item: any, idx: number) => {
            const totalChallenges = item.sections?.reduce(
              (acc: number, s: any) => acc + (s.challenges?.length || 0), 0
            ) || 0
            const freeChallenges = Math.min(3, totalChallenges)
            const lockedChallenges = Math.max(0, totalChallenges - 3)

            return (
              <Link
                key={item.id}
                href={`/curriculum/${item.slug}`}
                className="group bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl dark:hover:shadow-slate-900 hover:border-indigo-100 dark:hover:border-indigo-900 transition-all"
              >
                <div className="flex flex-col md:flex-row md:items-center gap-6">
                  <div className="bg-gradient-to-br from-indigo-500 to-purple-600 h-20 w-20 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform shadow-lg shadow-indigo-200 dark:shadow-indigo-900/30">
                    <BookOpen className="h-10 w-10 text-white" />
                  </div>

                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <span className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-bold px-2.5 py-1 rounded-lg flex items-center gap-1">
                        ✓ {freeChallenges} Tantangan Gratis
                      </span>
                      {lockedChallenges > 0 && (
                        <span className="bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-xs font-bold px-2.5 py-1 rounded-lg flex items-center gap-1">
                          <Lock className="h-3 w-3" /> {lockedChallenges} Tantangan (Login)
                        </span>
                      )}
                      <span className="text-slate-400 dark:text-slate-500 text-xs flex items-center gap-1">
                        <Clock className="h-3 w-3" /> ~{Math.ceil(totalChallenges * 0.5)} Jam
                      </span>
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {item.title}
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-end shrink-0">
                    <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-xl group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/30 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-all">
                      <ChevronRight className="h-6 w-6 text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors" />
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}

          {(curricula || []).length === 0 && (
            <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-200 dark:border-slate-700">
              <BookOpen className="h-12 w-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400 font-medium">Belum ada kurikulum yang tersedia.</p>
            </div>
          )}
        </div>

        {/* CTA Bottom */}
        {!user && (
          <div className="mt-16 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl p-10 text-center text-white">
            <Users className="h-10 w-10 mx-auto mb-4 opacity-80" />
            <h3 className="text-2xl font-black mb-2">Siap untuk belajar lebih dalam?</h3>
            <p className="text-indigo-200 mb-6">Daftar sekarang dan akses semua tantangan secara penuh, lacak progres Anda, dan kuasai Nahwu!</p>
            <Link
              href="/auth/register"
              className="inline-block bg-white text-indigo-700 px-8 py-3.5 rounded-2xl font-black hover:bg-indigo-50 transition-all shadow-xl"
            >
              Buat Akun Gratis Sekarang →
            </Link>
          </div>
        )}
      </main>
    </div>
  )
}
