
import React from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '../hooks/useI18n';

const NotFound: React.FC = () => {
  const { t, locale } = useI18n();

  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
      <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
      <h2 className="text-3xl font-semibold text-text-main mb-2">{t('notFound.title')}</h2>
      <p className="text-lg text-text-light mb-8">{t('notFound.message')}</p>
      <Link
        to={`/${locale}/dashboard`}
        className="px-8 py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary-dark transition-colors"
      >
        {t('notFound.goHome')}
      </Link>
    </div>
  );
};

export default NotFound;
