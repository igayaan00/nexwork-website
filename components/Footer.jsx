import Link from "next/link";
import { Mail, Phone, MapPin, Lock, ArrowUpRight, UserCheck } from "lucide-react";

export default function Footer({ company }) {
  const socials = [
    {
      name: "Instagram",
      href: company.instagram || "https://www.instagram.com/",
      icon: (
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
          <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
        </svg>
      ),
    },
    {
      name: "Facebook",
      href: company.facebook || "https://www.facebook.com/",
      icon: (
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
        </svg>
      ),
    },
    {
      name: "LinkedIn",
      href: company.linkedin || "https://www.linkedin.com/",
      icon: (
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
          <rect width="4" height="12" x="2" y="9" />
          <circle cx="4" cy="4" r="2" />
        </svg>
      ),
    },
  ];

  return (
    <footer className="relative overflow-hidden border-t border-slate-800 bg-[#0B1120] text-slate-300">
      {/* Subtle Brand Accent Glow */}
      <div className="pointer-events-none absolute -top-24 left-1/2 h-48 w-[36rem] -translate-x-1/2 rounded-full bg-gradient-to-r from-[#00AEEF]/10 via-[#004C97]/15 to-[#F7941D]/10 blur-3xl" />

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-12">
          {/* Brand Column with Transparent Logo & Social Links */}
          <div className="space-y-4 md:col-span-5">
            <Link href="/" className="inline-block">
              <img
                src={company.logo}
                alt="NEXWORK"
                className="h-9 w-auto object-contain"
              />
            </Link>
            <p className="max-w-sm text-sm leading-relaxed text-slate-400">
              {company.tagline}
            </p>

            {/* Small Social Media Logos (Instagram, Facebook, LinkedIn) */}
            <div className="flex items-center gap-2.5 pt-1">
              {socials.map((soc) => (
                <a
                  key={soc.name}
                  href={soc.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={soc.name}
                  title={soc.name}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-700/90 bg-slate-800/80 text-slate-300 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#38BDF8] hover:bg-slate-800 hover:text-white"
                >
                  {soc.icon}
                </a>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <Link
                href="/enquiry"
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#38BDF8] transition-colors hover:text-white"
              >
                Start a Project <ArrowUpRight size={13} />
              </Link>
              <span className="text-slate-600">•</span>
              <Link
                href="/work-with-us"
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#F7941D] transition-colors hover:text-white"
              >
                Join Our Team <ArrowUpRight size={13} />
              </Link>
            </div>
          </div>

          {/* Agencies Column */}
          <div className="md:col-span-3">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-400">
              Agencies
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm text-slate-300">
              <li>
                <Link href="/media-agency" className="transition-colors hover:text-white">
                  Media Agency
                </Link>
              </li>
              <li>
                <Link href="/ai-automation" className="transition-colors hover:text-white">
                  AI Automation
                </Link>
              </li>
              <li>
                <Link href="/digital-marketing" className="transition-colors hover:text-white">
                  Digital Marketing
                </Link>
              </li>
              <li>
                <Link href="/enquiry" className="transition-colors hover:text-white">
                  Enquiry
                </Link>
              </li>
              <li>
                <Link href="/work-with-us" className="transition-colors hover:text-white">
                  Work With Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Information Column */}
          <div className="md:col-span-4">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-400">
              Company Information
            </h3>
            <ul className="mt-4 space-y-3.5 text-sm text-slate-300">
              <li className="flex items-center gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-800/90 text-[#38BDF8]">
                  <Mail size={15} />
                </span>
                <a href={`mailto:${company.email}`} className="transition-colors hover:text-white">
                  {company.email}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-800/90 text-[#38BDF8]">
                  <Phone size={15} />
                </span>
                <a href={`tel:${company.phone}`} className="transition-colors hover:text-white">
                  {company.phone}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-800/90 text-[#F7941D]">
                  <MapPin size={15} />
                </span>
                <span className="pt-1 text-slate-300">{company.address}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Credit + Admin Login & Employee Login Side-by-Side */}
        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-slate-800/90 pt-7 text-xs text-slate-400 sm:flex-row">
          <p className="font-medium text-slate-300">
            Designed and developed by NEXWORK and NEXWORK TECH
          </p>

          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              href="/admin"
              className="inline-flex items-center gap-1.5 rounded-full border border-slate-700 bg-slate-800/80 px-4 py-1.5 font-medium text-slate-200 transition-all duration-300 hover:border-[#38BDF8] hover:bg-slate-800 hover:text-white"
            >
              <Lock size={13} />
              Admin Login
            </Link>
            <Link
              href="/employee"
              className="inline-flex items-center gap-1.5 rounded-full border border-slate-700 bg-slate-800/80 px-4 py-1.5 font-medium text-slate-200 transition-all duration-300 hover:border-[#F7941D] hover:bg-slate-800 hover:text-[#F7941D]"
            >
              <UserCheck size={13} />
              Employee Login
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
