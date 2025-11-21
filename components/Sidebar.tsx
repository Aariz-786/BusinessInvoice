
import React from 'react';
import { View } from '../types';
import { NAV_ITEMS } from '../constants';

interface SidebarProps {
  currentView: View;
  setCurrentView: (view: View) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setCurrentView }) => {
  return (
    <aside className="z-20 hidden w-64 overflow-y-auto bg-white md:block flex-shrink-0 shadow-lg">
      <div className="py-4 text-gray-500">
        <a className="ml-6 text-lg font-bold text-gray-800" href="#">
          BusinessInvoice
        </a>
        <ul className="mt-6">
          {NAV_ITEMS.map((item) => (
            <li className="relative px-6 py-3" key={item.view}>
              {currentView === item.view && (
                <span
                  className="absolute inset-y-0 left-0 w-1 bg-blue-600 rounded-tr-lg rounded-br-lg"
                  aria-hidden="true"
                ></span>
              )}
              <button
                onClick={() => setCurrentView(item.view)}
                className={`inline-flex items-center w-full text-sm font-semibold transition-colors duration-150 hover:text-gray-800 ${
                  currentView === item.view ? 'text-gray-800' : ''
                }`}
              >
                <i className={`${item.icon} w-5`}></i>
                <span className="ml-4">{item.name}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;
