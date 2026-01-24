'use client';

import { Mic, LayoutGrid, Gift, FileCheck } from 'lucide-react';

interface TabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  counts?: {
    general: number;
    voice: number;
    instantReward: number;
    evidenceSubmission: number;
  };
}

export function Tabs({ activeTab, onTabChange, counts }: TabsProps) {
  const tabs = [
    { 
      id: 'general', 
      label: 'General', 
      icon: LayoutGrid,
      count: counts?.general 
    },
    { 
      id: 'voice', 
      label: 'Voice', 
      icon: Mic,
      count: counts?.voice 
    },
    { 
      id: 'instantReward', 
      label: 'Instant Reward', 
      icon: Gift,
      count: counts?.instantReward 
    },
    { 
      id: 'evidenceSubmission', 
      label: 'Evidence Submission', 
      icon: FileCheck,
      count: counts?.evidenceSubmission 
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



