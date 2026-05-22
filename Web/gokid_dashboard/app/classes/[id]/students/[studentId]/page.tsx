'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Smile, 
  Phone,
  Cake,
  UserCheck,
  MoreVertical,
  MessageCircle,
  Activity,
  Heart,
  Calendar,
  Trophy,
  Zap
} from 'lucide-react';
import { cn } from '@/src/lib/utils';

// Mock data generator (In real app, this would come from API based on ID)
const getChildData = (id: string) => {
  const babies = [
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
    }
  ];
  return babies.find(b => b.id === id) || babies[0];
};

export default function StudentProfilePage() {
  const params = useParams();
  const router = useRouter();
  const studentId = params.studentId as string;
  const child = getChildData(studentId);

  return (
    <div className="p-8 min-h-[calc(100vh-80px)] bg-[#fcfaff]">
      {/* Back Button */}
      <button 
        onClick={() => router.back()}
        className="flex items-center gap-2 text-slate-400 hover:text-indigo-600 transition-colors mb-10 group"
      >
        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
        <span className="text-xs font-bold uppercase tracking-widest">Back to Students</span>
      </button>

      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-[40px] border border-slate-50 shadow-2xl shadow-indigo-100/30 overflow-hidden min-h-[500px] flex flex-col relative">
          {/* Profile Banner */}
          <div className={cn(
            "h-30 w-full opacity-20 bg-gradient-to-r relative z-0",
            child.gender === 'Boy' ? "from-indigo-400 to-blue-300" : "from-pink-300 to-rose-200"
          )} />
          
          <div className="px-6 md:px-10 pb-10 flex-1 -mt-20 relative z-10">
            <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
              <div className="flex items-end gap-6">
                <div className={cn(
                  "w-15 h-15 md:w-28 md:h-28 rounded-[30px] border-[3px] border-white shadow-2xl flex items-center justify-center relative",
                  child.gender === 'Boy' ? "bg-indigo-50 text-indigo-600" : "bg-pink-50 text-pink-600"
                )}>
                  <Smile className="h-10 w-10 md:h-12 md:w-12" />
                </div>
                <div className="mb-4">
                  <div className="flex flex-col md:flex-row md:items-center gap-3 mb-3">
                    <h2 className="text-xl md:text-2xl font-black text-slate-800 leading-tight">{child.name}</h2>
                    <div className={cn("inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black tracking-widest uppercase", child.badge.color)}>
                      <child.badge.icon className="h-3 w-3" />
                      {child.badge.label}
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-slate-400 font-bold text-xs mt-3">
                    <span className="flex items-center gap-2 uppercase tracking-tighter bg-slate-50 px-3 py-1.5 rounded-xl">
                      <Cake className="h-4 w-4 text-indigo-400" /> {child.age}
                    </span>
                    <span className="flex items-center gap-2 uppercase tracking-tighter bg-slate-50 px-3 py-1.5 rounded-xl">
                      <UserCheck className="h-4 w-4 text-pink-400" /> {child.gender}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3 mb-4">
                <button className="p-4 bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white rounded-[28px] transition-all shadow-xl shadow-emerald-100/50">
                  <Phone className="h-6 w-6" />
                </button>
                <button className="p-4 bg-indigo-600 text-white hover:bg-indigo-700 rounded-[28px] transition-all shadow-xl shadow-indigo-200">
                  <MessageCircle className="h-6 w-6" />
                </button>
                <button className="p-4 bg-slate-50 text-slate-400 hover:text-slate-600 rounded-[28px] transition-all">
                  <MoreVertical className="h-6 w-6" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Stats Card */}
              <div className="lg:col-span-2 space-y-8">
                <div className="bg-slate-50/50 rounded-[32px] p-8 border border-slate-50 shadow-inner">
                  <div className="flex justify-between items-center mb-6">
                    <h4 className="text-[11px] font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
                      <Activity className="h-4 w-4 text-indigo-500" /> Participation Insight
                    </h4>
                    <span className="text-xl font-black text-indigo-600">{child.participation}%</span>
                  </div>
                  <div className="h-3.5 bg-slate-200 rounded-full overflow-hidden mb-6 shadow-inner">
                    <div 
                      className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full transition-all duration-1000 shadow-md shadow-indigo-100" 
                      style={{ width: `${child.participation}%` }}
                    />
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="bg-white p-4 rounded-2xl border border-slate-100 text-center shadow-sm">
                      <p className="text-[9px] font-bold text-slate-400 uppercase mb-0.5">Status</p>
                      <p className={cn("text-[10px] font-black uppercase tracking-wider", child.status === 'Active' ? "text-emerald-500" : "text-rose-500")}>
                        {child.status}
                      </p>
                    </div>
                    <div className="bg-white p-4 rounded-2xl border border-slate-100 text-center shadow-sm">
                      <p className="text-[9px] font-bold text-slate-400 uppercase mb-0.5">Joined</p>
                      <p className="text-[10px] font-black text-slate-700">{child.joinDate}</p>
                    </div>
                    <div className="bg-white p-4 rounded-2xl border border-slate-100 text-center shadow-sm">
                      <p className="text-[9px] font-bold text-slate-400 uppercase mb-0.5">Attendance</p>
                      <p className="text-[10px] font-black text-slate-700">98%</p>
                    </div>
                    <div className="bg-white p-4 rounded-2xl border border-slate-100 text-center shadow-sm">
                      <p className="text-[9px] font-bold text-slate-400 uppercase mb-0.5">Exp.</p>
                      <p className="text-[10px] font-black text-slate-700">Level 4</p>
                    </div>
                  </div>
                </div>

                <div className="bg-[#fffcfc] rounded-[32px] p-8 border border-rose-50 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Heart className="h-20 w-20 text-rose-500" />
                  </div>
                  <h4 className="text-[11px] font-black text-slate-800 uppercase tracking-widest flex items-center gap-2 mb-6">
                    <Heart className="h-4 w-4 text-rose-500" /> Teacher's Notes
                  </h4>
                  <p className="text-slate-600 text-sm leading-relaxed italic relative z-10">
                    "{child.name} exhibits a wonderful sense of curiosity. Always attentive and creative in sessions."
                  </p>
                </div>
              </div>

              {/* Parent Info Card */}
              <div className="bg-white border border-slate-100 rounded-[36px] p-8 shadow-xl shadow-indigo-50/50">
                 <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-8 border-b border-slate-50 pb-5">Parent Identity</h4>
                 <div className="space-y-8">
                   <div className="flex items-center gap-4">
                      <div className="w-11 h-11 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shadow-sm">
                        <UserCheck className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Guardian</p>
                        <p className="text-sm font-black text-slate-800 tracking-tight">{child.parentName}</p>
                      </div>
                   </div>
                   <div className="flex items-center gap-4">
                      <div className="w-11 h-11 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center shadow-sm">
                        <Phone className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Communication</p>
                        <p className="text-sm font-black text-slate-800 tracking-tight">{child.parentPhone}</p>
                      </div>
                   </div>
                   <div className="pt-8 border-t border-slate-50">
                      <div className="p-5 bg-slate-50/80 rounded-[28px] border-2 border-dashed border-slate-200">
                        <p className="text-[10px] font-bold text-slate-400 uppercase mb-2 tracking-widest">ID Key</p>
                        <p className="text-xs font-black text-slate-700 tracking-widest">{child.idNumber}</p>
                      </div>
                   </div>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
