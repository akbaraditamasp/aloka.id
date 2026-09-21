// Dummy content seed for the Aloka preview site (see PRODUCT.md §5/§8 — prices/names are placeholders).
//
//   bun run seed                       # against http://localhost:3000
//   SEED_URL=https://... SEED_EMAIL=... SEED_PASSWORD=... bun run seed
//
// Talks to the running server's admin API, so start `bun run dev` (or `start`) first. Idempotent:
// a record whose unique slug already exists (409) is left untouched and reused for relations, so it
// never overwrites edits made in the admin panel. If the database has no admin user yet, the given
// credentials are used to create the first one.

const BASE = (process.env.SEED_URL ?? "http://localhost:3000").replace(/\/+$/, "");
const EMAIL = process.env.SEED_EMAIL ?? "admin@aloka.id";
const PASSWORD = process.env.SEED_PASSWORD ?? "";

if (!PASSWORD) {
  console.error("Set SEED_PASSWORD (and optionally SEED_EMAIL / SEED_URL) before running the seed.");
  process.exit(1);
}

const api = async (method: string, path: string, body?: unknown, token?: string) => {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: { "content-type": "application/json", ...(token ? { authorization: `Bearer ${token}` } : {}) },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const json = await res.json().catch(() => ({}));
  return { status: res.status, json: json as any };
};

const login = async () => {
  const setup = await api("GET", "/api/setup/status");
  if (setup.json?.needsSetup ?? setup.json?.data?.needsSetup) {
    const created = await api("POST", "/api/setup", { name: "Admin", email: EMAIL, password: PASSWORD });
    if (created.status >= 300) throw new Error(`Admin setup failed: ${JSON.stringify(created.json)}`);
    console.log(`Created first admin user ${EMAIL}`);
    return created.json.data.token as string;
  }
  const res = await api("POST", "/api/auth/login", { email: EMAIL, password: PASSWORD });
  if (res.status >= 300) throw new Error(`Login failed (${res.status}) — check SEED_EMAIL / SEED_PASSWORD`);
  return res.json.data.token as string;
};

const token = await login();

const counts: Record<string, { created: number; skipped: number }> = {};
const tally = (model: string, key: "created" | "skipped") => {
  counts[model] ??= { created: 0, skipped: 0 };
  counts[model][key]++;
};

// Creates the record, or (on a unique-slug 409) looks the existing one up. Returns the bare record id
// (relations expect "abc123", not "facilitator:abc123").
const ensure = async (model: string, slug: string, body: Record<string, unknown>, slugField = "slug") => {
  const res = await api("POST", `/api/${model}`, { ...body, [slugField]: slug }, token);
  if (res.status < 300) {
    tally(model, "created");
    return String(res.json.data.id).split(":")[1] ?? "";
  }
  if (res.status === 409) {
    tally(model, "skipped");
    const found = await api("GET", `/api/${model}?filters[${slugField}]=${encodeURIComponent(slug)}&limit=1`, undefined, token);
    return String(found.json?.data?.[0]?.id ?? "").split(":")[1] ?? "";
  }
  throw new Error(`${model} "${slug}" failed (${res.status}): ${JSON.stringify(res.json)}`);
};

// Event times are written in WIB (UTC+7); `days` is relative to now so seeded events are always upcoming.
const wib = (days: number, hour: number) => {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() + days);
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), hour - 7, 0, 0)).toISOString();
};

