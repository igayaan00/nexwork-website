import Link from "next/link";
import { ArrowUpRight, Tv, Sparkles, Megaphone, ArrowRight } from "lucide-react";
import { readData } from "@/lib/db";
import { FadeIn, HoverCard } from "@/components/MotionWrapper";
import ReviewSection from "@/components/ReviewSection";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const data = await readData();
  const { company, mediaAgency, aiAutomation, digitalMarketing, reviews } = data;

  const agencies = [
    {
      badge: "01 / Media",
      title: "Media Agency",
      subtitle: "Times of Today",
      desc: mediaAgency.description,
      href: "/media-agency",
      icon: Tv,
      accent: "bg-sky-50 text-[#004C97] border-sky-100",
      preview: mediaAgency.items?.[0]?.thumbnail || "/showcase/media-1.svg",
    },
    {
      badge: "02 / Automation",
      title: "AI Automation",
      subtitle: "Smart Systems & Workflows",
      desc: aiAutomation.description,
      href: "/ai-automation",
      icon: Sparkles,
      accent: "bg-amber-50 text-[#D97706] border-amber-100",
      preview: aiAutomation.items?.[0]?.image || "/showcase/ai-1.svg",
    },
    {
      badge: "03 / Growth",
      title: "Digital Marketing",
      subtitle: "Performance & Branding",
      desc: digitalMarketing.description,
      href: "/digital-marketing",
      icon: Megaphone,
      accent: "bg-slate-100 text-slate-800 border-slate-200",
      preview: digitalMarketing.items?.[0]?.image || "/showcase/dm-1.svg",
    },
  ];

  return (
    <div className="relative overflow-hidden">
      {/* Soft Light Ambient Glow */}
      <div className="pointer-events-none absolute inset-x-0 -top-32 -z-10 flex justify-center">
        <div className="h-80 w-[48rem] rounded-full bg-gradient-to-r from-[#00AEEF]/12 via-[#004C97]/8 to-[#F7941D]/12 blur-3xl" />
      </div>

      {/* Hero Section */}
      <section className="mx-auto max-w-7xl px-4 pb-20 pt-20 sm:px-6 lg:px-8 lg:pt-28">
        <FadeIn className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200/90 bg-white px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-slate-600 shadow-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-[#00AEEF]" />
            NEXWORK Parent Ecosystem
          </div>

          <h1 className="mt-7 text-4xl font-bold tracking-tight text-slate-950 sm:text-6xl sm:leading-[1.08]">
            {company.tagline}
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
            {company.heroSubtitle}
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/enquiry"
              className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-7 py-3.5 text-sm font-semibold text-white shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#004C97] hover:shadow-lg"
            >
              Start an Enquiry <ArrowRight size={16} />
            </Link>
            <Link
              href="/work-with-us"
              className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-7 py-3.5 text-sm font-semibold text-slate-800 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#F7941D] hover:text-[#F7941D]"
            >
              Work With Us
            </Link>
          </div>
        </FadeIn>

        {/* Minimalist Stats Bar */}
        {company.stats && company.stats.length > 0 && (
          <FadeIn delay={0.12} className="mx-auto mt-16 max-w-3xl">
            <div className="grid grid-cols-3 divide-x divide-slate-200/80 rounded-3xl border border-slate-200/80 bg-white/90 py-6 shadow-sm backdrop-blur-sm">
              {company.stats.map((stat, idx) => (
                <div key={idx} className="px-4 text-center">
                  <p className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-xs font-medium text-slate-500 sm:text-sm">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </FadeIn>
        )}

        {/* Optional Admin-Uploaded Hero Showcase Image */}
        {company.heroImage && (
          <FadeIn delay={0.18} className="mt-14">
            <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-2.5 shadow-lg">
              <img
                src={company.heroImage}
                alt="NEXWORK Showcase"
                className="max-h-[480px] w-full rounded-2xl object-cover"
              />
            </div>
          </FadeIn>
        )}
      </section>

      {/* 3 Agencies Section */}
      <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
        <FadeIn className="mb-12 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-[#004C97]">
              Our Divisions
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              Three Specialized Agencies
            </h2>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-slate-500">
            Select any agency below to explore its dedicated page, capabilities, and curated work showcase.
          </p>
        </FadeIn>

        <div className="grid gap-7 lg:grid-cols-3">
          {agencies.map((agency, idx) => {
            const Icon = agency.icon;
            return (
              <FadeIn key={agency.href} delay={idx * 0.1}>
                <Link href={agency.href} className="block h-full">
                  <HoverCard className="group flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm transition-all duration-300 hover:border-slate-300 hover:shadow-xl">
                    {/* Preview Image */}
                    <div className="relative aspect-[16/10] w-full overflow-hidden border-b border-slate-100 bg-slate-50">
                      <img
                        src={agency.preview}
                        alt={agency.title}
                        className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      />
                      <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-slate-700 shadow-sm backdrop-blur-sm">
                        {agency.badge}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="flex flex-1 flex-col justify-between p-7">
                      <div>
                        <div className={`inline-flex rounded-2xl border p-3 ${agency.accent}`}>
                          <Icon size={20} />
                        </div>
                        <p className="mt-5 text-xs font-semibold uppercase tracking-wider text-slate-400">
                          {agency.subtitle}
                        </p>
                        <h3 className="mt-1 text-2xl font-bold text-slate-950">
                          {agency.title}
                        </h3>
                        <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-slate-600">
                          {agency.desc}
                        </p>
                      </div>

                      <div className="mt-7 inline-flex items-center gap-1.5 text-sm font-semibold text-slate-900 transition-colors group-hover:text-[#004C97]">
                        Open {agency.title}
                        <ArrowUpRight
                          size={16}
                          className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                        />
                      </div>
                    </div>
                  </HoverCard>
                </Link>
              </FadeIn>
            );
          })}
        </div>
      </section>

      {/* Client Reviews Section */}
      <ReviewSection initialReviews={reviews || []} />

      {/* Minimalist Bottom CTA Strip */}
      <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="flex flex-col items-start justify-between gap-8 rounded-[2rem] border border-slate-200/90 bg-white p-8 shadow-sm sm:p-12 lg:flex-row lg:items-center">
            <div className="max-w-xl">
              <p className="text-xs font-semibold uppercase tracking-widest text-[#F7941D]">
                Ready to Collaborate?
              </p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
                Build with NEXWORK or become part of our growing team.
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">
                Whether you need media coverage, AI workflow automation, or digital marketing — we are one click away.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/enquiry"
                className="rounded-full bg-slate-900 px-7 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-[#004C97]"
              >
                Make an Enquiry
              </Link>
              <Link
                href="/work-with-us"
                className="rounded-full border border-slate-300 bg-white px-7 py-3.5 text-sm font-semibold text-slate-800 transition-all duration-300 hover:border-[#F7941D] hover:text-[#F7941D]"
              >
                Apply for a Role
              </Link>
            </div>
          </div>
        </FadeIn>
      </section>
    </div>
  );
}
