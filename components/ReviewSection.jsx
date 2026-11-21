"use client";

import { useState } from "react";
import { Star, MessageSquarePlus, CheckCircle2, Quote } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { FadeIn, HoverCard } from "@/components/MotionWrapper";

export default function ReviewSection({ initialReviews = [] }) {
  const [reviews, setReviews] = useState(initialReviews);
  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    role: "",
    service: "Media Agency",
    rating: 5,
    comment: "",
  });

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "review", payload: form }),
    });
    setLoading(false);

    if (res.ok) {
      const created = { id: Date.now().toString(), ...form };
      setReviews([created, ...reviews]);
      setSubmitted(true);
      setForm({ name: "", role: "", service: "Media Agency", rating: 5, comment: "" });
      setTimeout(() => {
        setSubmitted(false);
        setShowForm(false);
      }, 2200);
    }
  }

  return (
    <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
      <FadeIn className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-[#004C97]">
            Client Testimonials
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            Trusted by Brands & Partners
          </h2>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center gap-2 self-start rounded-full border border-slate-300 bg-white px-5 py-2.5 text-xs font-semibold text-slate-800 shadow-xs transition-all duration-300 hover:border-[#004C97] hover:text-[#004C97] sm:self-auto"
        >
          <MessageSquarePlus size={15} />
          {showForm ? "Close Form" : "Write a Review"}
        </button>
      </FadeIn>

      {/* Collapsible Public Review Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-8 rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm sm:p-8">
              {submitted ? (
                <div className="flex items-center gap-2.5 text-sm font-semibold text-emerald-700">
                  <CheckCircle2 size={20} /> Thank you! Your review has been published.
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <h3 className="text-base font-bold text-slate-900">Share Your Experience with NEXWORK</h3>
                  <div className="grid gap-4 sm:grid-cols-3">
                    <input
                      required
                      placeholder="Your Name"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-[#004C97]"
                    />
                    <input
                      placeholder="Role / Company (Optional)"
                      value={form.role}
                      onChange={(e) => setForm({ ...form, role: e.target.value })}
                      className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-[#004C97]"
                    />
                    <select
                      value={form.service}
                      onChange={(e) => setForm({ ...form, service: e.target.value })}
                      className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-[#004C97]"
                    >
                      <option value="Media Agency">Media Agency</option>
                      <option value="AI Automation">AI Automation</option>
                      <option value="Digital Marketing">Digital Marketing</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-600">Rating:</span>
                    {[1, 2, 3, 4, 5].map((num) => (
                      <button
                        type="button"
                        key={num}
                        onClick={() => setForm({ ...form, rating: num })}
                        className="p-0.5"
                      >
                        <Star
                          size={18}
                          className={
                            num <= form.rating
                              ? "fill-[#F7941D] text-[#F7941D]"
                              : "text-slate-300"
                          }
                        />
                      </button>
                    ))}
                  </div>

                  <textarea
                    required
                    rows={3}
                    placeholder="Write your feedback..."
                    value={form.comment}
                    onChange={(e) => setForm({ ...form, comment: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-[#004C97]"
                  />

                  <button
                    disabled={loading}
                    className="rounded-full bg-slate-900 px-6 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-[#004C97]"
                  >
                    {loading ? "Posting..." : "Post Review"}
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reviews Grid */}
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {reviews.map((rev, idx) => (
          <FadeIn key={rev.id} delay={idx * 0.08}>
            <HoverCard className="flex h-full flex-col justify-between rounded-3xl border border-slate-200/80 bg-white p-7 shadow-sm transition-shadow duration-300 hover:shadow-lg">
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={15}
                        className={
                          i < (rev.rating || 5)
                            ? "fill-[#F7941D] text-[#F7941D]"
                            : "text-slate-200"
                        }
                      />
                    ))}
                  </div>
                  <Quote size={18} className="text-slate-200" />
                </div>

                <p className="mt-5 text-sm leading-relaxed text-slate-600">
                  &ldquo;{rev.comment}&rdquo;
                </p>
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
                <div>
                  <p className="text-sm font-bold text-slate-900">{rev.name}</p>
                  {rev.role && <p className="text-xs text-slate-500">{rev.role}</p>}
                </div>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold text-slate-700">
                  {rev.service}
                </span>
              </div>
            </HoverCard>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}
