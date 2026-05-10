import type { Metadata } from "next";
import { Providers } from "@/components/providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "CourseSphere",
  description: "Gestão colaborativa de cursos online",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="h-full antialiased">
      <body className="min-h-full bg-[#f6faf7] text-slate-950">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