// ---------------------------------------------------------------- facilitators
const facilitatorData = [
  {
    slug: "heri-setiawan",
    name: "Dr. Heri Setiawan, S.E., M.M.",
    title: "Konsultan Tata Kelola Koperasi",
    city: "Semarang",
    expertise: ["Tata kelola", "AD/ART", "Pelaporan RAT"],
    bio: "<p>Pendamping koperasi dengan pengalaman lebih dari 15 tahun di bidang tata kelola dan penyusunan AD/ART. Aktif memfasilitasi pelatihan pengurus dan pengawas koperasi di berbagai daerah.</p>",
  },
  {
    slug: "ratna-kusumawati",
    name: "Ratna Kusumawati, S.E., Ak.",
    title: "Konsultan Keuangan & Perpajakan Koperasi",
    city: "Bandung",
    expertise: ["Laporan keuangan", "Perhitungan SHU", "Pajak koperasi"],
    bio: "<p>Akuntan yang berfokus pada pembukuan, laporan keuangan, dan kepatuhan pajak koperasi simpan pinjam maupun koperasi konsumen.</p>",
  },
  {
    slug: "andika-pratama",
    name: "Andika Pratama, S.H., M.Kn.",
    title: "Konsultan Legalitas Koperasi",
    city: "Jakarta",
    expertise: ["Akta pendirian", "SK Kemenkumham", "NIB & perizinan"],
    bio: "<p>Praktisi hukum yang mendampingi pendirian badan hukum koperasi dan pengurusan izin operasional, dari akta sampai NIB.</p>",
  },
  {
    slug: "maya-anggraeni",
    name: "Maya Anggraeni, S.E.",
    title: "Asesor & Fasilitator Sertifikasi Kompetensi",
    city: "Yogyakarta",
    expertise: ["Sertifikasi kompetensi", "Uji kompetensi", "Try out"],
    bio: "<p>Asesor dan fasilitator yang menyiapkan peserta menghadapi uji kompetensi pengurus, pengawas, dan pengelola keuangan koperasi.</p>",
  },
  {
    slug: "yusuf-hidayat",
    name: "Yusuf Hidayat, S.E., M.M.",
    title: "Konsultan Pembiayaan Koperasi",
    city: "Surabaya",
    expertise: ["Pengajuan KUR", "LPDB-KUMKM", "Kredit bank"],
    bio: "<p>Berpengalaman menyusun proposal dan kelengkapan pengajuan pembiayaan koperasi ke bank, program KUR, dan LPDB-KUMKM.</p>",
  },
  {
    slug: "lestari-wulandari",
    name: "Lestari Wulandari, S.Kom.",
    title: "Fasilitator Digitalisasi Koperasi",
    city: "Malang",
    expertise: ["Digitalisasi administrasi", "Aplikasi simpan pinjam"],
    bio: "<p>Membantu koperasi beralih dari pencatatan manual ke sistem digital yang rapi dan mudah diaudit.</p>",
  },
];

const fid: Record<string, string> = {};
for (const [i, f] of facilitatorData.entries()) {
  const { slug, ...rest } = f;
  fid[slug] = await ensure("facilitator", slug, { ...rest, status: "PUBLISH", sortOrder: i + 1 });
}

// ---------------------------------------------------------------- testimonials
const testimonials = [
  ["Budi Santoso", "Ketua", "Koperasi Tani Makmur — Jawa Tengah", "Dulu urus izin USP koperasi kami tersendat bertahun-tahun karena bingung dokumennya. Didampingi Aloka, semua proses jadi jelas tahapannya dan akhirnya izin keluar dalam hitungan bulan."],
  ["Siti Rahma", "Bendahara", "Koperasi Sejahtera Bersama — Lampung", "Kelas akuntansi & laporan keuangannya gampang diikuti walau saya bukan lulusan akuntansi. Sekarang neraca dan pembagian SHU koperasi kami rapi dan bisa dipertanggungjawabkan ke anggota."],
  ["Andi Prasetyo", "Pengurus", "KSP Amanah — Yogyakarta", "Konsultan Aloka datang langsung ke koperasi kami buat pendampingan pengajuan pembiayaan. Fee-nya jelas di depan, tidak ada potongan hasil, dan pengajuan kami akhirnya disetujui bank."],
  ["Rina Wulandari", "Ketua", "Koperasi Wanita Mandiri — Bali", "Ikut kelas online dan sertifikasi kompetensi Aloka bikin saya lebih percaya diri ngurus koperasi. Materinya jelas, bisa diulang kapan saja, dan sertifikatnya diakui pas kami ajukan izin operasional."],
  ["Hendra Gunawan", "Ketua", "Koperasi Nelayan Bahari — Sulawesi Selatan", "Kami mendirikan koperasi dari nol dan sama sekali buta soal akta sama NIB. Tim Aloka pandu step by step sampai badan hukum kami resmi terbit."],
  ["Dewi Lestari", "Sekretaris", "Koperasi Konsumen Sejahtera — Sumatera Utara", "Webinar rutin Aloka selalu ada insight baru buat pengurus kayak saya. Enak juga bisa langsung tanya ke fasilitatornya kalau ada yang belum paham."],
] as const;

