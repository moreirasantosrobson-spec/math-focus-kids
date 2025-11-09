import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';

import { useSettingsStore } from './stores/useSettingsStore';
import useAccessibility from './hooks/useAccessibility';

import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import Practice from './pages/Practice';
import Review from './pages/Review';
import Settings from './pages/Settings';
import ParentDashboard from './pages/ParentDashboard';
import NotFound from './pages/NotFound';
import FocusAudioPlayer from './components/FocusAudioPlayer';

import { useI18n } from './lib/useI18n'; // ✅ caminho CORRIGIDO

const App: React.FC = () => {
  const { locale } = useSettingsStore();
  useAccessibility();

  return (
    <HashRouter>
      <div className="min-h-screen flex flex-col font-sans">
        <Header />
        <main className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8">
          <Routes>
            <Route path="/" element={<Navigate to={`/${locale}/dashboard`} replace />} />
            <Route path="/:locale/dashboard" element={<Dashboard />} />
            <Route path="/:locale/practice/:skill" element={<Practice />} />
            <Route path="/:locale/review" element={<Review />} />
            <Route path="/:locale/settings" element={<Settings />} />
            <Route path="/:locale/parent" element={<ParentDashboard />} />
            <Route path="*" element={<NotFound />} />
          </Routes>

          <FocusAudioPlayer />
        </main>
      </div>
    </HashRouter>
  );
};

export default App;
