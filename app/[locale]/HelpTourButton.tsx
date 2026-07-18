"use client";

import { useState } from "react";
import { Joyride, Step } from "react-joyride";
import { CircleQuestionMark, Volume2, Play, X } from "lucide-react";

type SpeechSection = {
  target: string;
  text: string;
};

type Props = {
  steps: Step[];
  title?: string;
  description?: string;
  placement?:string;
  speechSections?: SpeechSection[];
};

export default function HelpTourButton({
  steps,
  title ="",
  placement ="",
  description ="",
  speechSections = [],
}: Props) {
  const [runTour, setRunTour] = useState(false);
  const [open, setOpen] = useState(false);
  const [reading, setReading] = useState(false);
  const [currentSection, setCurrentSection] = useState(0);
  const hasVoice =
  !!description || (speechSections && speechSections.length > 0);
  const highlightSection = (selector: string) => {
    document
      .querySelectorAll(".speech-highlight")
      .forEach((el) => el.classList.remove("speech-highlight"));

    const element = document.querySelector(selector);

    if (!element) return;

    element.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });

    element.classList.add("speech-highlight");
  };

  const speakSection = (index: number) => {
    if (index >= speechSections.length) {
      setReading(false);

      document
        .querySelectorAll(".speech-highlight")
        .forEach((el) => el.classList.remove("speech-highlight"));

      return;
    }

    setReading(true);
    setCurrentSection(index);

    const section = speechSections[index];

    highlightSection(section.target);

    window.speechSynthesis.cancel();

    const speech = new SpeechSynthesisUtterance(section.text);

    speech.lang = "en-US";

    speech.rate = 1;

    speech.pitch = 1;

    speech.onend = () => {
      speakSection(index + 1);
    };

    window.speechSynthesis.speak(speech);
  };

  const handleJoyride = (data: any) => {
    const { status } = data;

    if (status === "finished" || status === "skipped") {
      setRunTour(false);
    }
  };

  const startTour = () => {
    window.speechSynthesis.cancel();

    localStorage.removeItem("agri-tour");

    setOpen(false);

    setRunTour(true);
  };

  return (
    <>
      <Joyride
  run={runTour}
  steps={steps}
  continuous = {true}
  scrollToFirstStep= {true}
  onEvent={handleJoyride}
  options={{
    buttons: ["back", "skip", "primary"],
    showProgress: true,
    overlayClickAction: false,
    primaryColor: "#c8e639",
    primaryColor: "#c8e639",
      backgroundColor: "#ffffff",
      textColor: "#1f2937",
      overlayColor: "rgba(0,0,0,0.45)",
      zIndex: 9999,
      arrowColor: "#ffffff",
     
  }}

/>

      <div className="fixed bottom-6 right-6 z-[9999]">
        {open && (
          <div className="absolute bottom-16 right-0 w-64 rounded-2xl border border-gray-200 bg-white shadow-2xl overflow-hidden">
            <button
              onClick={startTour}
              className="flex w-full items-center gap-3 px-5 py-4 hover:bg-gray-50 transition"
            >
              <Play className="w-5 h-5 text-[#c8e639]" />

              <div className="text-left">
                <p className="font-semibold">Start Guided Tour</p>

                <p className="text-xs text-gray-500">
                  Learn this page step by step.
                </p>
              </div>
            </button>

         { hasVoice && <button
              onClick={() => {
                setOpen(false);

                if (speechSections.length > 0) {
                  speakSection(0);
                }
              }}
              className="flex w-full items-center gap-3 px-5 py-4 hover:bg-gray-50 transition border-t"
            >
              <Volume2 className="w-5 h-5 text-[#c8e639]" />

              <div className="text-left">
                <p className="font-semibold">Read This Page</p>

                <p className="text-xs text-gray-500">Listen to an overview.</p>
              </div>
            </button>}
          </div>
        )}
          {reading && (
  <button
    onClick={() => {
      window.speechSynthesis.cancel();

      setReading(false);

      document
        .querySelectorAll(".speech-highlight")
        .forEach((el) =>
          el.classList.remove("speech-highlight")
        );
    }}
    className="flex w-full items-center gap-3 px-5 py-4 border-2 border-black/30 bg-[#c8e639]/30 rounded-full hover:bg-red-50 transition "
  >
    <X className="w-5 h-5 text-red-500" />

    <div className="text-left">
      <p className="font-semibold">
        Stop
      </p>

      <p className="text-xs text-gray-500">
        Stop narration.
      </p>
    </div>
  </button>
)}
        <button
          onClick={() => setOpen(!open)}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-[#1b2620] text-[#c8e639] shadow-xl transition hover:scale-110"
          aria-label="Help and Accessibility"
        >
          {open ? <X size={24} /> : <CircleQuestionMark size={26} />}
        </button>
      </div>
    </>
  );
}