for (const [i, [name, position, organization, quote]] of testimonials.entries()) {
  // Testimonials have no natural unique key, so dedupe on the name.
  const existing = await api("GET", `/api/testimonial?search=${encodeURIComponent(name)}&limit=5`, undefined, token);
  if ((existing.json?.data ?? []).some((t: any) => t.name === name)) {
    tally("testimonial", "skipped");
    continue;
  }
  const res = await api("POST", "/api/testimonial", { name, position, organization, quote, status: "PUBLISH", sortOrder: i + 1 }, token);
  if (res.status >= 300) throw new Error(`testimonial "${name}" failed: ${JSON.stringify(res.json)}`);
  tally("testimonial", "created");
}

// ---------------------------------------------------------------- courses
const courseData = [
  ["dasar-dasar-perkoperasian", "Dasar-Dasar Perkoperasian", "TATA_KELOLA", "PEMULA", 40, 150000, "YES", "heri-setiawan", "Kenali prinsip, struktur, dan tata kelola koperasi dari nol — fondasi wajib sebelum urus legalitas & keuangan.", ["Prinsip dan jati diri koperasi", "Struktur organisasi: rapat anggota, pengurus, pengawas", "Hak dan kewajiban anggota"]],
  ["akuntansi-laporan-keuangan-koperasi", "Akuntansi & Laporan Keuangan Koperasi", "KEUANGAN", "MENENGAH", 55, 200000, "YES", "ratna-kusumawati", "Susun neraca, laporan rugi-laba, dan perhitungan SHU koperasi Anda dengan benar dan bisa diaudit.", ["Pencatatan transaksi koperasi", "Menyusun neraca dan laporan laba rugi", "Menghitung dan menyajikan SHU"]],
  ["tata-kelola-shu-koperasi", "Tata Kelola & SHU Koperasi", "TATA_KELOLA", "SULIT", 50, 200000, "YES", "heri-setiawan", "Pahami peran pengurus, pengawas, dan anggota, serta cara pembagian SHU yang adil dan transparan.", ["Peran pengurus, pengawas, dan anggota", "Mekanisme pembagian SHU sesuai AD/ART", "Transparansi dan akuntabilitas pengurus"]],
  ["legalitas-dasar-koperasi", "Legalitas Dasar Koperasi", "LEGALITAS", "PEMULA", 35, 150000, "NO", "andika-pratama", "Pahami alur akta pendirian, SK Kemenkumham, sampai NIB — biar tidak bingung waktu mulai mengurusnya.", ["Alur pendirian badan hukum koperasi", "Dokumen yang perlu disiapkan", "Mengenal NIB dan izin turunannya"]],
  ["strategi-pengajuan-pembiayaan", "Strategi Pengajuan Pembiayaan", "KEUANGAN", "MENENGAH", 45, 200000, "NO", "yusuf-hidayat", "Susun proposal dan laporan yang meyakinkan bank atau lembaga keuangan untuk membiayai koperasi Anda.", ["Menilai kelayakan koperasi di mata pemberi pembiayaan", "Menyusun proposal dan kelengkapan dokumen", "Mengenal KUR dan LPDB-KUMKM"]],
  ["manajemen-unit-simpan-pinjam", "Manajemen Unit Simpan Pinjam", "TATA_KELOLA", "MENENGAH", 50, 200000, "NO", "ratna-kusumawati", "Kelola alur simpan pinjam anggota secara sehat — dari analisis kelayakan sampai pengelolaan risiko macet.", ["Analisis kelayakan pinjaman anggota", "Pengelolaan risiko dan pinjaman macet", "Pelaporan unit simpan pinjam"]],
  ["digitalisasi-administrasi-koperasi", "Digitalisasi Administrasi Koperasi", "DIGITALISASI", "PEMULA", 30, 150000, "NO", "lestari-wulandari", "Mulai pindah dari pencatatan manual ke sistem digital — lebih rapi, cepat, dan minim salah catat.", ["Memilih aplikasi administrasi koperasi", "Migrasi data anggota dan simpanan", "Menjaga keamanan data"]],
  ["kepemimpinan-pengurus-koperasi", "Kepemimpinan Pengurus Koperasi", "TATA_KELOLA", "PEMULA", 35, 150000, "NO", "heri-setiawan", "Bangun kepercayaan anggota lewat kepemimpinan yang terbuka, komunikatif, dan bertanggung jawab.", ["Gaya kepemimpinan pengurus koperasi", "Komunikasi dengan anggota", "Mengelola konflik dan pengambilan keputusan"]],
  ["audit-internal-koperasi", "Audit Internal Koperasi", "KEUANGAN", "SULIT", 55, 200000, "NO", "ratna-kusumawati", "Bekali pengawas dengan teknik pemeriksaan internal sederhana sebelum audit eksternal atau RAT.", ["Tujuan dan ruang lingkup audit internal", "Teknik pemeriksaan kas, simpanan, dan pinjaman", "Menyusun laporan hasil pengawasan"]],
] as const;

