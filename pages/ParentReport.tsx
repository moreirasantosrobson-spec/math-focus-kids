import React, { useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SKILLS_LIST } from '../constants';
import { useI18n } from '../hooks/useI18n';

// 🔌 Tenta importar o store se existir
// (se o arquivo não existir, o bundler acusa; se existir, ótimo)
import useProgressStore from '../stores/useProgressStore'; // <- mantém assim

type Attempt = {
  skill?: string;
  correct?: boolean;
  timestamp?: number;
  focusSeconds?: number;
};

// Fallback: caso o store não tenha "attempts", tentamos localStorage
function useAttemptsFallback(): Attempt[] {
  try {
    const raw = localStorage.getItem('mfk_attempts');
    if (!raw) return [];
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

const ParentReport: React.FC = () => {
  const { t, locale } = useI18n();

  // 1) tenta pegar do store (se sua store tiver "attempts")
  let attemptsFromStore: Attempt[] | undefined;
  try {
    // @ts-ignore – se a store não tiver esse campo, evitamos crash
    attemptsFromStore = useProgressStore?.getState?.().attempts as Attempt[] | undefined;
  } catch {
    attemptsFromStore = undefined;
  }

  // 2) se não tiver no store, usa fallback
  const attempts = attemptsFromStore && Array.isArray(attemptsFromStore)
    ? attemptsFromStore
    : useAttemptsFallback();

  const perSkill = useMemo(() => {
    const map = new Map<string, { total: number; correct: number }>();
    SKILLS_LIST.forEach((s) => map.set(s, { total: 0, correct: 0 }));
    attempts.forEach((a) => {
      const key = a.skill || 'unknown';
      if (!map.has(key)) map.set(key, { total: 0, correct: 0 });
      const rec = map.get(key)!;
      rec.total += 1;
      if (a.correct) rec.correct += 1;
    });
    return Array.from(map.entries()).map(([skill, { total, correct }]) => ({
      skill,
      total,
      correct,
      accuracy: total ? Math.round((correct / total) * 100) : 0,
    }));
  }, [attempts]);

  const overall = useMemo(() => {
    const total = attempts.length;
    const correct = attempts.filter((a) => a.correct).length;
    const accuracy = total ? Math.round((correct / total) * 100) : 0;
    const focusSeconds = attempts.reduce(
      (sum, a) => sum + (a.focusSeconds || 0),
      0
    );
    return { total, correct, accuracy, focusSeconds };
  }, [attempts]);

  useEffect(() => {
    const id = setTimeout(() => {
      if (typeof window !== 'undefined' && typeof window.print === 'function') {
        window.print();
      }
    }, 400);
    return () => clearTimeout(id);
  }, []);

  const fmtTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}m ${s}s`;
  };

  return (
    <div className="print-page max-w-3xl mx-auto bg-white p-6 md:p-10 rounded-lg shadow-lg">
      <div className="no-print mb-4">
        <Link
          to={`/${locale}/parent`}
          className="inline-block px-4 py-2 rounded-md bg-gray-100 hover:bg-gray-200"
        >
          ← {t('parent.goBack') || 'Back'}
        </Link>
      </div>

      <h1 className="text-3xl font-bold text-center mb-2">
        {t('parent.reportTitle') || 'Parent Progress Report'}
      </h1>
      <p className="text-center text-sm text-gray-500 mb-8">
        {new Date().toLocaleString()}
      </p>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">
          {t('parent.overview') || 'Overview'}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="rounded-md border p-4">
            <div className="text-gray-500 text-sm">{t('parent.totalAnswers') || 'Total Answers'}</div>
            <div className="text-2xl font-bold">{overall.total}</div>
          </div>
          <div className="rounded-md border p-4">
            <div className="text-gray-500 text-sm">{t('parent.accuracy') || 'Accuracy'}</div>
            <div className="text-2xl font-bold">{overall.accuracy}%</div>
          </div>
          <div className="rounded-md border p-4">
            <div className="text-gray-500 text-sm">{t('parent.focusTime') || 'Focus Time'}</div>
            <div className="text-2xl font-bold">
              {overall.focusSeconds ? fmtTime(overall.focusSeconds) : '—'}
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-3">
          {t('parent.bySkill') || 'Performance by Skill'}
        </h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="text-left border-b">
              <th className="py-2 pr-2">{t('parent.skill') || 'Skill'}</th>
              <th className="py-2 pr-2">{t('parent.total') || 'Total'}</th>
              <th className="py-2 pr-2">{t('parent.correct') || 'Correct'}</th>
              <th className="py-2">{t('parent.acc') || 'Accuracy'}</th>
            </tr>
          </thead>
          <tbody>
            {perSkill.map((row) => (
              <tr key={row.skill} className="border-b last:border-0">
                <td className="py-2 pr-2">{t(`skills.${row.skill}`) || row.skill}</td>
                <td className="py-2 pr-2">{row.total}</td>
                <td className="py-2 pr-2">{row.correct}</td>
                <td className="py-2">{row.accuracy}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <p className="text-xs text-gray-400 mt-8">
        {t('parent.printHint') || 'Tip: use “Save as PDF” in the print dialog.'}
      </p>
    </div>
  );
};

export default ParentReport;
