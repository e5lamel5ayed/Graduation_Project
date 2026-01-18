'use client';

import { FileText, Mic, LayoutGrid } from 'lucide-react';
import { useState } from 'react';

interface TabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  counts?: {
    all: number;
    text: number;
    voice: number;
  };
}

export default function Tabs({ activeTab, onTabChange, counts }: TabsProps) {
  const tabs = [
    { 
      id: 'all', 
      label: 'All', 
      icon: LayoutGrid,
      count: counts?.all 
    },
    { 
      id: 'text', 
      label: 'Text', 
      icon: FileText,
      count: counts?.text 
    },
    { 
      id: 'voice', 
      label: 'Voice', 
      icon: Mic,
      count: counts?.voice 
    },
  ];

  return (
    <div className="inline-flex gap-2 p-1.5 bg-gray-50 rounded-2xl border border-gray-100">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`
              relative px-5 py-2.5 rounded-xl font-medium text-sm
              transition-all duration-300 ease-out
              flex items-center gap-2
              ${isActive
                ? 'bg-white text-indigo-700 shadow-sm shadow-indigo-100/50'
                : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
              }
            `}
          >
            <Icon className={`h-4 w-4 transition-transform duration-300 ${isActive ? 'scale-110' : ''}`} />
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span className={`
                ml-1 px-2 py-0.5 rounded-md text-xs font-semibold
                transition-colors duration-300
                ${isActive 
                  ? 'bg-indigo-100 text-indigo-700' 
                  : 'bg-gray-200 text-gray-600'
                }
              `}>
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

// Demo Component
function Demo() {
  const [activeTab, setActiveTab] = useState('all');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-12">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Tabs Component</h1>
          <p className="text-gray-600">Modern and elegant tab navigation</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">With Counts</h3>
            <Tabs 
              activeTab={activeTab} 
              onTabChange={setActiveTab}
              counts={{ all: 12, text: 8, voice: 4 }}
            />
          </div>

          <div className="pt-6 border-t border-gray-100">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">Without Counts</h3>
            <Tabs 
              activeTab={activeTab} 
              onTabChange={setActiveTab}
            />
          </div>

          <div className="mt-8 p-6 bg-gray-50 rounded-xl">
            <p className="text-sm text-gray-600">
              <span className="font-semibold">Active Tab:</span>{' '}
              <span className="text-indigo-600 font-medium">{activeTab}</span>
            </p>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          {['all', 'text', 'voice'].map((tab) => (
            <div
              key={tab}
              className={`p-6 rounded-2xl border-2 transition-all duration-300 ${
                activeTab === tab
                  ? 'bg-indigo-50 border-indigo-200'
                  : 'bg-white border-gray-100'
              }`}
            >
              <h4 className="font-semibold text-gray-900 capitalize mb-2">{tab} Tasks</h4>
              <p className="text-sm text-gray-600">
                Content for {tab} tab goes here
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

