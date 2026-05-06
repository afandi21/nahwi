# Rincian Tugas Agent Gemini Flash (Junior Programmer) - Proyek Nahwi

Dokumen ini adalah rincian tugas (Task Breakdown) langkah demi langkah untuk agent AI (Gemini Flash) dalam mengimplementasikan platform "Nahwi". Tugas dipecah menjadi instruksi tingkat file yang atomik agar mudah dieksekusi secara bertahap tanpa error.

---

## Phase 1 — Foundation (Setup Awal & Autentikasi)

**Goal:** Proyek berjalan di localhost dengan struktur Next.js 14, Tailwind, dan terhubung ke Supabase.

- [x] **Task 1.1: Inisialisasi Proyek Next.js**
  - **Instruksi:** Jalankan perintah `npx create-next-app@14 . --typescript --tailwind --eslint --app --use-npm` di dalam direktori `nahwi`.
  - **Validasi:** Pastikan folder `app`, `public`, dan file konfigurasi (`tailwind.config.ts`, dll) berhasil dibuat.

- [x] **Task 1.2: Install Dependensi Tambahan**
  - **Instruksi:** Install package Supabase client (`@supabase/supabase-js`, `@supabase/ssr`), dan package icon (misalnya `lucide-react`).

- [x] **Task 1.3: Setup Environment Variables**
  - **Instruksi:** Buat file `.env.local` di root proyek.
  - **Isi:** Tambahkan placeholder untuk `NEXT_PUBLIC_SUPABASE_URL` dan `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

- [x] **Task 1.4: Konfigurasi Font Arabic (Amiri)**
  - **Instruksi:** Edit `app/layout.tsx`. Gunakan `next/font/google` untuk memuat font 'Amiri' dan tambahkan class CSS global untuk mendefinisikan font Arab.

- [x] **Task 1.5: Buat Supabase Utility Client**
  - **Instruksi:** Buat folder `lib/supabase` dan tambahkan file `client.ts` (untuk browser) dan `server.ts` (untuk SSR).
  - **Validasi:** Client berhasil diekspor tanpa error TypeScript.

- [x] **Task 1.6: Setup Halaman Register & Login**
  - **Instruksi:** Buat file `app/auth/login/page.tsx` dan `app/auth/register/page.tsx`. Buat form UI sederhana (Tailwind) dengan input email dan password.
  - **Logika:** Hubungkan dengan fungsi `supabase.auth.signUp()` dan `supabase.auth.signInWithPassword()`.

- [x] **Task 1.7: Setup Landing Page Sederhana**
  - **Instruksi:** Edit `app/page.tsx` menjadi landing page sementara dengan tombol "Mulai Belajar" yang mengarah ke `/auth/login` (atau `/learn` jika sudah login).

---

## Phase 2 — Core Learning UI (Komponen Pembelajaran)

**Goal:** Membangun antarmuka utama pembelajaran (3-Panel) dan logika Keyboard Arab + Evaluasi Client-Side.

- [x] **Task 2.1: Buat Komponen Layout 3-Panel**
  - **Instruksi:** Buat file `components/learn/ThreePanelLayout.tsx`.
  - **UI:** Gunakan Tailwind CSS Grid/Flexbox untuk membagi layar menjadi 3 kolom yang proporsional di desktop.

- [x] **Task 2.2: Buat Komponen Arabic Keyboard**
  - **Instruksi:** Buat file `components/learn/ArabicKeyboard.tsx`.
  - **Logika:** Tambahkan 28 huruf hijaiyah + baris harakat. Berikan fungsi callback `onKeyPress(char)`. Pastikan tombol ditekan mengirimkan Unicode yang tepat (contoh: `\u064F` untuk dhammah).

- [x] **Task 2.3: Buat Komponen Input Panel (Panel 2)**
  - **Instruksi:** Buat `components/learn/InputPanel.tsx`. Gunakan font 'Amiri' dengan direktif `dir="rtl"`.
  - **State:** Simpan jawaban pengguna saat ini dan hubungkan dengan aksi `ArabicKeyboard`.

- [x] **Task 2.4: Buat Logika Evaluasi (Test Runner)**
  - **Instruksi:** Buat file `lib/test-runner.ts` murni menggunakan fungsi JavaScript.
  - **Logika:** Implementasikan fungsi `runTests(userAnswer, tests, validAnswers, challengeType)` sesuai kode referensi pada `implementation.md`.

- [x] **Task 2.5: Buat Komponen Test Suite Panel (Panel 3)**
  - **Instruksi:** Buat `components/learn/TestSuite.tsx`.
  - **UI:** Tampilkan list assertion dan gunakan fungsi dari `lib/test-runner.ts` untuk memunculkan indikator Sukses (✓) atau Gagal (✗) secara real-time.

- [x] **Task 2.6: Integrasikan ke Halaman Lesson**
  - **Instruksi:** Buat file `app/learn/[curriculum]/[challengeId]/page.tsx`.
  - **Logika:** Panggil `ThreePanelLayout` dan masukkan `MateriPanel` di Panel 1, `InputPanel` di Panel 2, dan `TestSuite` di Panel 3. Gunakan dummy data untuk sementara jika Supabase belum terisi.

---

## Phase 3 — Curriculum & Navigation (Sistem Navigasi & Progress)

**Goal:** User bisa melihat daftar bab dan progress pembelajarannya.

- [x] **Task 3.1: Halaman Daftar Kurikulum**
  - **Instruksi:** Buat file `app/learn/page.tsx`. Tampilkan list kurikulum (misal: "Nahwu Dasar") yang didapatkan dari database Supabase (`curriculum` table).

- [x] **Task 3.2: Halaman Daftar Bab & Step**
  - **Instruksi:** Buat file `app/learn/[curriculum]/page.tsx`. Tampilkan tree/list `sections` dan `challenges`.

- [x] **Task 3.3: Implementasi Progress Gating**
  - **Instruksi:** Buat fungsi di halaman tersebut untuk membaca tabel `user_progress`. Disabled tombol/link pada step/challenge jika step sebelumnya belum diselesaikan.

- [x] **Task 3.4: Simpan Progress User**
  - **Instruksi:** Update `app/learn/[curriculum]/[challengeId]/page.tsx`. Saat seluruh test berhasil (pass) dan tombol "Lanjut" diklik, lakukan *upsert* data ke tabel `user_progress` melalui API route atau Server Actions.

---

## Phase 4 — Admin Panel (Pengelolaan Konten)

**Goal:** CRUD materi, bab, dan soal (challenge) via antarmuka browser untuk Admin.

- [x] **Task 4.1: Setup Admin Middleware / Auth Guard**
  - **Instruksi:** Buat layout khusus `app/admin/layout.tsx` yang mengecek apakah user memiliki role 'admin'. Jika bukan, *redirect* ke `/learn`.

- [x] **Task 4.2: Buat Admin Dashboard Dasar**
  - **Instruksi:** Buat `app/admin/page.tsx` berisi statistik sederhana (misal jumlah bab, total soal).

- [x] **Task 4.3: Halaman Editor Kurikulum**
  - **Instruksi:** Buat `app/admin/curriculum/page.tsx` untuk melakukan CRUD (tambah/edit/hapus) data ke tabel `curriculum` dan `sections`.

- [x] **Task 4.4: Halaman List Challenge & Editor Soal**
  - **Instruksi:** Buat `app/admin/challenges/page.tsx` (list soal) dan `app/admin/challenges/[id]/page.tsx` (form detail soal).
  - **UI/Logika:** Form ini harus memiliki input untuk teks materi, jawaban valid (Array JSON), test assertions (Array JSON), serta opsi *multiple choice*.

---

## Phase 5 — Polish & Launch (Finalisasi)

**Goal:** Menyiapkan aplikasi untuk penggunaan nyata dengan UI yang matang dan SEO yang baik.

- [x] **Task 5.1: Halaman Profil User**
  - **Instruksi:** Buat `app/profile/page.tsx` untuk menampilkan statistik belajar (jumlah soal selesai, level, dll).

- [x] **Task 5.2: Optimasi Responsive Mobile**
  - **Instruksi:** Update `components/learn/ArabicKeyboard.tsx` agar tombol dapat melakukan *wrap* dan ukurannya menyesuaikan layar kecil.

- [x] **Task 5.3: Error Handling & Loading States**
  - **Instruksi:** Tambahkan file `loading.tsx` and `error.tsx` pada folder-folder utama untuk pengalaman user yang lebih mulus.

- [x] **Task 5.4: SEO Metadata & OpenGraph**
  - **Instruksi:** Update `app/layout.tsx` dengan metadata lengkap (title, description, keywords) dan OpenGraph tags.

- [x] **Task 5.5: Seed Data & Testing**
  - **Instruksi:** Masukkan minimal 10 soal nyata ke Supabase dan lakukan pengetesan alur belajar dari awal hingga akhir.

---

## Instruksi Tambahan (Aturan Main untuk Agent)
1. **Satu Task, Satu Iterasi:** Jangan mencoba membuat lebih dari 3 file baru dalam satu respon. Selesaikan satu komponen/task hingga tuntas, cek *linter* atau *type error*, sebelum berlanjut ke task berikutnya.
2. **TypeScript Strict:** Selalu buat tipe data di `types/index.ts` untuk setiap entitas tabel Supabase atau struktur objek agar tidak ada peringatan `any`.
3. **Konfirmasi:** Setelah menyelesaikan sebuah Phase atau Task besar, selalu simpan *progress* dan laporkan hasilnya sebelum melanjutkan ke Phase berikutnya.
