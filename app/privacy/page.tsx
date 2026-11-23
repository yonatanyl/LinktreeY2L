import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy – Y2L Uploader",
  description: "Kebijakan privasi Y2L Uploader, alat pribadi untuk mengelola video channel YouTube Y2L | yali.",
  alternates: { canonical: "https://y2lnatan.site/privacy" },
  robots: { index: true, follow: true },
};

const sections: { title: string; body: string[] }[] = [
  {
    title: "Apa itu Y2L Uploader / What it is",
    body: [
      "Y2L Uploader adalah alat pribadi yang hanya dipakai oleh pemilik channel YouTube Y2L | yali (@y2lyali) untuk mengelola video channel itu sendiri: upload, jadwal tayang, thumbnail, serta memposting dan menyematkan komentar.",
      "Y2L Uploader is a private tool used only by the owner of the YouTube channel Y2L | yali (@y2lyali) to manage that channel's own videos: uploading, scheduling, thumbnails, and posting/pinning comments. It is not offered to other users.",
    ],
  },
  {
    title: "Data yang diakses / Data accessed",
    body: [
      "Lewat YouTube API Services, aplikasi ini mengakses data YouTube milik pemilik channel sesuai izin yang diberikan (scope youtube.upload, youtube, youtube.force-ssl), hanya untuk channel Y2L | yali.",
      "Through the YouTube API Services the app accesses the channel owner's YouTube data under the granted scopes (youtube.upload, youtube, youtube.force-ssl), only for the Y2L | yali channel.",
    ],
  },
  {
    title: "Penyimpanan & berbagi / Storage and sharing",
    body: [
      "Token akses disimpan secara lokal di komputer pemilik channel. Data tidak dijual, tidak dibagikan ke pihak ketiga, dan tidak dipakai untuk iklan atau analitik pihak lain.",
      "Access tokens are stored locally on the channel owner's computer. No data is sold, shared with third parties, or used for advertising. Use of information received from Google APIs adheres to the Google API Services User Data Policy, including the Limited Use requirements.",
    ],
  },
  {
    title: "Mencabut akses / Revoking access",
    body: [
      "Akses bisa dicabut kapan saja di https://myaccount.google.com/permissions dan lewat setelan keamanan Google.",
      "Access can be revoked at any time at https://myaccount.google.com/permissions.",
    ],
  },
  {
    title: "Ketentuan terkait / Related terms",
    body: [
      "Dengan memakai aplikasi ini, pengguna terikat pada YouTube Terms of Service (https://www.youtube.com/t/terms) dan Google Privacy Policy (https://policies.google.com/privacy).",
      "By using this app you agree to the YouTube Terms of Service (https://www.youtube.com/t/terms); see also the Google Privacy Policy (https://policies.google.com/privacy).",
    ],
  },
  {
    title: "Kontak / Contact",
    body: ["Instagram @yonatanyl atau halaman utama https://y2lnatan.site."],
  },
];

export default function PrivacyPage() {
  return (
    <main className="min-h-screen px-6 py-16 text-slate-200">
      <div className="mx-auto max-w-2xl">
        <Link href="/" className="text-sm text-sky-400 hover:underline">
          ← y2lnatan.site
        </Link>
        <h1 className="mt-6 text-3xl font-bold text-white">Privacy Policy – Y2L Uploader</h1>
        <p className="mt-2 text-sm text-slate-400">Berlaku sejak / Effective: 23 November 2026</p>
        {sections.map((s) => (
          <section key={s.title} className="mt-10">
            <h2 className="text-lg font-semibold text-white">{s.title}</h2>
            {s.body.map((p) => (
              <p key={p.slice(0, 32)} className="mt-3 leading-relaxed">
                {p}
              </p>
            ))}
          </section>
        ))}
      </div>
    </main>
  );
}
