"use client";

import { useState } from "react";
import { Briefcase, Upload, CheckCircle2 } from "lucide-react";
import { FadeIn } from "@/components/MotionWrapper";

export default function WorkWithUsPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    role: "Video Editor / Media",
    note: "",
  });
  const [resumeFile, setResumeFile] = useState(null);
  const [status, setStatus] = useState("idle");

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("loading");

    let resumeUrl = "";
    if (resumeFile) {
      const fd = new FormData();
      fd.append("file", resumeFile);
      const up = await fetch("/api/upload", { method: "POST", body: fd });
      const upData = await up.json();
      if (!up.ok) {
        alert(upData.error || "Resume upload failed");
        setStatus("idle");
        return;
      }
      resumeUrl = upData.url;
    }

    const res = await fetch("/api/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "application",
        payload: { ...form, resumeUrl },
      }),
    });

    if (res.ok) {
      setStatus("done");
      setForm({ name: "", email: "", phone: "", role: "Video Editor / Media", note: "" });
      setResumeFile(null);
    } else {
      setStatus("error");
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
      <FadeIn>
        <span className="text-xs font-semibold uppercase tracking-widest text-[#F7941D]">
          Careers at NEXWORK
        </span>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
          Work With Us
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-slate-600">
          Want to work across Media, AI Automation, or Digital Marketing? Submit your details and resume below.
        </p>

        {status === "done" ? (
          <div className="mt-8 rounded-3xl border border-emerald-200 bg-emerald-50 p-7 text-emerald-900">
            <div className="flex items-center gap-2.5 text-base font-bold">
              <CheckCircle2 size={22} /> Application Submitted Successfully!
            </div>
            <p className="mt-2 text-sm text-emerald-800">
              Thank you for applying at NEXWORK. Our hiring team will review your resume and reach out if shortlisted.
            </p>
            <button
              onClick={() => setStatus("idle")}
              className="mt-5 rounded-full bg-emerald-700 px-5 py-2 text-xs font-semibold text-white hover:bg-emerald-800"
            >
              Submit Another Application
            </button>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="mt-8 space-y-5 rounded-3xl border border-slate-200/80 bg-white p-7 shadow-sm sm:p-8"
          >
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
              <label className="text-xs font-semibold text-slate-600">Role / Department</label>
              <select
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-[#004C97]"
              >
                <option>Video Editor / Media</option>
                <option>Anchor / Ground Reporter</option>
                <option>AI Automation Developer</option>
                <option>Digital Marketer / Performance Ads</option>
                <option>Graphic / Motion Designer</option>
                <option>Other</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-600">Upload Resume (PDF / DOC / DOCX)</label>
              <label className="mt-1.5 flex cursor-pointer items-center justify-center gap-2.5 rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-sm text-slate-600 transition-colors hover:border-[#004C97] hover:bg-sky-50/40">
                <Upload size={18} className="text-[#004C97]" />
                <span className="font-medium">
                  {resumeFile ? resumeFile.name : "Click to choose your resume file"}
                </span>
                <input
                  required
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
                  className="hidden"
                />
              </label>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-600">Portfolio Link / Short Intro</label>
              <textarea
                rows={3}
                value={form.note}
                onChange={(e) => setForm({ ...form, note: e.target.value })}
                placeholder="Share your experience, LinkedIn, or portfolio link..."
                className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition-colors focus:border-[#004C97]"
              />
            </div>

            <button
              disabled={status === "loading"}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-slate-900 py-3.5 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:bg-[#F7941D] disabled:opacity-60"
            >
              <Briefcase size={16} />
              {status === "loading" ? "Submitting..." : "Submit Application"}
            </button>
          </form>
        )}
      </FadeIn>
    </div>
  );
}
