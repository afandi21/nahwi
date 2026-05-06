'use client'

import { useState } from 'react'
import { Challenge, ChallengeType, TestAssertion } from '@/types'
import { 
  Save, 
  ArrowLeft, 
  Plus, 
  Trash2, 
  HelpCircle, 
  BookOpen, 
  Layers, 
  ShieldCheck, 
  Loader2,
  Settings,
  ChevronRight
} from 'lucide-react'
import Link from 'next/link'
import { upsertChallenge } from '@/app/actions/admin'
import { useRouter } from 'next/navigation'

interface ChallengeEditorProps {
  challenge?: Partial<Challenge>
  sections: { id: string, title: string }[]
}

export default function ChallengeEditor({ challenge, sections }: ChallengeEditorProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<Partial<Challenge>>({
    id: challenge?.id,
    title: challenge?.title || '',
    materi_text: challenge?.materi_text || '',
    arabic_sentence: challenge?.arabic_sentence || '',
    type: challenge?.type || 'harakat',
    valid_answers: challenge?.valid_answers || [],
    tests: challenge?.tests || [],
    section_id: challenge?.section_id || (sections[0]?.id || ''),
    order_index: challenge?.order_index || 0,
    translation: challenge?.translation || ''
  })

  const [newValidAnswer, setNewValidAnswer] = useState('')
  const [activeTab, setActiveTab] = useState<'materi' | 'question' | 'tests'>('materi')

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validasi Kunci Jawaban
    if (!formData.valid_answers || formData.valid_answers.length === 0) {
      alert('PERINGATAN: Anda belum memasukkan Kunci Jawaban. Soal tidak akan bisa dijawab oleh peserta tanpa kunci jawaban!')
      setActiveTab('question')
      return
    }

    // Validasi Bab
    if (!formData.section_id) {
      alert('Mohon pilih Bab / Section sebelum menyimpan soal.')
      return
    }

    setLoading(true)
    const result = await upsertChallenge(formData)
    if (result.success) {
      router.push('/admin/challenges')
      router.refresh()
    } else {
      alert('Error: ' + result.error)
      setLoading(false)
    }
  }


  const addTest = () => {
    const newTest: TestAssertion = {
      id: Math.random().toString(36).substr(2, 9),
      description: 'Test baru',
      type: 'not_empty'
    }
    setFormData({ ...formData, tests: [...(formData.tests || []), newTest] })
  }

  const removeTest = (id: string) => {
    setFormData({ ...formData, tests: formData.tests?.filter(t => t.id !== id) })
  }

  const addValidAnswer = () => {
    if (newValidAnswer.trim()) {
      setFormData({ 
        ...formData, 
        valid_answers: [...(formData.valid_answers || []), newValidAnswer.trim()] 
      })
      setNewValidAnswer('')
    }
  }

  const tabs = [
    { id: 'materi', label: '1. Materi', icon: BookOpen },
    { id: 'question', label: '2. Soal & Jawaban', icon: Layers },
    { id: 'tests', label: '3. Validasi (Tests)', icon: ShieldCheck },
  ]

  return (
    <form onSubmit={handleSave} className="space-y-8 max-w-6xl pb-20">
      {/* Header Sticky */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 sticky top-0 z-30 bg-slate-50/80 backdrop-blur-md py-4 border-b border-slate-200 -mx-10 px-10 mb-8">
        <div className="flex items-center gap-4">
          <Link href="/admin/challenges" className="p-2 bg-white rounded-xl border border-slate-200 text-slate-500 hover:text-slate-900 transition-all shadow-sm">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              {formData.id ? 'Edit Tantangan' : 'Buat Tantangan Baru'}
            </h2>
            <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest">Kurikulum Nahwi</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            type="submit" 
            disabled={loading}
            className="bg-indigo-600 text-white px-8 py-3.5 rounded-2xl font-black text-sm flex items-center gap-2 hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-500/20 disabled:opacity-50"
          >
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
            {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2 p-1.5 bg-slate-200/50 rounded-2xl w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
              activeTab === tab.id 
                ? 'bg-white text-indigo-600 shadow-sm' 
                : 'text-slate-500 hover:text-slate-700 hover:bg-white/50'
            }`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2">
          {/* TAB 1: MATERI */}
          {activeTab === 'materi' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 space-y-8">
              <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-8">
                <div className="space-y-3">
                  <label className="text-sm font-black text-slate-400 uppercase tracking-widest">Judul Tantangan</label>
                  <input 
                    type="text" 
                    required
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white rounded-2xl outline-none transition-all text-lg font-bold"
                    placeholder="Contoh: Mengenal Mubtada"
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-black text-slate-400 uppercase tracking-widest">Isi Materi (Markdown)</label>
                  <textarea 
                    rows={10}
                    value={formData.materi_text}
                    onChange={e => setFormData({ ...formData, materi_text: e.target.value })}
                    className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white rounded-2xl outline-none transition-all font-mono text-sm leading-relaxed"
                    placeholder="Tulis penjelasan kaidah nahwu di sini..."
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SOAL & JAWABAN */}
          {activeTab === 'question' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 space-y-8">
              <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-10">
                <div className="grid grid-cols-1 gap-8">
                  <div className="space-y-3">
                    <label className="text-sm font-black text-slate-400 uppercase tracking-widest text-right block">Kalimat Arab Utama</label>
                    <input 
                      type="text" 
                      dir="rtl"
                      value={formData.arabic_sentence}
                      onChange={e => setFormData({ ...formData, arabic_sentence: e.target.value })}
                      className="w-full px-8 py-10 bg-indigo-50/30 border-2 border-dashed border-indigo-200 focus:border-indigo-500 focus:bg-white rounded-[2rem] outline-none transition-all font-arabic text-5xl text-center text-slate-900"
                      placeholder="Ketik kalimat Arab..."
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <label className="text-sm font-black text-slate-400 uppercase tracking-widest">Terjemahan Indonesia</label>
                    <input 
                      type="text" 
                      value={formData.translation}
                      onChange={e => setFormData({ ...formData, translation: e.target.value })}
                      className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white rounded-2xl outline-none transition-all font-bold"
                      placeholder="Arti kalimat di atas..."
                    />
                  </div>
                </div>

                <div className="pt-8 border-t border-slate-100 space-y-6">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-black text-slate-400 uppercase tracking-widest">Daftar Jawaban Valid</label>
                    <span className="text-[10px] bg-indigo-100 text-indigo-600 px-2 py-1 rounded-md font-black">Minimal 1</span>
                  </div>
                  
                  <div className="flex gap-3">
                    <input 
                      type="text" 
                      dir="rtl"
                      value={newValidAnswer}
                      onChange={e => setNewValidAnswer(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addValidAnswer())}
                      className="flex-1 px-6 py-3 bg-slate-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white rounded-2xl outline-none transition-all font-arabic text-2xl"
                      placeholder="Tambahkan variasi jawaban..."
                    />
                    <button 
                      type="button"
                      onClick={addValidAnswer}
                      className="bg-slate-900 text-white px-6 rounded-2xl hover:bg-indigo-600 transition-colors shadow-lg"
                    >
                      <Plus className="h-6 w-6" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {formData.valid_answers?.map((ans, i) => (
                      <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-200 group">
                        <button 
                          type="button" 
                          onClick={() => setFormData({ ...formData, valid_answers: formData.valid_answers?.filter((_, idx) => idx !== i) })}
                          className="p-2 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                        <span className="font-arabic text-xl">{ans}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: TESTS */}
          {activeTab === 'tests' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 space-y-8">
              <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-black text-slate-900 tracking-tight">Test Assertions</h3>
                    <p className="text-sm text-slate-500 font-medium">Validasi langkah demi langkah untuk feedback instan.</p>
                  </div>
                  <button 
                    type="button" 
                    onClick={addTest}
                    className="bg-indigo-50 text-indigo-600 px-4 py-2 rounded-xl text-sm font-black flex items-center gap-2 hover:bg-indigo-100 transition-all"
                  >
                    <Plus className="h-4 w-4" />
                    Tambah
                  </button>
                </div>

                <div className="space-y-4">
                  {formData.tests?.map((test, index) => (
                    <div key={test.id} className="p-6 bg-slate-50 rounded-3xl border border-slate-200 flex flex-col gap-4 relative group">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Deskripsi Feedback</label>
                              <input 
                                type="text" 
                                value={test.description}
                                onChange={e => {
                                  const newTests = [...(formData.tests || [])]
                                  newTests[index].description = e.target.value
                                  setFormData({ ...formData, tests: newTests })
                                }}
                                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold"
                                placeholder="Misal: Kata pertama harus ber-dhammah"
                              />
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Tipe Pengecekan</label>
                              <select 
                                value={test.type}
                                onChange={e => {
                                  const newTests = [...(formData.tests || [])]
                                  newTests[index].type = e.target.value as any
                                  setFormData({ ...formData, tests: newTests })
                                }}
                                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold outline-none"
                              >
                                <option value="not_empty">Tidak Kosong</option>
                                <option value="in_valid_answers">Cocok dengan Jawaban Valid</option>
                                <option value="word_position_has_char">Posisi Kata & Harakat</option>
                                <option value="contains_char">Mengandung Karakter</option>
                                <option value="regex">Pattern (Regex)</option>
                              </select>
                            </div>
                          </div>
                        </div>
                        
                        <button 
                          type="button" 
                          onClick={() => removeTest(test.id)}
                          className="p-3 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-2xl transition-all"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Settings */}
        <div className="space-y-8">
          <div className="bg-slate-900 p-8 rounded-[2.5rem] shadow-2xl text-white space-y-8">
            <div className="flex items-center gap-3">
              <Settings className="h-6 w-6 text-indigo-400" />
              <h3 className="text-xl font-black tracking-tight">Konfigurasi</h3>
            </div>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Bab / Section</label>
                <select 
                  value={formData.section_id}
                  onChange={e => setFormData({ ...formData, section_id: e.target.value })}
                  className="w-full px-4 py-3 bg-white/10 border border-white/10 rounded-2xl outline-none focus:bg-white/20 transition-all font-bold text-sm"
                >
                  {sections.map(s => <option key={s.id} value={s.id} className="text-slate-900">{s.title}</option>)}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Tipe Challenge</label>
                <select 
                  value={formData.type}
                  onChange={e => setFormData({ ...formData, type: e.target.value as ChallengeType })}
                  className="w-full px-4 py-3 bg-white/10 border border-white/10 rounded-2xl outline-none focus:bg-white/20 transition-all font-bold text-sm"
                >
                  <option value="harakat" className="text-slate-900">📝 Berikan Harakat</option>
                  <option value="multiple_choice" className="text-slate-900">🔘 Pilihan Ganda</option>
                  <option value="fill_blank" className="text-slate-900">🖋️ Isi Titik-titik</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Urutan (Index)</label>
                <input 
                  type="number" 
                  value={formData.order_index}
                  onChange={e => setFormData({ ...formData, order_index: parseInt(e.target.value) })}
                  className="w-full px-4 py-3 bg-white/10 border border-white/10 rounded-2xl outline-none focus:bg-white/20 transition-all font-bold text-sm"
                />
              </div>
            </div>

            <div className="pt-6 border-t border-white/10">
              <div className="bg-indigo-500/20 rounded-2xl p-4 border border-indigo-500/20">
                <div className="flex items-center gap-2 mb-2">
                  <HelpCircle className="h-4 w-4 text-indigo-400" />
                  <span className="text-xs font-bold text-indigo-400">Tips Admin</span>
                </div>
                <p className="text-[10px] text-slate-400 leading-relaxed">
                  Gunakan tipe "Harakat" untuk menguji kemampuan penulisan harakat secara manual oleh peserta.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  )
}
