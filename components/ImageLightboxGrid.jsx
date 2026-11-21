"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ZoomIn } from "lucide-react";
import { FadeIn, HoverCard, smoothEase } from "@/components/MotionWrapper";

export default function ImageLightboxGrid({ items, emptyText }) {
  const [selected, setSelected] = useState(null);

  if (!items || items.length === 0) {
    return (
      <div className="mt-6 rounded-3xl border border-dashed border-slate-300 bg-white/70 p-10 text-center text-sm text-slate-500">
        {emptyText || "No showcase images added yet. Upload images from the Admin Panel."}
      </div>
    );
  }

  return (
    <>
      <div className="mt-8 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item, idx) => (
          <FadeIn key={item.id} delay={idx * 0.08}>
            <HoverCard className="group cursor-pointer overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm transition-shadow duration-300 hover:shadow-xl">
              <div
                onClick={() => setSelected(item)}
                className="relative aspect-[16/11] w-full overflow-hidden bg-slate-100"
              >
                <img
                  src={item.image}
                  alt={item.title || "NEXWORK Showcase"}
                  className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-slate-900/15 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/95 text-slate-900 shadow-lg backdrop-blur-sm">
                    <ZoomIn size={18} />
                  </span>
                </div>
              </div>
              {item.title && (
                <div className="px-6 py-4">
                  <p className="text-sm font-semibold text-slate-800">{item.title}</p>
                </div>
              )}
            </HoverCard>
          </FadeIn>
        ))}
      </div>

      {/* Smooth Minimalist Lightbox Modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
            className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/75 p-4 backdrop-blur-md"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 8 }}
              transition={{ duration: 0.3, ease: smoothEase }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-3xl bg-white p-3 shadow-2xl"
            >
              <button
                onClick={() => setSelected(null)}
                aria-label="Close preview"
                className="absolute right-5 top-5 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-slate-800 shadow-md transition-colors hover:bg-slate-900 hover:text-white"
              >
                <X size={18} />
              </button>
              <img
                src={selected.image}
                alt={selected.title || "Preview"}
                className="max-h-[75vh] w-full rounded-2xl object-contain bg-slate-50"
              />
              {selected.title && (
                <p className="px-4 py-3 text-center text-sm font-semibold text-slate-800">
                  {selected.title}
                </p>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
