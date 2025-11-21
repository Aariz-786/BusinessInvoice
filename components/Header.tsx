
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="z-10 py-4 bg-white shadow-md">
      <div className="container flex items-center justify-between h-full px-6 mx-auto text-blue-600">
        <div className="flex items-center space-x-2">
            <i className="fa-solid fa-file-invoice text-2xl"></i>
            <h1 className="text-xl font-bold text-gray-800">BusinessInvoice</h1>
        </div>
        <div className="flex items-center space-x-4">
          <button className="p-2 rounded-full hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <i className="fa-solid fa-bell"></i>
          </button>
          <div className="flex items-center space-x-2">
            <img className="w-8 h-8 rounded-full" src="https://picsum.photos/100" alt="Admin" />
            <span className="font-medium hidden md:block">Property Manager</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
