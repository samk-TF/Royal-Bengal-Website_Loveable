import { useState, useEffect } from "react";

/**
 * Simple language hook to persist and toggle between English and German.
 * The current language is stored in localStorage so it persists between visits.
 */
export type Language = "en" | "de";

export function useLanguage(): [Language, () => void] {
  const [language, setLanguage] = useState<Language>(() => {
    if (typeof window === "undefined") return "en";
    const stored = localStorage.getItem("lang");
    return stored === "de" || stored === "en" ? (stored as Language) : "en";
  });

  useEffect(() => {
    localStorage.setItem("lang", language);
  }, [language]);

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "en" ? "de" : "en"));
  };

  return [language, toggleLanguage];
}