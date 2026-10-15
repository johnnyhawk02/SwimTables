import React, { useState } from 'react';
import { SwimSession, DayOfWeek, CategoryId } from '../types/timetable';
import { DAYS_OF_WEEK, ALL_SESSIONS, CATEGORY_META } from '../data/timetableData';
import { formatTimeRange } from '../utils/timeUtils';
import { CalendarRange, Filter, Info, Sparkles } from 'lucide-react';

interface WeeklyMatrixViewProps {
  onOpenDetails: (session: SwimSession) => void;
  onSelectDay: (day: DayOfWeek) => void;
}

export const WeeklyMatrixView: React.FC<WeeklyMatrixViewProps> = ({
  onOpenDetails,
  onSelectDay,
}) => {
  const [highlightCategory, setHighlightCategory] = useState<CategoryId | 'all'>('all');

  const mainPoolSessions = ALL_SESSIONS.filter((s) => s.facility === 'main');
  const learnerPoolSessions = ALL_SESSIONS.filter((s) => s.facility === 'learner');
  const healthSuiteSessions = ALL_SESSIONS.filter((s) => s.facility === 'health');

  const getSessionsForDay = (sessionsList: SwimSession[], day: DayOfWeek) => {
    return sessionsList
      .filter((s) => s.day === day)
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
  };

  const renderSessionBlock = (session: SwimSession) => {
    const meta = CATEGORY_META[session.category];
    const isHighlighted = highlightCategory === 'all' || highlightCategory === session.category;
    const isDimmed = highlightCategory !== 'all' && highlightCategory !== session.category;

    return (
      <button
        key={session.id}
        onClick={() => onOpenDetails(session)}
        className={`w-full text-left p-2 rounded-xl mb-2 transition-all duration-150 border cursor-pointer ${
          isDimmed
            ? 'opacity-30 bg-slate-50 border-slate-200'
            : isHighlighted && highlightCategory !== 'all'
            ? 'ring-2 ring-teal-500 scale-[1.02] shadow-sm'
            : 'hover:shadow-sm hover:border-slate-300'
        } ${meta.bgColor}`}
      >
        <div className="font-mono text-[11px] font-bold text-slate-900 block leading-tight">
          {session.startTime} - {session.endTime}
        </div>
        <div className="text-xs font-extrabold text-slate-950 mt-0.5 leading-snug">
          {session.title}
        </div>
        {session.priceNote && (
          <div className="text-[10px] font-bold text-amber-900 bg-amber-200/60 rounded px-1.5 py-0.5 mt-1 inline-block">
            {session.priceNote}
          </div>
        )}
      </button>
    );
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200/90 p-4 sm:p-5 mb-5 space-y-6">
      
      {/* Top Controller */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
            <CalendarRange className="w-5 h-5 text-teal-600" />
            <span>Full Weekly Timetable Matrix</span>
          </h2>
          <p className="text-xs text-slate-500">
            Interactive leisure centre matrix view. Click any session box to view details, notes, and calendar export.
          </p>
        </div>

        {/* Quick highlight filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider shrink-0 mr-1">
            Highlight:
          </span>
          <button
            onClick={() => setHighlightCategory('all')}
            className={`text-xs px-2.5 py-1 rounded-lg font-bold transition cursor-pointer shrink-0 border ${
              highlightCategory === 'all'
                ? 'bg-slate-900 text-white border-slate-950'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setHighlightCategory('public')}
            className={`text-xs px-2.5 py-1 rounded-lg font-bold transition cursor-pointer shrink-0 border ${
              highlightCategory === 'public'
                ? 'bg-cyan-600 text-white border-cyan-700'
                : 'bg-cyan-50 hover:bg-cyan-100 text-cyan-800 border-cyan-200'
            }`}
          >
            🏊 Public Swim
          </button>
          <button
            onClick={() => setHighlightCategory('over60')}
            className={`text-xs px-2.5 py-1 rounded-lg font-bold transition cursor-pointer shrink-0 border ${
              highlightCategory === 'over60'
                ? 'bg-amber-600 text-white border-amber-700'
                : 'bg-amber-50 hover:bg-amber-100 text-amber-800 border-amber-200'
            }`}
          >
            👵 £2 Over 60s
          </button>
          <button
            onClick={() => setHighlightCategory('adult')}
            className={`text-xs px-2.5 py-1 rounded-lg font-bold transition cursor-pointer shrink-0 border ${
              highlightCategory === 'adult'
                ? 'bg-emerald-600 text-white border-emerald-700'
                : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-200'
            }`}
          >
            🧘 Adult Only
          </button>
          <button
            onClick={() => setHighlightCategory('aquafit')}
            className={`text-xs px-2.5 py-1 rounded-lg font-bold transition cursor-pointer shrink-0 border ${
              highlightCategory === 'aquafit'
                ? 'bg-fuchsia-600 text-white border-fuchsia-700'
                : 'bg-fuchsia-50 hover:bg-fuchsia-100 text-fuchsia-800 border-fuchsia-200'
            }`}
          >
            ⚡ Aqua Fit
          </button>
        </div>
      </div>

      {/* SECTION 1: MAIN POOL */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-xl">🏊‍♂️</span>
            <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
              Main Pool
            </h3>
            <span className="text-xs text-sky-700 bg-sky-100 px-2 py-0.5 rounded-full font-bold">
              25m Competition Standard
            </span>
          </div>
          <span className="text-xs text-slate-400">Scroll horizontally if on mobile →</span>
        </div>

        <div className="overflow-x-auto border border-slate-200 rounded-2xl shadow-2xs">
          <table className="w-full min-w-[850px] border-collapse text-left">
            <thead>
              <tr className="bg-gradient-to-r from-sky-800 to-sky-900 text-white text-xs font-extrabold uppercase tracking-wider">
                {DAYS_OF_WEEK.map((day) => (
                  <th 
                    key={day} 
                    className="p-2.5 text-center border-r border-sky-700/60 last:border-r-0 hover:bg-sky-700 cursor-pointer transition"
                    onClick={() => onSelectDay(day)}
                    title={`Click to view ${day} in Day view`}
                  >
                    <div>{day}</div>
                    <div className="text-[10px] text-sky-200 font-normal lowercase">tap for day view</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-slate-50/50">
              <tr>
                {DAYS_OF_WEEK.map((day) => {
                  const daySessions = getSessionsForDay(mainPoolSessions, day);
                  return (
                    <td 
                      key={day} 
                      className="p-2 align-top border-r border-slate-200 last:border-r-0 w-[14.28%]"
                    >
                      {daySessions.map(renderSessionBlock)}
                    </td>
                  );
                })}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION 2: LEARNER POOL */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-xl">👶</span>
            <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
              Learner Pool
            </h3>
            <span className="text-xs text-teal-700 bg-teal-100 px-2 py-0.5 rounded-full font-bold">
              Warm Shallow Water (Beginners & Families)
            </span>
          </div>
        </div>

        <div className="overflow-x-auto border border-slate-200 rounded-2xl shadow-2xs">
          <table className="w-full min-w-[850px] border-collapse text-left">
            <thead>
              <tr className="bg-gradient-to-r from-teal-800 to-teal-900 text-white text-xs font-extrabold uppercase tracking-wider">
                {DAYS_OF_WEEK.map((day) => (
                  <th 
                    key={day} 
                    className="p-2.5 text-center border-r border-teal-700/60 last:border-r-0 hover:bg-teal-700 cursor-pointer transition"
                    onClick={() => onSelectDay(day)}
                  >
                    <div>{day}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-slate-50/50">
              <tr>
                {DAYS_OF_WEEK.map((day) => {
                  const daySessions = getSessionsForDay(learnerPoolSessions, day);
                  return (
                    <td 
                      key={day} 
                      className="p-2 align-top border-r border-slate-200 last:border-r-0 w-[14.28%]"
                    >
                      {daySessions.length === 0 ? (
                        <div className="text-center py-4 text-xs text-slate-400 italic">
                          No public sessions
                        </div>
                      ) : (
                        daySessions.map(renderSessionBlock)
                      )}
                    </td>
                  );
                })}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION 3: HEALTH SUITE */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-xl">🧖‍♀️</span>
            <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
              Health Suite
            </h3>
            <span className="text-xs text-rose-700 bg-rose-100 px-2 py-0.5 rounded-full font-bold">
              Strictly No Under 16s Allowed
            </span>
          </div>
        </div>

        <div className="overflow-x-auto border border-slate-200 rounded-2xl shadow-2xs">
          <table className="w-full min-w-[850px] border-collapse text-left">
            <thead>
              <tr className="bg-gradient-to-r from-rose-800 to-rose-900 text-white text-xs font-extrabold uppercase tracking-wider">
                {DAYS_OF_WEEK.map((day) => (
                  <th 
                    key={day} 
                    className="p-2.5 text-center border-r border-rose-700/60 last:border-r-0 hover:bg-rose-700 cursor-pointer transition"
                    onClick={() => onSelectDay(day)}
                  >
                    <div>{day}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-slate-50/50">
              <tr>
                {DAYS_OF_WEEK.map((day) => {
                  const daySessions = getSessionsForDay(healthSuiteSessions, day);
                  return (
                    <td 
                      key={day} 
                      className="p-2 align-top border-r border-slate-200 last:border-r-0 w-[14.28%]"
                    >
                      {daySessions.map(renderSessionBlock)}
                    </td>
                  );
                })}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
