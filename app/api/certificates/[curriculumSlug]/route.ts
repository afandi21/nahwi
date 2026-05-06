import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import {
  buildCertificateMergeValues,
  getCertificateExtension,
  mergeCertificateTemplate,
  sanitizeCertificateFilename,
} from '@/lib/certificates'

type SectionRow = {
  challenges: { id: string }[] | null
}

export async function GET(
  _request: Request,
  { params }: { params: { curriculumSlug: string } }
) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const [{ data: curriculum }, { data: profile }] = await Promise.all([
    supabase
      .from('curriculum')
      .select('id, title, slug')
      .eq('slug', params.curriculumSlug)
      .single(),
    supabase.from('profiles').select('full_name, email').eq('id', user.id).single(),
  ])

  if (!curriculum) {
    return NextResponse.json({ error: 'Kurikulum tidak ditemukan.' }, { status: 404 })
  }

  const [{ data: template }, { data: sections }] = await Promise.all([
    supabase
      .from('certificate_templates')
      .select('template_name, template_mime_type, template_content')
      .eq('curriculum_id', curriculum.id)
      .single(),
    supabase
      .from('sections')
      .select('challenges(id)')
      .eq('curriculum_id', curriculum.id)
      .order('order_index'),
  ])

  if (!template) {
    return NextResponse.json(
      { error: 'Template sertifikat belum tersedia untuk kurikulum ini.' },
      { status: 404 }
    )
  }

  const challengeIds = ((sections || []) as SectionRow[])
    .flatMap((section) => section.challenges || [])
    .map((challenge) => challenge.id)

  if (challengeIds.length === 0) {
    return NextResponse.json(
      { error: 'Belum ada challenge dalam kurikulum ini.' },
      { status: 400 }
    )
  }

  const { data: progressRows } = await supabase
    .from('user_progress')
    .select('challenge_id, completed_at')
    .eq('user_id', user.id)
    .eq('is_completed', true)
    .in('challenge_id', challengeIds)

  const completedRows = progressRows || []
  const completedIds = new Set(completedRows.map((row) => row.challenge_id))
  const eligible = challengeIds.every((challengeId) => completedIds.has(challengeId))

  if (!eligible) {
    return NextResponse.json(
      { error: 'Sertifikat tersedia setelah semua challenge kurikulum selesai.' },
      { status: 403 }
    )
  }

  const completedAt =
    completedRows
      .map((row) => row.completed_at)
      .filter(Boolean)
      .sort()
      .at(-1) || new Date().toISOString()

  const fullName =
    profile?.full_name || user.user_metadata?.full_name || user.email?.split('@')[0] || 'Peserta'
  const email = profile?.email || user.email || '-'

  const mergedContent = mergeCertificateTemplate(
    template.template_content,
    buildCertificateMergeValues({
      fullName,
      email,
      curriculumTitle: curriculum.title,
      curriculumSlug: curriculum.slug,
      completedAt,
    })
  )

  const extension = getCertificateExtension(template.template_mime_type)
  const fileName = sanitizeCertificateFilename(`sertifikat-${curriculum.slug}-${fullName}`)

  return new NextResponse(mergedContent, {
    headers: {
      'Content-Type': `${template.template_mime_type}; charset=utf-8`,
      'Content-Disposition': `attachment; filename=\"${fileName}.${extension}\"`,
    },
  })
}
