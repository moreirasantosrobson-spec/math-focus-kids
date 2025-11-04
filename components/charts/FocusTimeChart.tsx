
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useI18n } from '../../hooks/useI18n';

interface FocusTimeChartProps {
  data: { name: string; time: number }[];
}

const FocusTimeChart: React.FC<FocusTimeChartProps> = ({ data }) => {
  const { t } = useI18n();
  return (
    <div className="w-full h-80 bg-white p-4 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-4 text-text-main">{t('parent.focusTime')}</h3>
      <ResponsiveContainer>
        <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis unit="s" />
          <Tooltip formatter={(value: number) => `${value.toFixed(1)}s`}/>
          <Area type="monotone" dataKey="time" stroke="#ffc658" fill="#ffc658" name="Time per question (seconds)"/>
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default FocusTimeChart;
