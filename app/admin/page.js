"use client";

import { useEffect, useState } from "react";
import {
  Lock,
  LogOut,
  Save,
  Plus,
  Trash2,
  FileText,
  CheckCircle2,
  KeyRound,
  Image as ImageIcon,
} from "lucide-react";

const EMPTY_SITE = {
  company: {
    email: "",
    phone: "",
    address: "",
    youtubeChannel: "",
    instagram: "",
    facebook: "",
    linkedin: "",
    tagline: "",
    heroSubtitle: "",
    heroImage: "",
  },
  mediaAgency: { description: "", items: [] },
  aiAutomation: { description: "", items: [] },
  digitalMarketing: { description: "", items: [] },
  reviews: [],
  enquiries: [],
  applications: [],
  employees: [],
  attendance: [],
  adminAuth: { username: "admin" },
};

function normalizeSiteData(raw) {
  const d = raw && typeof raw === "object" ? raw : {};
  return {
    ...EMPTY_SITE,
    ...d,
    company: {
      ...EMPTY_SITE.company,
      ...(d.company && typeof d.company === "object" ? d.company : {}),
    },
    mediaAgency: {
      description: d.mediaAgency?.description || "",
      items: Array.isArray(d.mediaAgency?.items) ? d.mediaAgency.items : [],
    },
    aiAutomation: {
      description: d.aiAutomation?.description || "",
      items: Array.isArray(d.aiAutomation?.items) ? d.aiAutomation.items : [],
    },
    digitalMarketing: {
      description: d.digitalMarketing?.description || "",
      items: Array.isArray(d.digitalMarketing?.items) ? d.digitalMarketing.items : [],
    },
    reviews: Array.isArray(d.reviews) ? d.reviews : [],
    enquiries: Array.isArray(d.enquiries) ? d.enquiries : [],
    applications: Array.isArray(d.applications) ? d.applications : [],
    employees: Array.isArray(d.employees) ? d.employees : [],
    attendance: Array.isArray(d.attendance) ? d.attendance : [],
    adminAuth: {
      username: d.adminAuth?.username || "admin",
    },
  };
}

