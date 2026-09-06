# STYLE.md — Aloka Brand & UI Style Guide

Panduan visual untuk website Aloka. Dasar: logo resmi (`static/logo.png`, `static/logo-full.png`) dan referensi struktural [dikoin.id](https://dikoin.id) (lihat `PRODUCT.md` §7 untuk konteks bisnis). File ini murni soal **tampilan** — untuk model bisnis, sitemap, dan copy, rujuk `PRODUCT.md`.

---

## 1. Brand essence

- **Tagline:** "Koperasi Naik Kelas, Bareng Aloka"
- **Positioning:** teman koperasi menuju legal, sehat keuangan, dan bankable.
- **Read dari logo:** bentuk "A" adalah gunung/puncak yang sedang didaki — searah dengan "naik kelas". Lengkungan di bawahnya menyerupai jembatan/pelukan yang menopang dua kaki huruf, dengan satu titik (dot) di tengah bawah — dibaca sebagai tujuan/destinasi yang dituju bersama. Gradasi warna dari biru langit cerah di puncak ke biru dongker/indigo dalam di dasar menyampaikan perjalanan dari **potensi (langit, jernih, digital)** menuju **fondasi (stabil, tepercaya, institusional)**.
- **Kata sifat brand:** tepercaya, membimbing (bukan menggurui), optimis, rapi/profesional, membumi (bukan korporat-dingin).

---

## 2. Logo

| Asset | Kapan dipakai |
|---|---|
| `static/logo.png` | Ikon saja (favicon, avatar, app icon, ruang sempit, watermark) |
| `static/logo-full.png` | Lockup lengkap (mark + wordmark "aloka") — header, footer, dokumen, materi cetak |

**Aturan pakai:**
- Selalu beri clear space di sekeliling logo minimal setinggi lengkungan "jembatan" pada mark.
- Jangan mengubah rasio gradasi, memutar mark, atau memisah dot dari lengkungan.
- Di atas foto/latar ramai, taruh logo di atas panel solid (putih atau Navy Deep) — jangan langsung di atas foto tanpa kontras.
- Wordmark selalu lowercase ("aloka"), jangan di-uppercase-kan atau diberi title case.
- Versi monokrom (putih polos, atau Navy Deep polos) dipakai bila gradasi tidak reproduksi dengan baik (favicon kecil, stempel, embossing).

---

## 3. Warna

Diambil langsung dari sampling gradasi logo — bukan pilihan generik "biru korporat".

### 3.1 Brand gradient (primer)

| Token | Hex | Peran |
|---|---|---|
| `brand-sky` | `#00ADEE` | Ujung terang gradasi — highlight, ikon aktif, hover state, aksen kecil |
| `brand-blue` | `#1369A9` | Titik tengah gradasi — warna interaktif utama (link, ikon, border aktif) |
| `brand-indigo` | `#1D4282` | Transisi gelap — background section gelap, hover pada tombol navy |
| `brand-navy` | `#242A6A` | Ujung gelap gradasi — teks brand, footer, tombol primer solid |

Gradient standar (dipakai di logo, boleh dipakai ulang untuk hero background/CTA aksen, **jangan** untuk body text):

```css
background: linear-gradient(160deg, #00ADEE 0%, #1369A9 45%, #1D4282 75%, #242A6A 100%);
```

Pakai gradient secukupnya — 1 elemen hero per halaman, atau underline/badge kecil. Kalau semua section pakai gradient, dampaknya hilang.

### 3.2 Netral

| Token | Hex | Peran |
|---|---|---|
| `ink` | `#0F172A` | Teks judul/body di atas putih (slate-900) |
| `ink-muted` | `#475569` | Teks sekunder, caption (slate-600) |
| `border` | `#E2E8F0` | Garis pembatas, card border (slate-200) |
| `surface` | `#F8FAFC` | Background section alternatif (slate-50) |
| `surface-white` | `#FFFFFF` | Background dasar |

### 3.3 Aksen hangat (CTA & status)

Biru gradasi bagus untuk identitas, tapi kalau dipakai juga untuk semua tombol, halaman terasa datar dan CTA tidak menonjol (masalah umum di situs institusi finansial/koperasi). Pakai satu aksen hangat untuk aksi utama & elemen "hasil/pertumbuhan" — selaras dengan SHU/kemakmuran koperasi:

| Token | Hex | Peran |
|---|---|---|
| `accent-amber` | `#F5A524` | CTA primer ("Daftar Sekarang", "Konsultasi Gratis"), badge "Populer", angka pencapaian |
| `accent-amber-dark` | `#C97F0E` | Hover state untuk tombol amber |

Status semantik (dipakai apa adanya, jangan diberi makna lain):

| Token | Hex | Peran |
|---|---|---|
| `success` | `#16A34A` | Konfirmasi, "Terverifikasi", legal/lunas |
| `warning` | `#D97706` | Perhatian, deadline mendekat |
| `danger` | `#DC2626` | Error form, dokumen ditolak |

### 3.4 Kontras & aksesibilitas

- Teks di atas `brand-navy`/gradient gelap: putih (`#FFFFFF`) atau `brand-sky` untuk aksen, minimum AA (4.5:1) untuk body text.
- `accent-amber` di atas putih **tidak** memenuhi AA untuk teks kecil — pakai hanya untuk background tombol dengan teks putih/`brand-navy`, bukan untuk teks amber di atas putih.
- Jangan taruh `brand-sky` (#00ADEE) sebagai teks di atas putih untuk body copy — kontrasnya lemah; gunakan `brand-blue` (#1369A9) atau lebih gelap untuk teks link.

---

## 4. Tipografi

Plus Jakarta Sans + Inter sudah jadi pasangan default hampir semua produk digital Indonesia — dipakai di kompetitor, fintech, sampai landing page generik, jadi tidak membantu Aloka terlihat beda. Sebagai gantinya, Aloka pakai sistem tiga peran dengan karakter yang lebih tegas, tapi tetap masuk akal untuk konteks konsultan keuangan/legalitas koperasi:

| Peran | Font | Alasan | Fallback stack |
|---|---|---|---|
| Heading / display | **Bricolage Grotesque** | Grotesque geometris dengan kepribadian — sudut tegas tapi tidak kaku, terasa ambisius/"naik kelas" tanpa jadi playful berlebihan. Variable font, tersedia gratis di Google Fonts, belum jenuh dipakai di pasar Indonesia. | `"Bricolage Grotesque", ui-sans-serif, system-ui, sans-serif` |
| Body / UI | **Figtree** | Humanis, hangat, sangat legible untuk paragraf panjang (syarat legalitas, penjelasan skema pembiayaan) — cocok dengan nada "teman koperasi" tanpa terasa kaku seperti grotesque murni untuk body text. | `Figtree, ui-sans-serif, system-ui, sans-serif` |
| Angka & data finansial | **JetBrains Mono** | Dipakai khusus untuk angka: harga, statistik pencapaian, nomor sertifikat, tabel laporan keuangan. Karakter tabular monospace memberi kesan "data yang bisa diaudit" — selaras dengan positioning bankable/akuntabel, sekaligus jadi elemen visual yang unik dan langsung dikenali sebagai "ini angka penting". | `"JetBrains Mono", ui-monospace, monospace` |

**Cara pakai angka mono (§4 lanjutan):** dipakai untuk elemen berdiri sendiri yang butuh ketegasan (hero stat "500+ Koperasi Didampingi", harga di card layanan, baris tabel laporan) — bukan untuk angka yang muncul di tengah kalimat body text biasa (itu tetap ikut font body).

**Skala & bobot:**

- H1 (hero): 40–56px / Bricolage Grotesque ExtraBold (800) / `leading-tight` / `tracking-tight`
- H2 (section title): 28–36px / Bricolage Grotesque Bold (700)
- H3 (card title): 18–20px / Bricolage Grotesque SemiBold (600)
- Body: 16px / Figtree Regular (400) / `leading-relaxed` untuk paragraf panjang
- Caption/meta: 13–14px / Figtree Medium (500) / `ink-muted`
- Angka besar (stat/harga): 32–48px / JetBrains Mono Bold (700) / `font-variant-numeric: tabular-nums`

Judul besar boleh pakai `brand-navy` solid, atau sesekali gradient text (`background-clip: text`) untuk 1–2 kata kunci di hero — jangan seluruh kalimat. Bricolage Grotesque punya varian optical size (`opsz`) — untuk H1/hero pakai setting besar (36–96) agar sudutnya lebih tajam dan ekspresif; untuk H3/label kecil turunkan ke 14–24 agar tetap rapi di ukuran kecil.

---

## 5. Bentuk, spasi, elevasi

- **Radius:** `rounded-2xl` (16px) untuk card & panel besar, `rounded-full` untuk tombol & badge — mengikuti kelengkungan organik pada mark logo (bukan kotak tajam).
- **Spacing:** skala Tailwind default (4px base). Section padding: `py-16 md:py-24`. Card padding: `p-6` sampai `p-8`.
- **Shadow:** halus, bukan drop shadow gelap — `shadow-sm` / `shadow-lg` dengan opacity rendah, warna shadow condong ke `brand-navy` transparan alih-alih hitam murni, contoh: `box-shadow: 0 12px 24px -8px rgb(36 42 106 / 0.15)`.
- **Border:** 1px `border` (slate-200) untuk card di atas putih; card di atas section gelap pakai `border-white/10`.

---

## 6. Komponen

### Tombol
- **Primary:** solid `accent-amber`, teks `brand-navy` atau putih, `rounded-full`, padding `px-6 py-3`, hover → `accent-amber-dark`.
- **Secondary:** outline `brand-blue` di atas putih, teks `brand-blue`, hover → fill `brand-blue` teks putih.
- **Ghost/tertiary (di atas gradient gelap):** border putih/30%, teks putih, hover → background putih/10%.
- Jangan pernah dua tombol gradient bersebelahan — gradient hanya untuk 1 elemen fokus per section.

### Card (kelas, layanan, fasilitator)
- Background putih, border `border`, radius `rounded-2xl`, shadow halus.
- Gambar/thumbnail di atas (rasio 16:9 atau 4:3), radius mengikuti card.
- Badge kategori kecil (mis. "Akademi", "Konsultasi") — pill kecil dengan background `surface` + teks `brand-blue`, atau solid amber untuk "Populer"/"Terbaru".
- Hover: elevasi shadow naik sedikit + border berubah ke `brand-blue/30`, jangan translate/scale besar (situs institusional, bukan playful).

### Stats bar (angka pencapaian — pola dari dikoin.id)
- Section dengan background gradient brand atau `brand-navy` solid, teks putih.
- Angka besar (Plus Jakarta Sans, bold, `accent-amber` atau putih) + label kecil di bawahnya (`text-white/70`).
- Grid 2–4 kolom, dipisah garis tipis putih/10% antar kolom di desktop.

### Navigasi
- Header sticky, putih dengan `border-b`, logo (`logo-full.png`) kiri, menu tengah/kanan.
- Menu utama: Akademi, Konsultasi, Legalitas & Pembiayaan, Fasilitator, Event, Tentang — dropdown untuk 3 pilar yang punya sub-halaman (ikuti struktur `PRODUCT.md` §6).
- Tombol "Masuk" (ghost/outline) + "Daftar Sekarang" (amber, solid) di ujung kanan.
- Link aktif: teks `brand-blue` + underline tipis, bukan background block penuh.

### Hero
- Dua pola yang konsisten dipakai bergantian antar halaman:
  1. **Gradient hero** (beranda, landing pilar): background gradient brand penuh, teks putih, headline besar + subcopy + 2 CTA (amber solid + ghost outline).
  2. **Light hero** (halaman dalam/katalog): background putih/`surface`, headline `brand-navy`, breadcrumb di atas judul, ilustrasi/foto di kanan.

### Foto & imagery
- Gaya dikoin.id: foto dokumenter nyata (pelatihan, rapat pengurus koperasi, tanda tangan dokumen) — bukan stock photo generik orang tersenyum ke kamera tanpa konteks.
- Terapkan duotone/overlay tipis gradient brand (opacity 10–20%) di atas foto pada hero agar menyatu dengan palet, tapi jangan sampai foto jadi ilegal dibaca.
- Ikon: line icon dengan stroke 1.5–2px, sudut membulat, warna `brand-blue` di atas putih atau putih di atas gradient — hindari icon set filled/3D yang kontras gayanya dengan mark logo yang minimal. Implementasi icon wajib lewat Iconify — lihat §9.2.

---

## 7. Voice tertulis di UI (micro-copy)

- Bahasa Indonesia, orang kedua langsung ("Anda"/tanpa "Anda" bila lebih natural), aktif, bukan pasif birokratis.
- CTA memakai kata kerja + hasil: "Daftar Sekarang", "Konsultasi Gratis", "Cek Kelayakan Pembiayaan" — bukan "Klik di sini" atau "Submit".
- Nada membimbing seorang teman yang paham regulasi, bukan menggurui atau menakut-nakuti soal legalitas. Hindari jargon berlebihan tanpa penjelasan (SHU, KSP/USP boleh dipakai tapi beri konteks singkat di first mention).

---

## 8. Referensi implementasi Tailwind v4 (opsional, saat siap dipakai)

Proyek ini pakai Tailwind v4 tanpa file config — token custom didefinisikan lewat `@theme` di `src/client/app.css`. Contoh siap tempel saat implementasi dimulai (belum diterapkan ke file — ini hanya referensi):

```css
@import "tailwindcss";
@source "../views/**/*.edge";

@theme {
  --color-brand-sky: #00ADEE;
  --color-brand-blue: #1369A9;
  --color-brand-indigo: #1D4282;
  --color-brand-navy: #242A6A;

  --color-accent-amber: #F5A524;
  --color-accent-amber-dark: #C97F0E;

  --color-ink: #0F172A;
  --color-ink-muted: #475569;

  --font-display: "Bricolage Grotesque", ui-sans-serif, system-ui, sans-serif;
  --font-sans: Figtree, ui-sans-serif, system-ui, sans-serif;
  --font-mono: "JetBrains Mono", ui-monospace, monospace;
}
```

Ketiga font tersedia gratis di Google Fonts — saat implementasi, muat lewat `@import` di `app.css` atau `<link>` di layout, misalnya:

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,200..800&family=Figtree:wght@400;500;600;700&family=JetBrains+Mono:wght@500;700&display=swap" rel="stylesheet" />
```

Pemakaian di Edge template setelah token ini ada: `class="bg-brand-navy text-white font-display"`, `class="text-accent-amber font-mono tabular-nums"` untuk angka, dst.

---

## 9. Aturan implementasi (wajib)

Dua aturan berikut mengikat, bukan sekadar preferensi — berlaku untuk semua kode yang menyentuh tampilan (`.edge`, `main.ts`, `app.css`).

### 9.1 Tailwind token wajib, dilarang keras arbitrary value tanpa alasan jelas

- Selalu pakai token yang sudah ada — baik dari `@theme` custom (`bg-brand-navy`, `text-ink-muted`, `text-accent-amber`) maupun skala default Tailwind (`p-6`, `gap-4`, `rounded-2xl`, `text-2xl`). Kalau butuh value yang "kebetulan" sama dengan skala default (`text-[24px]` misalnya), pakai token-nya (`text-2xl`), bukan arbitrary value.
- **Dilarang keras** menulis arbitrary value (`bg-[#242A6A]`, `w-[327px]`, `text-[15px]`, `gap-[18px]`, `top-[42%]`) kecuali memang tidak ada padanannya di skala/token dan nilainya genuinely satu kali pakai (contoh yang bisa diterima: posisi hasil kalkulasi layout spesifik, nilai dari data dinamis/CMS yang rentangnya tidak bisa diprediksi di awal). Kalau dipakai, wajib sertakan komentar singkat di dekat class yang menjelaskan alasannya, supaya reviewer tahu itu keputusan sadar, bukan jalan pintas.
- Kalau kebutuhannya berulang (warna baru, breakpoint baru, spacing yang sering dipakai) → tambahkan sebagai token baru di `@theme` (`src/client/app.css`) dulu, baru dipakai sebagai class. Jangan tempel arbitrary value yang sama berkali-kali di banyak file — itu tandanya harus jadi token.

### 9.2 Icon wajib pakai Iconify

- Semua icon UI wajib lewat `@iconify/tailwind4` (sudah terpasang di `devDependencies`). Jangan taruh SVG icon inline manual, jangan pakai icon font lain (Font Awesome, dsb.), jangan `<img>` ke file SVG icon terpisah.
- Setup sekali di `src/client/app.css` saat implementasi dimulai:
  ```css
  @import "tailwindcss";
  @plugin "@iconify/tailwind4";
  @source "../views/**/*.edge";
  ```
- Pemakaian di template lewat utility class `icon-[<prefix>--<nama-icon>]`, dikombinasikan dengan utility Tailwind biasa (ukuran & warna tetap ikut §9.1 — token, bukan arbitrary):
  ```edge
  <span class="icon-[mdi--calendar-check] size-5 text-brand-blue"></span>
  ```
- Tidak wajib satu icon set untuk seluruh situs — boleh pilih set berbeda per konteks (mis. card fitur tertentu pakai **Lucide**, section lain pakai **Mdi**/**Solar**), asal sesuai kebutuhan konten. Yang wajib: **konsisten dalam satu konteks yang sama** — semua icon di dalam satu section/card group/komponen yang berulang harus dari set & gaya yang sama (jangan campur outline dan filled, atau dua set berbeda gayanya, di dalam grid card yang sama atau satu section yang sama). Gaya default tetap mengikuti §6: stroke ringan/line, sudut membulat.

---

## 10. Referensi & sumber

- Logo: `static/logo.png`, `static/logo-full.png` (warna disampling langsung dari file, lihat §3.1)
- Struktur & model bisnis: `PRODUCT.md`
- Referensi visual/struktural eksternal: [dikoin.id](https://dikoin.id) — dipakai untuk pola hero + stats bar + card katalog + gaya fotografi dokumenter, **bukan** untuk palet warna (Aloka punya gradasi biru-indigo sendiri dari logo, berbeda dari navy-putih polos dikoin.id).
