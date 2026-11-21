"use client";

import { useEffect, useState } from "react";
import {
  UserCheck,
  LogOut,
  Clock,
  CheckCircle2,
  CalendarDays,
  LogIn,
} from "lucide-react";
import { FadeIn } from "@/components/MotionWrapper";

export default function EmployeePortalPage() {
  const [auth, setAuth] = useState(false);
  const [loading, setLoading] = useState(true);
  const [creds, setCreds] = useState({ employeeId: "", password: "" });
  const [employee, setEmployee] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [mode, setMode] = useState("Office");
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const todayDate = new Date().toLocaleDateString("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  async function loadProfile() {
    const res = await fetch("/api/employee/auth").then((r) => r.json());
    setAuth(res.authenticated);
    if (res.authenticated) {
      setEmployee(res.employee);
      setAttendance(res.attendance || []);
    }
    setLoading(false);
  }

  useEffect(() => {
    loadProfile();
  }, []);

  async function handleLogin(e) {
    e.preventDefault();
    const res = await fetch("/api/employee/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(creds),
    });
    const out = await res.json();
    if (res.ok) {
      await loadProfile();
    } else {
      alert(out.error || "Invalid Employee ID or Password");
    }
  }

  async function handleLogout() {
    await fetch("/api/employee/auth", { method: "DELETE" });
    setAuth(false);
    setEmployee(null);
    setAttendance([]);
  }

  async function markAttendance(action) {
    setSubmitting(true);
    const res = await fetch("/api/employee/attendance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, mode, note }),
    });
    const out = await res.json();
    setSubmitting(false);
    if (res.ok) {
      setNote("");
      await loadProfile();
    } else {
      alert(out.error || "Attendance update failed");
    }
  }

  if (loading) {
    return <div className="p-20 text-center text-sm text-slate-500">Loading Employee Portal...</div>;
  }

  if (!auth) {
    return (
      <div className="mx-auto max-w-md px-4 py-20">
        <FadeIn>
          <form
            onSubmit={handleLogin}
            className="space-y-4 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm"
          >
            <div className="flex items-center gap-2.5 text-lg font-bold text-slate-900">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-[#F7941D]">
                <UserCheck size={20} />
              </span>
              NEXWORK Employee Login
            </div>
            <p className="text-xs leading-relaxed text-slate-500">
              Apni Employee ID aur Password daal kar login karein aur apni daily attendance mark karein.
            </p>
            <div>
              <label className="text-xs font-semibold text-slate-600">Employee ID</label>
              <input
                required
                placeholder="e.g. NXW001"
                value={creds.employeeId}
                onChange={(e) => setCreds({ ...creds, employeeId: e.target.value })}
                className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm uppercase outline-none focus:border-[#004C97]"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600">Password</label>
              <input
                required
                type="password"
                placeholder="Enter your password"
                value={creds.password}
                onChange={(e) => setCreds({ ...creds, password: e.target.value })}
                className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#004C97]"
              />
            </div>
            <button className="w-full rounded-full bg-slate-900 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#004C97]">
              Login
            </button>
          </form>
        </FadeIn>
      </div>
    );
  }

  const todayRecord = attendance.find((a) => a.date === todayDate);

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <FadeIn>
        {/* Top Employee Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm">
          <div>
            <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-[#004C97]">
              ID: {employee.employeeId}
            </span>
            <h1 className="mt-2 text-2xl font-bold text-slate-950">
              Welcome, {employee.name}
            </h1>
            <p className="text-xs text-slate-500">{employee.role}</p>
          </div>

          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 rounded-full border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100"
          >
            <LogOut size={14} /> Logout
          </button>
        </div>

        {/* Today's Attendance Card */}
        <div className="mt-7 rounded-3xl border border-slate-200/80 bg-white p-7 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2 text-base font-bold text-slate-900">
              <CalendarDays size={18} className="text-[#004C97]" />
              Today&apos;s Attendance — {todayDate}
            </div>
            {todayRecord ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                <CheckCircle2 size={14} /> Marked Present ({todayRecord.checkIn})
              </span>
            ) : (
              <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                Not Marked Yet
              </span>
            )}
          </div>

          {!todayRecord ? (
            <div className="mt-5 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-semibold text-slate-600">Work Mode</label>
                  <select
                    value={mode}
                    onChange={(e) => setMode(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-[#004C97]"
                  >
                    <option value="Office">Office</option>
                    <option value="On-Field / Shoot">On-Field / Shoot</option>
                    <option value="Work From Home">Work From Home</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600">
                    Today&apos;s Task / Note (Optional)
                  </label>
                  <input
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="e.g. Ground shoot at Assi Ghat / Client campaign"
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-[#004C97]"
                  />
                </div>
              </div>

              <button
                onClick={() => markAttendance("checkin")}
                disabled={submitting}
                className="inline-flex items-center gap-2 rounded-full bg-[#004C97] px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-slate-900 disabled:opacity-60"
              >
                <LogIn size={16} />
                {submitting ? "Marking..." : "Mark Attendance (Check-In)"}
              </button>
            </div>
          ) : (
            <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
              <div className="space-y-1 text-sm text-slate-600">
                <p>
                  <strong className="text-slate-900">Check-In:</strong> {todayRecord.checkIn} •{" "}
                  <strong className="text-slate-900">Mode:</strong> {todayRecord.mode}
                </p>
                {todayRecord.checkOut && (
                  <p>
                    <strong className="text-slate-900">Check-Out:</strong> {todayRecord.checkOut}
                  </p>
                )}
                {todayRecord.note && (
                  <p className="text-xs text-slate-500">Note: {todayRecord.note}</p>
                )}
              </div>

              {!todayRecord.checkOut && (
                <button
                  onClick={() => markAttendance("checkout")}
                  disabled={submitting}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-slate-900 px-5 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-[#F7941D]"
                >
                  <Clock size={14} />
                  {submitting ? "Updating..." : "Mark Check-Out"}
                </button>
              )}
            </div>
          )}
        </div>

        {/* Attendance History */}
        <div className="mt-8 rounded-3xl border border-slate-200/80 bg-white p-7 shadow-sm">
          <h2 className="text-base font-bold text-slate-900">Your Attendance History</h2>
          {attendance.length === 0 ? (
            <p className="mt-3 text-sm text-slate-500">Abhi tak koi attendance record nahi hai.</p>
          ) : (
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-xs uppercase text-slate-400">
                    <th className="py-3 pr-4">Date</th>
                    <th className="py-3 pr-4">Check-In</th>
                    <th className="py-3 pr-4">Check-Out</th>
                    <th className="py-3 pr-4">Mode</th>
                    <th className="py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {attendance.map((rec) => (
                    <tr key={rec.id}>
                      <td className="py-3 pr-4 font-medium text-slate-900">{rec.date}</td>
                      <td className="py-3 pr-4 text-slate-600">{rec.checkIn}</td>
                      <td className="py-3 pr-4 text-slate-600">{rec.checkOut || "—"}</td>
                      <td className="py-3 pr-4 text-slate-600">{rec.mode}</td>
                      <td className="py-3">
                        <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
                          {rec.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </FadeIn>
    </div>
  );
}
