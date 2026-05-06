import Link from "next/link";
import { BookOpen, Sparkles, GraduationCap, ArrowRight } from "lucide-react";
import { createClient } from '@/lib/supabase/server'
import ThemeToggle from '@/components/ThemeToggle'

export default async function Home() {
  const supabase = createClient()
  let settings = null
  
  try {
    const { data } = await supabase
      .from('site_settings')
      .select('*')
      .eq('id', 'main')
      .single()
    settings = data
  } catch (e) {
    console.error("Settings fetch failed", e)
  }

  // Check auth status to make nav links context-aware
  const { data: { user } } = await supabase.auth.getUser()

  const siteName = settings?.site_name || "Rumah Nahwu"
  const tagline = settings?.tagline || "Belajar Tata Bahasa Arab Interaktif"
  const description = settings?.meta_description || "Pelajari tata bahasa Arab melalui tantangan real-time, evaluasi instan, dan kurikulum yang terstruktur."

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-300">
      {/* Navigation */}
      <nav className="border-b border-slate-100 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-28 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {settings?.logo_url ? (
              <img src={settings.logo_url} alt="Logo" className="h-20 w-auto" />
            ) : (
              <div className="bg-indigo-600 p-3 rounded-2xl">
                <BookOpen className="h-8 w-8 text-white" />
              </div>
            )}
            <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{siteName}</span>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link
              href={user ? '/learn' : '/curriculum'}
              className="text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              Kurikulum
            </Link>
            {user ? (
              <Link
                href={user.app_metadata?.role === 'admin' ? '/admin' : '/learn'}
                className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-all shadow-md"
              >
                {user.app_metadata?.role === 'admin' ? 'Dashboard Admin' : 'Lanjut Belajar'}
              </Link>
            ) : (
              <>
                <Link 
                  href="/auth/login" 
                  className="text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  Masuk
                </Link>
                <Link 
                  href="/auth/register" 
                  className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-all shadow-md hover:shadow-indigo-200 dark:hover:shadow-indigo-900/20"
                >
                  Daftar Gratis
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main>
        <section className="relative pt-20 pb-32 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 opacity-10 dark:opacity-20">
            <div className="absolute top-0 left-1/4 w-72 h-72 bg-indigo-400 rounded-full blur-[120px]" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-400 rounded-full blur-[120px]" />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 bg-indigo-50 dark:bg-indigo-950 border border-indigo-100 dark:border-indigo-900 px-3 py-1 rounded-full text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider mb-8">
              <Sparkles className="h-3.5 w-3.5" />
              {tagline}
            </div>
            
            <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 dark:text-white mb-6 tracking-tight">
              Kuasai <span className="text-indigo-600 dark:text-indigo-400">Nahwu</span> dengan <br className="hidden md:block" />
              Sistem Interaktif
            </h1>
            
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
              {description}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link 
                href="/auth/login" 
                className="group w-full sm:w-auto bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-8 py-4 rounded-2xl text-lg font-bold hover:bg-slate-800 dark:hover:bg-slate-100 transition-all shadow-xl flex items-center justify-center gap-2"
              >
                Mulai Belajar 
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                href="#features" 
                className="w-full sm:w-auto px-8 py-4 rounded-2xl text-lg font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex items-center justify-center"
              >
                Lihat Fitur
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 bg-slate-50 dark:bg-slate-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: <GraduationCap className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />,
                  title: "Kurikulum Terstruktur",
                  desc: "Materi yang disusun secara bertahap mulai dari huruf, harakat, hingga kalimat kompleks."
                },
                {
                  icon: <Sparkles className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />,
                  title: "Evaluasi Real-time",
                  desc: "Dapatkan feedback instan untuk setiap jawaban yang Anda masukkan di panel interaktif."
                },
                {
                  icon: <BookOpen className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />,
                  title: "Latihan Intensif",
                  desc: "Ratusan tantangan yang dirancang untuk memperkuat pemahaman Anda tentang kaidah Nahwi."
                }
              ].map((feature, i) => (
                <div key={i} className="bg-white dark:bg-slate-800 p-8 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md dark:hover:shadow-slate-900 transition-shadow">
                  <div className="bg-indigo-50 dark:bg-indigo-950 w-12 h-12 rounded-xl flex items-center justify-center mb-6">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{feature.title}</h3>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-100 dark:border-slate-800 py-12 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            © {new Date().getFullYear()} {siteName}. Dibuat dengan ❤️ untuk pembelajaran bahasa Arab.
          </p>
        </div>
      </footer>
    </div>
  );
}
