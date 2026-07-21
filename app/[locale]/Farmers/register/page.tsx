"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import HelpTourButton from "@/app/[locale]/HelpTourButton";
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  X,
  ArrowRight,
  MapPin,
  Loader2,
  Volume2,
  VolumeX,
  Globe,
} from "lucide-react";
import NavBar from "../../navbar";
import Footer from "../../Footer";

const easeOut = [0.16, 1, 0.3, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: easeOut } },
};

// ---------------------------------------------------------------------------
// Multi-language voice guide
// Note: translations below are a best-effort starting point, not reviewed by
// native speakers — swap in verified copy before shipping to real users.
// ---------------------------------------------------------------------------
type LangCode = "en" | "es" | "hi" | "bn";

const LANGUAGES: { code: LangCode; label: string; ttsLang: string }[] = [
  { code: "en", label: "English", ttsLang: "en-US" },
  { code: "es", label: "Español", ttsLang: "es-ES" },
  { code: "hi", label: "हिन्दी", ttsLang: "hi-IN" },

];

const STRINGS: Record <
  LangCode,
  {
    header: string;
    farmName: string;
    ownerName: string;
    location: string;
    acreage: string;
    farmBasicsSection: string;
    cropsCertsSection: string;
    uploadZone: string;
    iotSection: string;
    timeline: string;
    submitReady: string;
    submitBlocked: string;
    submitted: string;
    languageChanged: string;
    cropAdded: (crop: string) => string;
    cropRemoved: (crop: string) => string;
    certSelected: (label: string) => string;
    certRemoved: (label: string) => string;
    iotAdded: (title: string) => string;
    iotRemoved: (title: string) => string;
    iotDesc: (title: string, desc: string) => string;
    uploading: (n: number) => string;
  }