for (const [i, [slug, title, category, level, durationMinutes, price, featured, fac, summary, outcomes]] of courseData.entries()) {
  await ensure("course", slug, {
    title, category, level, durationMinutes, price, featured, summary,
    outcomes: [...outcomes],
    description: `<p>${summary}</p><p>Materi disajikan dalam video singkat dengan studi kasus koperasi, dilengkapi kuis di setiap bagian. Anda bisa menonton ulang kapan saja dan mendapatkan sertifikat setelah menyelesaikan kelas.</p>`,
    facilitator: fid[fac],
    status: "PUBLISH",
    sortOrder: i + 1,
  });
}

// ---------------------------------------------------------------- certifications
const certificationData = [
  ["pengelolaan-keuangan-koperasi", "Pengelolaan Keuangan Koperasi", "Bendahara & staf keuangan", "Kompetensi pencatatan, laporan keuangan, dan perhitungan SHU untuk bendahara dan staf keuangan koperasi.", 750000, ["Melakukan pencatatan transaksi koperasi", "Menyusun laporan keuangan koperasi", "Menghitung dan menyajikan SHU"], ["Pengurus atau staf keuangan koperasi", "Memahami dasar pencatatan keuangan"]],
  ["manajemen-koperasi", "Manajemen Koperasi", "Ketua & pengurus", "Kompetensi tata kelola, perencanaan, dan pengambilan keputusan organisasi untuk ketua dan pengurus koperasi.", 850000, ["Menyusun rencana kerja dan anggaran koperasi", "Menjalankan tata kelola organisasi koperasi", "Memimpin rapat anggota"], ["Pengurus koperasi aktif", "Memahami AD/ART koperasi"]],
  ["pengawasan-koperasi", "Pengawasan Koperasi", "Pengawas", "Kompetensi audit internal, evaluasi kinerja pengurus, dan kepatuhan aturan untuk pengawas koperasi.", 750000, ["Melakukan audit internal sederhana", "Mengevaluasi kinerja pengurus", "Memeriksa kepatuhan terhadap AD/ART dan regulasi"], ["Pengawas atau calon pengawas koperasi"]],
] as const;

