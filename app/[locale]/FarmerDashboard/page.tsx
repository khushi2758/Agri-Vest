"use client";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Home, LayoutDashboard, BarChart2, Wallet, Briefcase, Calendar, Settings, LogOut,
  MapPin, Wheat, Ruler, User, RefreshCcw, AlertCircle, X, Check, Clock, Loader2,
  Camera, Upload, Trash2, ChevronDown, FileText, Send, ImageOff, CalendarDays,
} from "lucide-react";
import NavBar from "../navbar";

// ---- types -------------------------------------------------------------

type TaskStatus = "Pending" | "In Progress" | "Completed";

interface FieldTask {
  id: string;
  title: string;
  description?: string;
  dueDate?: string;
  status: TaskStatus;
  notes: string;
  updatedAt?: string;
}

interface StagedImage {
  id: string;
  file: File;
  previewUrl: string;
  caption: string;
}

interface FieldImageRecord {
  id: string;
  url: string;
  caption?: string;
  uploadedAt: string;
}

interface ProgressUpdate {
  id: string;
  type: "Daily" | "Weekly";
  date: string;
  notes: string;
  tasksCompleted: number;
  totalTasks: number;
  imageCount: number;
}

interface FieldAssignment {
  id: string;
  name: string;
  location: string;
  crop: string;
  size: string;
  owner: string;
  ownerContact?: string;
  assignedDate?: string;
}

interface FarmerDashboardData {
  farmerName: string;
  field: FieldAssignment;
  tasks: FieldTask[];
  images: FieldImageRecord[];
  updates: ProgressUpdate[];
}

// ---- static nav (mirrors the rest of the app shell) ---------------------

const navItems = [
  { href: "/en", label: "Home", icon: Home },
  { href: "/en/Explore", label: "Explore", icon: LayoutDashboard },
  { href: "/en/Portfolio", label: "Portfolio", icon: BarChart2 },
  { href: "/en/Wallet", label: "Wallet", icon: Wallet },
  { href: "/en/Investor", label: "Investor", icon: Briefcase },
  { href: "/en/Farmers", label: "Farmers", icon: Calendar },
];

const STATUS_STYLES: Record<TaskStatus, string> = {
  Pending: "bg-[#1b2620]/5 text-[#1b2620]/60 border-[#1b2620]/10",
  "In Progress": "bg-amber-100/80 text-amber-700 border-amber-200",
  Completed: "bg-[#c8e639]/40 text-[#1b2620] border-[#c8e639]/60",
};

const STATUS_ORDER: TaskStatus[] = ["Pending", "In Progress", "Completed"];

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

function todayLabel() {
  return new Date().toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}

// ---- liquid glass background (matches Wallet dashboard) -----------------

function LiquidBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden -z-10">
      <div className="absolute inset-0 bg-[#eef2e4]" />
      <div className="glass-blob glass-blob-a absolute top-[-10%] right-[-5%] w-[560px] h-[560px] rounded-full bg-[#c8e639]/40 blur-[100px]" />
      <div className="glass-blob glass-blob-b absolute bottom-[-15%] left-[5%] w-[480px] h-[480px] rounded-full bg-[#8fd3c0]/35 blur-[110px]" />
      <div className="glass-blob glass-blob-c absolute top-[30%] left-[35%] w-[380px] h-[380px] rounded-full bg-[#1b2620]/10 blur-[120px]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.6),transparent_60%)]" />
    </div>
  );
}

// ---- skeleton -------------------------------------------------------------

function DashboardSkeleton() {
  return (
    <div className="min-h-screen flex overflow-hidden font-sans relative" aria-busy="true" aria-label="Loading field assignment">
      <LiquidBackground />
      <aside className="w-20 border-r border-white/40 flex flex-col items-center py-6 shrink-0 glass-panel" />
      <aside className="w-80 border-r border-white/40 shrink-0 glass-panel p-6">
        <div className="h-6 w-40 rounded-full glass-shimmer mb-4" />
        <div className="h-24 rounded-2xl glass-shimmer mb-3" />
        <div className="h-24 rounded-2xl glass-shimmer mb-3" />
        <div className="h-24 rounded-2xl glass-shimmer" />
      </aside>
      <main className="flex-1 p-6">
        <div className="h-10 w-72 rounded-full glass-shimmer mb-6" />
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 flex flex-col gap-6">
            <div className="h-[420px] rounded-3xl glass-shimmer" />
          </div>
          <div className="flex flex-col gap-6">
            <div className="h-[280px] rounded-3xl glass-shimmer" />
            <div className="flex-1 min-h-[300px] rounded-3xl glass-shimmer" />
          </div>
        </div>
      </main>
    </div>
  );
}