> = {
  en: {
    header:
      "Welcome. This form registers your land for verification and investment. Tap any box to hear what to do. Tap the speaker icon anytime to turn the guide off.",
    farmName: "Enter your farm's name here.",
    ownerName: "Enter the full legal name of the land owner here.",
    location: "Enter the county and state where your land is located.",
    acreage: "Enter your total land size, in acres, here.",
    farmBasicsSection: "Enter your farm information: name, owner, location, and total acreage.",
    cropsCertsSection: "Choose the crops you grow, and any certifications your farm has.",
    uploadZone: "Tap here to upload your land documents, like your deed or ownership certificate.",
    iotSection: "Choose the farm sensors you would like installed. Some are already included for you.",
    timeline: "This shows how long registration, certification, and listing usually take.",
    submitReady: "Everything looks good. Tap the black button below to submit your application.",
    submitBlocked: "Please fill in your farm name, owner name, and acreage before submitting.",
    submitted: "Your application has been submitted. Our team will review your farm and contact you soon.",
    languageChanged: "Voice guide is now in English.",
    cropAdded: (c) => `${c} added.`,
    cropRemoved: (c) => `${c} removed.`,
    certSelected: (l) => `${l} selected.`,
    certRemoved: (l) => `${l} removed.`,
    iotAdded: (t) => `${t} added.`,
    iotRemoved: (t) => `${t} removed.`,
    iotDesc: (t, d) => `${t}. ${d}`,
    uploading: (n) => `Uploading ${n} file${n > 1 ? "s" : ""}. Please wait.`,
  },
  es: {
    header:
      "Bienvenido. Este formulario registra su terreno para verificación e inversión. Toque cualquier casilla para escuchar qué hacer. Toque el ícono del altavoz para apagar la guía.",
    farmName: "Ingrese el nombre de su finca aquí.",
    ownerName: "Ingrese el nombre legal completo del propietario aquí.",
    location: "Ingrese el condado y el estado donde se encuentra su terreno.",
    acreage: "Ingrese el tamaño total de su terreno, en acres, aquí.",
    farmBasicsSection: "Ingrese la información de su finca: nombre, propietario, ubicación y superficie total.",
    cropsCertsSection: "Elija los cultivos que produce y cualquier certificación que tenga su finca.",
    uploadZone: "Toque aquí para subir sus documentos de tierra, como su escritura o certificado de propiedad.",
    iotSection: "Elija los sensores que desea instalar en su finca. Algunos ya están incluidos.",
    timeline: "Esto muestra cuánto tiempo suelen tardar el registro, la certificación y la publicación.",
    submitReady: "Todo está listo. Toque el botón negro de abajo para enviar su solicitud.",
    submitBlocked: "Complete el nombre de la finca, el propietario y la superficie antes de enviar.",
    submitted: "Su solicitud ha sido enviada. Nuestro equipo revisará su finca y se pondrá en contacto pronto.",
    languageChanged: "La guía de voz ahora está en español.",
    cropAdded: (c) => `${c} agregado.`,
    cropRemoved: (c) => `${c} eliminado.`,
    certSelected: (l) => `${l} seleccionado.`,
    certRemoved: (l) => `${l} eliminado.`,
    iotAdded: (t) => `${t} agregado.`,
    iotRemoved: (t) => `${t} eliminado.`,
    iotDesc: (t, d) => `${t}. ${d}`,
    uploading: (n) => `Subiendo ${n} archivo${n > 1 ? "s" : ""}. Por favor espere.`,
  },
  hi: {
    header:
      "स्वागत है। यह फ़ॉर्म आपकी ज़मीन को सत्यापन और निवेश के लिए पंजीकृत करता है। क्या करना है यह सुनने के लिए किसी भी बॉक्स को छुएं। गाइड बंद करने के लिए स्पीकर आइकन को छुएं।",
    farmName: "यहां अपने खेत का नाम दर्ज करें।",
    ownerName: "यहां भूमि मालिक का पूरा कानूनी नाम दर्ज करें।",
    location: "वह जिला और राज्य दर्ज करें जहां आपकी ज़मीन स्थित है।",
    acreage: "यहां अपनी कुल भूमि का आकार, एकड़ में, दर्ज करें।",
    farmBasicsSection: "अपने खेत की जानकारी दर्ज करें: नाम, मालिक, स्थान, और कुल क्षेत्रफल।",
    cropsCertsSection: "आप जो फसलें उगाते हैं उन्हें चुनें, और अपने खेत के किसी भी प्रमाणपत्र को चुनें।",
    uploadZone: "अपने भूमि दस्तावेज़, जैसे विलेख या स्वामित्व प्रमाणपत्र, अपलोड करने के लिए यहां छुएं।",
    iotSection: "अपने खेत में लगाए जाने वाले सेंसर चुनें। कुछ पहले से शामिल हैं।",
    timeline: "यह दिखाता है कि पंजीकरण, प्रमाणन, और सूचीकरण में आमतौर पर कितना समय लगता है।",
    submitReady: "सब कुछ ठीक है। अपना आवेदन जमा करने के लिए नीचे दिए गए काले बटन को छुएं।",
    submitBlocked: "जमा करने से पहले कृपया खेत का नाम, मालिक का नाम, और क्षेत्रफल भरें।",
    submitted: "आपका आवेदन जमा कर दिया गया है। हमारी टीम आपके खेत की समीक्षा करेगी और जल्द ही संपर्क करेगी।",
    languageChanged: "वॉइस गाइड अब हिन्दी में है।",
    cropAdded: (c) => `${c} जोड़ा गया।`,
    cropRemoved: (c) => `${c} हटाया गया।`,
    certSelected: (l) => `${l} चुना गया।`,
    certRemoved: (l) => `${l} हटाया गया।`,
    iotAdded: (t) => `${t} जोड़ा गया।`,
    iotRemoved: (t) => `${t} हटाया गया।`,
    iotDesc: (t, d) => `${t}. ${d}`,
    uploading: (n) => `${n} फ़ाइलें अपलोड हो रही हैं। कृपया प्रतीक्षा करें।`,
  },

};