for (const [i, [slug, name, targetRole, summary, price, competencyUnits, requirements]] of certificationData.entries()) {
  await ensure("certification", slug, {
    name, targetRole, summary, price,
    competencyUnits: [...competencyUnits],
    requirements: [...requirements],
    description: `<p>${summary}</p><p>Skema ini disusun berdasarkan standar kompetensi kerja yang relevan. Aloka mendampingi peserta dari pendaftaran, try out, sampai uji kompetensi oleh asesor.</p>`,
    status: "PUBLISH",
    sortOrder: i + 1,
  });
}

// ---------------------------------------------------------------- events
const eventData = [
  ["webinar-strategi-legalitas-ksp-usp", "Webinar: Strategi Legalitas KSP/USP", "WEBINAR", "ONLINE", "Zoom", 0, 300, 14, 19, 21, "andika-pratama", "Bahas syarat, tahapan, dan kesalahan umum dalam mengurus izin operasional KSP/USP."],
  ["workshop-laporan-keuangan-koperasi", "Workshop Penyusunan Laporan Keuangan Koperasi", "WORKSHOP", "OFFLINE", "Jakarta", 350000, 40, 30, 9, 15, "ratna-kusumawati", "Praktik langsung menyusun neraca dan laporan laba rugi koperasi dengan studi kasus nyata."],
  ["try-out-sertifikasi-kompetensi-aloka-batch-3", "Try Out Sertifikasi Kompetensi Aloka Batch 3", "PELATIHAN", "ONLINE", "Zoom", 0, 200, 45, 13, 16, "maya-anggraeni", "Latihan soal dan simulasi uji kompetensi sebelum ujian sertifikasi resmi."],
] as const;

for (const [slug, title, type, mode, venue, price, quota, days, from, to, fac, summary] of eventData) {
  await ensure("event", slug, {
    title, type, mode, venue, price, quota, summary,
    description: `<p>${summary}</p><p>Peserta mendapatkan materi dan kesempatan tanya jawab langsung dengan pemateri.</p>`,
    startAt: wib(days, from),
    endAt: wib(days, to),
    facilitator: fid[fac],
    status: "PUBLISH",
  });
}

