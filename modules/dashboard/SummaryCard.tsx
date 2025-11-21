
import React from 'react';
import Card from '../../components/Card';

interface SummaryCardProps {
  title: string;
  value: string;
  icon: string;
  color: string;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ title, value, icon, color }) => {
  return (
    <Card className="flex items-center">
      <div className={`p-3 mr-4 text-white bg-${color}-500 rounded-full`}>
        <i className={icon}></i>
      </div>
      <div>
        <p className="mb-2 text-sm font-medium text-gray-600">{title}</p>
        <p className="text-lg font-semibold text-gray-700">{value}</p>
      </div>
    </Card>
  );
};

export default SummaryCard;
