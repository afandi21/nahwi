export const CERTIFICATE_PLACEHOLDERS = [
  '<<nama peserta>>',
  '<<email peserta>>',
  '<<nama kurikulum>>',
  '<<slug kurikulum>>',
  '<<tanggal lulus>>',
  '<<tahun>>',
] as const

export function extractCertificatePlaceholders(template: string) {
  const matches = template.match(/<<\s*[^>]+?\s*>>/g) || []
  return Array.from(new Set(matches))
}

function normalizePlaceholder(placeholder: string) {
  return placeholder.replace(/[<>]/g, '').trim().toLowerCase()
}

export function mergeCertificateTemplate(
  template: string,
  values: Record<string, string>
) {
  return template.replace(/<<\s*([^>]+?)\s*>>/g, (full, key: string) => {
    const normalizedKey = normalizePlaceholder(key)
    return values[normalizedKey] ?? full
  })
}

export function buildCertificateMergeValues(input: {
  fullName: string
  email: string
  curriculumTitle: string
  curriculumSlug: string
  completedAt: string
}) {
  const completedDate = new Date(input.completedAt)
  return {
    'nama peserta': input.fullName,
    'email peserta': input.email,
    'nama kurikulum': input.curriculumTitle,
    'slug kurikulum': input.curriculumSlug,
    'tanggal lulus': completedDate.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    }),
    tahun: String(completedDate.getFullYear()),
  }
}

export function getCertificateExtension(mimeType: string) {
  switch (mimeType) {
    case 'text/html':
      return 'html'
    case 'image/svg+xml':
      return 'svg'
    case 'text/plain':
    default:
      return 'txt'
  }
}

export function sanitizeCertificateFilename(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}
