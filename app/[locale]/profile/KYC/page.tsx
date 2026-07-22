"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  User, Calendar, Globe2, Phone, MapPin, FileText, UploadCloud,
  CheckCircle2, X, Loader2, ShieldCheck, ArrowRight, Camera,
  Volume2, VolumeX, Globe, HelpCircle,
} from "lucide-react";
import HelpTourButton from "../../HelpTourButton";
import NavBar from "../../navbar";
// ---------------------------------------------------------------------------
// Guided tour steps — same shape as registerLandSteps / registerLandSpeechSections
// ---------------------------------------------------------------------------
export const kycSteps = [
  {
    target: "#kyc-header",
    content:
      "👋 Welcome to identity verification. This form confirms who you are before you can start investing on AgriVest.",
  },
  {
    target: "#kyc-personal",
    content:
      "🧾 Enter your personal information exactly as it appears on your official ID: full name, date of birth, nationality, phone, and address.",
  },
  {
    target: "#kyc-document",
    content:
      "🪪 Choose your document type — passport, driver's license, or national ID — and upload a clear photo of it.",
  },
  {
    target: "#kyc-address",
    content:
      "🏠 Upload a utility bill or bank statement dated within the last 3 months to confirm your address.",
  },
  {
    target: "#kyc-selfie",
    content:
      "🤳 Upload a selfie of yourself holding your ID, in good lighting, so we can confirm it belongs to you.",
  },
  {
    target: "#kyc-submit",
    content:
      "✅ Once every section is complete, submit for verification. Our team typically reviews within 1–2 business days.",
  },
];

// ---------------------------------------------------------------------------
// Multi-language voice guide (best-effort translations — review before ship)
// ---------------------------------------------------------------------------
type LangCode = "en" | "es" | "hi" | "bn";

const LANGUAGES: { code: LangCode; label: string; ttsLang: string }[] = [
  { code: "en", label: "English", ttsLang: "en-US" },
  { code: "es", label: "Español", ttsLang: "es-ES" },
  { code: "hi", label: "हिन्दी", ttsLang: "hi-IN" },
  { code: "bn", label: "বাংলা", ttsLang: "bn-IN" },
];

const STRINGS: Record<
  LangCode,
  {
    header: string;
    personalSection: string;
    docSection: string;
    addressSection: string;
    selfieSection: string;
    fullName: string;
    dob: string;
    nationality: string;
    phone: string;
    address: string;
    submitReady: string;
    submitBlocked: string;
    submitted: string;
    languageChanged: string;
  }
