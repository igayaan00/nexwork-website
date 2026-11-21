import Link from "next/link";
import { Play, ArrowUpRight, Youtube, ArrowLeft } from "lucide-react";
import { readData } from "@/lib/db";
import { FadeIn, HoverCard } from "@/components/MotionWrapper";

export const dynamic = "force-dynamic";

export default async function MediaAgencyPage() {
  const data = await readData();
  const { mediaAgency, company } = data;

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
          <span className="inline-flex items-center gap-2 rounded-full bg-sky-50 px-3.5 py-1 text-xs font-semibold uppercase tracking-widest text-[#004C97]">
            NEXWORK Media Division
          </span>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
            {mediaAgency.title}
          </h1>
          <p className="mt-5 text-base leading-relaxed text-slate-600">
            {mediaAgency.description}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={company.youtubeChannel}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-red-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-red-700"
            >
              <Youtube size={18} />
              Open Times of Today on YouTube
            </a>
            <Link
              href="/enquiry"
              className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-800 transition-colors hover:border-slate-900"
            >
              Enquire for Media Services
            </Link>
          </div>
        </div>
      </FadeIn>

      {/* Video Thumbnail + YouTube Link Boxes */}
      <div className="mt-16">
        <div className="flex items-end justify-between border-b border-slate-200/80 pb-4">
          <h2 className="text-xl font-bold text-slate-950">Featured Videos & Reports</h2>
          <span className="text-xs font-medium text-slate-500">
            Click any video to open directly in YouTube
          </span>
        </div>

        {mediaAgency.items.length === 0 ? (
          <div className="mt-8 rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-500">
            Admin Panel se Media Agency ke video thumbnails aur YouTube links add karein.
          </div>
        ) : (
          <div className="mt-8 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {mediaAgency.items.map((item, idx) => (
              <FadeIn key={item.id} delay={idx * 0.08}>
                <HoverCard className="group flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm transition-shadow duration-300 hover:shadow-xl">
                  {/* Clickable Thumbnail */}
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative block aspect-video w-full overflow-hidden bg-slate-100"
                  >
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-slate-950/20 transition-colors duration-300 group-hover:bg-slate-950/35">
                      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/95 text-red-600 shadow-lg transition-transform duration-300 group-hover:scale-110">
                        <Play size={20} fill="currentColor" className="ml-0.5" />
                      </span>
                    </div>
                  </a>

                  {/* Title + Direct YouTube Link Button Below */}
                  <div className="flex flex-1 flex-col justify-between p-6">
                    <h3 className="line-clamp-2 text-base font-semibold leading-snug text-slate-900">
                      {item.title}
                    </h3>

                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-5 inline-flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs font-semibold text-slate-800 transition-all duration-300 hover:border-red-200 hover:bg-red-50 hover:text-red-700"
                    >
                      <span className="inline-flex items-center gap-2">
                        <Youtube size={15} className="text-red-600" />
                        Watch on YouTube
                      </span>
                      <ArrowUpRight size={15} />
                    </a>
                  </div>
                </HoverCard>
              </FadeIn>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
