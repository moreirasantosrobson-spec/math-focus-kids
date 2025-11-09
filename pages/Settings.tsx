import React from 'react';
import AccessibilityPanel from '../components/AccessibilityPanel';
import LanguageSwitcher from '../components/LanguageSwitcher';
import { useI18n } from '../hooks/useI18n';

// ⬇️ estes são os CONTROLES que aparecem na tela de Settings
import FocusAudioControls from '../components/FocusAudioControls';

const Settings: React.FC = () => {
  const { t } = useI18n();

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <h1 className="text-4xl font-bold text-center text-text-main">
        {t('settings.title')}
      </h1>

      {/* Idioma */}
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold text-text-main">
          {t('settings.language')}
        </h2>
        <div className="bg-white p-6 rounded-lg shadow-lg flex justify-center">
          <LanguageSwitcher />
        </div>
      </div>

      {/* Acessibilidade */}
      <AccessibilityPanel />

      {/* ⬇️ Áudio de foco (play/pausar, volume, seleção) */}
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold text-text-main">
          {t('settings.focusAudio')}
        </h2>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <FocusAudioControls />
        </div>
      </div>
    </div>
  );
};

export default Settings;
