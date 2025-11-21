
import React from 'react';
import BillUploader from './BillUploader';
import AnomalyDetector from './AnomalyDetector';

const UtilityView: React.FC = () => {
  return (
    <div className="py-4">
      <h2 className="my-6 text-2xl font-semibold text-gray-700">Smart Utility Management</h2>
      <div className="space-y-8">
        <BillUploader />
        <AnomalyDetector />
      </div>
    </div>
  );
};

export default UtilityView;
