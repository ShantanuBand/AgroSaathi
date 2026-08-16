import React, { createContext, useContext, useEffect, useState } from 'react';
import { TRANSLATIONS, MARATHI_DICTIONARY, type Language } from '@/lib/translations';

export interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: string, fallback?: string) => string;
}

const STORAGE_LANG_KEY = 'agri_hub_language';

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem(STORAGE_LANG_KEY) as Language) || 'mr'; // Default to Marathi
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem(STORAGE_LANG_KEY, lang);
  };

  const toggleLanguage = () => {
    const nextLang = language === 'en' ? 'mr' : 'en';
    setLanguage(nextLang);
  };

  const t = (key: string, fallback?: string): string => {
    if (TRANSLATIONS[language] && TRANSLATIONS[language][key]) {
      return TRANSLATIONS[language][key];
    }
    return fallback || key;
  };

  // End-to-end DOM text & placeholder translation observer for both Marathi and English modes
  useEffect(() => {
    const isMarathi = language === 'mr';
    const rawEntries = isMarathi
      ? Object.entries(MARATHI_DICTIONARY)
      : Object.entries(MARATHI_DICTIONARY).map(([en, mr]) => [mr, en]);

    // Sort by source string length descending so longer phrases match before sub-words
    const sortedEntries = rawEntries.filter(([from]) => Boolean(from && from.trim())).sort((a, b) => b[0].length - a[0].length);

    const translateText = (origText: string): { text: string; modified: boolean } => {
      // Do NOT translate email addresses or URLs
      if (origText.includes('@') && /\S+@\S+\.\S+/.test(origText)) {
        return { text: origText, modified: false };
      }

      let current = origText;
      let modified = false;
      for (let i = 0; i < sortedEntries.length; i++) {
        const [fromWord, toWord] = sortedEntries[i];
        if (current.includes(fromWord)) {
          const regex = new RegExp(escapeRegExp(fromWord), 'g');
          current = current.replace(regex, toWord);
          modified = true;
        }
      }
      return { text: current, modified };
    };

    const translateNode = (node: Node) => {
      if (node.nodeType === Node.TEXT_NODE && node.nodeValue) {
        const { text, modified } = translateText(node.nodeValue);
        if (modified) {
          node.nodeValue = text;
        }
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        const elem = node as HTMLElement;
        const tagName = elem.tagName.toLowerCase();

        if (elem.classList?.contains('notranslate') || elem.classList?.contains('no-translate') || elem.getAttribute('data-no-translate') === 'true') {
          return;
        }

        if (tagName !== 'script' && tagName !== 'style') {
          // Translate placeholder attribute if present
          if ((tagName === 'input' || tagName === 'textarea') && (elem as HTMLInputElement).placeholder) {
            const { text, modified } = translateText((elem as HTMLInputElement).placeholder);
            if (modified) {
              (elem as HTMLInputElement).placeholder = text;
            }
          }

          Array.from(node.childNodes).forEach(translateNode);
        }
      }
    };

    // Run initial scan on document body
    translateNode(document.body);

    // Observe dynamic changes (e.g. API responses loading into DOM)
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach(translateNode);
      });
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