> = {
  en: {
    header:
      "Welcome. This form verifies your identity. Tap any box to hear what to do, and tap the speaker icon anytime to turn the guide off.",
    personalSection: "Enter your personal information exactly as it appears on your official ID.",
    docSection: "Choose your document type and upload a clear photo of it.",
    addressSection: "Upload a utility bill or bank statement dated within the last 3 months.",
    selfieSection: "Upload a selfie of yourself holding your ID, in good lighting.",
    fullName: "Enter your full legal name here.",
    dob: "Enter your date of birth here.",
    nationality: "Enter your nationality here.",
    phone: "Enter your phone number here.",
    address: "Enter your home address here.",
    submitReady: "Everything looks good. Tap the button below to submit for verification.",
    submitBlocked: "Please complete all fields and uploads before submitting.",
    submitted: "Your verification has been submitted. We'll review it and email you soon.",
    languageChanged: "Voice guide is now in English.",
  },
  es: {
    header:
      "Bienvenido. Este formulario verifica su identidad. Toque cualquier casilla para escuchar qué hacer, y toque el ícono del altavoz para apagar la guía.",
    personalSection: "Ingrese su información personal exactamente como aparece en su identificación oficial.",
    docSection: "Elija el tipo de documento y suba una foto clara del mismo.",
    addressSection: "Suba una factura de servicios o un estado de cuenta bancario de los últimos 3 meses.",
    selfieSection: "Suba una selfie sosteniendo su identificación, con buena iluminación.",
    fullName: "Ingrese su nombre legal completo aquí.",
    dob: "Ingrese su fecha de nacimiento aquí.",
    nationality: "Ingrese su nacionalidad aquí.",
    phone: "Ingrese su número de teléfono aquí.",
    address: "Ingrese su dirección aquí.",
    submitReady: "Todo está listo. Toque el botón de abajo para enviar a verificación.",
    submitBlocked: "Complete todos los campos y cargas antes de enviar.",
    submitted: "Su verificación ha sido enviada. La revisaremos y le enviaremos un correo pronto.",
    languageChanged: "La guía de voz ahora está en español.",
  },
  hi: {
    header:
      "स्वागत है। यह फ़ॉर्म आपकी पहचान सत्यापित करता है। क्या करना है सुनने के लिए किसी भी बॉक्स को छुएं, और गाइड बंद करने के लिए स्पीकर आइकन को छुएं।",
    personalSection: "अपनी आधिकारिक पहचान पत्र के अनुसार अपनी व्यक्तिगत जानकारी दर्ज करें।",
    docSection: "अपना दस्तावेज़ प्रकार चुनें और उसकी स्पष्ट फोटो अपलोड करें।",
    addressSection: "पिछले 3 महीनों के भीतर की उपयोगिता बिल या बैंक स्टेटमेंट अपलोड करें।",
    selfieSection: "अच्छी रोशनी में अपनी ID पकड़े हुए एक सेल्फी अपलोड करें।",
    fullName: "यहां अपना पूरा कानूनी नाम दर्ज करें।",
    dob: "यहां अपनी जन्मतिथि दर्ज करें।",
    nationality: "यहां अपनी राष्ट्रीयता दर्ज करें।",
    phone: "यहां अपना फ़ोन नंबर दर्ज करें।",
    address: "यहां अपना घर का पता दर्ज करें।",
    submitReady: "सब कुछ ठीक है। सत्यापन के लिए जमा करने हेतु नीचे दिया गया बटन दबाएं।",
    submitBlocked: "जमा करने से पहले कृपया सभी फ़ील्ड और अपलोड पूरा करें।",
    submitted: "आपका सत्यापन जमा कर दिया गया है। हम इसकी समीक्षा करेंगे और जल्द ही आपको ईमेल करेंगे।",
    languageChanged: "वॉइस गाइड अब हिन्दी में है।",
  },
  bn: {
    header: "Identity Verification (KYC)",
    personalSection: "Personal Details",
    docSection: "Identity Document",
    addressSection: "Proof of Address",
    selfieSection: "Selfie Verification",
    fullName: "Enter your full legal name here.",
    dob: "Enter your date of birth here.",
    nationality: "Enter your nationality here.",
    phone: "Enter your phone number here.",
    address: "Enter your home address here.",
    submitReady: "Everything looks good. Press the button below to submit for verification.",
    submitBlocked: "Please complete all fields and uploads before submitting.",
    submitted: "Your verification has been submitted. We will review it and email you shortly.",
    languageChanged: "Voice guide is now in Bengali.",
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
  voice: string;
  onSpeak: (text: string) => void;
}) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div className="flex items-start gap-3">
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#1b2620] text-[11px] font-bold text-white">
          {number}
        </span>
        <div>
          <h2 className="text-sm font-extrabold uppercase tracking-[0.1em] text-[#1b2620]">{title}</h2>
          <p className="mt-0.5 text-xs text-[#1b2620]/50">{sub}</p>
        </div>
      </div>
      <button
        type="button"
        onClick={() => onSpeak(voice)}
        aria-label={`Hear instructions for ${title}`}
        className="shrink-0 flex h-8 w-8 items-center justify-center rounded-full bg-[#eaf6c8] text-[#4a5a12] hover:bg-[#dcf0a8] transition-colors"
      >
        <Volume2 size={15} />
      </button>
    </div>
  );
}

