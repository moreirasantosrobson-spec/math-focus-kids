
import { useEffect } from 'react';
import { useSettingsStore } from '../stores/useSettingsStore';

const useAccessibility = () => {
  const { isHighContrast, useDyslexicFont } = useSettingsStore();

  useEffect(() => {
    const root = document.documentElement;
    if (isHighContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }
  }, [isHighContrast]);

  useEffect(() => {
    const root = document.documentElement;
    if (useDyslexicFont) {
      root.classList.add('font-opendyslexic');
    } else {
      root.classList.remove('font-opendyslexic');
    }
  }, [useDyslexicFont]);
};

export default useAccessibility;
