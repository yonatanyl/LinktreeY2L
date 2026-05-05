import type { Metadata } from "next";
import "./globals.css";

// 🚀 INI ADALAH INTI DARI SEO NEXT.JS ANDA
export const metadata: Metadata = {
  title: "Y2L | Yali | Natan - Streamer Valorant & Data Analyst",
  description: "Profil resmi Y2L (Natan / Yali / Nat / Tan). Ex-Immo 2 Valorant Streamer Indonesia, Tech Content Creator, dan Profesional Data Analyst. Join Havefun Party sekarang!",
  keywords: [
    "Y2L", "Natan", "Yali", "Nat", "Tan", "Yonatan Yusak Lestari", 
    "Streamer Valorant", "Valorant Indonesia", "Ex-Immo 2", "Valorant Gameplay", 
    "Data Analyst", "Data Practitioner", "Tech Creator", "Mabar Valorant"
  ],
  authors: [{ name: "Yonatan Yusak Lestari" }],
  openGraph: {
    title: "Y2L | Yali | Natan - Streamer Valorant & Data Analyst",
    description: "Ex-Immo 2 Valorant Streamer Indonesia & Profesional Data Analyst.",
    url: "https://linktr.ee/yonatanyl", // Ganti dengan domain Vercel/Custom Anda nanti
    siteName: "Y2L Official",
    images: [
      {
        url: "/profile.jpg",
        width: 800,
        height: 600,
        alt: "Y2L Natan Profile",
      },
    ],
    locale: "id_ID",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className="antialiased bg-[#080408]">
        {children}
      </body>
    </html>
  );
}