import React from 'react';
import AccessibilityPanel from '../components/AccessibilityPanel';
import LanguageSwitcher from '../components/LanguageSwitcher';
import { useI18n } from '../hooks/useI18n';
import FocusAudioPlayer from '../components/FocusAudioPlayer'; // ✅ player de foco correto

const Settings: React.FC = () => {
  const { t } = useI18n();

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <h1 className="text-4xl font-bold text-center text-text-main">
        {t('settings.title')}
      </h1>

      <div className="space-y-2">
        <h2 className="text-2xl font-semibold text-text-main">
          {t('settings.language')}
        </h2>
        <div className="bg-white p-6 rounded-lg shadow-lg flex justify-center">
          <LanguageSwitcher />
        </div>
      </div>

      {/* Acessibilidade (contraste, fonte, etc.) */}
      <AccessibilityPanel />

      {/* ✅ Controles do áudio de foco (botão play/pausar) */}
      <FocusAudioPlayer />
    </div>
  );
};

export default Settings;