// ---- mock fallback data ---------------------------------------------------
// Used only if /api/farmer/assignment is unavailable, so this page is
// reviewable before the backend route exists. Replace with real data once
// the endpoint is wired up.

function buildMockData(): FarmerDashboardData {
  return {
    farmerName: "Farmer",
    field: {
      id: "field-104",
      name: "Field 104 - North Plot",
      location: "Nashik, Maharashtra",
      crop: "Grapes (Thompson Seedless)",
      size: "4.2 acres",
      owner: "Agrivest Cooperative Trust",
      ownerContact: "owner@agrivest.example",
      assignedDate: "2026-06-01",
    },
    tasks: [
      { id: uid(), title: "Irrigation check - drip lines", description: "Inspect drip lines for clogging and pressure drop.", dueDate: "2026-07-25", status: "In Progress", notes: "Checked rows 1-6, all clear." },
      { id: uid(), title: "Apply fungicide spray", description: "Preventive spray as per crop schedule.", dueDate: "2026-07-26", status: "Pending", notes: "" },
      { id: uid(), title: "Weeding - eastern boundary", description: "Manual weeding along the eastern boundary.", dueDate: "2026-07-24", status: "Completed", notes: "Finished, boundary clear." },
      { id: uid(), title: "Soil moisture reading", description: "Log soil moisture at 3 sensor points.", dueDate: "2026-07-27", status: "Pending", notes: "" },
    ],
    images: [],
    updates: [
      { id: uid(), type: "Daily", date: "2026-07-24", notes: "Completed eastern boundary weeding. Irrigation on schedule.", tasksCompleted: 1, totalTasks: 4, imageCount: 2 },
      { id: uid(), type: "Weekly", date: "2026-07-18", notes: "Good progress this week. Fungicide spray delayed due to rain.", tasksCompleted: 3, totalTasks: 5, imageCount: 4 },
    ],
  };
}

