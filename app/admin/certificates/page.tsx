import { createClient } from '@/lib/supabase/server'
import CertificateManager from '@/components/admin/CertificateManager'
import type { CertificateTemplate, Curriculum } from '@/types'

export default async function AdminCertificatesPage() {
  const supabase = createClient()

  const { data: curricula } = await supabase
    .from('curriculum')
    .select('*')
    .order('order_index')

  const { data: templates } = await supabase
    .from('certificate_templates')
    .select('*')

  return (
    <CertificateManager
      curricula={(curricula || []) as Curriculum[]}
      templates={(templates || []) as CertificateTemplate[]}
    />
  )
}
