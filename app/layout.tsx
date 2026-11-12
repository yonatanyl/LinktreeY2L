import type { Metadata } from "next";
import "./globals.css";

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": "https://y2lnatan.site/#person",
  name: "Yonatan Yusak Lestari",
  alternateName: ["Y2L", "Natan", "Yali"],
  jobTitle: "Data Analyst",
  description:
    "Data Analyst dan streamer Valorant Indonesia (Ex-Immortal II) yang dikenal sebagai Y2L, Natan, atau Yali.",
  image: "https://y2lnatan.site/profile.jpg",
  url: "https://y2lnatan.site/",
  sameAs: [
    "https://www.linkedin.com/in/yonatanyl/",
    "https://github.com/yonatanyl",
    "https://www.youtube.com/@y2lyali",
    "https://tiktok.com/@y2lnatan",
    "https://instagram.com/yonatanyl",
    "https://yonatanyl.github.io/LinktreeY2L/",
  ],
};

// 🚀 INI ADALAH INTI DARI SEO NEXT.JS ANDA
export const metadata: Metadata = {
  metadataBase: new URL("https://y2lnatan.site/"),
  title: "Y2L | Yali | Natan - Streamer Valorant & Data Analyst",
  description: "Profil resmi Y2L (Natan / Yali / Nat / Tan). Ex-Immo 2 Valorant Streamer Indonesia, Tech Content Creator, dan Profesional Data Analyst. Join Havefun Party sekarang!",
  keywords: [
    "Y2L", "Natan", "Yali", "Nat", "Tan", "Streamer Valorant", 
    "Streamer Valorant", "Valorant Indonesia", "Ex-Immo 2", "Valorant Gameplay", 
    "Data Analyst", "Data Practitioner", "Tech Creator", "Mabar Valorant"
  ],
  authors: [{ name: "Natan" }],
  alternates: {
    canonical: "https://y2lnatan.site/",
  },
  openGraph: {
    title: "Y2L | Yali | Natan - Streamer Valorant & Data Analyst",
    description: "Ex-Immo 2 Valorant Streamer Indonesia & Profesional Data Analyst.",
    url: "https://y2lnatan.site/",
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
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(personJsonLd).replace(/</g, "\\u003c"),
          }}
        />
      </head>
      <body className="antialiased bg-[#05070f]">
        {children}
      </body>
    </html>
  );
}