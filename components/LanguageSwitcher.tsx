
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSettingsStore } from '../stores/useSettingsStore';
import { useI18n } from '../hooks/useI18n';
import { Locale } from '../types';
import { SUPPORTED_LOCALES } from '../constants';
import ChevronDownIcon from './icons/ChevronDownIcon';

const LanguageSwitcher: React.FC = () => {
  const { locale, setLocale } = useSettingsStore();
  const navigate = useNavigate();
  const { t } = useI18n();

  const handleLocaleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLocale = e.target.value as Locale;
    setLocale(newLocale);
    // A more robust solution would update the URL path correctly
    navigate(`/${newLocale}/dashboard`);
  };

  return (
    <div className="relative">
      <select
        value={locale}
        onChange={handleLocaleChange}
        aria-label={t('settings.language')}
        className="appearance-none bg-white border border-gray-300 rounded-md py-2 pl-3 pr-10 text-base focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
      >
        {SUPPORTED_LOCALES.map((loc) => (
          <option key={loc} value={loc}>
            {loc.toUpperCase()}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
        <ChevronDownIcon className="h-4 w-4" />
      </div>
    </div>
  );
};

export default LanguageSwitcher;
