
import React, { useState, useMemo, useCallback } from 'react';
import Card from '../../components/Card';
import Spinner from '../../components/Spinner';
import { detectUsageAnomaly } from '../../services/geminiService';
import { mockUtilityMeters } from '../../data/mockData';
import { AnomalyReport } from '../../types';

const AnomalyDetector: React.FC = () => {
    const [selectedMeterId, setSelectedMeterId] = useState<string>(mockUtilityMeters[1].id);
    const [currentUsage, setCurrentUsage] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [report, setReport] = useState<AnomalyReport | null>(null);

    const selectedMeter = useMemo(() => {
        return mockUtilityMeters.find(m => m.id === selectedMeterId);
    }, [selectedMeterId]);

    const handleDetection = useCallback(async () => {
        if (!selectedMeter || !currentUsage) {
            setError("Please select a meter and enter current usage.");
            return;
        }
        
        setIsLoading(true);
        setError(null);
        setReport(null);

        try {
            const usage = parseFloat(currentUsage);
            const anomalyReport = await detectUsageAnomaly(selectedMeter.historicalUsage, usage);
            setReport(anomalyReport);
        } catch (e) {
            setError(e instanceof Error ? e.message : 'An unknown error occurred');
        } finally {
            setIsLoading(false);
        }
    }, [selectedMeter, currentUsage]);

    return (
        <Card>
            <h3 className="text-xl font-semibold text-gray-700 mb-4">AI Anomaly Detection</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                <div>
                    <div className="mb-4">
                        <label htmlFor="meter-select" className="block mb-2 text-sm font-medium text-gray-900">Select Meter</label>
                        <select
                            id="meter-select"
                            value={selectedMeterId}
                            onChange={(e) => setSelectedMeterId(e.target.value)}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        >
                            {mockUtilityMeters.map(meter => (
                                <option key={meter.id} value={meter.id}>
                                    {meter.unit} - {meter.utilityType}
                                </option>
                            ))}
                        </select>
                    </div>
                    {selectedMeter && (
                        <div className="mb-4 p-3 bg-gray-100 rounded-lg">
                            <p className="text-sm font-medium text-gray-700">Historical Data (last 6 months):</p>
                            <p className="text-sm text-gray-600">{selectedMeter.historicalUsage.join(', ')}</p>
                        </div>
                    )}
                    <div className="mb-4">
                        <label htmlFor="current-usage" className="block mb-2 text-sm font-medium text-gray-900">Enter Current Month's Usage</label>
                        <input
                            type="number"
                            id="current-usage"
                            value={currentUsage}
                            onChange={e => setCurrentUsage(e.target.value)}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                            placeholder="e.g., 95"
                        />
                    </div>
                    <button
                        onClick={handleDetection}
                        disabled={isLoading || !currentUsage}
                        className="w-full px-4 py-2 font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400"
                    >
                        {isLoading ? <Spinner /> : 'Check for Anomaly'}
                    </button>
                </div>
                <div>
                    <h4 className="text-lg font-medium text-gray-800 mb-2">AI Analysis Report</h4>
                    {error && <div className="p-3 text-sm text-red-700 bg-red-100 rounded-lg mb-4">{error}</div>}
                    <div className={`p-4 rounded-lg border ${report?.isAnomaly ? 'bg-red-50 border-red-300' : 'bg-green-50 border-green-300'}`}>
                         {isLoading && <p className="text-gray-500">AI is analyzing the data...</p>}
                         {!report && !isLoading && <p className="text-gray-500">Submit data to see analysis here.</p>}
                         {report && (
                            <>
                                <div className="flex items-center mb-2">
                                     <i className={`fa-solid ${report.isAnomaly ? 'fa-triangle-exclamation text-red-600' : 'fa-check-circle text-green-600'} text-2xl mr-3`}></i>
                                     <p className={`text-xl font-bold ${report.isAnomaly ? 'text-red-800' : 'text-green-800'}`}>
                                        {report.isAnomaly ? 'Anomaly Detected' : 'Usage is Normal'}
                                     </p>
                                </div>
                                <p className={`text-sm ${report.isAnomaly ? 'text-red-700' : 'text-green-700'}`}>
                                    <strong>Reasoning:</strong> {report.reasoning}
                                </p>
                            </>
                         )}
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default AnomalyDetector;
