import React, { useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useI18n } from '../hooks/useI18n';
import LanguageSwitcher from './LanguageSwitcher';
import { useProgressStore } from '../stores/useProgressStore';
import { getDueForReviewItems } from '../services/srs'; 

const Header: React.FC = () => {
  const { t, locale } = useI18n();
  const location = useLocation();
  const { attempts, isInitialized } = useProgressStore();

  const dueForReviewCount = useMemo(() => {
    if (!isInitialized) return 0;
    return getDueForReviewItems(attempts).length;
  }, [attempts, isInitialized]);

  // Don't render header if we don't have a locale yet (e.g., at root path before redirect)
  if (!locale) return null;
  
  // Hide header on practice screen for focus
  if (location.pathname.includes('/practice/')) {
    return null;
  }

  return (
    <header className="bg-white shadow-md">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <NavLink to={`/${locale}/dashboard`} className="text-2xl font-bold text-primary">
              {t('appName')}
            </NavLink>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <NavLink
              to={`/${locale}/dashboard`}
              className={({ isActive }) =>
                `px-3 py-2 rounded-md text-sm font-medium ${isActive ? 'bg-primary text-white' : 'text-text-main hover:bg-gray-100'}`
              }
            >
              {t('dashboard.title')}
            </NavLink>
            {dueForReviewCount > 0 && (
              <NavLink
                to={`/${locale}/review`}
                className={({ isActive }) =>
                  `relative px-3 py-2 rounded-md text-sm font-medium ${isActive ? 'bg-primary text-white' : 'text-text-main hover:bg-gray-100'}`
                }
              >
                {t('dashboard.review')}
                <span className="absolute -top-2 -right-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
                  {dueForReviewCount}
                </span>
              </NavLink>
            )}
            <NavLink
              to={`/${locale}/parent`}
              className={({ isActive }) =>
                `px-3 py-2 rounded-md text-sm font-medium ${isActive ? 'bg-primary text-white' : 'text-text-main hover:bg-gray-100'}`
              }
            >
              {t('dashboard.parentZone')}
            </NavLink>
             <NavLink
              to={`/${locale}/settings`}
              className={({ isActive }) =>
                `px-3 py-2 rounded-md text-sm font-medium ${isActive ? 'bg-primary text-white' : 'text-text-main hover:bg-gray-100'}`
              }
            >
              {t('dashboard.settings')}
            </NavLink>
            <LanguageSwitcher />
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