function Field({
  label,
  placeholder,
  value,
  onChange,
  icon: Icon,
  type = "text",
  voice,
  onFocusField,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  icon: React.ElementType;
  type?: string;
  voice: string;
  onFocusField: (text: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-[11px] font-bold uppercase tracking-wide text-[#1b2620]/50">{label}</span>
      <div className="mt-1.5 flex items-center gap-2.5 rounded-xl border border-[#1b2620]/10 bg-white px-3.5 py-2.5 focus-within:border-[#8bba16] transition-colors">
        <Icon size={15} strokeWidth={2} className="text-[#1b2620]/40 shrink-0" />
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => onFocusField(voice)}
          placeholder={placeholder}
          className="w-full bg-transparent text-sm font-semibold text-[#1b2620] outline-none placeholder:text-[#1b2620]/30 placeholder:font-medium"
        />
      </div>
    </label>
  );
}

const DOC_TYPES = ["Passport", "Driver's License", "National ID"];

type UploadFile = { id: string; name: string; progress: number; done: boolean; url?: string };

function Dropzone({
  label,
  hint,
  files,
  onUpload,
  onRemove,
  voice,
  onFocusField,
}: {
  label: string;
  hint: string;
  files: UploadFile[];
  onUpload: (fileList: FileList) => void;
  onRemove: (id: string) => void;
  voice: string;
  onFocusField: (text: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      if (e.dataTransfer.files?.length) onUpload(e.dataTransfer.files);
    },
    [onUpload]
  );

  return (
    <div>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        onFocus={() => onFocusField(voice)}
        role="button"
        tabIndex={0}
        aria-label={label}
        className={`flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 border-dashed p-6 text-center transition-colors ${
          dragOver ? "border-[#1b2620] bg-[#f7f9f2]" : "border-[#1b2620]/15 hover:border-[#8bba16]"
        }`}
      >
        <UploadCloud size={20} strokeWidth={2} className="text-[#1b2620]/40" />
        <p className="text-sm font-bold text-[#1b2620]">{label}</p>
        <p className="text-xs text-[#1b2620]/40">{hint}</p>
        <input
          ref={inputRef}
          type="file"
          multiple
          className="hidden"
          onChange={(e) => e.target.files && onUpload(e.target.files)}
        />
      </div>

      {files.length > 0 && (
        <div className="mt-3 flex flex-col gap-2">
          {files.map(({ id, name, progress, done }) => (
            <div key={id} className="flex items-center gap-3 rounded-lg border border-[#1b2620]/10 bg-white px-3.5 py-2.5">
              <FileText size={15} className="shrink-0 text-[#1b2620]/40" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-[#1b2620]">{name}</p>
                {!done && (
                  <div className="mt-1 h-1 w-full rounded-full bg-[#1b2620]/10">
                    <div className="h-full rounded-full bg-[#c8e639] transition-all" style={{ width: `${progress}%` }} />
                  </div>
                )}
              </div>
              {done ? (
                <CheckCircle2 size={15} className="shrink-0 text-[#4a5a12]" />
              ) : (
                <Loader2 size={15} className="shrink-0 animate-spin text-[#1b2620]/30" />
              )}
              <button onClick={() => onRemove(id)} aria-label={`Remove ${name}`}>
                <X size={14} className="text-[#1b2620]/30 hover:text-[#1b2620]/70" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const SECTION_IDS = {
  personal: "kyc-personal",
  document: "kyc-document",
  address: "kyc-address",
  selfie: "kyc-selfie",
} as const;

export default function KYCForm() {
  const [fullName, setFullName] = useState("");
  const [dob, setDob] = useState("");
  const [nationality, setNationality] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const [docType, setDocType] = useState("Passport");
  const [docFiles, setDocFiles] = useState<UploadFile[]>([]);
  const [addressFiles, setAddressFiles] = useState<UploadFile[]>([]);
  const [selfieFiles, setSelfieFiles] = useState<UploadFile[]>([]);

  const [submitted, setSubmitted] = useState(false);

  // ---- voice guide state ----
  const [voiceEnabled, setVoiceEnabled] = useState(true);
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
    if (voiceEnabled) {
      window.speechSynthesis?.cancel();
      const utterance = new SpeechSynthesisUtterance(STRINGS[code].languageChanged);
      utterance.rate = 0.92;
      utterance.lang = LANGUAGES.find((l) => l.code === code)?.ttsLang ?? "en-US";
      window.speechSynthesis.speak(utterance);
    }
  };

  const focusIn = useCallback(
    (sectionId: string, text: string) => {
      setActiveSection(sectionId);
      speak(text);
    },
    [speak]
  );

  const sectionClass = (id: string) =>
    `rounded-2xl border bg-white/60 p-6 transition-all duration-300 ${
      activeSection === id
        ? "border-[#8bba16] ring-2 ring-[#c8e639] ring-offset-2 ring-offset-[#f7f9f2] shadow-lg"
        : "border-[#c7d6a0]"
    }`;

  const handleUpload = (setFiles: React.Dispatch<React.SetStateAction<UploadFile[]>>) => (fileList: FileList) => {
    Array.from(fileList).forEach(async (file) => {
      const id = `${file.name}-${Date.now()}`;
      setFiles((prev) => [...prev, { id, name: file.name, progress: 0, done: false }]);
      
      const formData = new FormData();
      formData.append("file", file);
      
      try {
        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData
        });
        const data = await res.json();
        
        if (res.ok) {
          setFiles((prev) =>
            prev.map((f) => (f.id === id ? { ...f, progress: 100, done: true, url: data.url } : f))
          );
        } else {
          setFiles((prev) => prev.filter(f => f.id !== id));
        }
      } catch (e) {
        setFiles((prev) => prev.filter(f => f.id !== id));
      }
    });
  };

  const removeFile = (setFiles: React.Dispatch<React.SetStateAction<UploadFile[]>>) => (id: string) =>
    setFiles((prev) => prev.filter((f) => f.id !== id));

  const canSubmit =
    fullName.trim() &&
    dob.trim() &&
    nationality.trim() &&
    address.trim() &&
    docFiles.some((f) => f.done) &&
    addressFiles.some((f) => f.done) &&
    selfieFiles.some((f) => f.done) &&
    !submitted;

  const handleSubmit = () => {
    if (!canSubmit) {
      speak(t.submitBlocked);
      return;
    }
    setSubmitted(true);
    setActiveSection(null);
    speak(t.submitted);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#f7f9f2] px-6 pb-20 font-sans md:px-14 flex items-center justify-center">
        <div className="max-w-xl mx-auto bg-white rounded-2xl border border-gray-100 shadow-sm p-10 text-center">
          <div className="w-16 h-16 rounded-full bg-[#eaf6c8] flex items-center justify-center mx-auto mb-5">
            <ShieldCheck size={30} strokeWidth={2} className="text-[#4a5a12]" />
          </div>
          <h1 className="text-xl font-extrabold text-[#1b2620] mb-2">Verification submitted</h1>
          <p className="text-sm text-[#1b2620]/60 max-w-sm mx-auto">
            We're reviewing your documents. This usually takes 1–2 business days. We'll email you once it's complete.
          </p>
        </div>
      </div>
    );
  }

  return (

    <div className="min-h-screen bg-[#f7f9f2] px-6 pb-20 font-sans md:px-14">
<NavBar/>
      {/* voice guide controls — fixed, matching Register Land */}
      <div className="fixed right-25 bottom-5 z-40 flex flex-col items-end gap-2">
        {langMenuOpen && (
          <div className="flex flex-col gap-1 rounded-2xl bg-white p-2 shadow-lg border border-neutral-200">
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

        <HelpTourButton steps={kycSteps}/>
        </div>
      </div>

      <div className="mx-auto max-w-[1000px] border-2 border-dashed border-[#8bba16] bg-white p-6 rounded-xl mt-3.5">

        {/* stacked outline title block */}
        <div id="kyc-header" className="  bg-neutral-50 rounded-t-2xl p-2">
            <div>
          <div className="mx-auto mt-3 text-sm text-neutral-600 border-b-2 border-[#c1ed7a] p-3 w-full relative ">
            <button
              type="button"
              onClick={() => speak(t.header)}
              aria-label="Hear welcome instructions"
              className="absolute top-0 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-[#eaf6c8] text-[#4a5a12] hover:bg-[#dcf0a8] transition-colors"
            >
              <Volume2 size={16} />
            </button>
            </div>
            </div>
            <div >
            <h1 className="text-3xl max-w-[62px]  font-extrabold uppercase tracking-tight text-[#c1ed7a] md:text-4xl p-2 bg-neutral-900 m-2 rounded-2xl
           mt-3 m text-sm   border-b-2 border-[#c1ed7a] p-3  w-full text-6xl font-extrabold
    text-[#c1ed7a]
    [-webkit-text-stroke:1.5px_theme(colors.neutral.900)] 
            ">
              Verify Your Identity
            </h1>
            <p className="max-w-[50ch] text-sm font-mono text-neutral-600 ">
              Provide your identity documents so we can verify your account and unlock investing on AgriVest.
            </p>
          </div>
             
        </div>

        <div className="mt-12 flex flex-col gap-10">
 
          <section id={SECTION_IDS.personal} className={sectionClass(SECTION_IDS.personal)}>
            <StepLabel
              number="01"
              title="Personal information"
              sub="Must match your official identification"
              voice={t.personalSection}
              onSpeak={(text) => focusIn(SECTION_IDS.personal, text)}
            />
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Full legal name" placeholder="e.g. Amara Osei" value={fullName} onChange={setFullName} icon={User} voice={t.fullName} onFocusField={(text) => focusIn(SECTION_IDS.personal, text)} />
              <Field label="Date of birth" placeholder="" value={dob} onChange={setDob} icon={Calendar} type="date" voice={t.dob} onFocusField={(text) => focusIn(SECTION_IDS.personal, text)} />
              <Field label="Nationality" placeholder="e.g. Ghana" value={nationality} onChange={setNationality} icon={Globe2} voice={t.nationality} onFocusField={(text) => focusIn(SECTION_IDS.personal, text)} />
              <Field label="Phone number" placeholder="e.g. +1 555 019 2288" value={phone} onChange={setPhone} icon={Phone} type="tel" voice={t.phone} onFocusField={(text) => focusIn(SECTION_IDS.personal, text)} />
              <div className="sm:col-span-2">
                <Field label="Residential address" placeholder="Street, city, state, postal code" value={address} onChange={setAddress} icon={MapPin} voice={t.address} onFocusField={(text) => focusIn(SECTION_IDS.personal, text)} />
              </div>
            </div>
          </section>
 
          <section id={SECTION_IDS.document} className={sectionClass(SECTION_IDS.document)}>
            <StepLabel
              number="02"
              title="Identity document"
              sub="Upload a clear photo of a valid government ID"
              voice={t.docSection}
              onSpeak={(text) => focusIn(SECTION_IDS.document, text)}
            />
 
            <p className="mt-6 text-[11px] font-bold uppercase tracking-wide text-[#1b2620]/50">Document type</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {DOC_TYPES.map((doc) => (
                <button
                  key={doc}
                  onClick={() => {
                    setDocType(doc);
                    focusIn(SECTION_IDS.document, doc);
                  }}
                  onFocus={() => focusIn(SECTION_IDS.document, doc)}
                  className={`rounded-full border px-4 py-1.5 text-xs font-semibold transition ${
                    docType === doc ? "border-[#1b2620] bg-[#1b2620] text-white" : "border-[#1b2620]/15 text-[#1b2620]/60 hover:border-[#1b2620]/40"
                  }`}
                >
                  {doc}
                </button>
              ))}
            </div>
 
            <div className="mt-4">
              <Dropzone
                label={`Upload ${docType.toLowerCase()}`}
                hint="Front and back if applicable · JPG, PNG, or PDF up to 10MB"
                files={docFiles}
                onUpload={handleUpload(setDocFiles)}
                onRemove={removeFile(setDocFiles)}
                voice={t.docSection}
                onFocusField={(text) => focusIn(SECTION_IDS.document, text)}
              />
            </div>
          </section>
 
          <section id={SECTION_IDS.address} className={sectionClass(SECTION_IDS.address)}>
            <StepLabel
              number="03"
              title="Proof of address"
              sub="Dated within the last 3 months"
              voice={t.addressSection}
              onSpeak={(text) => focusIn(SECTION_IDS.address, text)}
            />
            <div className="mt-6">
              <Dropzone
                label="Upload utility bill or bank statement"
                hint="Must show your full name and address · up to 10MB"
                files={addressFiles}
                onUpload={handleUpload(setAddressFiles)}
                onRemove={removeFile(setAddressFiles)}
                voice={t.addressSection}
                onFocusField={(text) => focusIn(SECTION_IDS.address, text)}
              />
            </div>
          </section>
 
          <section id={SECTION_IDS.selfie} className={sectionClass(SECTION_IDS.selfie)}>
            <StepLabel
              number="04"
              title="Selfie verification"
              sub="Confirms the ID belongs to you"
              voice={t.selfieSection}
              onSpeak={(text) => focusIn(SECTION_IDS.selfie, text)}
            />
            <div className="mt-6">
              <Dropzone
                label="Upload a selfie holding your ID"
                hint="Face and ID both clearly visible · up to 10MB"
                files={selfieFiles}
                onUpload={handleUpload(setSelfieFiles)}
                onRemove={removeFile(setSelfieFiles)}
                voice={t.selfieSection}
                onFocusField={(text) => focusIn(SECTION_IDS.selfie, text)}
              />
            </div>
            <div className="mt-3 flex items-center gap-2 text-xs text-[#1b2620]/40">
              <Camera size={13} /> Tip: take this in good lighting, without glasses or a hat.
            </div>
          </section>
 
          <button
            id="kyc-submit"
            onClick={handleSubmit}
            onFocus={() => speak(canSubmit ? t.submitReady : t.submitBlocked)}
            disabled={!canSubmit}
            className={`flex items-center justify-center gap-2 rounded-full py-4 text-sm font-bold text-white transition-all ${
              canSubmit ? "bg-[#1b2620] hover:bg-[#0a0f0c]" : "bg-[#1b2620]/20 cursor-not-allowed"
            }`}
          >
            Submit for verification <ArrowRight size={16} />
          </button>
          {!canSubmit && (
            <p className="-mt-6 text-center text-xs text-[#1b2620]/40">
              Fill in all fields and upload your ID, proof of address, and selfie to continue.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}