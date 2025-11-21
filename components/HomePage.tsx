import React from 'react';

interface HomePageProps {
  onStart: () => void;
}

const HomePage: React.FC<HomePageProps> = ({ onStart }) => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="text-center p-6">
        <h1 className="text-4xl font-bold text-gray-800 mb-4 sm:text-5xl">
          Welcome to BusinessInvoice
        </h1>
        <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
          Your all-in-one solution for B2B invoicing and service management.
        </p>
        <button
          onClick={onStart}
          className="px-8 py-3 text-lg font-semibold text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-transform transform hover:scale-105"
        >
          Enter Dashboard
        </button>
      </div>
    </div>
  );
};

export default HomePage;
