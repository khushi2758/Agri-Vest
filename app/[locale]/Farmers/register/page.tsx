"use client";
import { useCallback, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  X,
  ArrowRight,
  MapPin,
  Loader2,
} from "lucide-react";
import NavBar from "../../navbar";
import Footer from "../../Footer";

const easeOut = [0.16, 1, 0.3, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: easeOut } },
};

function StepLabel({ number, title, sub }: { number: string; title: string; sub: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-neutral-900 text-[11px] font-bold text-white">
        {number}
      </span>
      <div>
        <h2 className="text-sm font-bold uppercase tracking-[0.1em] text-neutral-900">{title}</h2>
        <p className="mt-0.5 text-xs text-neutral-500">{sub}</p>
      </div>
    </div>
  );
}

function Field({ label, placeholder, value, onChange }: { label: string; placeholder: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="block">
      <span className="text-[11px] font-semibold uppercase tracking-wide text-neutral-500">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-1.5 w-full rounded-lg border border-neutral-300 bg-white px-3.5 py-2.5 text-sm text-neutral-900 outline-none transition focus:border-neutral-900"
      />
    </label>
  );
}

const CROPS = ["Corn", "Soybeans", "Winter Wheat", "Alfalfa", "Fallow", "Organic Garden"];

const CERTS = [
  { key: "organic", label: "Certified organic" },
  { key: "regen", label: "Regenerative practices" },
  { key: "water", label: "Water rights certified" },
  { key: "carbon", label: "Low-carbon irrigation" },
];

type UploadFile = { id: string; name: string; progress: number; done: boolean };

type IotItem = { key: string; title: string; desc: string; cost: number; required?: boolean };

const IOT_ITEMS: IotItem[] = [
  { key: "soil", title: "Soil moisture network (12 nodes)", desc: "Auto-installed with the base package upon verification.", cost: 850, required: true },
  { key: "weather", title: "Automated weather station", desc: "Required for modern crop-yield claims.", cost: 1200 },
  { key: "camera", title: "High-res tract camera (live feed)", desc: "Boosts investor confidence with real-time footage.", cost: 400 },
];

