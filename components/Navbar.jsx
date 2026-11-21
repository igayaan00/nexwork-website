"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/media-agency", label: "Media Agency" },
  { href: "/ai-automation", label: "AI Automation" },
  { href: "/digital-marketing", label: "Digital Marketing" },
];

export default function Navbar({ logo = "/logo.png" }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800/90 bg-[#0F172A]/95 text-slate-200 shadow-sm backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
        {/* Transparent NEXWORK Logo Directly on Dark Header (No Black Box) */}
        <Link href="/" className="flex items-center">
          <motion.img
            src={logo}
            alt="NEXWORK"
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ scale: 1.03 }}
            className="h-7 w-auto object-contain sm:h-8"
          />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-1 lg:flex">
          {navLinks.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  active ? "text-white" : "text-slate-300 hover:text-white"
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="nav-pill"
                    transition={{ type: "spring", stiffness: 360, damping: 32 }}
                    className="absolute inset-0 -z-10 rounded-full bg-slate-800/90 ring-1 ring-slate-700/80"
                  />
                )}
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Enquiry & Work With Us Buttons */}
        <div className="hidden items-center gap-2.5 md:flex">
          <Link
            href="/enquiry"
            className="rounded-full bg-[#004C97] px-5 py-2 text-sm font-medium text-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#00AEEF] hover:text-slate-950"
          >
            Enquiry
          </Link>
          <Link
            href="/work-with-us"
            className="rounded-full border border-slate-700 bg-slate-800/70 px-5 py-2 text-sm font-medium text-slate-100 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#F7941D] hover:text-[#F7941D]"
          >
            Work With Us
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="rounded-xl border border-slate-700 bg-slate-800/60 p-2 text-slate-200 lg:hidden"
          aria-label="Toggle Menu"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden border-t border-slate-800 bg-[#0F172A] lg:hidden"
          >
            <div className="flex flex-col gap-2 px-5 py-5">
              {navLinks.map((item) => {
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={`rounded-xl px-3 py-2.5 text-sm font-medium ${
                      active ? "bg-slate-800 text-[#38BDF8]" : "text-slate-300 hover:text-white"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
              <div className="mt-3 flex gap-3">
                <Link
                  href="/enquiry"
                  onClick={() => setOpen(false)}
                  className="flex-1 rounded-full bg-[#004C97] py-2.5 text-center text-sm font-medium text-white"
                >
                  Enquiry
                </Link>
                <Link
                  href="/work-with-us"
                  onClick={() => setOpen(false)}
                  className="flex-1 rounded-full border border-slate-700 bg-slate-800 py-2.5 text-center text-sm font-medium text-slate-100"
                >
                  Work With Us
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
