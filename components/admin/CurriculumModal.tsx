'use client'

import { useState } from 'react'
import { X, Save, Loader2, BookOpen, Globe, Lock } from 'lucide-react'
import { upsertCurriculum } from '@/app/actions/admin'

interface CurriculumModalProps {
  curriculum?: any
  onClose: () => void
  onSuccess: () => void
}

export default function CurriculumModal({ curriculum, onClose, onSuccess }: CurriculumModalProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    id: curriculum?.id || '',
    title: curriculum?.title || '',
    slug: curriculum?.slug || '',
    description: curriculum?.description || '',
    order_index: curriculum?.order_index || 0,
    is_published: curriculum?.is_published ?? false
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const result = await upsertCurriculum(formData)
    if (result.success) {
      onSuccess()
      onClose()
    } else {
      alert('Gagal menyimpan: ' + result.error)
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white dark:bg-slate-900 w-full max-w-xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-600 rounded-xl">
              <BookOpen className="h-5 w-5 text-white" />
            </div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white">
              {curriculum ? 'Edit Kurikulum' : 'Tambah Kurikulum Baru'}
            </h3>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors">
            <X className="h-5 w-5 text-slate-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Judul Kurikulum</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={e => {
                const title = e.target.value
                const slug = title.toLowerCase().replace(/[^a-z0-9]/g, '-')
                setFormData({ ...formData, title, slug: formData.id ? formData.slug : slug })
              }}
              className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-indigo-500 rounded-2xl outline-none transition-all font-bold text-slate-900 dark:text-white"
              placeholder="Contoh: Nahwu Dasar Level 1"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">URL Slug</label>
              <input
                type="text"
                required
                value={formData.slug}
                onChange={e => setFormData({ ...formData, slug: e.target.value })}
                className="w-full px-5 py-3 bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-indigo-500 rounded-xl outline-none transition-all font-mono text-xs font-bold text-slate-600 dark:text-slate-400"
                placeholder="nahwu-dasar-1"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Urutan (Index)</label>
              <input
                type="number"
                value={formData.order_index}
                onChange={e => setFormData({ ...formData, order_index: parseInt(e.target.value) })}
                className="w-full px-5 py-3 bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-indigo-500 rounded-xl outline-none transition-all font-bold text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Deskripsi Singkat</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-indigo-500 rounded-2xl outline-none transition-all text-sm text-slate-600 dark:text-slate-400 leading-relaxed"
              placeholder="Jelaskan apa yang akan dipelajari di kurikulum ini..."
            />
          </div>

          <div className="flex items-center justify-between p-6 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3">
              {formData.is_published ? <Globe className="h-5 w-5 text-emerald-500" /> : <Lock className="h-5 w-5 text-slate-400" />}
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-white">Status Publikasi</p>
                <p className="text-[10px] text-slate-500 font-medium">{formData.is_published ? 'Dapat dilihat oleh peserta' : 'Hanya draf admin'}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, is_published: !formData.is_published })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${formData.is_published ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-slate-700'}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${formData.is_published ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-8 py-4 rounded-2xl font-bold text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all text-sm"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-[2] bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-500/20 disabled:opacity-50"
            >
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
              {loading ? 'Menyimpan...' : 'Simpan Kurikulum'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
