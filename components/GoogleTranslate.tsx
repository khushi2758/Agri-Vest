"use client";
import { useEffect, useState } from "react";
import Script from "next/script";

export default function GoogleTranslate({ preferredLanguage }: { preferredLanguage?: string }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    if (preferredLanguage) {
      document.cookie = `googtrans=/en/${preferredLanguage}; path=/;`;
    }
  }, [preferredLanguage]);

  useEffect(() => {
    if (mounted && !(window as any).googleTranslateElementInit) {
      (window as any).googleTranslateElementInit = () => {
        new (window as any).google.translate.TranslateElement(
          { 
            pageLanguage: 'en',
            includedLanguages: 'en,es,fr,hi',
            autoDisplay: false,
            layout: (window as any).google.translate.TranslateElement.InlineLayout.SIMPLE
          }, 
          'google_translate_element'
        );
      };
    }
  }, [mounted]);

  if (!mounted) return null;

  return (
    <>
      <div id="google_translate_element" className="fixed bottom-4 right-4 z-[9999] opacity-0 pointer-events-none w-0 h-0 overflow-hidden" aria-hidden="true"></div>
      <Script 
        src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit" 
        strategy="lazyOnload"
      />
      <style>{`
        .goog-te-banner-frame,
        .goog-te-banner-frame.skiptranslate,
        iframe.goog-te-banner-frame { 
          display: none !important; 
          visibility: hidden !important; 
        }
        body { 
          top: 0px !important; 
          position: static !important; 
        }
        .VIpgJd-ZVi9od-ORHb-OEVmcd { 
          display: none !important; 
        }
        #goog-gt-tt { display: none !important; }
        .goog-tooltip { display: none !important; }
        .goog-tooltip:hover { display: none !important; }
        .goog-text-highlight { background-color: transparent !important; border: none !important; box-shadow: none !important; }
      `}</style>
    </>
  );
}