export default function RegisterLand() {
  const [farmName, setFarmName] = useState("");
  const [location, setLocation] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [acreage, setAcreage] = useState("");

  const [selectedCrops, setSelectedCrops] = useState<string[]>(["Corn"]);
  const [certs, setCerts] = useState<Record<string, boolean>>({ organic: true, regen: false, water: false, carbon: false });

  const [files, setFiles] = useState<UploadFile[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [iot, setIot] = useState<Record<string, boolean>>({ soil: true, weather: true, camera: false });

  const [submitted, setSubmitted] = useState(false);

  const toggleCrop = (crop: string) =>
    setSelectedCrops((prev) => (prev.includes(crop) ? prev.filter((c) => c !== crop) : [...prev, crop]));

  const toggleCert = (key: string) => setCerts((prev) => ({ ...prev, [key]: !prev[key] }));

  const toggleIot = (key: string, required?: boolean) => {
    if (required) return;
    setIot((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const estimatedCost = IOT_ITEMS.reduce((sum, item) => sum + (iot[item.key] ? item.cost : 0), 0);

  const simulateUpload = (fileList: FileList) => {
    Array.from(fileList).forEach((file) => {
      const id = `${file.name}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      setFiles((prev) => [...prev, { id, name: file.name, progress: 0, done: false }]);
      const interval = setInterval(() => {
        setFiles((prev) =>
          prev.map((f) => {
            if (f.id !== id || f.done) return f;
            const next = Math.min(f.progress + 18 + Math.random() * 12, 100);
            return { ...f, progress: next, done: next >= 100 };
          })
        );
      }, 220);
      setTimeout(() => clearInterval(interval), 2200);
    });
  };

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files?.length) simulateUpload(e.dataTransfer.files);
  }, []);

  const removeFile = (id: string) => setFiles((prev) => prev.filter((f) => f.id !== id));

  const canSubmit = farmName.trim() && ownerName.trim() && acreage.trim() && !submitted;

  const handleSubmit = () => {
    if (!canSubmit) return;
    setSubmitted(true);
  };

  return (
     <div className="min-h-screen bg-[#b8cb8a] px-6 pb-20 font-sans md:px-14  ">
      <NavBar />
      <div className="mx-auto max-w-[920px] border-2 border-dashed border-[#a4c358] bg-white/50 p-6 rounded-xl mt-3.5">
        
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: easeOut }} className="text-center">
          <h1 className="text-3xl font-extrabold uppercase tracking-tight text-[#335202] md:text-4xl">Register Your Land</h1>
          <p className="mx-auto mt-3 max-w-[46ch] text-sm text-neutral-500">
            Provide the technical and legal attributes required to open your farm to global agricultural investment.
          </p>
        </motion.div>

        <div className="mt-12 flex flex-col gap-10">
          <motion.section variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} className="rounded-2xl border-1 border-[#c7d6a0] bg-white/50  p-6 md:p-8">
            <StepLabel number="01" title="Farmer & farm basics" sub="Ownership and geographic location details" />
            <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-[1fr_1fr_auto]">
              <div className="flex flex-col gap-5">
                <Field label="Farm entity name" placeholder="e.g. Green Meadow Holdings" value={farmName} onChange={setFarmName} />
                <Field label="Owner legal name" placeholder="e.g. Full legal owner name" value={ownerName} onChange={setOwnerName} />
              </div>
              <div className="flex flex-col gap-5">
                <Field label="Land location" placeholder="e.g. County, State" value={location} onChange={setLocation} />
                <Field label="Total acreage" placeholder="e.g. 438" value={acreage} onChange={setAcreage} />
              </div>
              <div className="flex w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-neutral-300 bg-neutral-50 p-4 text-center md:w-40">
                <MapPin size={18} className="text-neutral-400" />
                <p className="text-[11px] font-semibold uppercase tracking-wide text-neutral-500">GPS boundary snapshot</p>
                <p className="text-[10px] text-neutral-400">Auto-plotted from location</p>
              </div>
            </div>
          </motion.section>

          <motion.section variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} className="rounded-2xl border-1 border-[#c7d6a0] bg-white/50 p-6 md:p-8">
            <StepLabel number="02" title="Agricultural practices" sub="Current crop cycle and sustainability certifications" />

            <p className="mt-6 text-[11px] font-semibold uppercase tracking-wide text-neutral-500">Active crop rotation</p>
            <div className="mt-2.5 flex flex-wrap gap-2">
              {CROPS.map((crop) => {
                const active = selectedCrops.includes(crop);
                return (
                  <button
                    key={crop}
                    onClick={() => toggleCrop(crop)}
                    className={`rounded-full border px-4 py-1.5 text-xs font-semibold transition ${
                      active ? "border-neutral-900 bg-neutral-900 text-white" : "border-neutral-300 text-neutral-600 hover:border-neutral-500"
                    }`}
                  >
                    {crop}
                  </button>
                );
              })}
            </div>

            <p className="mt-6 text-[11px] font-semibold uppercase tracking-wide text-neutral-500">Sustainability certifications</p>
            <div className="mt-2.5 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              {CERTS.map(({ key, label }) => (
                <label key={key} className="flex cursor-pointer items-center gap-2.5 rounded-lg border border-neutral-200 px-3.5 py-2.5 text-sm text-neutral-800 transition hover:border-neutral-400">
                  <input type="checkbox" checked={certs[key]} onChange={() => toggleCert(key)} className="h-4 w-4 accent-[#c8e639]" />
                  {label}
                </label>
              ))}
            </div>
          </motion.section>

          <motion.section variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} className="rounded-2xl border-1 border-[#c7d6a0] bg-white/50 p-6 md:p-8">
            <StepLabel number="03" title="Legal documentation" sub="Official titles, land deeds, and identification" />

            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={onDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`mt-6 flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 border-dashed p-8 text-center transition ${
                dragOver ? "border-neutral-900 bg-neutral-50" : "border-neutral-300"
              }`}
            >
              <UploadCloud size={22} className="text-neutral-400" />
              <p className="text-sm font-semibold text-neutral-800">Drop legal docs here</p>
              <p className="text-xs text-neutral-400">Accepts .pdf, .docx up to 20MB · or click to browse</p>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                className="hidden"
                onChange={(e) => e.target.files && simulateUpload(e.target.files)}
              />
            </div>

            {files.length > 0 && (
              <div className="mt-4 flex flex-col gap-2">
                {files.map(({ id, name, progress, done }) => (
                  <div key={id} className="flex items-center gap-3 rounded-lg border border-neutral-200 px-3.5 py-2.5">
                    <FileText size={16} className="shrink-0 text-neutral-400" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-neutral-800">{name}</p>
                      {!done && (
                        <div className="mt-1 h-1 w-full rounded-full bg-neutral-100">
                          <div className="h-full rounded-full bg-[#c8e639] transition-all" style={{ width: `${progress}%` }} />
                        </div>
                      )}
                    </div>
                    {done ? (
                      <CheckCircle2 size={16} className="shrink-0 text-[#5c7a0f]" />
                    ) : (
                      <Loader2 size={16} className="shrink-0 animate-spin text-neutral-400" />
                    )}
                    <button onClick={() => removeFile(id)} aria-label="Remove file">
                      <X size={15} className="text-neutral-400 hover:text-neutral-700" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </motion.section>

          <motion.section variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} className="rounded-2xl border-1 border-[#c7d6a0] bg-white/50 p-6 md:p-8">
            <StepLabel number="04" title="IoT sensor installation" sub="Hardware compatibility check for your farm listing" />

            <div className="mt-6 flex flex-col gap-2.5">
              {IOT_ITEMS.map(({ key, title, desc, cost, required }) => (
                <label
                  key={key}
                  className={`flex items-start gap-3 rounded-lg border px-3.5 py-3 text-sm transition ${
                    required ? "border-neutral-200 bg-neutral-50" : "cursor-pointer border-neutral-200 hover:border-neutral-400"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={iot[key]}
                    disabled={required}
                    onChange={() => toggleIot(key, required)}
                    className="mt-0.5 h-4 w-4 accent-[#c8e639] disabled:opacity-60"
                  />
                  <span className="flex-1">
                    <span className="flex items-center gap-2">
                      <span className="font-semibold text-neutral-900">{title}</span>
                      {required && <span className="rounded-full bg-[#eaf6c8] px-2 py-0.5 text-[10px] font-bold uppercase text-[#4a5a12]">Included</span>}
                    </span>
                    <span className="mt-0.5 block text-xs text-neutral-500">{desc}</span>
                  </span>
                  <span className="whitespace-nowrap text-xs font-semibold text-neutral-500">${cost.toLocaleString()}</span>
                </label>
              ))}
            </div>

            <div className="mt-4 flex items-center justify-between rounded-lg bg-neutral-900 px-4 py-3">
              <p className="text-xs font-semibold text-white">
                Estimated cost: <span className="text-[#c8e639]">${estimatedCost.toLocaleString()}</span>{" "}
                <span className="text-neutral-400">(required for farm listing)</span>
              </p>
            </div>
          </motion.section>

          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} className="rounded-2xl border-2 border-[#c7d6a0] bg-white/50 border-dashed  e p-6 text-center">
            <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-neutral-900">Expectation timeline</p>
            <div className="mx-auto mt-4 grid max-w-md grid-cols-1 gap-3 text-left sm:grid-cols-3">
              {[
                ["Registration & deployment", "10 days"],
                ["Certification ID", "Ongoing"],
                ["Investment cap listing", "Est. Aug 2026"],
              ].map(([label, value]) => (
                <div key={label}>
                  <p className="text-[11px] uppercase tracking-wide text-neutral-500">{label}</p>
                  <p className="text-sm font-bold text-neutral-900">{value}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.button
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            whileHover={canSubmit ? { scale: 1.01 } : {}}
            whileTap={canSubmit ? { scale: 0.99 } : {}}
            onClick={handleSubmit}
            disabled={!canSubmit && !submitted}
            className={`flex w-full items-center justify-center gap-2 rounded-full py-4 text-sm font-semibold text-white transition ${
              submitted ? "bg-[#4a5a12]" : canSubmit ? "bg-neutral-900 hover:bg-neutral-800" : "cursor-not-allowed bg-neutral-300"
            }`}
          >
            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.span key="done" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2">
                  <CheckCircle2 size={16} /> Application submitted
                </motion.span>
              ) : (
                <motion.span key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2">
                  Submit application <ArrowRight size={16} />
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
          {!canSubmit && !submitted && (
            <p className="-mt-6 text-center text-xs text-neutral-400">Fill in farm name, owner, and acreage to submit.</p>
          )}
        
        </div>
         
      </div>
         
    </div>
  );
}