
import React from 'react';
import { useSettingsStore } from '../stores/useSettingsStore';
import { useI18n } from '../hooks/useI18n';

const AccessibilityPanel: React.FC = () => {
  const {
    isHighContrast,
    toggleHighContrast,
    useDyslexicFont,
    toggleDyslexicFont,
    isTtsEnabled,
    toggleTts,
  } = useSettingsStore();
  const { t } = useI18n();

  const Toggle: React.FC<{ label: string; checked: boolean; onChange: () => void }> = ({ label, checked, onChange }) => (
    <label className="flex items-center justify-between cursor-pointer py-2 border-b">
      <span className="text-lg text-text-main">{label}</span>
      <div className="relative">
        <input type="checkbox" className="sr-only" checked={checked} onChange={onChange} />
        <div className={`block w-14 h-8 rounded-full ${checked ? 'bg-primary' : 'bg-gray-300'}`}></div>
        <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${checked ? 'translate-x-6' : ''}`}></div>
      </div>
    </label>
  );

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg">
      <h3 className="text-2xl font-bold mb-4 text-text-main">{t('settings.accessibility')}</h3>
      <div className="space-y-4">
        <Toggle label={t('settings.highContrast')} checked={isHighContrast} onChange={toggleHighContrast} />
        <Toggle label={t('settings.dyslexicFont')} checked={useDyslexicFont} onChange={toggleDyslexicFont} />
        <Toggle label={t('settings.tts')} checked={isTtsEnabled} onChange={toggleTts} />
      </div>
    </div>
  );
};

export default AccessibilityPanel;
