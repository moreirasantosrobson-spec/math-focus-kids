
import React, { useMemo } from 'react';
import { useProgressStore } from '../stores/useProgressStore';
import { useI18n } from '../hooks/useI18n';
import { SKILLS_LIST } from '../constants';
import { Skill, Difficulty, Attempt } from '../types';
import AccuracyChart from '../components/charts/AccuracyChart';
import DifficultyChart from '../components/charts/DifficultyChart';
import FocusTimeChart from '../components/charts/FocusTimeChart';

const ParentDashboard: React.FC = () => {
  const { t } = useI18n();
  const { attempts } = useProgressStore();

  const chartData = useMemo(() => {
    if (attempts.length < 5) {
      return { accuracyData: [], difficultyData: [], focusTimeData: [], hasData: false };
    }

    // Accuracy Data
    const accuracyData = SKILLS_LIST.map(skill => {
      const skillAttempts = attempts.filter(a => a.skill === skill);
      if (skillAttempts.length === 0) return { name: t(`skills.${skill}`), accuracy: 0 };
      const correct = skillAttempts.filter(a => a.isCorrect).length;
      return { name: t(`skills.${skill}`), accuracy: Math.round((correct / skillAttempts.length) * 100) };
    }).filter(d => attempts.some(a => a.skill === Object.keys(t('skills')).find(key => t(`skills.${key}`) === d.name)));

    // Difficulty Data (for most practiced skill)
    const skillCounts = attempts.reduce((acc, a) => {
      acc[a.skill] = (acc[a.skill] || 0) + 1;
      return acc;
    }, {} as Record<Skill, number>);
    
    const mostPracticedSkill = Object.keys(skillCounts).sort((a,b) => skillCounts[b as Skill] - skillCounts[a as Skill])[0] as Skill;

    const difficultyMap: Record<Difficulty, number> = { [Difficulty.Easy]: 1, [Difficulty.Medium]: 2, [Difficulty.Hard]: 3 };
    const difficultyData = attempts
      .filter(a => a.skill === mostPracticedSkill)
      .map((a, index) => ({ name: index + 1, difficulty: difficultyMap[a.difficulty] }));

    // Focus Time Data (last 20 attempts)
    const focusTimeData = attempts
      .slice(-20)
      .map((a, index) => ({ name: `${t(`skills.${a.skill}`)} #${index + 1}`, time: a.timeTaken / 1000 }));
      
    return { accuracyData, difficultyData, focusTimeData, hasData: true };

  }, [attempts, t]);

  if (!chartData.hasData) {
    return (
      <div className="text-center p-8">
        <h1 className="text-3xl font-bold mb-4">{t('parent.title')}</h1>
        <p className="text-lg">{t('parent.noData')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold text-center text-text-main">{t('parent.title')}</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <AccuracyChart data={chartData.accuracyData} />
        <DifficultyChart data={chartData.difficultyData} />
        <div className="lg:col-span-2">
            <FocusTimeChart data={chartData.focusTimeData} />
        </div>
      </div>
    </div>
  );
};

export default ParentDashboard;
