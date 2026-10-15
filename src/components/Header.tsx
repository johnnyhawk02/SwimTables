import React, { useState, useEffect } from 'react';
import { 
  Phone, 
  MapPin, 
  Printer, 
  Info, 
  Clock, 
  ExternalLink, 
  SlidersHorizontal,
  ChevronRight,
  ShieldAlert,
  Sparkles
} from 'lucide-react';
import { CENTRE_INFO } from '../data/timetableData';
import { getCurrentTimeString, getCurrentDayOfWeek, parseMinutes } from '../utils/timeUtils';

interface HeaderProps {
  onOpenInfo: () => void;
  fontSize: 'normal' | 'large' | 'extra-large';
  setFontSize: (size: 'normal' | 'large' | 'extra-large') => void;
  onOpenLiveView?: () => void;
  simulatedTime: string | null;
  onResetTime: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenInfo,
  fontSize,
  setFontSize,
  onOpenLiveView,
  simulatedTime,
  onResetTime,
}) => {
  const [realTime, setRealTime] = useState(getCurrentTimeString());
  const [todayDay, setTodayDay] = useState(getCurrentDayOfWeek());

  useEffect(() => {
    const timer = setInterval(() => {
      setRealTime(getCurrentTimeString());
      setTodayDay(getCurrentDayOfWeek());
    }, 15000);
    return () => clearInterval(timer);
  }, []);

  const displayTime = simulatedTime || realTime;

  // Determine if Meadows Leisure Centre is currently open
  const isWeekend = todayDay === 'Saturday' || todayDay === 'Sunday';
  const openTimeM = isWeekend ? 8 * 60 : 6 * 60 + 30; // 8:00am or 6:30am
  let closeTimeM = 22 * 60; // 10:00pm weekday
  if (todayDay === 'Saturday') closeTimeM = 16 * 60; // 4:00pm
  if (todayDay === 'Sunday') closeTimeM = 16 * 60; // 4:00pm for health suite, 3pm main

  const currentM = parseMinutes(displayTime);
  const isOpen = currentM >= openTimeM && currentM < closeTimeM;

  const handlePrint = () => {
    window.print();
  };

  return (
    <header className="bg-gradient-to-r from-slate-900 via-sky-950 to-teal-950 text-white shadow-xl border-b border-sky-800/40 sticky top-0 z-30">
      {/* Top Banner Notice */}
      <div className="bg-emerald-900/90 text-emerald-100 px-4 py-1.5 text-xs sm:text-sm font-medium flex items-center justify-between border-b border-emerald-700/50">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>
              Official Active Sefton Timetable <span className="opacity-75">• Commences 02.03.26</span>
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline text-emerald-200/80">
              Timetables subject to change
            </span>
            <a 
              href={CENTRE_INFO.website} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="inline-flex items-center gap-1 hover:underline text-emerald-300 font-semibold"
            >
              activeseftonfitness.co.uk
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-3 sm:py-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          
          {/* Brand & Identity */}
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-cyan-400 to-teal-600 flex items-center justify-center shadow-lg shadow-teal-500/20 text-white text-2xl font-black shrink-0 border border-teal-300/30">
              🏊
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
                  {CENTRE_INFO.name}
                </h1>
                <span className="bg-sky-500/20 text-sky-200 border border-sky-400/30 text-xs px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                  Active Fitness
                </span>
              </div>
              <p className="text-slate-300 text-xs sm:text-sm mt-0.5 flex flex-wrap items-center gap-2">
                <span className="flex items-center gap-1 text-slate-300">
                  <MapPin className="w-3.5 h-3.5 text-teal-400" />
                  Hall Lane, Maghull, Liverpool {CENTRE_INFO.postcode}
                </span>
                <span className="text-slate-500 hidden sm:inline">•</span>
                <a 
                  href={`tel:${CENTRE_INFO.phone.replace(/\s+/g, '')}`}
                  className="flex items-center gap-1 text-teal-300 hover:text-teal-200 font-semibold underline decoration-teal-400/40"
                  title="Call Meadows reception"
                >
                  <Phone className="w-3.5 h-3.5" />
                  {CENTRE_INFO.phone}
                </a>
              </p>
            </div>
          </div>

          {/* Quick Action Buttons Group */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
            {/* Live Open Status Button */}
            <div className="flex items-center gap-2 bg-slate-800/80 border border-slate-700/80 rounded-xl px-3 py-1.5 shadow-inner">
              <span className={`w-2.5 h-2.5 rounded-full ${isOpen ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'}`} />
              <div className="text-xs">
                <span className={`font-bold ${isOpen ? 'text-emerald-300' : 'text-rose-300'}`}>
                  {isOpen ? 'Centre Open' : 'Centre Closed'}
                </span>
                <span className="text-slate-400 ml-1.5 font-mono">
                  {displayTime}
                </span>
              </div>
            </div>

            {simulatedTime && (
              <button
                onClick={onResetTime}
                className="text-xs bg-amber-500/20 text-amber-200 border border-amber-400/40 px-2.5 py-1.5 rounded-xl font-medium hover:bg-amber-500/30 transition flex items-center gap-1 cursor-pointer"
                title="Reset to live local clock"
              >
                <span>Reset Time</span>
                <span className="text-amber-400 font-bold">✕</span>
              </button>
            )}

            {/* Font Size Button Selector */}
            <div className="flex items-center bg-slate-800/80 border border-slate-700/80 rounded-xl p-0.5 text-xs font-semibold">
              <span className="px-2 text-slate-400 text-[11px] hidden sm:inline">Text:</span>
              <button
                onClick={() => setFontSize('normal')}
                className={`px-2 py-1 rounded-lg transition cursor-pointer ${
                  fontSize === 'normal' 
                    ? 'bg-sky-600 text-white shadow-sm' 
                    : 'text-slate-300 hover:text-white'
                }`}
                title="Default text size"
              >
                A
              </button>
              <button
                onClick={() => setFontSize('large')}
                className={`px-2 py-1 rounded-lg transition cursor-pointer ${
                  fontSize === 'large' 
                    ? 'bg-sky-600 text-white shadow-sm' 
                    : 'text-slate-300 hover:text-white'
                }`}
                title="Larger text size"
              >
                A+
              </button>
              <button
                onClick={() => setFontSize('extra-large')}
                className={`px-2 py-1 rounded-lg transition cursor-pointer font-bold ${
                  fontSize === 'extra-large' 
                    ? 'bg-sky-600 text-white shadow-sm' 
                    : 'text-slate-300 hover:text-white'
                }`}
                title="Extra large text size for seniors"
              >
                A++
              </button>
            </div>

            {/* Print Button */}
            <button
              onClick={handlePrint}
              className="bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 hover:text-white px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold border border-slate-700 flex items-center gap-1.5 transition cursor-pointer shadow-sm"
              title="Print swimming timetable"
            >
              <Printer className="w-3.5 h-3.5 text-slate-300" />
              <span className="hidden sm:inline">Print</span>
            </button>

            {/* Call Reception Quick Button */}
            <a
              href={`tel:${CENTRE_INFO.phone.replace(/\s+/g, '')}`}
              className="bg-teal-600 hover:bg-teal-500 active:scale-95 text-white px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition shadow-sm cursor-pointer"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Call Reception</span>
            </a>

            {/* Info / Hours Button */}
            <button
              onClick={onOpenInfo}
              className="bg-sky-600 hover:bg-sky-500 active:scale-95 text-white px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition shadow-sm cursor-pointer"
            >
              <Info className="w-3.5 h-3.5" />
              <span>Centre Info & Rules</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
