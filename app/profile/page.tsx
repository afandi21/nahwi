import { createClient } from '@/lib/supabase/server'
import { User, BookOpen, Trophy, Clock, Calendar, Mail, Award, Download } from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import LogoutButton from '@/components/auth/LogoutButton'
import type { CertificateTemplate } from '@/types'

type CurriculumProgressRow = {
  id: string
  title: string
  slug: string
  sections: {
    challenges: { id: string }[] | null
  }[] | null
}

export default async function ProfilePage() {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const [{ count: completedCount }, { data: progressRows }, { data: curricula }, { data: certificateTemplates }] =
    await Promise.all([
      supabase
        .from('user_progress')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('is_completed', true),
      supabase
        .from('user_progress')
        .select('challenge_id')
        .eq('user_id', user.id)
        .eq('is_completed', true),
      supabase
        .from('curriculum')
        .select('id, title, slug, sections(challenges(id))')
        .eq('is_published', true)
        .order('order_index'),
      supabase.from('certificate_templates').select('curriculum_id'),
    ])

  const completedIds = new Set((progressRows || []).map((row) => row.challenge_id))
  const templateCurriculumIds = new Set(
    ((certificateTemplates || []) as Pick<CertificateTemplate, 'curriculum_id'>[]).map(
      (template) => template.curriculum_id
    )
  )

  const certificateStatuses = ((curricula || []) as CurriculumProgressRow[]).map((curriculum) => {
    const challengeIds = (curriculum.sections || [])
      .flatMap((section) => section.challenges || [])
      .map((challenge) => challenge.id)

    const completedChallenges = challengeIds.filter((challengeId) => completedIds.has(challengeId)).length

    return {
      id: curriculum.id,
      title: curriculum.title,
      slug: curriculum.slug,
      totalChallenges: challengeIds.length,
      completedChallenges,
      isCompleted: challengeIds.length > 0 && completedChallenges === challengeIds.length,
      hasTemplate: templateCurriculumIds.has(curriculum.id),
    }
  })

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center gap-8">
          <div className="h-24 w-24 rounded-3xl bg-indigo-600 flex items-center justify-center text-white shadow-xl shadow-indigo-100">
            <User className="h-12 w-12" />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {profile?.full_name || user.email?.split('@')[0]}
            </h1>
            <p className="text-slate-500 mt-1 flex items-center justify-center md:justify-start gap-2">
              <Mail className="h-4 w-4" />
              {user.email}
            </p>
            <p className="text-slate-500 mt-1 flex items-center justify-center md:justify-start gap-2">
              <Calendar className="h-4 w-4" />
              Bergabung sejak{' '}
              {new Date(user.created_at).toLocaleDateString('id-ID', {
                month: 'long',
                year: 'numeric',
              })}
            </p>
          </div>
          <div className="flex gap-4">
            <Link
              href="/learn"
              className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
            >
              Lanjut Belajar
            </Link>
            <LogoutButton />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="h-12 w-12 bg-emerald-50 rounded-xl flex items-center justify-center">
              <Trophy className="h-6 w-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tantangan Selesai</p>
              <p className="text-2xl font-black text-slate-900">{completedCount || 0}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="h-12 w-12 bg-blue-50 rounded-xl flex items-center justify-center">
              <BookOpen className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Kurikulum Aktif</p>
              <p className="text-2xl font-black text-slate-900">{certificateStatuses.length}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="h-12 w-12 bg-amber-50 rounded-xl flex items-center justify-center">
              <Award className="h-6 w-6 text-amber-600" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Sertifikat Tersedia</p>
              <p className="text-2xl font-black text-slate-900">
                {certificateStatuses.filter((item) => item.isCompleted && item.hasTemplate).length}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm p-10">
            <h3 className="text-2xl font-black text-slate-900 mb-8 tracking-tight">Sertifikat Kurikulum</h3>
            <div className="space-y-6">
              {certificateStatuses.length === 0 ? (
                <div className="text-center py-12 text-slate-400 italic">
                  Belum ada kurikulum tersedia untuk sertifikat.
                </div>
              ) : (
                certificateStatuses.map((certificate) => {
                  const progressPercent =
                    certificate.totalChallenges > 0
                      ? Math.round(
                          (certificate.completedChallenges / certificate.totalChallenges) * 100
                        )
                      : 0

                  return (
                    <div
                      key={certificate.id}
                      className="p-6 bg-slate-50 rounded-3xl border border-slate-100 flex items-center gap-6 group hover:bg-white hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300"
                    >
                      <div
                        className={`h-14 w-14 rounded-2xl shadow-sm flex items-center justify-center transition-transform group-hover:scale-110 ${
                          certificate.isCompleted ? 'bg-emerald-50 text-emerald-600' : 'bg-white text-indigo-600'
                        }`}
                      >
                        <Award className="h-7 w-7" />
                      </div>
                      <div className="flex-1">
                        <p className="font-black text-slate-900">{certificate.title}</p>
                        <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">
                          Progress: {certificate.completedChallenges}/{certificate.totalChallenges}
                        </p>
                        <div className="mt-4 w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-indigo-500 rounded-full"
                            style={{ width: `${progressPercent}%` }}
                          />
                        </div>
                      </div>
                      {certificate.isCompleted && certificate.hasTemplate ? (
                        <a
                          href={`/api/certificates/${certificate.slug}`}
                          className="inline-flex items-center gap-2 rounded-2xl bg-indigo-600 px-4 py-3 text-sm font-black text-white shadow-lg shadow-indigo-100 transition-all hover:bg-indigo-700"
                        >
                          <Download className="h-4 w-4" />
                          Download
                        </a>
                      ) : (
                        <div className="text-xs font-bold text-slate-400">
                          {certificate.hasTemplate ? 'Belum lulus' : 'Template belum tersedia'}
                        </div>
                      )}
                    </div>
                  )
                })
              )}
            </div>
          </div>

          <div className="bg-slate-900 rounded-[2.5rem] shadow-2xl p-10 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <Trophy className="h-32 w-32" />
            </div>
            <h3 className="text-2xl font-black mb-8 relative z-10 tracking-tight">Status Belajar</h3>
            <div className="space-y-6 relative z-10">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 bg-white/10 rounded-2xl flex items-center justify-center">
                  <Trophy className="h-6 w-6 text-amber-400" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Sertifikat Siap Unduh</p>
                  <p className="text-lg font-black">
                    {certificateStatuses.filter((item) => item.isCompleted && item.hasTemplate).length} Kurikulum
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 bg-white/10 rounded-2xl flex items-center justify-center">
                  <Clock className="h-6 w-6 text-blue-400" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Progress Keseluruhan</p>
                  <p className="text-lg font-black">{completedCount || 0} Tantangan Selesai</p>
                </div>
              </div>
            </div>

            <div className="mt-10 bg-indigo-600/20 rounded-3xl p-6 border border-indigo-500/20">
              <p className="text-sm font-bold mb-2 italic">
                "Sedikit tapi rutin lebih baik daripada banyak tapi terputus."
              </p>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                - Pepatah Arab
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
