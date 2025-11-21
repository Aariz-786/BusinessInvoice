
import React, { useState } from 'react';
import Card from '../../components/Card';
import Spinner from '../../components/Spinner';
import { extractBillDetails, fileToBase64 } from '../../services/geminiService';
import { BillDetails } from '../../types';

const BillUploader: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [billDetails, setBillDetails] = useState<BillDetails | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setBillDetails(null);
      setError(null);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file first.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setBillDetails(null);

    try {
      const base64Image = await fileToBase64(file);
      const details = await extractBillDetails(base64Image, file.type);
      setBillDetails(details);
    } catch (e) {
      setError(e instanceof Error ? e.message : "An unknown error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <h3 className="text-xl font-semibold text-gray-700 mb-4">AI-Powered Bill Ingestion</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">Upload Master Utility Bill (PDF/Image)</label>
          <div className="flex items-center justify-center w-full">
            <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <i className="fa-solid fa-cloud-arrow-up text-4xl text-gray-400"></i>
                <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                <p className="text-xs text-gray-500">{file ? file.name : 'PNG, JPG, or PDF'}</p>
              </div>
              <input id="dropzone-file" type="file" className="hidden" onChange={handleFileChange} accept="image/png, image/jpeg, application/pdf" />
            </label>
          </div>
           {preview && <img src={preview} alt="Bill preview" className="mt-4 max-h-40 rounded-lg shadow-sm" />}
          <button
            onClick={handleUpload}
            disabled={!file || isLoading}
            className="w-full mt-4 px-4 py-2 font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isLoading ? <Spinner /> : 'Scan Bill with AI'}
          </button>
        </div>
        <div>
          <h4 className="text-lg font-medium text-gray-800 mb-2">Extracted Details</h4>
          {error && <div className="p-3 text-sm text-red-700 bg-red-100 rounded-lg" role="alert">{error}</div>}
          <div className="space-y-4 p-4 bg-gray-50 rounded-lg border">
            {isLoading && <p className="text-gray-500">AI is analyzing the bill...</p>}
            {billDetails ? (
              <>
                <div>
                  <label className="block text-xs font-medium text-gray-500">Total Amount</label>
                  <p className="text-lg font-semibold text-gray-900">${billDetails.totalAmount.toFixed(2)}</p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500">Billing Period</label>
                  <p className="text-lg font-semibold text-gray-900">{billDetails.billingPeriod}</p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500">Total Usage</label>
                  <p className="text-lg font-semibold text-gray-900">{billDetails.totalUsage}</p>
                </div>
                <button className="w-full mt-2 px-4 py-2 font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                  Approve & Allocate Costs
                </button>
              </>
            ) : (
                !isLoading && <p className="text-gray-500">Upload a bill to see extracted data here.</p>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default BillUploader;
