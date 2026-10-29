import { useState, useEffect } from "react";
import { useLanguage } from "./LanguageContext";

const T = ({ children }) => {
  const { language, translateText } = useLanguage();
  const [translated, setTranslated] = useState(children);

  useEffect(() => {
    if (language === "en") {
      setTranslated(children);
      return;
    }
    translateText(children).then(setTranslated);
  }, [language, children]);

  return translated;
};

export default T;