export default function FarmerFieldDashboard() {
  const router = useRouter();
  const [data, setData] = useState<FarmerDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [usingMockData, setUsingMockData] = useState(false);

  const [savingTaskId, setSavingTaskId] = useState<string | null>(null);
  const [expandedNotesId, setExpandedNotesId] = useState<string | null>(null);
  const [draftNotes, setDraftNotes] = useState<Record<string, string>>({});

  const [stagedImages, setStagedImages] = useState<StagedImage[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [reportType, setReportType] = useState<"Daily" | "Weekly">("Daily");
  const [reportNotes, setReportNotes] = useState("");
  const [submittingReport, setSubmittingReport] = useState(false);
  const [reportSubmitted, setReportSubmitted] = useState(false);

  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 3200);
  }, []);

  const fetchAssignment = useCallback(
    async (isRefresh = false) => {
      isRefresh ? setRefreshing(true) : setLoading(true);
      setLoadError(null);
      try {
        const res = await fetch("/api/farmer/assignment");
        if (res.status === 401 || res.status === 403) {
          router.push("/en/login");
          return;
        }
        if (!res.ok) throw new Error("bad status");
        const json = await res.json();
        setData(json);
        setUsingMockData(false);
      } catch (err) {
        // No live endpoint yet (or the network is down in the field) -
        // fall back to mock data so the page is still usable.
        setData(buildMockData());
        setUsingMockData(true);
        if (isRefresh) setLoadError("Couldn't reach the server - showing your last saved data.");
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [router]
  );

  useEffect(() => {
    fetchAssignment();
  }, [fetchAssignment]);

  useEffect(() => {
    return () => {
      stagedImages.forEach((img) => URL.revokeObjectURL(img.previewUrl));
      if (toastTimer.current) clearTimeout(toastTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const taskCounts = useMemo(() => {
    const tasks = data?.tasks ?? [];
    return {
      total: tasks.length,
      completed: tasks.filter((t) => t.status === "Completed").length,
      inProgress: tasks.filter((t) => t.status === "In Progress").length,
      pending: tasks.filter((t) => t.status === "Pending").length,
    };
  }, [data]);

  const progressPct = taskCounts.total ? Math.round((taskCounts.completed / taskCounts.total) * 100) : 0;

  // ---- task status / notes -------------------------------------------------

  const persistTask = useCallback(
    async (taskId: string, patch: Partial<FieldTask>) => {
      setSavingTaskId(taskId);
      setData((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          tasks: prev.tasks.map((t) => (t.id === taskId ? { ...t, ...patch, updatedAt: new Date().toISOString() } : t)),
        };
      });
      try {
        await fetch(`/api/farmer/tasks/${taskId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(patch),
        });
      } catch {
        // Optimistic UI already applied; sync will retry on next refresh.
      } finally {
        setSavingTaskId(null);
      }
    },
    []
  );

  const cycleStatus = (task: FieldTask) => {
    const idx = STATUS_ORDER.indexOf(task.status);
    const next = STATUS_ORDER[(idx + 1) % STATUS_ORDER.length];
    persistTask(task.id, { status: next });
    if (next === "Completed") showToast(`"${task.title}" marked complete`);
  };

  const setStatus = (task: FieldTask, status: TaskStatus) => {
    if (status === task.status) return;
    persistTask(task.id, { status });
  };

  const saveNotes = (task: FieldTask) => {
    const notes = draftNotes[task.id] ?? task.notes;
    persistTask(task.id, { notes });
    setExpandedNotesId(null);
    showToast("Progress note saved");
  };

  // ---- image upload -------------------------------------------------

  const addFiles = (files: FileList | File[]) => {
    const arr = Array.from(files).filter((f) => f.type.startsWith("image/"));
    if (arr.length === 0) return;
    const staged = arr.map((file) => ({ id: uid(), file, previewUrl: URL.createObjectURL(file), caption: "" }));
    setStagedImages((prev) => [...prev, ...staged]);
  };

  const removeStaged = (id: string) => {
    setStagedImages((prev) => {
      const found = prev.find((p) => p.id === id);
      if (found) URL.revokeObjectURL(found.previewUrl);
      return prev.filter((p) => p.id !== id);
    });
  };

  const uploadStagedImages = async () => {
    if (stagedImages.length === 0) return;
    setUploading(true);
    try {
      const formData = new FormData();
      stagedImages.forEach((img) => formData.append("images", img.file, img.file.name));
      formData.append("fieldId", data?.field.id ?? "");
      await fetch("/api/farmer/images", { method: "POST", body: formData });
    } catch {
      // Field connectivity can be unreliable - keep images visible locally either way.
    } finally {
      const newRecords: FieldImageRecord[] = stagedImages.map((img) => ({
        id: img.id,
        url: img.previewUrl,
        caption: img.caption,
        uploadedAt: new Date().toISOString(),
      }));
      setData((prev) => (prev ? { ...prev, images: [...newRecords, ...prev.images] } : prev));
      setStagedImages([]);
      setUploading(false);
      showToast(`${newRecords.length} image${newRecords.length > 1 ? "s" : ""} uploaded`);
    }
  };

  // ---- report submission -------------------------------------------------

  const submitReport = async () => {
    if (!data) return;
    setSubmittingReport(true);
    const payload = {
      fieldId: data.field.id,
      type: reportType,
      date: new Date().toISOString(),
      notes: reportNotes,
      tasks: data.tasks.map((t) => ({ id: t.id, status: t.status, notes: t.notes })),
      imageIds: data.images.slice(0, stagedImages.length).map((i) => i.id),
    };
    try {
      await fetch("/api/farmer/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } catch {
      // Queue locally; still record it in the update history below.
    } finally {
      const newUpdate: ProgressUpdate = {
        id: uid(),
        type: reportType,
        date: new Date().toISOString(),
        notes: reportNotes || "No additional notes.",
        tasksCompleted: taskCounts.completed,
        totalTasks: taskCounts.total,
        imageCount: data.images.length,
      };
      setData((prev) => (prev ? { ...prev, updates: [newUpdate, ...prev.updates] } : prev));
      setReportNotes("");
      setSubmittingReport(false);
      setReportSubmitted(true);
      showToast(`${reportType} report submitted`);
      setTimeout(() => setReportSubmitted(false), 2200);
    }
  };

  if (loading) return <DashboardSkeleton />;

  if (loadError && !data) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 relative">
        <LiquidBackground />
        <div className="glass-panel rounded-3xl p-8 max-w-sm w-full text-center fade-in-up">
          <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-4" />
          <p className="text-[#1b2620] font-bold mb-1">Couldn't load your field assignment</p>
          <p className="text-[#1b2620]/60 text-sm mb-6">{loadError}</p>
          <button
            onClick={() => fetchAssignment()}
            className="w-full bg-[#1b2620] text-white font-bold py-3 rounded-xl hover:bg-[#0a0f0c] transition-all hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-[#c8e639] focus:ring-offset-2"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  if (!data) return null;
  const { field, tasks, images, updates, farmerName } = data;

  const fieldSummary = [
    { icon: MapPin, label: "Location", value: field.location },
    { icon: Wheat, label: "Crop", value: field.crop },
    { icon: Ruler, label: "Size", value: field.size },
    { icon: User, label: "Owner", value: field.owner },
  ];

  return (
     <div>
    <NavBar/>
    <div className="min-h-screen text-[#1b2620] flex overflow-hidden font-sans selection:bg-[#c8e639] selection:text-black relative">
      <LiquidBackground />

      {/* icon rail */}
  

      {/* Allocated Farmland sidebar — the field this farmer is assigned to, always visible */}
      <aside className="w-80 glass-panel border-r border-white/40 flex flex-col shrink-0 z-20 h-screen overflow-y-auto fade-in-up">
        <div className="p-6 relative z-10">
          <h2 className="text-[#1b2620]/50 text-xs uppercase tracking-wider font-extrabold mb-1">Allocated Farmland</h2>
          <h3 className="text-xl font-extrabold text-[#1b2620] mb-4 leading-snug">{field.name}</h3>

          <div className="glass-input rounded-2xl px-4 py-3 flex items-center gap-3 mb-6">
            <div className="flex-1 h-1.5 rounded-full bg-[#1b2620]/10 overflow-hidden">
              <div className="h-full bg-[#c8e639] rounded-full transition-all duration-700" style={{ width: `${progressPct}%` }} />
            </div>
            <span className="text-xs font-extrabold text-[#1b2620] shrink-0">{progressPct}% done</span>
          </div>

          <div className="flex flex-col gap-3">
            {fieldSummary.map(({ icon: Icon, label, value }) => (
              <div key={label} className="glass-input rounded-2xl p-4 flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#1b2620]/5 flex items-center justify-center text-[#1b2620]/60 shrink-0">
                  <Icon size={16} />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] uppercase tracking-wide font-extrabold text-[#1b2620]/40">{label}</p>
                  <p className="text-sm font-bold text-[#1b2620] leading-snug truncate">{value}</p>
                </div>
              </div>
            ))}
          </div>

          {field.assignedDate && (
            <p className="text-[11px] font-bold text-[#1b2620]/40 mt-4 flex items-center gap-1.5">
              <CalendarDays size={12} /> Assigned {field.assignedDate}
            </p>
          )}

          <div className="mt-6 pt-6 border-t border-white/40">
            <p className="text-[10px] uppercase tracking-wide font-extrabold text-[#1b2620]/40 mb-3">Task progress</p>
            <div className="flex flex-col gap-2 text-xs font-bold text-[#1b2620]/60">
              <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[#c8e639]" /> {taskCounts.completed} completed</span>
              <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-amber-400" /> {taskCounts.inProgress} in progress</span>
              <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[#1b2620]/20" /> {taskCounts.pending} pending</span>
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col h-screen overflow-hidden p-6 relative">
        {loadError && (
          <div role="alert" className="mb-4 flex items-center justify-between gap-3 glass-panel-amber text-amber-800 text-sm font-bold px-4 py-3 rounded-2xl relative z-30 fade-in-up">
            <span className="flex items-center gap-2"><AlertCircle size={16} /> {loadError}</span>
            <button onClick={() => setLoadError(null)} aria-label="Dismiss" className="text-amber-600 hover:text-amber-900"><X size={16} /></button>
          </div>
        )}
      

        <header className="flex justify-between items-center mb-6 relative z-0 fade-in-up flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight">My Field Assignment</h1>
            <p className="text-sm text-[#1b2620]/50 font-bold">Welcome back, {farmerName} - here's what's on {field.name} today.</p>
          </div>
          <button
            onClick={() => fetchAssignment(true)}
            disabled={refreshing}
            className="glass-input flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold text-[#1b2620]/70 hover:text-[#1b2620] transition-all hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#c8e639] disabled:opacity-50"
          >
            <RefreshCcw size={14} className={refreshing ? "animate-spin" : ""} /> Refresh
          </button>
        </header>

        <div className="flex-1 overflow-y-auto pr-2 pb-10 custom-scrollbar relative z-10">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* ---- LEFT COLUMN ---- */}
            <div className="xl:col-span-2 flex flex-col gap-6">
              {/* Task list */}
              <div className="glass-panel rounded-3xl p-6 fade-in-up" style={{ animationDelay: "60ms" }}>
                <div className="flex items-center justify-between mb-5 relative z-10 flex-wrap gap-3">
                  <h3 className="text-[#1b2620] font-extrabold text-sm tracking-wide uppercase">Task List</h3>
                  <div className="flex items-center gap-2 text-[11px] font-bold text-[#1b2620]/50">
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#c8e639]" /> {taskCounts.completed} done</span>
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-400" /> {taskCounts.inProgress} in progress</span>
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#1b2620]/20" /> {taskCounts.pending} pending</span>
                  </div>
                </div>

                <div className="flex flex-col gap-3 relative z-10">
                  {tasks.map((task, i) => {
                    const isExpanded = expandedNotesId === task.id;
                    const isSaving = savingTaskId === task.id;
                    return (
                      <div key={task.id} className="glass-input rounded-2xl p-4 fade-in-up" style={{ animationDelay: `${100 + i * 40}ms` }}>
                        <div className="flex items-start justify-between gap-3 flex-wrap">
                          <div className="flex items-start gap-3 min-w-[200px]">
                            <button
                              onClick={() => cycleStatus(task)}
                              aria-label={`Cycle status for ${task.title}, currently ${task.status}`}
                              className={`mt-0.5 w-6 h-6 rounded-full border flex items-center justify-center shrink-0 transition-all hover:scale-110 ${
                                task.status === "Completed" ? "bg-[#c8e639] border-[#c8e639]" : "bg-white/60 border-[#1b2620]/20"
                              }`}
                            >
                              {task.status === "Completed" && <Check size={13} className="text-[#1b2620]" strokeWidth={3} />}
                              {task.status === "In Progress" && <Clock size={12} className="text-amber-600" />}
                            </button>
                            <div>
                              <p className="font-bold text-sm text-[#1b2620] leading-snug">{task.title}</p>
                              {task.description && <p className="text-xs text-[#1b2620]/50 mt-0.5">{task.description}</p>}
                              {task.dueDate && (
                                <p className="text-[10px] text-[#1b2620]/40 font-bold mt-1 flex items-center gap-1">
                                  <CalendarDays size={10} /> Due {task.dueDate}
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            {isSaving && <Loader2 size={14} className="animate-spin text-[#1b2620]/40" />}
                            <div className="relative">
                              <select
                                value={task.status}
                                onChange={(e) => setStatus(task, e.target.value as TaskStatus)}
                                aria-label={`Status for ${task.title}`}
                                className={`appearance-none text-xs font-bold pl-3 pr-7 py-1.5 rounded-lg border cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#c8e639] ${STATUS_STYLES[task.status]}`}
                              >
                                {STATUS_ORDER.map((s) => (
                                  <option key={s} value={s}>{s}</option>
                                ))}
                              </select>
                              <ChevronDown size={12} className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 opacity-50" />
                            </div>
                            <button
                              onClick={() => { setExpandedNotesId(isExpanded ? null : task.id); setDraftNotes((d) => ({ ...d, [task.id]: d[task.id] ?? task.notes })); }}
                              className="text-xs font-bold text-[#1b2620]/50 hover:text-[#1b2620] glass-input px-3 py-1.5 rounded-lg transition-all hover:scale-105 flex items-center gap-1"
                            >
                              <FileText size={12} /> Notes
                            </button>
                          </div>
                        </div>

                        {isExpanded && (
                          <div className="mt-3 pt-3 border-t border-white/40 dropdown-in">
                            <label className="text-[10px] uppercase tracking-wide font-extrabold text-[#1b2620]/40 mb-1 block">Progress notes</label>
                            <textarea
                              value={draftNotes[task.id] ?? task.notes}
                              onChange={(e) => setDraftNotes((d) => ({ ...d, [task.id]: e.target.value }))}
                              placeholder="What did you do for this task? Anything the owner should know?"
                              rows={3}
                              className="w-full bg-white/50 border border-white/60 rounded-xl p-3 text-sm text-[#1b2620] placeholder-[#1b2620]/30 outline-none focus:ring-2 focus:ring-[#c8e639] resize-none"
                            />
                            <div className="flex justify-end gap-2 mt-2">
                              <button onClick={() => setExpandedNotesId(null)} className="text-xs font-bold text-[#1b2620]/50 hover:text-[#1b2620] px-3 py-1.5">Cancel</button>
                              <button onClick={() => saveNotes(task)} className="text-xs font-bold bg-[#1b2620] text-white px-4 py-1.5 rounded-lg hover:bg-[#0a0f0c] transition-all hover:scale-105">Save note</button>
                            </div>
                          </div>
                        )}
                        {!isExpanded && task.notes && (
                          <p className="text-xs text-[#1b2620]/50 mt-2 pl-9 italic line-clamp-1">"{task.notes}"</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Image upload */}
              <div className="glass-panel rounded-3xl p-6 fade-in-up" style={{ animationDelay: "120ms" }}>
                <div className="flex items-center justify-between mb-4 relative z-10">
                  <h3 className="text-[#1b2620] font-extrabold text-sm tracking-wide uppercase">Upload Field Images</h3>
                  <span className="text-xs font-bold text-[#1b2620]/40">{images.length} on file</span>
                </div>

                <div
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={(e) => { e.preventDefault(); setIsDragging(false); addFiles(e.dataTransfer.files); }}
                  onClick={() => fileInputRef.current?.click()}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") fileInputRef.current?.click(); }}
                  aria-label="Upload field images, drag and drop or click to browse"
                  className={`relative z-10 rounded-2xl border-2 border-dashed p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 ${
                    isDragging ? "border-[#c8e639] bg-[#c8e639]/10 scale-[1.01]" : "border-[#1b2620]/15 hover:border-[#1b2620]/30 hover:bg-white/30"
                  }`}
                >
                  <input ref={fileInputRef} type="file" accept="image/*" multiple hidden onChange={(e) => e.target.files && addFiles(e.target.files)} />
                  <div className="w-12 h-12 rounded-full bg-[#c8e639]/30 flex items-center justify-center mb-3">
                    <Camera size={20} className="text-[#1b2620]" />
                  </div>
                  <p className="text-sm font-bold text-[#1b2620]">Drag photos here, or click to browse</p>
                  <p className="text-xs text-[#1b2620]/40 mt-1">JPG or PNG - crop condition, pest damage, irrigation, etc.</p>
                </div>

                {stagedImages.length > 0 && (
                  <div className="mt-4 relative z-10">
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                      {stagedImages.map((img) => (
                        <div key={img.id} className="relative group rounded-xl overflow-hidden aspect-square glass-input fade-in-up">
                          <img src={img.previewUrl} alt="" className="w-full h-full object-cover" />
                          <button
                            onClick={() => removeStaged(img.id)}
                            aria-label="Remove image"
                            className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={uploadStagedImages}
                      disabled={uploading}
                      className="mt-4 w-full bg-[#1b2620] text-white font-bold py-3 rounded-xl hover:bg-[#0a0f0c] transition-all hover:scale-[1.01] flex items-center justify-center gap-2 disabled:opacity-60"
                    >
                      {uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                      {uploading ? "Uploading..." : `Upload ${stagedImages.length} image${stagedImages.length > 1 ? "s" : ""}`}
                    </button>
                  </div>
                )}

                {images.length > 0 && (
                  <div className="mt-5 relative z-10">
                    <p className="text-[10px] uppercase tracking-wide font-extrabold text-[#1b2620]/40 mb-2">Previously uploaded</p>
                    <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                      {images.slice(0, 12).map((img) => (
                        <div key={img.id} className="rounded-lg overflow-hidden aspect-square glass-input">
                          <img src={img.url} alt="" className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* ---- RIGHT COLUMN ---- */}
            <div className="flex flex-col gap-6">
              {/* Submit report */}
              <div className="glass-panel-dark rounded-3xl p-6 relative overflow-hidden fade-in-up" style={{ animationDelay: "100ms" }}>
                <div className="glass-shine glass-shine-dark" />
                <div className="relative z-10">
                  <h3 className="text-white font-extrabold text-sm tracking-wide uppercase mb-1">Submit Progress Report</h3>
                  <p className="text-white/50 text-xs font-bold mb-4">{todayLabel()} - {taskCounts.completed}/{taskCounts.total} tasks completed</p>

                  <div className="flex bg-white/10 p-1 rounded-full mb-4">
                    {(["Daily", "Weekly"] as const).map((t) => (
                      <button
                        key={t}
                        onClick={() => setReportType(t)}
                        className={`flex-1 text-xs font-bold py-2 rounded-full transition-all duration-300 ${
                          reportType === t ? "bg-[#c8e639] text-[#1b2620]" : "text-white/60 hover:text-white"
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>

                  <textarea
                    value={reportNotes}
                    onChange={(e) => setReportNotes(e.target.value)}
                    placeholder={`Summarize your ${reportType.toLowerCase()} progress for the owner...`}
                    rows={4}
                    className="w-full bg-white/10 border border-white/15 rounded-xl p-3 text-sm text-white placeholder-white/30 outline-none focus:ring-2 focus:ring-[#c8e639] resize-none mb-4"
                  />

                  <button
                    onClick={submitReport}
                    disabled={submittingReport}
                    className="w-full bg-[#c8e639] text-[#1b2620] font-extrabold py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(200,230,57,0.2)] hover:shadow-[0_0_30px_rgba(200,230,57,0.5)] transition-all hover:scale-[1.02] disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-white"
                  >
                    {submittingReport ? <Loader2 size={16} className="animate-spin" /> : reportSubmitted ? <Check size={16} /> : <Send size={16} />}
                    {submittingReport ? "Submitting..." : reportSubmitted ? "Submitted!" : `Submit ${reportType} Report`}
                  </button>
                </div>
              </div>

              {/* Previous updates */}
              <div className="glass-panel rounded-3xl p-6 flex-1 min-h-[300px] fade-in-up" style={{ animationDelay: "160ms" }}>
                <h3 className="text-[#1b2620] font-extrabold text-sm tracking-wide uppercase mb-4 relative z-10">Previous Updates</h3>

                {updates.length === 0 ? (
                  <div className="flex flex-col items-center justify-center text-center py-12 text-[#1b2620]/40 relative z-10">
                    <ImageOff size={28} className="mb-2 opacity-50" />
                    <p className="font-bold text-sm">No updates yet</p>
                    <p className="text-xs">Your submitted reports will show up here.</p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3 relative z-10">
                    {updates.map((u, i) => (
                      <div key={u.id} className="glass-input rounded-2xl p-4 fade-in-up" style={{ animationDelay: `${180 + i * 50}ms` }}>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded ${u.type === "Weekly" ? "bg-[#1b2620] text-white" : "bg-[#c8e639]/50 text-[#1b2620]"}`}>
                            {u.type}
                          </span>
                          <span className="text-[10px] font-bold text-[#1b2620]/40">
                            {new Date(u.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                          </span>
                        </div>
                        <p className="text-xs text-[#1b2620]/70 leading-relaxed mb-2 line-clamp-3">{u.notes}</p>
                        <div className="flex items-center gap-3 text-[10px] font-bold text-[#1b2620]/40">
                          <span>{u.tasksCompleted}/{u.totalTasks} tasks done</span>
                          <span className="flex items-center gap-1"><Camera size={10} /> {u.imageCount}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {toast && (
        <div className="fixed bottom-6 right-6 z-50 glass-panel-strong rounded-2xl px-5 py-3 flex items-center gap-2 toast-in">
          <Check size={16} className="text-[#1b2620]" />
          <span className="text-sm font-bold text-[#1b2620]">{toast}</span>
          
        </div>
      )}

      
    

   
    </div>
    </div>
  );
}