import React from 'react';
import { DayOfWeek } from '../types/timetable';
import { DAYS_OF_WEEK } from '../data/timetableData';
import { Calendar, ChevronRight, Sparkles } from 'lucide-react';
import { getCurrentDayOfWeek } from '../utils/timeUtils';

interface DaySelectorProps {
  selectedDay: DayOfWeek;
  onSelectDay: (day: DayOfWeek) => void;
  sessionCounts: Record<DayOfWeek, number>;
}

export const DaySelector: React.FC<DaySelectorProps> = ({
  selectedDay,
  onSelectDay,
  sessionCounts,
}) => {
  const today = getCurrentDayOfWeek();

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200/90 p-3 sm:p-4 mb-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold">
            <Calendar className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
              Select Day of Week
            </h2>
            <p className="text-xs text-slate-500">
              Tap any day button below to view all scheduled sessions
            </p>
          </div>
        </div>

        {/* Jump to Today Button */}
        <button
          onClick={() => onSelectDay(today)}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer shadow-xs ${
            selectedDay === today
              ? 'bg-emerald-600 text-white ring-2 ring-emerald-400 ring-offset-1'
              : 'bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100 active:scale-95'
          }`}
          title={`Switch view to today (${today})`}
        >
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          <span>Jump to Today ({today.slice(0, 3)})</span>
        </button>
      </div>

      {/* Big Day Buttons Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
        {DAYS_OF_WEEK.map((day) => {
          const isSelected = selectedDay === day;
          const isToday = today === day;
          const count = sessionCounts[day] || 0;

          return (
            <button
              key={day}
              onClick={() => onSelectDay(day)}
              className={`relative flex flex-col items-center justify-center p-3 rounded-xl transition-all duration-150 cursor-pointer text-center group border ${
                isSelected
                  ? 'bg-gradient-to-b from-sky-600 to-sky-700 text-white border-sky-800 shadow-md shadow-sky-600/20 ring-2 ring-sky-500 ring-offset-1 scale-[1.02]'
                  : 'bg-slate-50 hover:bg-slate-100/90 text-slate-800 border-slate-200/90 hover:border-slate-300 active:scale-95'
              }`}
            >
              {/* Today Marker */}
              {isToday && (
                <span
                  className={`absolute -top-1.5 right-2 px-1.5 py-0.2 text-[10px] font-extrabold uppercase rounded-full tracking-wider ${
                    isSelected
                      ? 'bg-emerald-400 text-emerald-950 shadow-xs'
                      : 'bg-emerald-600 text-white'
                  }`}
                >
                  Today
                </span>
              )}

              <span
                className={`text-sm sm:text-base font-extrabold tracking-tight ${
                  isSelected ? 'text-white' : 'text-slate-900 group-hover:text-sky-700'
                }`}
              >
                {day}
              </span>

              <div className="flex items-center gap-1.5 mt-1">
                <span
                  className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                    isSelected
                      ? 'bg-sky-800/80 text-sky-100'
                      : 'bg-slate-200/90 text-slate-700 group-hover:bg-sky-100 group-hover:text-sky-800'
                  }`}
                >
                  {count} {count === 1 ? 'session' : 'sessions'}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
