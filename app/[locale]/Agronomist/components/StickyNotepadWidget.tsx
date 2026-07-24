"use client";
import React, { useState, useEffect } from "react";
import { PenTool, Minimize2, Maximize2, X, FileOutput, Check } from "lucide-react";

export function StickyNotepadWidget({
  onPasteToAnalysis
}: {
  onPasteToAnalysis: (text: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(true);
  const [content, setContent] = useState("");
  const [copied, setCopied] = useState(false);

  // Load from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem("agronomist_notepad");
    if (saved) setContent(saved);
  }, []);

  // Save to local storage on change
  useEffect(() => {
    localStorage.setItem("agronomist_notepad", content);
  }, [content]);

  const handlePaste = () => {
    if (!content.trim()) return;
    onPasteToAnalysis(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => { setIsOpen(true); setIsMinimized(false); }}
        className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white p-4 rounded-full shadow-lg hover:bg-emerald-700 transition-all hover:scale-105"
        title="Open Agronomist Notepad"
      >
        <PenTool size={24} />
      </button>
    );
  }

  return (
    <div 
      className={`fixed right-6 z-50 transition-all duration-300 ease-in-out bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden flex flex-col ${
        isMinimized ? "bottom-6 w-64 h-14" : "bottom-6 w-80 h-96 sm:w-96"
      }`}
    >
      <div 
        className="bg-gray-50 border-b border-gray-100 p-3 flex items-center justify-between cursor-pointer"
        onClick={() => setIsMinimized(!isMinimized)}
      >
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <PenTool size={16} />
          </div>
          <div>
            <h3 className="text-sm font-black text-gray-900">Verdict Notepad</h3>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button 
            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-lg transition"
            onClick={(e) => { e.stopPropagation(); setIsMinimized(!isMinimized); }}
          >
            {isMinimized ? <Maximize2 size={14} /> : <Minimize2 size={14} />}
          </button>
          <button 
            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
            onClick={(e) => { e.stopPropagation(); setIsOpen(false); }}
          >
            <X size={14} />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <div className="flex-1 flex flex-col p-4">
          <textarea
            className="flex-1 w-full bg-gray-50/50 border border-gray-100 rounded-xl p-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 resize-none transition-all placeholder:text-gray-300"
            placeholder="Draft your analysis, observations, and verdict here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between">
            <p className="text-xs text-gray-400 font-medium">
              {content.length} chars
            </p>
            <button
              onClick={handlePaste}
              disabled={!content.trim()}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                !content.trim() 
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
                  : copied 
                    ? "bg-emerald-50 text-emerald-600"
                    : "bg-gray-900 text-white hover:bg-gray-800"
              }`}
            >
              {copied ? (
                <>
                  <Check size={14} />
                  Copied to Analysis!
                </>
              ) : (
                <>
                  <FileOutput size={14} />
                  Paste to Analysis
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
