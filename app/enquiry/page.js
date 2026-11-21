"use client";

import { useState } from "react";
import { Send, CheckCircle2 } from "lucide-react";
import { FadeIn } from "@/components/MotionWrapper";

const services = ["Media Agency", "AI Automation", "Digital Marketing", "Multiple Services"];

export default function EnquiryPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    service: "Media Agency",
    message: "",
  });
  const [status, setStatus] = useState("idle");

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("loading");
    const res = await fetch("/api/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "enquiry", payload: form }),
    });
    if (res.ok) {
      setStatus("done");
      setForm({ name: "", email: "", phone: "", service: "Media Agency", message: "" });
    } else {
      setStatus("error");
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
      <FadeIn>
        <span className="text-xs font-semibold uppercase tracking-widest text-[#004C97]">
          Project Enquiry
        </span>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
          Start Your Project with NEXWORK
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-slate-600">
          Choose the service you need — Media Agency, AI Automation, or Digital Marketing — and share your requirements below.
        </p>

        {status === "done" ? (
          <div className="mt-8 rounded-3xl border border-emerald-200 bg-emerald-50 p-7 text-emerald-900">
            <div className="flex items-center gap-2.5 text-base font-bold">
              <CheckCircle2 size={22} /> Enquiry Submitted Successfully!
            </div>
            <p className="mt-2 text-sm text-emerald-800">
              Thank you for reaching out. Our NEXWORK team will connect with you shortly.
            </p>
            <button
              onClick={() => setStatus("idle")}
              className="mt-5 rounded-full bg-emerald-700 px-5 py-2 text-xs font-semibold text-white hover:bg-emerald-800"
            >
              Submit Another Enquiry
            </button>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="mt-8 space-y-5 rounded-3xl border border-slate-200/80 bg-white p-7 shadow-sm sm:p-8"
          >
            <div>
              <label className="text-xs font-semibold text-slate-600">Select Service</label>
              <div className="mt-2 grid grid-cols-2 gap-2.5">
                {services.map((svc) => (
                  <button
                    type="button"
                    key={svc}
                    onClick={() => setForm({ ...form, service: svc })}
                    className={`rounded-xl border px-3.5 py-2.5 text-left text-xs font-semibold transition-all ${
                      form.service === svc
                        ? "border-[#004C97] bg-sky-50 text-[#004C97]"
                        : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                    }`}
                  >
                    {svc}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-600">Full Name</label>
              <input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Your full name"
                className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition-colors focus:border-[#004C97]"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-xs font-semibold text-slate-600">Email Address</label>
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="you@example.com"
                  className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition-colors focus:border-[#004C97]"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600">Phone Number</label>
                <input
                  required
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="+91 98765 43210"
                  className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition-colors focus:border-[#004C97]"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-600">Project Details</label>
              <textarea
                required
                rows={4}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="Tell us about your requirements, goals, and timeline..."
                className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition-colors focus:border-[#004C97]"
              />
            </div>

            {status === "error" && (
              <p className="text-xs font-medium text-red-600">
                Something went wrong while submitting. Please try again.
              </p>
            )}

            <button
              disabled={status === "loading"}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-slate-900 py-3.5 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:bg-[#004C97] disabled:opacity-60"
            >
              <Send size={16} />
              {status === "loading" ? "Submitting..." : "Submit Enquiry"}
            </button>
          </form>
        )}
      </FadeIn>
    </div>
  );
}