function StepLabel({
  number,
  title,
  sub,
  voice,
  onSpeak,
}: {
  number: string;
  title: string;
  sub: string;
  voice?: string;
  onSpeak?: (text: string) => void;
}) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div className="flex items-start gap-3">
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-neutral-900 text-[11px] font-bold text-white">
          {number}
        </span>
        <div>
          <h2 className="text-sm font-bold uppercase tracking-[0.1em] text-neutral-900">{title}</h2>
          <p className="mt-0.5 text-xs text-neutral-500">{sub}</p>
        </div>
      </div>
      {voice && onSpeak && (
        <button
          type="button"
          onClick={() => onSpeak(voice)}
          aria-label={`Hear instructions for ${title}`}
          className="shrink-0 flex h-8 w-8 items-center justify-center rounded-full bg-[#eaf6c8] text-[#4a5a12] hover:bg-[#dcf0a8] transition-colors"
        >
          <Volume2 size={15} />
        </button>
      )}
    </div>
  );
}

function Field({
  label,
  placeholder,
  value,
  onChange,
  voice,
  onFocusField,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  voice?: string;
  onFocusField?: (text: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-[11px] font-semibold uppercase tracking-wide text-neutral-500">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => voice && onFocusField?.(voice)}
        placeholder={placeholder}
        className="mt-1.5 w-full rounded-lg border border-neutral-300 bg-white px-3.5 py-2.5 text-sm text-neutral-900 outline-none transition focus:border-neutral-900"
      />
    </label>
  );
}

const CROPS = ["Corn", "Soybeans", "Winter Wheat", "Alfalfa", "Fallow", "Organic Garden"];
export const registerLandSteps = [
  {
    target: "#register-header",
    content:
      "👋 Welcome to the Land Registration page. Complete this form to verify your farmland and make it available for investment on AgriVest.",
  },
  {
    target: "#farm-basics",
    content:
      "🌾 Enter your farm information, owner details, location, and total land area. These details help us identify and verify your property.",
  },
  {
    target: "#farm-name",
    content:
      "🌱 Select your current crops and sustainability certifications to showcase your farming practices to potential investors.",
  },
  {
    target: "#legal-documents",
    content:
      "📄 Upload your ownership documents, land deeds, or legal certificates. These files are required to verify your farmland.",
  },
  {
    target: "#iot-installation",
    content:
      "📡 Choose smart IoT devices to monitor your farm. Real-time data improves transparency and increases investor confidence.",
  },
  {
    target: "#timeline",
    content:
      "⏳ Review the estimated verification, certification, and listing timeline before submitting your application.",
  },
  {
    target: "#submit-application",
    content:
      "✅ Once all required information is complete, submit your application for review. We'll verify your farm before listing it on AgriVest.",
  },
];
export const registerLandSpeechSections = [
  {
    target: "#register-header",
    text: "Welcome to the Land Registration page. This form helps you register your farmland for verification and investment opportunities through AgriVest.",
  },
  {
    target: "#farm-basics",
    text: "Begin by entering your farm's basic information, including the farm name, owner's name, location, and total acreage. These details help us identify and verify your property.",
  },
  {
    target: "#farm-name",
    text: "Next, tell us about your agricultural practices. Select the crops you currently grow and choose any sustainability certifications your farm has earned. This information helps investors better understand your farming methods.",
  },
  {
    target: "#legal-documents",
    text: "Upload your legal ownership documents, such as land deeds or certificates. These documents are securely verified before your farmland is approved for listing.",
  },
  {
    target: "#iot-installation",
    text: "Choose the smart IoT devices you would like to install on your farm. These devices provide real-time monitoring, improve transparency, and increase investor confidence.",
  },
  {
    target: "#timeline",
    text: "Review the expected registration, verification, and investment listing timeline. This section gives you an estimate of when your farm will become available to investors.",
  },
  {
    target: "#submit-application",
    text: "After reviewing all the information, click Submit Application. Our team will verify your details and notify you once your farmland has been approved.",
  },
];
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

// Section ids used for both voice targeting and the focus-highlight ring
const SECTION_IDS = {
  basics: "farm-basics",
  crops: "farm-name",
  legal: "legal-documents",
  iot: "iot-installation",
} as const;

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

  // ---- Voice guide state ----
  const [voiceEnabled, setVoiceEnabled] = useState(true); // guide is on by default the moment the page loads
  const [language, setLanguage] = useState<LangCode>("en");
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const hasSpokenWelcome = useRef(false);

  const t = STRINGS[language];
  const ttsLang = LANGUAGES.find((l) => l.code === language)?.ttsLang ?? "en-US";

  const speak = useCallback(
    (text: string) => {
      if (!voiceEnabled) return;
      if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.92;
      utterance.lang = ttsLang;
      window.speechSynthesis.speak(utterance);
    },
    [voiceEnabled, ttsLang]
  );

  // Voice guide starts automatically as soon as the page loads
  useEffect(() => {
    if (voiceEnabled && !hasSpokenWelcome.current) {
      hasSpokenWelcome.current = true;
      const timer = setTimeout(() => speak(t.header), 600);
      return () => clearTimeout(timer);
    }
    return () => {
      window.speechSynthesis?.cancel();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Declining / re-enabling the guide
  const toggleVoice = () => {
    setVoiceEnabled((v) => {
      const next = !v;
      if (!next) window.speechSynthesis?.cancel();
      return next;
    });
  };

  const changeLanguage = (code: LangCode) => {
    setLanguage(code);
    setLangMenuOpen(false);
    // confirm the switch out loud, in the newly chosen language
    if (voiceEnabled) {
      window.speechSynthesis?.cancel();
      const utterance = new SpeechSynthesisUtterance(STRINGS[code].languageChanged);
      utterance.rate = 0.92;
      utterance.lang = LANGUAGES.find((l) => l.code === code)?.ttsLang ?? "en-US";
      window.speechSynthesis.speak(utterance);
    }
  };

  // Called by any field/control when it receives focus: highlights its
  // section and speaks the given text.
  const focusIn = useCallback(
    (sectionId: string, text: string) => {
      setActiveSection(sectionId);
      speak(text);
    },
    [speak]
  );

  const sectionClass = (id: string) =>
    `rounded-2xl border-1 bg-white/50 p-6 md:p-8 transition-all duration-300 ${
      activeSection === id
        ? "border-[#8bba16] ring-2 ring-[#c8e639] ring-offset-2 ring-offset-[#f7f9f2] shadow-lg"
        : "border-[#c7d6a0]"
    }`;

  const toggleCrop = (crop: string) => {
    const willAdd = !selectedCrops.includes(crop);
    focusIn(SECTION_IDS.crops, willAdd ? t.cropAdded(crop) : t.cropRemoved(crop));
    setSelectedCrops((prev) => (prev.includes(crop) ? prev.filter((c) => c !== crop) : [...prev, crop]));
  };

  const toggleCert = (key: string, label: string) => {
    const willEnable = !certs[key];
    focusIn(SECTION_IDS.crops, willEnable ? t.certSelected(label) : t.certRemoved(label));
    setCerts((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleIot = (key: string, title: string, required?: boolean) => {
    if (required) return;
    const willEnable = !iot[key];
    focusIn(SECTION_IDS.iot, willEnable ? t.iotAdded(title) : t.iotRemoved(title));
    setIot((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const estimatedCost = IOT_ITEMS.reduce((sum, item) => sum + (iot[item.key] ? item.cost : 0), 0);

  const simulateUpload = (fileList: FileList) => {
    focusIn(SECTION_IDS.legal, t.uploading(fileList.length));
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const removeFile = (id: string) => setFiles((prev) => prev.filter((f) => f.id !== id));

  const canSubmit = farmName.trim() && ownerName.trim() && acreage.trim() && !submitted;

  const handleSubmit = () => {
    if (!canSubmit) {
      speak(t.submitBlocked);
      return;
    }
    setSubmitted(true);
    setActiveSection(null);
    speak(t.submitted);
  };

  return (
    <div className="min-h-screen bg-[#f7f9f2] px-6 pb-20 font-sans md:px-14  ">
      <NavBar />
      <HelpTourButton steps={registerLandSteps}  />

      {/* Voice guide controls — fixed so they're reachable from anywhere on the page */}
      <div className="fixed right-20 bottom-7 z-40 flex flex-col items-end gap-2">
        {langMenuOpen && (
          <div className="flex flex-row gap-1 rounded-2xl bg-white p-2 shadow-lg border border-neutral-200">
            {LANGUAGES.map((l) => (
              <button
                key={l.code}
                onClick={() => changeLanguage(l.code)}
                className={`flex items-center justify-between gap-4 rounded-xl px-3.5 py-2 text-xs font-bold transition-colors ${
                  language === l.code ? "bg-neutral-900 text-[#c8e639]" : "text-neutral-600 hover:bg-neutral-100"
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>
        )}

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setLangMenuOpen((v) => !v)}
            aria-label="Choose voice guide language"
            className="flex items-center gap-2 rounded-full bg-white border border-neutral-300 px-4 py-3 text-xs font-bold text-neutral-700 shadow-lg hover:bg-neutral-50 transition-colors"
          >
            <Globe size={16} /> {LANGUAGES.find((l) => l.code === language)?.label}
          </button>

          <button
            type="button"
            onClick={toggleVoice}
            aria-label={voiceEnabled ? "Turn off voice guide" : "Turn on voice guide"}
            className={`flex items-center gap-2 rounded-full px-4 py-3 text-xs font-bold shadow-lg transition-colors ${
              voiceEnabled ? "bg-neutral-900 text-[#c8e639]" : "bg-white text-neutral-500 border border-neutral-300"
            }`}
          >
            {voiceEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
            {voiceEnabled ? "Voice guide on" : "Voice guide off"}
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-[1000px]  border-2 border-dashed border-[#8bba16] bg-white p-6 rounded-xl mt-3.5">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: easeOut }} className="text-center bg-neutral-50  rounded-t-2xl">
          <div id="register-header" className="mx-auto mt-3 m text-sm text-neutral-600  border-b-2 border-[#c1ed7a] p-3  w-full text-6xl font-extrabold
    text-transparent
    [-webkit-text-stroke:1.5px_theme(colors.neutral.900)] ">
            <div className="flex  justify-between">
              <h1 className="text-3xl max-w-[45px]  font-extrabold uppercase tracking-tight   text-[#c1ed7a] md:text-4xl p-2 bg-neutral-900 m-2 rounded-2xl">Register Your Land</h1>
              <button
                type="button"
                onClick={() => speak(t.header)}
                aria-label="Hear welcome instructions"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-[#eaf6c8] text-[#4a5a12] hover:bg-[#dcf0a8] transition-colors"
              >
                <Volume2 size={16} />
              </button>
            </div>
            <p className="max-w-[45ch] "> Provide the technical and legal attributes required to open your farm to global agricultural investment.</p>
          </div>
        </motion.div>

        <div className="mt-12 flex flex-col gap-10">
          <motion.section
            id={SECTION_IDS.basics}
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            className={sectionClass(SECTION_IDS.basics)}
          >
            <StepLabel number="01" title="Farmer & farm basics" sub="Ownership and geographic location details" voice={t.farmBasicsSection} onSpeak={(text) => focusIn(SECTION_IDS.basics, text)} />
            <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-[1fr_1fr_auto]">
              <div className="flex flex-col gap-5">
                <Field label="Farm entity name" placeholder="e.g. Green Meadow Holdings" value={farmName} onChange={setFarmName} voice={t.farmName} onFocusField={(text) => focusIn(SECTION_IDS.basics, text)} />
                <Field label="Owner legal name" placeholder="e.g. Full legal owner name" value={ownerName} onChange={setOwnerName} voice={t.ownerName} onFocusField={(text) => focusIn(SECTION_IDS.basics, text)} />
              </div>
              <div className="flex flex-col gap-5">
                <Field label="Land location" placeholder="e.g. County, State" value={location} onChange={setLocation} voice={t.location} onFocusField={(text) => focusIn(SECTION_IDS.basics, text)} />
                <Field label="Total acreage" placeholder="e.g. 438" value={acreage} onChange={setAcreage} voice={t.acreage} onFocusField={(text) => focusIn(SECTION_IDS.basics, text)} />
              </div>
              <div className="flex w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-neutral-300 bg-neutral-50 p-4 text-center md:w-40">
                <MapPin size={18} className="text-neutral-400" />
                <p className="text-[11px] font-semibold uppercase tracking-wide text-neutral-500">GPS boundary snapshot</p>
                <p className="text-[10px] text-neutral-400">Auto-plotted from location</p>
              </div>
            </div>
          </motion.section>

          <motion.section
            id={SECTION_IDS.crops}
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            className={sectionClass(SECTION_IDS.crops)}
          >
            <StepLabel number="02" title="Agricultural practices" sub="Current crop cycle and sustainability certifications" voice={t.cropsCertsSection} onSpeak={(text) => focusIn(SECTION_IDS.crops, text)} />

            <p className="mt-6 text-[11px] font-semibold uppercase tracking-wide text-neutral-500">Active crop rotation</p>
            <div className="mt-2.5 flex flex-wrap gap-2">
              {CROPS.map((crop) => {
                const active = selectedCrops.includes(crop);
                return (
                  <button
                    key={crop}
                    onClick={() => toggleCrop(crop)}
                    onFocus={() => focusIn(SECTION_IDS.crops, crop)}
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
                  <input
                    type="checkbox"
                    checked={certs[key]}
                    onChange={() => toggleCert(key, label)}
                    onFocus={() => focusIn(SECTION_IDS.crops, label)}
                    className="h-4 w-4 accent-[#c8e639]"
                  />
                  {label}
                </label>
              ))}
            </div>
          </motion.section>

          <motion.section
            id={SECTION_IDS.legal}
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            className={sectionClass(SECTION_IDS.legal)}
          >
            <StepLabel number="03" title="Legal documentation" sub="Official titles, land deeds, and identification" voice={t.uploadZone} onSpeak={(text) => focusIn(SECTION_IDS.legal, text)} />

            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={onDrop}
              onClick={() => fileInputRef.current?.click()}
              onFocus={() => focusIn(SECTION_IDS.legal, t.uploadZone)}
              tabIndex={0}
              role="button"
              aria-label="Upload legal documents"
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

          <motion.section
            id={SECTION_IDS.iot}
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            className={sectionClass(SECTION_IDS.iot)}
          >
            <StepLabel number="04" title="IoT sensor installation" sub="Hardware compatibility check for your farm listing" voice={t.iotSection} onSpeak={(text) => focusIn(SECTION_IDS.iot, text)} />

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
                    onChange={() => toggleIot(key, title, required)}
                    onFocus={() => focusIn(SECTION_IDS.iot, t.iotDesc(title, desc))}
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

          <motion.div id="timeline" variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} className="rounded-2xl border-2 border-[#c7d6a0] bg-white/50 border-dashed  e p-6 text-center">
            <div className="flex items-center justify-center gap-2">
              <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-neutral-900">Expectation timeline</p>
              <button
                type="button"
                onClick={() => speak(t.timeline)}
                aria-label="Hear timeline explanation"
                className="flex h-7 w-7 items-center justify-center rounded-full bg-[#eaf6c8] text-[#4a5a12] hover:bg-[#dcf0a8] transition-colors"
              >
                <Volume2 size={13} />
              </button>
            </div>
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
            id="submit-application"
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            whileHover={canSubmit ? { scale: 1.01 } : {}}
            whileTap={canSubmit ? { scale: 0.99 } : {}}
            onClick={handleSubmit}
            onFocus={() => speak(canSubmit ? t.submitReady : t.submitBlocked)}
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