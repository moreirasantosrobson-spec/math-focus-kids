
import { useCallback } from 'react';
import { useParams } from 'react-router-dom';
import en from '../messages/en.json';
import fr from '../messages/fr.json';
import pt from '../messages/pt.json';
import { Locale } from '../types';

const messages = { en, fr, pt };

type Translations = typeof en;

const getNestedValue = (obj: any, path: string): string | undefined => {
  return path.split('.').reduce((acc, part) => acc && acc[part], obj);
};

export const useI18n = () => {
  const { locale } = useParams<{ locale: Locale }>();
  const currentLocale = (locale && messages[locale]) ? locale : 'en';
  const translations = messages[currentLocale] as Translations;

  const t = useCallback((key: string, replacements?: Record<string, string | number>) => {
    const translation = getNestedValue(translations, key) || key;

    if (!replacements) {
      return translation;
    }

    return Object.entries(replacements).reduce((acc, [placeholder, value]) => {
      return acc.replace(`{{${placeholder}}}`, String(value));
    }, translation);
  }, [translations]);

  return { t, locale: currentLocale };
};
