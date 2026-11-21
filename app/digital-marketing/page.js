import Link from "next/link";
import { CheckCircle2, ArrowLeft } from "lucide-react";
import { readData } from "@/lib/db";
import { FadeIn } from "@/components/MotionWrapper";
import ImageLightboxGrid from "@/components/ImageLightboxGrid";

export const dynamic = "force-dynamic";

export default async function DigitalMarketingPage() {
  const data = await readData();
  const { digitalMarketing } = data;

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <FadeIn>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 transition-colors hover:text-slate-900"
        >
          <ArrowLeft size={14} /> Back to Home
        </Link>

        <div className="mt-6 max-w-3xl">
          <span className="inline-flex items-center rounded-full bg-sky-50 px-3.5 py-1 text-xs font-semibold uppercase tracking-widest text-[#004C97]">
            NEXWORK Growth Division
          </span>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
            {digitalMarketing.title}
          </h1>
          <p className="mt-5 text-base leading-relaxed text-slate-600">
            {digitalMarketing.description}
          </p>
        </div>
      </FadeIn>

      {/* What NEXWORK Does in Digital Marketing */}
      <FadeIn delay={0.1} className="mt-10">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-400">
          What We Deliver
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {digitalMarketing.highlights.map((point, i) => (
            <div
              key={i}
              className="flex items-center gap-3.5 rounded-2xl border border-slate-200/80 bg-white px-5 py-4 text-sm font-medium text-slate-800 shadow-sm"
            >
              <CheckCircle2 size={18} className="shrink-0 text-[#F7941D]" />
              <span>{point}</span>
            </div>
          ))}
        </div>
      </FadeIn>

      {/* Image Showcase Grid (Only Images, No Links) */}
      <div className="mt-16">
        <div className="border-b border-slate-200/80 pb-4">
          <h2 className="text-xl font-bold text-slate-950">Campaigns & Visual Creatives</h2>
        </div>
        <ImageLightboxGrid
          items={digitalMarketing.items}
          emptyText="Admin Panel se Digital Marketing ke showcase images upload karein."
        />
      </div>

      <FadeIn className="mt-16">
        <Link
          href="/enquiry"
          className="inline-flex rounded-full bg-slate-900 px-7 py-3.5 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#004C97]"
        >
          Enquire for Digital Marketing
        </Link>
      </FadeIn>
    </div>
  );
}
