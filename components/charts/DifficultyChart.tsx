
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useI18n } from '../../hooks/useI18n';

interface DifficultyChartProps {
  data: { name: number; difficulty: number }[];
}

const DifficultyChart: React.FC<DifficultyChartProps> = ({ data }) => {
  const { t } = useI18n();
  const difficultyMap: { [key: number]: string } = { 1: 'Easy', 2: 'Medium', 3: 'Hard' };

  return (
    <div className="w-full h-80 bg-white p-4 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-4 text-text-main">{t('parent.difficulty')}</h3>
      <ResponsiveContainer>
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" label={{ value: 'Attempts', position: 'insideBottom', offset: -5 }}/>
          <YAxis
            ticks={[1, 2, 3]}
            tickFormatter={(tick) => difficultyMap[tick]}
            domain={[1, 3]}
          />
          <Tooltip formatter={(value: number) => difficultyMap[value]} />
          <Legend />
          <Line type="monotone" dataKey="difficulty" stroke="#82ca9d" name="Difficulty" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DifficultyChart;
