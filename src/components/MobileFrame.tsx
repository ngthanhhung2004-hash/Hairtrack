import React, { useState, useEffect } from 'react';
import { Wifi, Battery, Signal } from 'lucide-react';

interface MobileFrameProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  showNavBar: boolean;
  userEmail?: string;
  onLogout?: () => void;
}

export default function MobileFrame({
  children,
  activeTab,
  setActiveTab,
  showNavBar,
  userEmail,
  onLogout
}: MobileFrameProps) {
  const [time, setTime] = useState('09:41');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      let minutes = now.getMinutes().toString().padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12; // the hour '0' should be '12'
      setTime(`${hours}:${minutes} ${ampm}`);
    };
    
    updateTime();
    const interval = setInterval(updateTime, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#050608] p-2 sm:p-6 text-slate-200 font-sans selection:bg-blue-600/30">
      {/* Background ambient glows (very subtle) */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none -translate-x-1/2 -translate-y-1/2" />

      {/* Main Container */}
      <div className="relative w-full max-w-[420px] h-[860px] bg-[#0A0C10] rounded-[40px] border-[6px] border-slate-800 shadow-2xl flex flex-col overflow-hidden ring-1 ring-slate-800/40">
        
        {/* Notch Area */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-900 rounded-b-xl z-50 flex items-center justify-center">
          <div className="w-10 h-1 bg-slate-800 rounded-full mb-1" />
          <div className="absolute right-6 w-2.5 h-2.5 bg-slate-950 rounded-full border border-slate-800" /> {/* Camera lens */}
        </div>

        {/* Status Bar */}
        <div className="flex justify-between items-center px-6 pt-3.5 pb-1 text-slate-500 text-[11px] font-mono select-none z-40 bg-[#0A0C10]">
          <div>{time}</div>
          <div className="flex items-center gap-1.5 pt-0.5">
            <Signal className="w-3 h-3 text-slate-500" />
            <span className="text-[9px] opacity-75">5G</span>
            <Wifi className="w-3 h-3 text-slate-500" />
            <Battery className="w-3.5 h-3.5 text-slate-500" />
          </div>
        </div>

        {/* Dynamic Display Area */}
        <div className="flex-1 overflow-y-auto no-scrollbar bg-[#0A0C10] flex flex-col relative">
          {children}
        </div>

        {/* Bottom Home Indicator / Navigation */}
        {showNavBar && (
          <div className="border-t border-slate-900 bg-[#0A0C10] pb-5 pt-2 px-2 z-40">
            <div className="flex justify-around items-center">
              <button
                id="nav-btn-dashboard"
                onClick={() => setActiveTab('dashboard')}
                className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-xl transition-all duration-200 active:scale-95 ${
                  activeTab === 'dashboard'
                    ? 'text-blue-500 font-medium scale-102'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                <span className="text-lg mb-0.5">📊</span>
                <span className="text-[10px] font-mono tracking-tight">Dashboard</span>
              </button>

              <button
                id="nav-btn-timeline"
                onClick={() => setActiveTab('timeline')}
                className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-xl transition-all duration-200 active:scale-95 ${
                  activeTab === 'timeline'
                    ? 'text-blue-500 font-medium scale-102'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                <span className="text-lg mb-0.5">📅</span>
                <span className="text-[10px] font-mono tracking-tight">Timeline</span>
              </button>

              <button
                id="nav-btn-camera"
                onClick={() => setActiveTab('camera')}
                className="relative -top-4 flex flex-col items-center justify-center w-12 h-12 bg-blue-600 rounded-full text-white shadow-lg shadow-blue-500/20 border-4 border-[#0A0C10] hover:scale-105 active:scale-95 transition-all duration-200"
              >
                <span className="text-xl mt-0.5">📷</span>
              </button>

              <button
                id="nav-btn-routine"
                onClick={() => setActiveTab('routine')}
                className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-xl transition-all duration-200 active:scale-95 ${
                  activeTab === 'routine'
                    ? 'text-blue-500 font-medium scale-102'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                <span className="text-lg mb-0.5">✅</span>
                <span className="text-[10px] font-mono tracking-tight">Routine</span>
              </button>

              <button
                id="nav-btn-profile"
                onClick={() => setActiveTab('profile')}
                className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-xl transition-all duration-200 active:scale-95 ${
                  activeTab === 'profile'
                    ? 'text-blue-500 font-medium scale-102'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                <span className="text-lg mb-0.5">👤</span>
                <span className="text-[10px] font-mono tracking-tight">Profile</span>
              </button>
            </div>
            
            {/* iOS Bottom Indicator gesture bar */}
            <div className="w-24 h-1 bg-slate-800 rounded-full mx-auto mt-3" />
          </div>
        )}
      </div>

      {/* Auxiliary Information for the Tester (Full Screen Mockup Info) */}
      <div className="mt-4 text-center max-w-sm text-slate-600 text-xs px-4 leading-relaxed">
        <p>
          <span className="font-semibold text-slate-500">HairTrack MVP Phase 1 Simulated Phone</span>. All progress, photos, and logged routine statistics sync dynamically with your browser's <span className="text-blue-500 font-medium">localStorage</span>.
        </p>
      </div>
    </div>
  );
}
