import React, { createContext, useContext, useState, useCallback } from "react";

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguageState] = useState(
    localStorage.getItem("language") || "en"
  );

  const setLanguage = useCallback((lang) => {
    setLanguageState(lang);
    localStorage.setItem("language", lang);
  }, []);

  const translateText = useCallback(
    async (text) => {
      if (!text) return "";
      if (language === "en") return text;
      try {
        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${language}&dt=t&q=${encodeURIComponent(text)}`;
        const res = await fetch(url);
        const data = await res.json();
        return data[0].map((item) => item[0]).join("");
      } catch {
        return text;
      }
    },
    [language]
  );

  const translateBatch = useCallback(
    async (textMap) => {
      const keys = Object.keys(textMap);
      const values = Object.values(textMap);
      const translatedValues = await Promise.all(
        values.map((value) => translateText(value))
      );
      const result = {};
      keys.forEach((key, index) => {
        result[key] = translatedValues[index];
      });
      return result;
    },
    [translateText]
  );

  return (
    <LanguageContext.Provider
      value={{ language, setLanguage, translateText, translateBatch }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
