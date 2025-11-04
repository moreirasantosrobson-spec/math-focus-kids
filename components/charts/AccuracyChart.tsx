
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useI18n } from '../../hooks/useI18n';

interface AccuracyChartProps {
  data: { name: string; accuracy: number }[];
}

const AccuracyChart: React.FC<AccuracyChartProps> = ({ data }) => {
  const { t } = useI18n();
  return (
    <div className="w-full h-80 bg-white p-4 rounded-lg shadow-md">
       <h3 className="text-xl font-semibold mb-4 text-text-main">{t('parent.accuracy')}</h3>
      <ResponsiveContainer>
        <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis unit="%" />
          <Tooltip formatter={(value) => `${value}%`} />
          <Legend />
          <Bar dataKey="accuracy" fill="#8884d8" name="Accuracy" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AccuracyChart;
