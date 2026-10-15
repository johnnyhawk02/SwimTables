import React from 'react';
import { CategoryId, DayOfWeek, FacilityId } from '../types/timetable';
import { DAYS_OF_WEEK } from '../data/timetableData';
import { 
  Printer, 
  Phone, 
  RotateCcw, 
  Radio, 
  Sparkles, 
  Calendar, 
  Clock, 
  Waves,
  Check,
  Search,
  X
} from 'lucide-react';

interface TimetableToolbarProps {
  selectedCategory: CategoryId | 'all';
  onSelectCategory: (cat: CategoryId | 'all') => void;
  selectedDay: DayOfWeek | 'all';
  onSelectDay: (day: DayOfWeek | 'all') => void;
  selectedFacility: FacilityId | 'all';
  onSelectFacility: (fac: FacilityId | 'all') => void;
  todayDay: DayOfWeek;
  currentTime: string;
  isLiveHighlight: boolean;
  onToggleLiveHighlight: () => void;
  onOpenReceiptMode: (day?: DayOfWeek) => void;
  onReset: () => void;
  hasActiveFilters: boolean;
}

export const TimetableToolbar: React.FC<TimetableToolbarProps> = ({
  selectedCategory,
  onSelectCategory,
  selectedDay,
  onSelectDay,
  selectedFacility,
  onSelectFacility,
  todayDay,
  currentTime,
  isLiveHighlight,
  onToggleLiveHighlight,
  onOpenReceiptMode,
  onReset,
  hasActiveFilters,
}) => {
  const categories: Array<{ id: CategoryId | 'all'; label: string; icon: string }> = [
    { id: 'all', label: 'All Sessions', icon: '✨' },
    { id: 'public', label: 'Public Swim', icon: '🏊' },
    { id: 'over60', label: '£2 Over 60s', icon: '👵' },
    { id: 'adult', label: 'Adult Only', icon: '🧘' },
    { id: 'aquafit', label: 'Aqua Fit', icon: '⚡' },
    { id: 'splash', label: 'Swim & Splash', icon: '👶' },
    { id: 'club', label: 'Pool closed', icon: '⛔' },
    { id: 'tri', label: 'Tri Club', icon: '🚴' },
  ];

  const facilities: Array<{ id: FacilityId | 'all'; label: string }> = [
    { id: 'all', label: 'All Pools' },
    { id: 'main', label: 'Main Pool' },
    { id: 'learner', label: 'Learner Pool' },
    { id: 'health', label: 'Health Suite' },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-md border border-slate-200/90 p-4 sm:p-5 mb-6 max-w-5xl mx-auto space-y-4 no-print">
      
      {/* Top row: Utility Buttons & Live Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold">
            🏊
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-extrabold text-slate-900">
              Interactive Timetable Buttons
            </h2>
            <p className="text-xs text-slate-500">
              Tap any button to filter or highlight sessions directly on the timetable below
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* What's On Now Toggle Button */}
          <button
            onClick={onToggleLiveHighlight}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer border ${
              isLiveHighlight
                ? 'bg-emerald-600 text-white border-emerald-700 shadow-sm ring-2 ring-emerald-400'
                : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-200'
            }`}
            title="Highlight sessions active right now"
          >
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span>Happening Now ({currentTime})</span>
          </button>

          {/* Epson Receipt Slip Button */}
          <button
            onClick={() => onOpenReceiptMode()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black bg-amber-500 hover:bg-amber-400 text-slate-950 border border-amber-600 transition cursor-pointer shadow-sm active:scale-95"
            title="Print one day's times on Epson receipt printer"
          >
            <span>🧾</span>
            <span>Print Receipt Slip (Epson)</span>
          </button>

          {/* Full Page Print Button */}
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition cursor-pointer"
            title="Print full timetable sheet"
          >
            <Printer className="w-3.5 h-3.5 text-slate-600" />
            <span>Full Sheet</span>
          </button>

          {/* Call Reception Button */}
          <a
            href="tel:01512886727"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-500 text-white transition shadow-xs"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>0151 288 6727</span>
          </a>

          {/* Reset Filters */}
          {hasActiveFilters && (
            <button
              onClick={onReset}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition cursor-pointer"
              title="Reset all highlights"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Button Row 1: Day of Week Buttons */}
      <div>
        <div className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-[#b8175c]" />
            <span>Filter by Day:</span>
          </span>
          {selectedDay !== 'all' && (
            <span className="text-xs font-semibold text-[#b8175c]">
              Showing {selectedDay} only
            </span>
          )}
        </div>
        <div className="grid grid-cols-4 sm:grid-cols-9 gap-1.5">
          <button
            onClick={() => onSelectDay('all')}
            className={`py-2 px-2 rounded-xl text-xs font-bold transition cursor-pointer border text-center ${
              selectedDay === 'all'
                ? 'bg-slate-900 text-white border-slate-950 shadow-sm'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
            }`}
          >
            All Week
          </button>

          {DAYS_OF_WEEK.map((day) => {
            const isSelected = selectedDay === day;
            const isToday = todayDay === day;
            return (
              <button
                key={day}
                onClick={() => onSelectDay(day)}
                className={`py-2 px-1 rounded-xl text-xs font-bold transition cursor-pointer border text-center relative ${
                  isSelected
                    ? 'bg-[#b8175c] text-white border-[#9b134d] shadow-sm ring-2 ring-[#b8175c]/40'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                {day.slice(0, 3)}
                {isToday && (
                  <span className="block text-[9px] text-emerald-600 font-extrabold uppercase leading-none mt-0.5">
                    Today
                  </span>
                )}
              </button>
            );
          })}

          {/* Jump to Today Button */}
          <button
            onClick={() => onSelectDay(todayDay)}
            className={`py-2 px-2 rounded-xl text-xs font-bold transition cursor-pointer border text-center ${
              selectedDay === todayDay
                ? 'bg-emerald-600 text-white border-emerald-700'
                : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-200'
            }`}
            title="Jump to today's column"
          >
            ⭐ Today
          </button>
        </div>
      </div>

      {/* Button Row 2: Session Category Highlight Buttons */}
      <div>
        <div className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-teal-600" />
          <span>Highlight Session Type:</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer border ${
                  isSelected
                    ? 'bg-teal-700 text-white border-teal-800 shadow-sm ring-2 ring-teal-500/40 scale-[1.02]'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200 hover:border-slate-300'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
                {isSelected && <Check className="w-3 h-3 ml-0.5" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Button Row 3: Pool / Facility Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mr-1">
            Pool Areas:
          </span>
          {facilities.map((fac) => {
            const isSelected = selectedFacility === fac.id;
            return (
              <button
                key={fac.id}
                onClick={() => onSelectFacility(fac.id)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer border ${
                  isSelected
                    ? 'bg-slate-800 text-white border-slate-900 shadow-2xs'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200'
                }`}
              >
                {fac.label}
              </button>
            );
          })}
        </div>

        <div className="text-xs text-slate-500 italic">
          💡 Click any box in the timetable to see session details & add to calendar
        </div>
      </div>

    </div>
  );
};