// ---------------------------------------------------------------- services (prices per PRODUCT.md §5 dummy)
// slug is a stable key read by the pillar templates — don't rename.
type S = [slug: string, name: string, category: string, price: number, unit: string, summary: string];
const services: S[] = [
  ["art", "Penyusunan ART Koperasi", "KONSULTASI", 1000000, "", "Anggaran Rumah Tangga yang sesuai kebutuhan dan regulasi koperasi Anda."],
  ["persus", "Penyusunan Persus", "KONSULTASI", 1000000, "/ dokumen", "Peraturan khusus internal koperasi, dari simpanan sampai pengelolaan usaha."],
  ["sop", "Penyusunan SOP", "KONSULTASI", 1500000, "/ paket SOP", "Standar operasional prosedur agar kerja pengurus dan staf seragam dan bisa diaudit."],
  ["pelaporan-rat", "Pendampingan Pelaporan RAT", "KONSULTASI", 2000000, "/ sesi RAT", "Pendampingan persiapan sampai pelaporan Rapat Anggota Tahunan."],
  ["spt-tahunan", "Pelaporan Pajak Tahunan", "KONSULTAN_PAJAK", 1500000, "", "Penyusunan dan pelaporan SPT Tahunan Badan koperasi, dari rekap transaksi sampai pelaporan online lewat DJP."],
  ["pajak-shu", "Konsultasi Pajak SHU", "KONSULTAN_PAJAK", 1000000, "", "Perhitungan dan pemotongan pajak atas pembagian SHU ke anggota sesuai ketentuan yang berlaku, biar tidak jadi temuan di kemudian hari."],
  ["ppn-efaktur", "PPN & e-Faktur Unit Usaha", "KONSULTAN_PAJAK", 1500000, "", "Pendampingan pengukuhan PKP dan penerbitan e-Faktur untuk unit usaha koperasi yang sudah wajib PPN."],
  ["pemeriksaan-pajak", "Pendampingan Pemeriksaan Pajak", "KONSULTAN_PAJAK", 2500000, "", "Konsultan Aloka mendampingi koperasi Anda menghadapi pemeriksaan atau klarifikasi dari kantor pajak."],
  ["laporan-tahunan", "Laporan Keuangan Tahunan", "LAPORAN_KEUANGAN", 2000000, "", "Penyusunan neraca, laporan laba rugi, laporan arus kas, dan catatan atas laporan keuangan koperasi untuk satu tahun buku."],
  ["pembukuan-bulanan", "Pembukuan Bulanan", "LAPORAN_KEUANGAN", 750000, "/bulan", "Pencatatan transaksi dan rekonsiliasi tiap bulan, sehingga posisi keuangan koperasi selalu jelas dan tidak menumpuk di akhir tahun."],
  ["penyajian-shu", "Perhitungan & Penyajian SHU", "LAPORAN_KEUANGAN", 1000000, "", "Perhitungan Sisa Hasil Usaha dan pembagiannya ke anggota sesuai AD/ART, lengkap dengan penyajiannya untuk RAT."],
  ["laporan-pembiayaan", "Laporan untuk Pembiayaan & Pemeriksaan", "LAPORAN_KEUANGAN", 1500000, "", "Penyesuaian format laporan keuangan untuk pengajuan pembiayaan bank/LPDB-KUMKM atau pemeriksaan dari dinas dan pengawas koperasi."],
  ["akta", "Akta Pendirian", "LEGALITAS", 1500000, "", "Penyusunan akta pendirian koperasi oleh notaris."],
  ["sk", "SK Pengesahan Kemenkumham", "LEGALITAS", 1000000, "", "Pengajuan dan pengawalan SK pengesahan badan hukum koperasi."],
  ["npwp", "NPWP Koperasi", "LEGALITAS", 500000, "", "Pengurusan NPWP badan untuk koperasi."],
  ["nib", "NIB & Izin Turunan", "LEGALITAS", 5000000, "", "Penerbitan NIB beserta KBLI, PKKPR, izin lingkungan, dan kewajiban LKPM."],
  ["ukk", "Pendampingan UKK Pengurus", "IZIN_KSP_USP", 2000000, "/ orang", "Persiapan Uji Kepatutan dan Kelayakan bagi pengurus koperasi simpan pinjam."],
  ["slik", "SLIK OJK / BI Checking", "IZIN_KSP_USP", 300000, "/ orang", "Pengecekan dan bantuan pemenuhan SLIK OJK / BI Checking pengurus."],
  ["tidak-pailit", "Surat Keterangan Tidak Pailit", "IZIN_KSP_USP", 750000, "/ orang", "Bantuan pengurusan surat keterangan tidak pailit dari pengadilan."],
  ["bank", "Pembiayaan Bank & Lembaga Keuangan", "PEMBIAYAAN", 2000000, "", "Pendampingan penyusunan proposal dan kelengkapan pengajuan kredit ke bank dan lembaga keuangan."],
  ["kur", "Program Pemerintah (KUR)", "PEMBIAYAAN", 2000000, "", "Pendampingan pengajuan Kredit Usaha Rakyat untuk koperasi dan anggotanya."],
  ["lpdb", "LPDB-KUMKM", "PEMBIAYAAN", 2500000, "", "Pendampingan pengajuan dana bergulir LPDB-KUMKM."],
];

for (const [i, [slug, name, category, price, unit, summary]] of services.entries()) {
  await ensure("service", slug, { name, category, price, ...(unit ? { priceUnit: unit } : {}), summary, status: "PUBLISH", sortOrder: i + 1 });
}

// ---------------------------------------------------------------- report
console.log("\nSeed complete:");
for (const [model, { created, skipped }] of Object.entries(counts)) {
  console.log(`  ${model.padEnd(14)} +${created} new, ${skipped} already existed`);
}
