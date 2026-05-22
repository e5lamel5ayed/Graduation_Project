'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Smile, 
  Phone, 
  Mail,
  UserCheck,
  Calendar,
  MoreVertical,
  Plus,
  MessageCircle,
  Trophy,
  Activity,
  Heart,
  Search,
  Filter,
  Zap,
  Cake
} from 'lucide-react';
import { Button, Input } from '@/src/components/ui';
import { cn } from '@/src/lib/utils';

interface Child {
  id: string;
  name: string;
  age: string;
  gender: 'Boy' | 'Girl';
  parentName: string;
  parentPhone: string;
  status: 'Active' | 'Absent';
  idNumber: string;
  joinDate: string;
  badge: {
    label: string;
    icon: any;
    color: string;
  };
  participation: number; // Percentage
}

export default function ClassStudentsPage() {
  const params = useParams();
  const router = useRouter();
  const classId = params.id as string;
  
  // Mock data for children
  const [children] = useState<Child[]>([
    {
      id: '1',
      name: 'Ahmed Mohamed',
      age: '5 years',
      gender: 'Boy',
      parentName: 'Mohamed Ahmed',
      parentPhone: '01234567890',
      status: 'Active',
      idNumber: '2950501000',
      joinDate: '2024-01-15',
      badge: { label: 'Star Student', icon: Trophy, color: 'text-amber-500 bg-amber-50' },
      participation: 85
    },
    {
      id: '2',
      name: 'Sara Ali',
      age: '4.5 years',
      gender: 'Girl',
      parentName: 'Ali Hassan',
      parentPhone: '01122334455',
      status: 'Active',
      idNumber: '2960602000',
      joinDate: '2024-02-01',
      badge: { label: 'Little Explorer', icon: Zap, color: 'text-purple-600 bg-purple-50' },
      participation: 92
    },
    {
      id: '3',
      name: 'Ziad Kareem',
      age: '5.2 years',
      gender: 'Boy',
      parentName: 'Kareem Mahmoud',
      parentPhone: '01099887766',
      status: 'Absent',
      idNumber: '2941212000',
      joinDate: '2024-01-10',
      badge: { label: 'Helper', icon: Heart, color: 'text-rose-500 bg-rose-50' },
      participation: 65
    },
    {
      id: '4',
      name: 'Laila Hassan',
      age: '4.8 years',
      gender: 'Girl',
      parentName: 'Hassan Ibrahim',
      parentPhone: '01233445566',
      status: 'Active',
      idNumber: '2950808000',
      joinDate: '2024-03-05',
      badge: { label: 'Most Creative', icon: Smile, color: 'text-blue-500 bg-blue-50' },
      participation: 88
    }
  ]);

  const [className] = useState('Math 101');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="p-8 min-h-[calc(100vh-80px)] bg-[#fcfaff]">
      {/* Header Section */}
      <div className="mb-10">
        <button 
          onClick={() => router.push('/classes')}
          className="flex items-center gap-2 text-slate-400 hover:text-indigo-600 transition-colors mb-4 group"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-xs font-bold uppercase tracking-widest">Back to Classes</span>
        </button>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-xl font-black text-slate-800">
              {className} <span className="text-indigo-600">Students</span>
            </h1>
            <p className="text-slate-400 text-sm mt-1">Select a child to view their full profile and performance</p>
          </div>
          <div className="flex gap-3">
             <div className="relative group">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                <Search className="h-4 w-4" />
              </span>
              <input 
                type="text" 
                placeholder="Search..." 
                className="pl-11 pr-4 py-2.5 bg-white border border-slate-100 rounded-2xl text-sm focus:ring-4 focus:ring-indigo-50 transition-all outline-none w-64 shadow-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button className="bg-indigo-600 hover:bg-indigo-700 rounded-2xl h-[46px] px-6 shadow-lg shadow-indigo-100 border-none font-bold text-xs uppercase tracking-wider">
              <Plus className="h-4 w-4 mr-2" />
              Register student
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-6">
        {children.map((child) => (
          <div 
            key={child.id}
            onClick={() => router.push(`/classes/${classId}/students/${child.id}`)}
            className="group relative p-5 rounded-[36px] bg-white border border-slate-100/50 transition-all duration-500 cursor-pointer text-center hover:shadow-[0_20px_50px_rgba(79,70,229,0.1)] hover:-translate-y-2 overflow-hidden"
          >
            {/* Background Accent Gradient */}
            <div className={cn(
              "absolute top-0 left-0 w-full h-1 opacity-0 group-hover:opacity-100 transition-opacity duration-500",
              child.gender === 'Boy' ? "bg-indigo-500" : "bg-pink-500"
            )} />
            
            <div className="relative mx-auto w-20 h-20 mb-5">
              {/* Animated background glow */}
              <div className={cn(
                "absolute inset-0 rounded-[28px] blur-xl opacity-0 group-hover:opacity-40 transition-opacity duration-500",
                child.gender === 'Boy' ? "bg-indigo-400" : "bg-pink-400"
              )} />
              
              <div className={cn(
                "relative w-full h-full rounded-[28px] flex items-center justify-center transition-all duration-500 group-hover:scale-110 shadow-inner",
                child.gender === 'Boy' ? "bg-indigo-50/50 text-indigo-500" : "bg-pink-50/50 text-pink-500"
              )}>
                <Smile className="h-10 w-10 drop-shadow-sm" />
              </div>
              {child.status === 'Active' && (
                <div className="absolute bottom-1 right-1 w-6 h-6 bg-emerald-500 border-[4px] border-white rounded-full shadow-lg z-10" />
              )}
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-black text-slate-700 tracking-tight group-hover:text-indigo-600 transition-colors">
                {child.name.split(' ')[0]}
              </h4>
              
              <div className={cn(
                "inline-flex py-1 px-3 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-sm transition-transform duration-300 group-hover:scale-105",
                child.badge.color
              )}>
                {child.badge.label}
              </div>
            </div>
          </div>
        ))}
        
        {/* Placeholder for adding new child */}
        <div className="p-6 rounded-[36px] bg-slate-50/50 border-2 border-dashed border-slate-200 transition-all duration-300 cursor-pointer text-center group hover:bg-white hover:border-indigo-300/50 hover:shadow-xl hover:shadow-indigo-50 flex flex-col items-center justify-center min-h-[180px]">
          <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-500 transition-all duration-300 group-hover:rotate-12 shadow-sm mb-4">
            <Plus className="h-7 w-7" />
          </div>
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] group-hover:text-indigo-600 transition-colors">Register Student</span>
        </div>
      </div>
    </div>
  );
}
