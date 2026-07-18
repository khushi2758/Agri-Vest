import {useEffect, useState} from 'react'
export function useGoogleLanguage() {
  const [language, setLanguage] = useState("en");

  useEffect(() => {
    const updateLanguage = () => {
      const match = document.cookie.match(/googtrans=\/en\/([a-z-]+)/);
      setLanguage(match?.[1] || "en");
    };

    updateLanguage();

    const interval = setInterval(updateLanguage, 500);

    return () => clearInterval(interval);
  }, []);

  return language;
}