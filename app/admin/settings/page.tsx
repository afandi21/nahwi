'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { 
  Globe, 
  Lock, 
  Database, 
  Save, 
  Bell, 
  ShieldCheck,
  Info,
  PlusCircle,
  Loader2
} from 'lucide-react'

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState<'general' | 'auth' | 'system'>('general')
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  
  const [formData, setFormData] = useState({
    site_name: '',
    tagline: '',
    meta_description: '',
    maintenance_mode: false,
    logo_url: '',
    theme: 'light',
    brand_color: '#4f46e5'
  })

  const supabase = createClient()

  // Fetch initial data
  useEffect(() => {
    async function loadSettings() {
      const { data } = await supabase
        .from('site_settings')
        .select('*')
        .eq('id', 'main')
        .single()
      
      if (data) {
        setFormData({
          site_name: data.site_name || '',
          tagline: data.tagline || '',
          meta_description: data.meta_description || '',
          maintenance_mode: data.maintenance_mode || false,
          logo_url: data.logo_url || '',
          theme: data.theme || 'light',
          brand_color: data.brand_color || '#4f46e5'
        })
      }
    }
    loadSettings()
  }, [])

  const handleSave = async () => {
    setIsSaving(true)
    setMessage(null)

    const { error } = await supabase
      .from('site_settings')
      .upsert({ 
        id: 'main',
        ...formData,
        updated_at: new Date().toISOString()
      })

    if (error) {
      setMessage({ type: 'error', text: 'Gagal menyimpan: ' + error.message })
    } else {
      setMessage({ type: 'success', text: 'Pengaturan berhasil diperbarui!' })
      setTimeout(() => setMessage(null), 3000)
    }
    setIsSaving(false)
  }

  const tabs = [
    { id: 'general', label: 'Umum', icon: Globe },
    { id: 'auth', label: 'Autentikasi', icon: Lock },
    { id: 'system', label: 'Sistem', icon: Database },
  ] as const

  return (
    <div className="space-y-10 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">Pengaturan Platform</h2>
          <p className="text-slate-500 mt-2 font-medium">Konfigurasi global untuk aplikasi Nahwu Anda.</p>
        </div>
        {message && (
          <div className={`px-6 py-3 rounded-2xl text-sm font-bold animate-in fade-in slide-in-from-top-2 duration-300 ${
            message.type === 'success' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-red-50 text-red-600 border border-red-100'
          }`}>
            {message.text}
          </div>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
        {/* Sidebar Tabs */}
        <aside className="lg:w-64 shrink-0">
          <div className="bg-white rounded-[2rem] border border-slate-200 p-3 space-y-1 shadow-sm">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl text-sm font-bold transition-all ${
                  activeTab === tab.id 
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' 
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <tab.icon className="h-5 w-5" />
                {tab.label}
              </button>
            ))}
          </div>
          
          <div className="mt-8 p-6 bg-indigo-50 rounded-[2rem] border border-indigo-100">
            <div className="flex items-center gap-2 mb-3">
              <Info className="h-4 w-4 text-indigo-600" />
              <span className="text-xs font-black text-indigo-600 uppercase tracking-widest">Bantuan</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Semua perubahan di sini akan berdampak langsung pada pengalaman belajar peserta.
            </p>
          </div>
        </aside>

        {/* Content Area */}
        <div className="flex-1 space-y-8">
          {activeTab === 'general' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 space-y-8">
              <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-8">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-6">
                  <Globe className="h-6 w-6 text-indigo-600" />
                  <h3 className="text-xl font-black text-slate-900">Konfigurasi Situs</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Logo Platform</label>
                    <div className="flex items-center gap-6 p-6 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                      <div className="h-20 w-20 bg-white rounded-2xl border border-slate-200 flex items-center justify-center overflow-hidden shadow-sm">
                        {formData.logo_url ? (
                          <img src={formData.logo_url} alt="Logo" className="h-full w-full object-contain" />
                        ) : (
                          <PlusCircle className="h-8 w-8 text-slate-300" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-bold text-slate-900 mb-1">Ganti Logo</p>
                        <p className="text-[10px] text-slate-400 mb-3 font-medium">PNG, JPG up to 2MB</p>
                        <input 
                          type="file" 
                          id="logo-upload"
                          className="hidden"
                          accept="image/*"
                          onChange={async (e) => {
                            const file = e.target.files?.[0]
                            if (file) {
                              // Simulate upload for now or show local preview
                              const reader = new FileReader()
                              reader.onload = (e) => {
                                setFormData({...formData, logo_url: e.target?.result as string})
                              }
                              reader.readAsDataURL(file)
                            }
                          }}
                        />
                        <label 
                          htmlFor="logo-upload"
                          className="cursor-pointer bg-white text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 transition-all inline-block"
                        >
                          Pilih File
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-8 flex flex-col justify-center">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nama Platform</label>
                      <input 
                        type="text" 
                        value={formData.site_name}
                        onChange={(e) => setFormData({...formData, site_name: e.target.value})}
                        className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white rounded-2xl outline-none transition-all font-bold"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Tagline</label>
                    <input 
                      type="text" 
                      value={formData.tagline}
                      onChange={(e) => setFormData({...formData, tagline: e.target.value})}
                      className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white rounded-2xl outline-none transition-all font-bold"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Deskripsi Meta (SEO)</label>
                  <textarea 
                    rows={4}
                    value={formData.meta_description}
                    onChange={(e) => setFormData({...formData, meta_description: e.target.value})}
                    className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white rounded-2xl outline-none transition-all font-medium leading-relaxed"
                  />
                </div>
              </div>

              <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-8">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-6">
                  <Bell className="h-6 w-6 text-indigo-600" />
                  <h3 className="text-xl font-black text-slate-900">Notifikasi & Pengumuman</h3>
                </div>
                
                <div className="flex items-center justify-between p-6 bg-slate-50 rounded-3xl border border-slate-100">
                  <div>
                    <p className="font-bold text-slate-900">Maintenance Mode</p>
                    <p className="text-xs text-slate-500 mt-1">Hanya admin yang bisa mengakses platform.</p>
                  </div>
                  <button 
                    onClick={() => setFormData({...formData, maintenance_mode: !formData.maintenance_mode})}
                    className={`relative inline-flex items-center cursor-pointer h-6 w-11 rounded-full transition-colors ${formData.maintenance_mode ? 'bg-indigo-600' : 'bg-slate-200'}`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${formData.maintenance_mode ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'auth' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 space-y-8">
              <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-8">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-6">
                  <ShieldCheck className="h-6 w-6 text-emerald-600" />
                  <h3 className="text-xl font-black text-slate-900">Keamanan & Pendaftaran</h3>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center justify-between p-6 bg-slate-50 rounded-3xl border border-slate-100">
                    <div>
                      <p className="font-bold text-slate-900">Buka Pendaftaran Siswa</p>
                      <p className="text-xs text-slate-500 mt-1">Izinkan pengguna baru mendaftar secara mandiri.</p>
                    </div>
                    <div className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-6 bg-slate-50 rounded-3xl border border-slate-100">
                    <div>
                      <p className="font-bold text-slate-900">Verifikasi Email</p>
                      <p className="text-xs text-slate-500 mt-1">Wajibkan verifikasi email sebelum bisa belajar.</p>
                    </div>
                    <div className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'system' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 space-y-8">
              
              {/* Database Status */}
              <div className="bg-white dark:bg-slate-900 p-8 md:p-10 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm space-y-8">
                <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-6">
                  <Database className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  <h3 className="text-xl font-black text-slate-900 dark:text-white">Status Sistem</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Database */}
                  <div className="flex items-center justify-between p-5 bg-emerald-50 dark:bg-emerald-950/30 rounded-2xl border border-emerald-100 dark:border-emerald-900/50">
                    <div className="flex items-center gap-3">
                      <div className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse" />
                      <div>
                        <p className="font-bold text-slate-800 dark:text-slate-200 text-sm">Database Supabase</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">PostgreSQL — Terkoneksi</p>
                      </div>
                    </div>
                    <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/50 px-3 py-1 rounded-xl uppercase">Online</span>
                  </div>

                  {/* Auth Service */}
                  <div className="flex items-center justify-between p-5 bg-emerald-50 dark:bg-emerald-950/30 rounded-2xl border border-emerald-100 dark:border-emerald-900/50">
                    <div className="flex items-center gap-3">
                      <div className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse" />
                      <div>
                        <p className="font-bold text-slate-800 dark:text-slate-200 text-sm">Auth Service</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Supabase Auth — Aktif</p>
                      </div>
                    </div>
                    <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/50 px-3 py-1 rounded-xl uppercase">Online</span>
                  </div>

                  {/* Storage */}
                  <div className="flex items-center justify-between p-5 bg-emerald-50 dark:bg-emerald-950/30 rounded-2xl border border-emerald-100 dark:border-emerald-900/50">
                    <div className="flex items-center gap-3">
                      <div className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse" />
                      <div>
                        <p className="font-bold text-slate-800 dark:text-slate-200 text-sm">Storage</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Supabase Storage — Aktif</p>
                      </div>
                    </div>
                    <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/50 px-3 py-1 rounded-xl uppercase">Online</span>
                  </div>

                  {/* Next.js */}
                  <div className="flex items-center justify-between p-5 bg-blue-50 dark:bg-blue-950/30 rounded-2xl border border-blue-100 dark:border-blue-900/50">
                    <div className="flex items-center gap-3">
                      <div className="h-3 w-3 rounded-full bg-blue-500 animate-pulse" />
                      <div>
                        <p className="font-bold text-slate-800 dark:text-slate-200 text-sm">Next.js Server</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">App Router — Running</p>
                      </div>
                    </div>
                    <span className="text-xs font-black text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/50 px-3 py-1 rounded-xl uppercase">Running</span>
                  </div>
                </div>
              </div>

              {/* Informasi Teknis */}
              <div className="bg-white dark:bg-slate-900 p-8 md:p-10 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
                <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-6">
                  <Info className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                  <h3 className="text-xl font-black text-slate-900 dark:text-white">Informasi Teknis</h3>
                </div>

                <div className="space-y-3">
                  {[
                    { label: 'Framework', value: 'Next.js 14 (App Router)' },
                    { label: 'Database', value: 'Supabase PostgreSQL' },
                    { label: 'Authentication', value: 'Supabase Auth (JWT)' },
                    { label: 'Storage', value: 'Supabase Storage' },
                    { label: 'Styling', value: 'Tailwind CSS v3' },
                    { label: 'Deployment', value: 'Vercel / Local' },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between py-3.5 px-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
                      <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">{item.label}</span>
                      <span className="text-sm font-black text-slate-900 dark:text-white">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Danger Zone */}
              <div className="bg-white dark:bg-slate-900 p-8 md:p-10 rounded-[2.5rem] border border-red-100 dark:border-red-900/30 shadow-sm space-y-6">
                <div className="flex items-center gap-3 border-b border-red-50 dark:border-red-900/20 pb-6">
                  <ShieldCheck className="h-6 w-6 text-red-500 dark:text-red-400" />
                  <h3 className="text-xl font-black text-slate-900 dark:text-white">Zona Berbahaya</h3>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-6 bg-red-50 dark:bg-red-950/20 rounded-3xl border border-red-100 dark:border-red-900/30">
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">Mode Maintenance</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Saat aktif, hanya admin yang bisa mengakses platform. Peserta akan melihat halaman maintenance.</p>
                    </div>
                    <button 
                      onClick={() => setFormData({...formData, maintenance_mode: !formData.maintenance_mode})}
                      className={`relative inline-flex items-center cursor-pointer h-6 w-11 rounded-full transition-colors shrink-0 ml-6 ${formData.maintenance_mode ? 'bg-red-500' : 'bg-slate-200 dark:bg-slate-700'}`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${formData.maintenance_mode ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                  </div>
                  {formData.maintenance_mode && (
                    <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 rounded-2xl">
                      <div className="h-2 w-2 rounded-full bg-red-500 animate-ping shrink-0" />
                      <p className="text-red-700 dark:text-red-400 text-sm font-semibold">⚠️ Mode Maintenance sedang AKTIF. Peserta tidak bisa mengakses platform!</p>
                    </div>
                  )}
                </div>
              </div>

            </div>
          )}

          {/* Fixed Footer Save Button */}
          <div className="flex items-center justify-end gap-4 bg-white/80 backdrop-blur-md p-6 rounded-[2rem] border border-slate-200 shadow-xl shadow-indigo-500/5">
             <button 
               onClick={() => window.location.reload()}
               className="px-8 py-3 rounded-2xl text-sm font-bold text-slate-500 hover:bg-slate-50 transition-all"
             >
               Batalkan
             </button>
             <button 
              onClick={handleSave}
              disabled={isSaving}
              className="bg-indigo-600 text-white px-10 py-4 rounded-2xl font-black text-sm flex items-center gap-2 hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-500/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
             >
              {isSaving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
              {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
