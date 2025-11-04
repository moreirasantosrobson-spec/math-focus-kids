
import React from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '../hooks/useI18n';
import { SKILLS_LIST } from '../constants';

const Dashboard: React.FC = () => {
  const { t, locale } = useI18n();

  return (
    <div className="text-center">
      <h1 className="text-3xl sm:text-4xl font-bold mb-8 text-text-main">{t('dashboard.title')}</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {SKILLS_LIST.map((skill) => (
          <Link
            key={skill}
            to={`/${locale}/practice/${skill}`}
            className="flex items-center justify-center text-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg hover:scale-105 transform transition-all duration-300"
          >
            <span className="text-lg font-semibold text-primary">{t(`skills.${skill}`)}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
