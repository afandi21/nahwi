'use client'

import { useMemo, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Save, Upload, FileText, Award, Download, Loader2 } from 'lucide-react'
import type { CertificateTemplate, Curriculum } from '@/types'
import {
  CERTIFICATE_PLACEHOLDERS,
  extractCertificatePlaceholders,
} from '@/lib/certificates'

type CurriculumTemplateState = {
  curriculumId: string
  curriculumTitle: string
  curriculumSlug: string
  templateId?: string
  templateName: string
  templateMimeType: string
  templateContent: string
}

interface CertificateManagerProps {
  curricula: Curriculum[]
  templates: CertificateTemplate[]
}

const SUPPORTED_TYPES = ['text/html', 'image/svg+xml', 'text/plain']

export default function CertificateManager({
  curricula,
  templates,
}: CertificateManagerProps) {
  const supabase = createClient()
  const [savingId, setSavingId] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  const [items, setItems] = useState<CurriculumTemplateState[]>(() =>
    curricula.map((curriculum) => {
      const existingTemplate = templates.find(
        (template) => template.curriculum_id === curriculum.id
      )

      return {
        curriculumId: curriculum.id,
        curriculumTitle: curriculum.title,
        curriculumSlug: curriculum.slug,
        templateId: existingTemplate?.id,
        templateName: existingTemplate?.template_name || `${curriculum.slug}-certificate.html`,
        templateMimeType: existingTemplate?.template_mime_type || 'text/html',
        templateContent:
          existingTemplate?.template_content ||
          `<section class="certificate">\n  <h1>Sertifikat Kelulusan</h1>\n  <p>Diberikan kepada <strong><<nama peserta>></strong></p>\n  <p>Atas kelulusan pada kurikulum <strong><<nama kurikulum>></strong></p>\n  <p>Tanggal lulus: <<tanggal lulus>></p>\n</section>`,
      }
    })
  )

  const visiblePlaceholders = useMemo(
    () =>
      items.reduce<Record<string, string[]>>((acc, item) => {
        acc[item.curriculumId] = extractCertificatePlaceholders(item.templateContent)
        return acc
      }, {}),
    [items]
  )

  const updateItem = (
    curriculumId: string,
    updater: (current: CurriculumTemplateState) => CurriculumTemplateState
  ) => {
    setItems((currentItems) =>
      currentItems.map((item) =>
        item.curriculumId === curriculumId ? updater(item) : item
      )
    )
  }

  const handleFileUpload = async (
    curriculumId: string,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!SUPPORTED_TYPES.includes(file.type)) {
      setMessage('File sertifikat harus bertipe HTML, SVG, atau TXT.')
      return
    }

    const content = await file.text()
    updateItem(curriculumId, (current) => ({
      ...current,
      templateName: file.name,
      templateMimeType: file.type,
      templateContent: content,
    }))
    setMessage(`Template ${file.name} berhasil dimuat. Jangan lupa simpan.`)
    event.target.value = ''
  }

  const handleSave = async (item: CurriculumTemplateState) => {
    setSavingId(item.curriculumId)
    setMessage(null)

    const { error } = await supabase.from('certificate_templates').upsert({
      id: item.templateId,
      curriculum_id: item.curriculumId,
      template_name: item.templateName,
      template_mime_type: item.templateMimeType,
      template_content: item.templateContent,
    })

    if (error) {
      setMessage(`Gagal menyimpan template untuk ${item.curriculumTitle}: ${error.message}`)
      setSavingId(null)
      return
    }

    const { data: savedTemplate } = await supabase
      .from('certificate_templates')
      .select('id')
      .eq('curriculum_id', item.curriculumId)
      .single()

    if (savedTemplate?.id) {
      updateItem(item.curriculumId, (current) => ({
        ...current,
        templateId: savedTemplate.id,
      }))
    }

    setMessage(`Template sertifikat untuk ${item.curriculumTitle} berhasil disimpan.`)
    setSavingId(null)
  }

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">
            Kelola Sertifikat
          </h2>
          <p className="mt-2 max-w-3xl text-slate-500 font-medium">
            Upload template sertifikat per kurikulum. Sistem akan membaca placeholder seperti
            {' '}
            <span className="font-black text-slate-700">&lt;&lt;nama peserta&gt;&gt;</span>
            {' '}
            dan menggantinya saat peserta lulus semua materi.
          </p>
        </div>
        <div className="rounded-3xl border border-indigo-100 bg-indigo-50 px-5 py-4 text-xs font-bold uppercase tracking-[0.2em] text-indigo-600">
          {curricula.length} Kurikulum
        </div>
      </div>

      {message && (
        <div className="rounded-2xl border border-indigo-100 bg-indigo-50 px-5 py-4 text-sm font-semibold text-indigo-700">
          {message}
        </div>
      )}

      <div className="rounded-[2.5rem] border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex flex-wrap gap-3">
          {CERTIFICATE_PLACEHOLDERS.map((placeholder) => (
            <span
              key={placeholder}
              className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-bold text-slate-600"
            >
              {placeholder}
            </span>
          ))}
        </div>
      </div>

      <div className="space-y-8">
        {items.map((item) => (
          <div
            key={item.curriculumId}
            className="rounded-[2.5rem] border border-slate-200 bg-white p-8 shadow-sm"
          >
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-indigo-50 p-3 text-indigo-600">
                    <Award className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-slate-900">{item.curriculumTitle}</h3>
                    <p className="text-sm font-medium text-slate-500">
                      File download peserta akan dibuat dari template ini setelah seluruh challenge dalam kurikulum selesai.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <label className="inline-flex cursor-pointer items-center gap-2 rounded-2xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-700 transition-all hover:bg-slate-50">
                  <Upload className="h-4 w-4" />
                  Pilih File
                  <input
                    type="file"
                    accept=".html,.svg,.txt,text/html,image/svg+xml,text/plain"
                    className="hidden"
                    onChange={(event) => handleFileUpload(item.curriculumId, event)}
                  />
                </label>
                <a
                  href={`/api/certificates/${item.curriculumSlug}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-700 transition-all hover:bg-slate-50"
                >
                  <Download className="h-4 w-4" />
                  Cek Endpoint
                </a>
              </div>
            </div>

            <div className="mt-8 grid gap-6 lg:grid-cols-[320px,1fr]">
              <div className="space-y-5 rounded-[2rem] border border-slate-200 bg-slate-50 p-6">
                <div>
                  <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
                    Nama File
                  </label>
                  <input
                    type="text"
                    value={item.templateName}
                    onChange={(event) =>
                      updateItem(item.curriculumId, (current) => ({
                        ...current,
                        templateName: event.target.value,
                      }))
                    }
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 outline-none transition-all focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
                    Tipe Template
                  </label>
                  <select
                    value={item.templateMimeType}
                    onChange={(event) =>
                      updateItem(item.curriculumId, (current) => ({
                        ...current,
                        templateMimeType: event.target.value,
                      }))
                    }
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 outline-none transition-all focus:border-indigo-500"
                  >
                    <option value="text/html">HTML</option>
                    <option value="image/svg+xml">SVG</option>
                    <option value="text/plain">TXT</option>
                  </select>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <div className="mb-3 flex items-center gap-2">
                    <FileText className="h-4 w-4 text-slate-400" />
                    <span className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">
                      Placeholder Terdeteksi
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(visiblePlaceholders[item.curriculumId] || []).length > 0 ? (
                      visiblePlaceholders[item.curriculumId].map((placeholder) => (
                        <span
                          key={placeholder}
                          className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700"
                        >
                          {placeholder}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs font-semibold text-slate-400">
                        Belum ada placeholder terdeteksi.
                      </span>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => handleSave(item)}
                  disabled={savingId === item.curriculumId}
                  className="inline-flex items-center gap-2 rounded-2xl bg-indigo-600 px-6 py-3 text-sm font-black text-white shadow-lg shadow-indigo-500/20 transition-all hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {savingId === item.curriculumId ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  {savingId === item.curriculumId ? 'Menyimpan...' : 'Simpan Template'}
                </button>
              </div>

              <div>
                <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
                  Isi Template Sertifikat
                </label>
                <textarea
                  rows={22}
                  value={item.templateContent}
                  onChange={(event) =>
                    updateItem(item.curriculumId, (current) => ({
                      ...current,
                      templateContent: event.target.value,
                    }))
                  }
                  className="min-h-[520px] w-full rounded-[2rem] border border-slate-200 bg-slate-50 px-6 py-5 font-mono text-sm leading-7 text-slate-700 outline-none transition-all focus:border-indigo-500 focus:bg-white"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
