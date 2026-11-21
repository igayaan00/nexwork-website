import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import IntroSplash from "@/components/IntroSplash";
import { ScrollProgress } from "@/components/MotionWrapper";
import { readData } from "@/lib/db";

const inter = Inter({ subsets: ["latin"] });

export const dynamic = "force-dynamic";

export const metadata = {
  title: "NEXWORK — Media, AI Automation & Digital Marketing",
  description:
    "NEXWORK parent company housing three specialized agencies: Media Agency (Times of Today), AI Automation, and Digital Marketing.",
};

export default async function RootLayout({ children }) {
  const data = await readData();

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${inter.className} flex min-h-screen flex-col bg-[#FAFAFB] text-slate-900`}
      >
        <IntroSplash />
        <ScrollProgress />
        <Navbar logo={data.company.logo} />
        <main className="flex-1">{children}</main>
        <Footer company={data.company} />
      </body>
    </html>
  );
}