export default function AdminPage() {
  const [auth, setAuth] = useState(false);
  const [loading, setLoading] = useState(true);
  const [creds, setCreds] = useState({ username: "", password: "" });
  const [data, setData] = useState(null);
  const [tab, setTab] = useState("general");
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState("");

  const [newMedia, setNewMedia] = useState({ title: "", link: "", file: null });
  const [newAi, setNewAi] = useState({ title: "", file: null });
  const [newDm, setNewDm] = useState({ title: "", file: null });
  const [newReview, setNewReview] = useState({
    name: "",
    role: "",
    service: "Media Agency",
    rating: 5,
    comment: "",
  });
  const [newPass, setNewPass] = useState({ username: "", password: "" });
  const [newEmp, setNewEmp] = useState({ employeeId: "", name: "", role: "", password: "" });

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(""), 3500);
  }

  async function loadAll() {
    try {
      const authRes = await fetch("/api/auth", { cache: "no-store" });
      const a = authRes.ok ? await authRes.json() : { authenticated: false };
      const isAuthed = Boolean(a?.authenticated);
      setAuth(isAuthed);

      if (isAuthed) {
        const siteRes = await fetch("/api/site", { cache: "no-store" });
        const rawSite = siteRes.ok ? await siteRes.json() : {};
        const safeSite = normalizeSiteData(rawSite);
        setData(safeSite);
        setNewPass({ username: safeSite.adminAuth?.username || "admin", password: "" });
      } else {
        setData(null);
      }
    } catch (err) {
      console.error("Failed to load admin state:", err);
      setData(normalizeSiteData({}));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAll();
  }, []);

  async function handleLogin(e) {
    e.preventDefault();
    const res = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(creds),
    });
    if (res.ok) {
      setLoading(true);
      await loadAll();
    } else {
      alert("Invalid username or password");
    }
  }

  async function handleLogout() {
    await fetch("/api/auth", { method: "DELETE" });
    setAuth(false);
    setData(null);
  }

  async function uploadFile(file) {
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    const out = await res.json();
    if (!res.ok) throw new Error(out?.error || "Upload failed");
    return out.url;
  }

  async function saveChanges(updatedData = data, successMsg = "Changes saved live!") {
    const payload = normalizeSiteData(updatedData);
    setSaving(true);
    const res = await fetch("/api/site", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setSaving(false);
    if (res.ok) {
      showToast(successMsg);
    } else {
      alert("Error saving changes.");
    }
  }

  async function addMediaItem(e) {
    e.preventDefault();
    if (!newMedia.file) return alert("Please select a thumbnail image");
    try {
      const thumbnail = await uploadFile(newMedia.file);
      const current = normalizeSiteData(data);
      const updated = {
        ...current,
        mediaAgency: {
          ...current.mediaAgency,
          items: [
            {
              id: Date.now().toString(),
              title: newMedia.title,
              link: newMedia.link,
              thumbnail,
            },
            ...current.mediaAgency.items,
          ],
        },
      };
      setData(updated);
      setNewMedia({ title: "", link: "", file: null });
      e.target.reset();
      await saveChanges(updated, "New Media thumbnail box added!");
    } catch (err) {
      alert(err.message);
    }
  }

  async function addGalleryItem(e, sectionKey, stateObj, resetFn) {
    e.preventDefault();
    if (!stateObj.file) return alert("Please select an image");
    try {
      const image = await uploadFile(stateObj.file);
      const current = normalizeSiteData(data);
      const sec = current[sectionKey] || { description: "", items: [] };
      const updated = {
        ...current,
        [sectionKey]: {
          ...sec,
          items: [{ id: Date.now().toString(), title: stateObj.title, image }, ...sec.items],
        },
      };
      setData(updated);
      resetFn({ title: "", file: null });
      e.target.reset();
      await saveChanges(updated, "New showcase image uploaded!");
    } catch (err) {
      alert(err.message);
    }
  }

  async function replaceItemImage(sectionKey, id, fieldName, file) {
    if (!file) return;
    try {
      const url = await uploadFile(file);
      const current = normalizeSiteData(data);
      const sec = current[sectionKey] || { description: "", items: [] };
      const updated = {
        ...current,
        [sectionKey]: {
          ...sec,
          items: sec.items.map((item) =>
            item.id === id ? { ...item, [fieldName]: url } : item
          ),
        },
      };
      setData(updated);
      await saveChanges(updated, "Image updated!");
    } catch (err) {
      alert(err.message);
    }
  }

  function updateItemField(sectionKey, id, field, value) {
    const current = normalizeSiteData(data);
    const sec = current[sectionKey] || { description: "", items: [] };
    setData({
      ...current,
      [sectionKey]: {
        ...sec,
        items: sec.items.map((item) =>
          item.id === id ? { ...item, [field]: value } : item
        ),
      },
    });
  }

  async function deleteItem(sectionKey, id) {
    const current = normalizeSiteData(data);
    const sec = current[sectionKey] || { description: "", items: [] };
    const updated = {
      ...current,
      [sectionKey]: {
        ...sec,
        items: sec.items.filter((i) => i.id !== id),
      },
    };
    setData(updated);
    await saveChanges(updated, "Item deleted!");
  }

  async function deleteInboxItem(listKey, id) {
    const current = normalizeSiteData(data);
    const updated = {
      ...current,
      [listKey]: (current[listKey] || []).filter((item) => item.id !== id),
    };
    setData(updated);
    await saveChanges(updated, "Entry removed!");
  }

  async function handlePasswordUpdate(e) {
    e.preventDefault();
    if (!newPass.username || !newPass.password) {
      return alert("Enter both username and new password");
    }
    const current = normalizeSiteData(data);
    const updated = {
      ...current,
      adminAuth: {
        username: newPass.username.trim(),
        password: newPass.password.trim(),
      },
    };
    setData(updated);
    await saveChanges(updated, "Admin login credentials updated!");
    setNewPass({ ...newPass, password: "" });
  }

  if (loading) {
    return (
      <div className="p-20 text-center text-sm text-slate-500">
        Loading Admin Panel...
      </div>
    );
  }

  if (!auth) {
    return (
      <div className="mx-auto max-w-md px-4 py-24">
        <form
          onSubmit={handleLogin}
          className="space-y-4 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm"
        >
          <div className="flex items-center gap-2.5 text-lg font-bold text-slate-900">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-[#004C97]">
              <Lock size={20} />
            </span>
            NEXWORK Admin Login
          </div>
          <p className="text-xs text-slate-500">
            Sign in to edit company info, photos, thumbnails, and view enquiries or resumes.
          </p>
          <input
            required
            placeholder="Username"
            value={creds.username}
            onChange={(e) => setCreds({ ...creds, username: e.target.value })}
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#004C97]"
          />
          <input
            required
            type="password"
            placeholder="Password"
            value={creds.password}
            onChange={(e) => setCreds({ ...creds, password: e.target.value })}
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#004C97]"
          />
          <button className="w-full rounded-full bg-slate-900 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#004C97]">
            Login to Dashboard
          </button>
        </form>
      </div>
    );
  }

  const safe = normalizeSiteData(data);

  const tabs = [
    { id: "general", label: "Company Info & UI" },
    { id: "media", label: "Media Agency" },
    { id: "ai", label: "AI Automation" },
    { id: "dm", label: "Digital Marketing" },
    { id: "reviews", label: `Reviews (${safe.reviews.length})` },
    { id: "employees", label: `Employees (${safe.employees.length})` },
    {
      id: "inbox",
      label: `Inbox (${safe.enquiries.length + safe.applications.length})`,
    },
    { id: "security", label: "Security" },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-xs font-semibold text-white shadow-xl">
          <CheckCircle2 size={16} className="text-emerald-400" /> {toast}
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-950">NEXWORK Admin Dashboard</h1>
          <p className="mt-1 text-xs text-slate-500">
            Sab changes save karte hi live website par turant update ho jate hain.
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="inline-flex items-center gap-1.5 rounded-full border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100"
        >
          <LogOut size={14} /> Logout
        </button>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`rounded-full px-4 py-2 text-xs font-semibold transition-all ${
              tab === t.id
                ? "bg-slate-900 text-white shadow-sm"
                : "border border-slate-200 bg-white text-slate-600 hover:border-slate-300"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "general" && (
        <div className="mt-8 space-y-5 rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
          <h2 className="text-base font-bold text-slate-900">Contact & Website UI Settings</h2>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-xs font-semibold text-slate-600">Company Email</label>
              <input
                value={safe.company.email}
                onChange={(e) =>
                  setData({ ...safe, company: { ...safe.company, email: e.target.value } })
                }
                className="mt-1 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600">Company Phone Number</label>
              <input
                value={safe.company.phone}
                onChange={(e) =>
                  setData({ ...safe, company: { ...safe.company, phone: e.target.value } })
                }
                className="mt-1 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-xs font-semibold text-slate-600">Company Address</label>
              <input
                value={safe.company.address}
                onChange={(e) =>
                  setData({ ...safe, company: { ...safe.company, address: e.target.value } })
                }
                className="mt-1 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600">YouTube Channel Link</label>
              <input
                value={safe.company.youtubeChannel}
                onChange={(e) =>
                  setData({
                    ...safe,
                    company: { ...safe.company, youtubeChannel: e.target.value },
                  })
                }
                className="mt-1 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="text-xs font-semibold text-slate-600">Instagram URL</label>
              <input
                value={safe.company.instagram}
                onChange={(e) =>
                  setData({ ...safe, company: { ...safe.company, instagram: e.target.value } })
                }
                placeholder="https://instagram.com/..."
                className="mt-1 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600">Facebook URL</label>
              <input
                value={safe.company.facebook}
                onChange={(e) =>
                  setData({ ...safe, company: { ...safe.company, facebook: e.target.value } })
                }
                placeholder="https://facebook.com/..."
                className="mt-1 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600">LinkedIn URL</label>
              <input
                value={safe.company.linkedin}
                onChange={(e) =>
                  setData({ ...safe, company: { ...safe.company, linkedin: e.target.value } })
                }
                placeholder="https://linkedin.com/company/..."
                className="mt-1 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-600">Hero Headline</label>
            <input
              value={safe.company.tagline}
              onChange={(e) =>
                setData({ ...safe, company: { ...safe.company, tagline: e.target.value } })
              }
              className="mt-1 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-600">Hero Subtitle</label>
            <textarea
              rows={2}
              value={safe.company.heroSubtitle}
              onChange={(e) =>
                setData({
                  ...safe,
                  company: { ...safe.company, heroSubtitle: e.target.value },
                })
              }
              className="mt-1 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm"
            />
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <label className="text-xs font-semibold text-slate-700">
              Home Hero Banner Photo (Optional — Upload or Clear)
            </label>
            <div className="mt-2 flex flex-wrap items-center gap-4">
              <input
                type="file"
                accept="image/*"
                onChange={async (e) => {
                  if (!e.target.files?.[0]) return;
                  const url = await uploadFile(e.target.files[0]);
                  setData({
                    ...safe,
                    company: { ...safe.company, heroImage: url },
                  });
                }}
                className="text-xs text-slate-600"
              />
              {safe.company.heroImage && (
                <button
                  type="button"
                  onClick={() =>
                    setData({ ...safe, company: { ...safe.company, heroImage: "" } })
                  }
                  className="text-xs font-semibold text-red-600 underline"
                >
                  Remove Banner Photo
                </button>
              )}
            </div>
          </div>

          <button
            onClick={() => saveChanges(safe)}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-full bg-[#004C97] px-6 py-2.5 text-sm font-semibold text-white hover:bg-slate-900"
          >
            <Save size={16} /> {saving ? "Saving..." : "Save Company Info"}
          </button>
        </div>
      )}

      {tab === "media" && (
        <div className="mt-8 space-y-6">
          <div className="space-y-3 rounded-3xl border border-slate-200 bg-white p-6">
            <label className="text-xs font-semibold text-slate-600">
              Media Agency Description
            </label>
            <textarea
              rows={3}
              value={safe.mediaAgency.description}
              onChange={(e) =>
                setData({
                  ...safe,
                  mediaAgency: { ...safe.mediaAgency, description: e.target.value },
                })
              }
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm"
            />
            <button
              onClick={() => saveChanges(safe)}
              className="inline-flex items-center gap-1.5 rounded-full bg-[#004C97] px-5 py-2 text-xs font-semibold text-white"
            >
              <Save size={14} /> Save Description
            </button>
          </div>

          <form
            onSubmit={addMediaItem}
            className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6"
          >
            <h2 className="font-bold text-slate-900">Add New Video Thumbnail Box</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <input
                required
                placeholder="Video Title"
                value={newMedia.title}
                onChange={(e) => setNewMedia({ ...newMedia, title: e.target.value })}
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm"
              />
              <input
                required
                placeholder="YouTube Video Link (https://youtu.be/...)"
                value={newMedia.link}
                onChange={(e) => setNewMedia({ ...newMedia, link: e.target.value })}
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm"
              />
            </div>
            <input
              required
              type="file"
              accept="image/*"
              onChange={(e) =>
                setNewMedia({ ...newMedia, file: e.target.files?.[0] || null })
              }
              className="text-sm text-slate-600"
            />
            <button className="inline-flex items-center gap-1.5 rounded-full bg-slate-900 px-5 py-2.5 text-xs font-semibold text-white hover:bg-[#004C97]">
              <Plus size={15} /> Add Video Box
            </button>
          </form>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {safe.mediaAgency.items.map((item) => (
              <div
                key={item.id}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
              >
                <div className="relative aspect-video bg-slate-100">
                  <img
                    src={item.thumbnail}
                    alt={item.title || "Media thumbnail"}
                    className="h-full w-full object-cover"
                  />
                  <label className="absolute bottom-2 right-2 cursor-pointer rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold text-slate-800 shadow">
                    <span className="inline-flex items-center gap-1">
                      <ImageIcon size={12} /> Replace
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) =>
                        replaceItemImage(
                          "mediaAgency",
                          item.id,
                          "thumbnail",
                          e.target.files?.[0]
                        )
                      }
                    />
                  </label>
                </div>
                <div className="space-y-2.5 p-4">
                  <input
                    value={item.title || ""}
                    onChange={(e) =>
                      updateItemField("mediaAgency", item.id, "title", e.target.value)
                    }
                    className="w-full rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-semibold"
                  />
                  <input
                    value={item.link || ""}
                    onChange={(e) =>
                      updateItemField("mediaAgency", item.id, "link", e.target.value)
                    }
                    className="w-full rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs text-slate-600"
                  />
                  <div className="flex items-center justify-between pt-1">
                    <button
                      onClick={() => saveChanges(safe)}
                      className="text-xs font-semibold text-[#004C97] hover:underline"
                    >
                      Save Box
                    </button>
                    <button
                      onClick={() => deleteItem("mediaAgency", item.id)}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-red-600 hover:underline"
                    >
                      <Trash2 size={13} /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "ai" && (
        <div className="mt-8 space-y-6">
          <div className="space-y-3 rounded-3xl border border-slate-200 bg-white p-6">
            <label className="text-xs font-semibold text-slate-600">
              AI Automation Description
            </label>
            <textarea
              rows={3}
              value={safe.aiAutomation.description}
              onChange={(e) =>
                setData({
                  ...safe,
                  aiAutomation: { ...safe.aiAutomation, description: e.target.value },
                })
              }
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm"
            />
            <button
              onClick={() => saveChanges(safe)}
              className="inline-flex items-center gap-1.5 rounded-full bg-[#004C97] px-5 py-2 text-xs font-semibold text-white"
            >
              <Save size={14} /> Save Description
            </button>
          </div>

          <form
            onSubmit={(e) => addGalleryItem(e, "aiAutomation", newAi, setNewAi)}
            className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6"
          >
            <h2 className="font-bold text-slate-900">Upload AI Automation Photo</h2>
            <input
              required
              placeholder="Photo Caption / Title"
              value={newAi.title}
              onChange={(e) => setNewAi({ ...newAi, title: e.target.value })}
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm"
            />
            <input
              required
              type="file"
              accept="image/*"
              onChange={(e) =>
                setNewAi({ ...newAi, file: e.target.files?.[0] || null })
              }
              className="text-sm text-slate-600"
            />
            <button className="inline-flex items-center gap-1.5 rounded-full bg-slate-900 px-5 py-2.5 text-xs font-semibold text-white hover:bg-[#004C97]">
              <Plus size={15} /> Upload Photo
            </button>
          </form>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {safe.aiAutomation.items.map((item) => (
              <div
                key={item.id}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
              >
                <div className="relative aspect-[4/3] bg-slate-100">
                  <img
                    src={item.image}
                    alt={item.title || "AI showcase"}
                    className="h-full w-full object-cover"
                  />
                  <label className="absolute bottom-2 right-2 cursor-pointer rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold text-slate-800 shadow">
                    <span className="inline-flex items-center gap-1">
                      <ImageIcon size={12} /> Replace
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) =>
                        replaceItemImage(
                          "aiAutomation",
                          item.id,
                          "image",
                          e.target.files?.[0]
                        )
                      }
                    />
                  </label>
                </div>
                <div className="flex items-center justify-between gap-2 p-4">
                  <input
                    value={item.title || ""}
                    onChange={(e) =>
                      updateItemField("aiAutomation", item.id, "title", e.target.value)
                    }
                    onBlur={() => saveChanges(safe)}
                    className="w-full rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-medium"
                  />
                  <button
                    onClick={() => deleteItem("aiAutomation", item.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "dm" && (
        <div className="mt-8 space-y-6">
          <div className="space-y-3 rounded-3xl border border-slate-200 bg-white p-6">
            <label className="text-xs font-semibold text-slate-600">
              Digital Marketing Description
            </label>
            <textarea
              rows={3}
              value={safe.digitalMarketing.description}
              onChange={(e) =>
                setData({
                  ...safe,
                  digitalMarketing: {
                    ...safe.digitalMarketing,
                    description: e.target.value,
                  },
                })
              }
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm"
            />
            <button
              onClick={() => saveChanges(safe)}
              className="inline-flex items-center gap-1.5 rounded-full bg-[#004C97] px-5 py-2 text-xs font-semibold text-white"
            >
              <Save size={14} /> Save Description
            </button>
          </div>

          <form
            onSubmit={(e) => addGalleryItem(e, "digitalMarketing", newDm, setNewDm)}
            className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6"
          >
            <h2 className="font-bold text-slate-900">Upload Digital Marketing Photo</h2>
            <input
              required
              placeholder="Campaign / Photo Title"
              value={newDm.title}
              onChange={(e) => setNewDm({ ...newDm, title: e.target.value })}
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm"
            />
            <input
              required
              type="file"
              accept="image/*"
              onChange={(e) =>
                setNewDm({ ...newDm, file: e.target.files?.[0] || null })
              }
              className="text-sm text-slate-600"
            />
            <button className="inline-flex items-center gap-1.5 rounded-full bg-slate-900 px-5 py-2.5 text-xs font-semibold text-white hover:bg-[#004C97]">
              <Plus size={15} /> Upload Photo
            </button>
          </form>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {safe.digitalMarketing.items.map((item) => (
              <div
                key={item.id}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
              >
                <div className="relative aspect-[4/3] bg-slate-100">
                  <img
                    src={item.image}
                    alt={item.title || "DM showcase"}
                    className="h-full w-full object-cover"
                  />
                  <label className="absolute bottom-2 right-2 cursor-pointer rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold text-slate-800 shadow">
                    <span className="inline-flex items-center gap-1">
                      <ImageIcon size={12} /> Replace
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) =>
                        replaceItemImage(
                          "digitalMarketing",
                          item.id,
                          "image",
                          e.target.files?.[0]
                        )
                      }
                    />
                  </label>
                </div>
                <div className="flex items-center justify-between gap-2 p-4">
                  <input
                    value={item.title || ""}
                    onChange={(e) =>
                      updateItemField("digitalMarketing", item.id, "title", e.target.value)
                    }
                    onBlur={() => saveChanges(safe)}
                    className="w-full rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-medium"
                  />
                  <button
                    onClick={() => deleteItem("digitalMarketing", item.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "reviews" && (
        <div className="mt-8 space-y-6">
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              const updated = {
                ...safe,
                reviews: [
                  {
                    id: Date.now().toString(),
                    name: newReview.name,
                    role: newReview.role,
                    service: newReview.service,
                    rating: Number(newReview.rating),
                    comment: newReview.comment,
                  },
                  ...safe.reviews,
                ],
              };
              setData(updated);
              setNewReview({
                name: "",
                role: "",
                service: "Media Agency",
                rating: 5,
                comment: "",
              });
              await saveChanges(updated, "Review added!");
            }}
            className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6"
          >
            <h2 className="font-bold text-slate-900">Add Client Review</h2>
            <div className="grid gap-4 sm:grid-cols-3">
              <input
                required
                placeholder="Client Name"
                value={newReview.name}
                onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
                className="rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm"
              />
              <input
                required
                placeholder="Role / Company"
                value={newReview.role}
                onChange={(e) => setNewReview({ ...newReview, role: e.target.value })}
                className="rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm"
              />
              <select
                value={newReview.service}
                onChange={(e) =>
                  setNewReview({ ...newReview, service: e.target.value })
                }
                className="rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm"
              >
                <option>Media Agency</option>
                <option>AI Automation</option>
                <option>Digital Marketing</option>
              </select>
            </div>
            <textarea
              required
              rows={2}
              placeholder="Review comment..."
              value={newReview.comment}
              onChange={(e) =>
                setNewReview({ ...newReview, comment: e.target.value })
              }
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm"
            />
            <button className="inline-flex items-center gap-1.5 rounded-full bg-slate-900 px-5 py-2.5 text-xs font-semibold text-white hover:bg-[#004C97]">
              <Plus size={15} /> Add Review
            </button>
          </form>

          <div className="grid gap-4 sm:grid-cols-2">
            {safe.reviews.map((rev) => (
              <div
                key={rev.id}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-bold text-slate-900">{rev.name}</p>
                    <p className="text-xs text-slate-500">
                      {rev.role} • {rev.service}
                    </p>
                  </div>
                  <button
                    onClick={async () => {
                      const updated = {
                        ...safe,
                        reviews: safe.reviews.filter((r) => r.id !== rev.id),
                      };
                      setData(updated);
                      await saveChanges(updated, "Review deleted!");
                    }}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
                <p className="mt-2 text-sm text-slate-600">&ldquo;{rev.comment}&rdquo;</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "employees" && (
        <div className="mt-8 space-y-8">
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              const exists = safe.employees.some(
                (emp) =>
                  emp.employeeId?.toLowerCase() ===
                  newEmp.employeeId.trim().toLowerCase()
              );
              if (exists) return alert("Ye Employee ID pehle se exist karti hai!");
              const updated = {
                ...safe,
                employees: [
                  {
                    id: Date.now().toString(),
                    employeeId: newEmp.employeeId.trim().toUpperCase(),
                    name: newEmp.name.trim(),
                    role: newEmp.role.trim() || "Team Member",
                    password: newEmp.password.trim(),
                  },
                  ...safe.employees,
                ],
              };
              setData(updated);
              setNewEmp({ employeeId: "", name: "", role: "", password: "" });
              await saveChanges(updated, "New employee created!");
            }}
            className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6"
          >
            <h2 className="font-bold text-slate-900">Create New Employee Login</h2>
            <div className="grid gap-4 sm:grid-cols-4">
              <input
                required
                placeholder="Employee ID (e.g. NXW002)"
                value={newEmp.employeeId}
                onChange={(e) =>
                  setNewEmp({ ...newEmp, employeeId: e.target.value })
                }
                className="rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm uppercase"
              />
              <input
                required
                placeholder="Full Name"
                value={newEmp.name}
                onChange={(e) => setNewEmp({ ...newEmp, name: e.target.value })}
                className="rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm"
              />
              <input
                placeholder="Role / Department"
                value={newEmp.role}
                onChange={(e) => setNewEmp({ ...newEmp, role: e.target.value })}
                className="rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm"
              />
              <input
                required
                placeholder="Password"
                value={newEmp.password}
                onChange={(e) =>
                  setNewEmp({ ...newEmp, password: e.target.value })
                }
                className="rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm"
              />
            </div>
            <button className="inline-flex items-center gap-1.5 rounded-full bg-slate-900 px-5 py-2.5 text-xs font-semibold text-white hover:bg-[#004C97]">
              <Plus size={15} /> Add Employee
            </button>
          </form>

          <div className="grid gap-4 sm:grid-cols-3">
            {safe.employees.map((emp) => (
              <div
                key={emp.id}
                className="rounded-2xl border border-slate-200 bg-white p-4 text-sm shadow-sm"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="rounded-full bg-sky-50 px-2.5 py-0.5 text-xs font-bold text-[#004C97]">
                      {emp.employeeId}
                    </span>
                    <p className="mt-2 font-bold text-slate-900">{emp.name}</p>
                    <p className="text-xs text-slate-500">{emp.role}</p>
                    <p className="mt-1 text-xs text-slate-400">Pass: {emp.password}</p>
                  </div>
                  <button
                    onClick={async () => {
                      const updated = {
                        ...safe,
                        employees: safe.employees.filter((x) => x.id !== emp.id),
                      };
                      setData(updated);
                      await saveChanges(updated, "Employee removed!");
                    }}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="font-bold text-slate-900">
              Employee Attendance Records ({safe.attendance.length})
            </h2>
            {safe.attendance.length === 0 ? (
              <p className="mt-3 text-sm text-slate-500">
                Abhi tak kisi employee ne attendance mark nahi ki hai.
              </p>
            ) : (
              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 text-xs uppercase text-slate-400">
                      <th className="py-3 pr-4">Date</th>
                      <th className="py-3 pr-4">Emp ID</th>
                      <th className="py-3 pr-4">Name</th>
                      <th className="py-3 pr-4">Check-In</th>
                      <th className="py-3 pr-4">Check-Out</th>
                      <th className="py-3 pr-4">Mode & Note</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {safe.attendance.map((rec) => (
                      <tr key={rec.id}>
                        <td className="py-3 pr-4 font-medium text-slate-900">{rec.date}</td>
                        <td className="py-3 pr-4 font-semibold text-[#004C97]">
                          {rec.employeeId}
                        </td>
                        <td className="py-3 pr-4 text-slate-800">{rec.name}</td>
                        <td className="py-3 pr-4 font-medium text-emerald-700">
                          {rec.checkIn}
                        </td>
                        <td className="py-3 pr-4 text-slate-600">
                          {rec.checkOut || "Active"}
                        </td>
                        <td className="py-3 pr-4 text-xs text-slate-500">
                          {rec.mode} {rec.note ? `• ${rec.note}` : ""}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {tab === "inbox" && (
        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          <div className="space-y-4">
            <h2 className="text-base font-bold text-slate-900">
              Client Enquiries ({safe.enquiries.length})
            </h2>
            {safe.enquiries.length === 0 && (
              <p className="text-sm text-slate-500">No enquiries yet.</p>
            )}
            {safe.enquiries.map((enq) => (
              <div
                key={enq.id}
                className="rounded-2xl border border-slate-200 bg-white p-5 text-sm shadow-sm"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-bold text-slate-900">{enq.name}</p>
                    <p className="text-xs font-medium text-[#004C97]">{enq.service}</p>
                  </div>
                  <button
                    onClick={() => deleteInboxItem("enquiries", enq.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
                <p className="mt-2 text-xs text-slate-600">
                  {enq.email} • {enq.phone}
                </p>
                {enq.company && (
                  <p className="text-xs text-slate-500">Company: {enq.company}</p>
                )}
                <p className="mt-2 rounded-xl bg-slate-50 p-3 text-xs text-slate-700">
                  {enq.message}
                </p>
                <p className="mt-2 text-[11px] text-slate-400">{enq.date}</p>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <h2 className="text-base font-bold text-slate-900">
              Job Applications & Resumes ({safe.applications.length})
            </h2>
            {safe.applications.length === 0 && (
              <p className="text-sm text-slate-500">No applications yet.</p>
            )}
            {safe.applications.map((app) => (
              <div
                key={app.id}
                className="rounded-2xl border border-slate-200 bg-white p-5 text-sm shadow-sm"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-bold text-slate-900">{app.name}</p>
                    <p className="text-xs font-medium text-[#F7941D]">{app.role}</p>
                  </div>
                  <button
                    onClick={() => deleteInboxItem("applications", app.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
                <p className="mt-2 text-xs text-slate-600">
                  {app.email} • {app.phone}
                </p>
                {app.portfolio && (
                  <p className="mt-1 break-all text-xs text-slate-500">
                    Portfolio: {app.portfolio}
                  </p>
                )}
                {app.note && <p className="mt-2 text-xs text-slate-700">{app.note}</p>}
                {app.resumeUrl && (
                  <a
                    href={app.resumeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-sky-50 px-3.5 py-1.5 text-xs font-semibold text-[#004C97] hover:bg-sky-100"
                  >
                    <FileText size={14} /> View / Download Resume (
                    {app.resumeName || "File"})
                  </a>
                )}
                <p className="mt-2 text-[11px] text-slate-400">{app.date}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "security" && (
        <div className="mt-8 max-w-lg">
          <form
            onSubmit={handlePasswordUpdate}
            className="space-y-4 rounded-3xl border border-slate-200 bg-white p-7 shadow-sm"
          >
            <div className="flex items-center gap-2 text-base font-bold text-slate-900">
              <KeyRound size={18} className="text-[#004C97]" />
              Change Admin Username & Password
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600">New Username</label>
              <input
                required
                value={newPass.username}
                onChange={(e) =>
                  setNewPass({ ...newPass, username: e.target.value })
                }
                className="mt-1 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600">New Password</label>
              <input
                required
                type="password"
                placeholder="Enter new strong password"
                value={newPass.password}
                onChange={(e) =>
                  setNewPass({ ...newPass, password: e.target.value })
                }
                className="mt-1 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm"
              />
            </div>
            <button className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-6 py-2.5 text-xs font-semibold text-white hover:bg-[#004C97]">
              <Save size={15} /> Update Credentials
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
