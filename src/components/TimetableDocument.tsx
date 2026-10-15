import React from 'react';
import { SwimSession, DayOfWeek, CategoryId, FacilityId } from '../types/timetable';
import { ALL_SESSIONS, DAYS_OF_WEEK } from '../data/timetableData';
import { isSessionActive } from '../utils/timeUtils';
import { Bookmark, BookmarkCheck, Calendar, Phone, Printer, ExternalLink, MapPin, Sparkles } from 'lucide-react';

interface TimetableDocumentProps {
  highlightCategory: CategoryId | 'all';
  highlightDay: DayOfWeek | 'all';
  facilityFilter: FacilityId | 'all';
  currentDay: DayOfWeek;
  currentTime: string;
  savedIds: string[];
  onOpenDetails: (session: SwimSession) => void;
  onToggleSave: (id: string) => void;
  onPrintDayReceipt?: (day: DayOfWeek) => void;
}

export const TimetableDocument: React.FC<TimetableDocumentProps> = ({
  highlightCategory,
  highlightDay,
  facilityFilter,
  currentDay,
  currentTime,
  savedIds,
  onOpenDetails,
  onToggleSave,
  onPrintDayReceipt,
}) => {
  // Ordered sessions for main pool matching PDF
  const mainSessionsByDay: Record<DayOfWeek, SwimSession[]> = {
    Monday: ALL_SESSIONS.filter((s) => s.facility === 'main' && s.day === 'Monday'),
    Tuesday: ALL_SESSIONS.filter((s) => s.facility === 'main' && s.day === 'Tuesday'),
    Wednesday: ALL_SESSIONS.filter((s) => s.facility === 'main' && s.day === 'Wednesday'),
    Thursday: ALL_SESSIONS.filter((s) => s.facility === 'main' && s.day === 'Thursday'),
    Friday: ALL_SESSIONS.filter((s) => s.facility === 'main' && s.day === 'Friday'),
    Saturday: ALL_SESSIONS.filter((s) => s.facility === 'main' && s.day === 'Saturday'),
    Sunday: ALL_SESSIONS.filter((s) => s.facility === 'main' && s.day === 'Sunday'),
  };

  // Ordered sessions for learner pool matching PDF
  const learnerSessionsByDay: Record<DayOfWeek, SwimSession[]> = {
    Monday: ALL_SESSIONS.filter((s) => s.facility === 'learner' && s.day === 'Monday'),
    Tuesday: ALL_SESSIONS.filter((s) => s.facility === 'learner' && s.day === 'Tuesday'),
    Wednesday: ALL_SESSIONS.filter((s) => s.facility === 'learner' && s.day === 'Wednesday'),
    Thursday: ALL_SESSIONS.filter((s) => s.facility === 'learner' && s.day === 'Thursday'),
    Friday: ALL_SESSIONS.filter((s) => s.facility === 'learner' && s.day === 'Friday'),
    Saturday: ALL_SESSIONS.filter((s) => s.facility === 'learner' && s.day === 'Saturday'),
    Sunday: ALL_SESSIONS.filter((s) => s.facility === 'learner' && s.day === 'Sunday'),
  };

  // Health suite sessions
  const healthSessionsByDay: Record<DayOfWeek, SwimSession[]> = {
    Monday: ALL_SESSIONS.filter((s) => s.facility === 'health' && s.day === 'Monday'),
    Tuesday: ALL_SESSIONS.filter((s) => s.facility === 'health' && s.day === 'Tuesday'),
    Wednesday: ALL_SESSIONS.filter((s) => s.facility === 'health' && s.day === 'Wednesday'),
    Thursday: ALL_SESSIONS.filter((s) => s.facility === 'health' && s.day === 'Thursday'),
    Friday: ALL_SESSIONS.filter((s) => s.facility === 'health' && s.day === 'Friday'),
    Saturday: ALL_SESSIONS.filter((s) => s.facility === 'health' && s.day === 'Saturday'),
    Sunday: ALL_SESSIONS.filter((s) => s.facility === 'health' && s.day === 'Sunday'),
  };

  const renderCellButton = (session: SwimSession) => {
    const hasCategoryFilter = highlightCategory !== 'all';
    const hasDayFilter = highlightDay !== 'all';
    const matchesCategory = !hasCategoryFilter || session.category === highlightCategory;
    const matchesDay = !hasDayFilter || session.day === highlightDay;

    const isHighlighted = (hasCategoryFilter && matchesCategory) || (hasDayFilter && matchesDay);
    const isDimmed = (hasCategoryFilter && !matchesCategory) || (hasDayFilter && !matchesDay);
    const isActiveNow = isSessionActive(session, currentDay, currentTime);
    const isSaved = savedIds.includes(session.id);

    return (
      <button
        key={session.id}
        onClick={() => onOpenDetails(session)}
        className={`w-full min-h-[68px] sm:min-h-[74px] p-1.5 sm:p-2 border border-slate-400/90 text-center flex flex-col justify-center items-center transition-all duration-150 cursor-pointer relative group text-slate-900 bg-white hover:bg-sky-50 active:scale-[0.98] ${
          isDimmed
            ? 'opacity-25 bg-slate-50'
            : isHighlighted
            ? 'bg-amber-100/90 ring-2 ring-amber-500 font-semibold z-10 scale-[1.01] shadow-xs'
            : ''
        } ${isActiveNow ? 'ring-2 ring-emerald-500 bg-emerald-50/80 z-10' : ''}`}
        title={`${session.title} (${session.startTime} - ${session.endTime}) - Click for details & calendar`}
      >
        {/* Active Now Live Indicator */}
        {isActiveNow && (
          <span className="absolute -top-1.5 right-1 px-1 py-0.2 bg-emerald-600 text-white text-[9px] font-extrabold uppercase rounded shadow-xs tracking-wider">
            Now
          </span>
        )}

        {/* Saved badge */}
        {isSaved && !isActiveNow && (
          <span className="absolute top-1 right-1 text-amber-500">
            ★
          </span>
        )}

        {/* Time - Exactly like PDF */}
        <div className="font-sans font-normal text-xs sm:text-[13px] text-slate-900 leading-tight">
          {session.startTime}-{session.endTime}
        </div>

        {/* Title - Exactly like PDF */}
        <div className="font-sans font-bold text-xs sm:text-[13px] text-slate-900 leading-snug mt-0.5">
          {session.title}
        </div>


        {/* Hover Hint Overlay Button */}
        <span className="absolute inset-x-0 bottom-0 py-0.5 bg-slate-900 text-white text-[9px] font-bold opacity-0 group-hover:opacity-90 transition-opacity uppercase tracking-wider">
          Tap for info & export
        </span>
      </button>
    );
  };

  return (
    <div className="bg-white shadow-xl border border-slate-300 rounded-lg sm:rounded-xl p-3 sm:p-7 max-w-5xl mx-auto font-sans text-slate-900 timetable-paper">
      
      {/* ================= HEADER SECTION ================= */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 pb-4 border-b border-slate-200">
        
        {/* Left Header: Centre Title and Address */}
        <div>
          <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-slate-800">
            Meadows Leisure Centre
          </h1>

          <div className="flex items-center gap-2 mt-0.5 mb-1">
            <span className="text-xl sm:text-2xl font-black text-slate-800 lowercase tracking-tight">
              active<span className="font-normal text-slate-600">fitness</span>
            </span>
            <div className="h-1 flex-1 max-w-[120px] bg-gradient-to-r from-[#b8175c] to-teal-600 rounded"></div>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 font-medium">
            Hall Lane, Maghull, Liverpool, Merseyside L31 7BB
          </p>
        </div>

        {/* Right Header: Opening Times */}
        <div className="text-xs sm:text-sm text-slate-700 md:text-right space-y-0.5 font-medium shrink-0">
          <div>Mon to Fri: 6.30am - 10.00pm</div>
          <div>Saturday: 8.00am - 4.00pm</div>
          <div>Sunday: 8.00am - 3.00pm (Health Suite 4pm)</div>
          <div className="text-slate-500 text-[11px] sm:text-xs italic pt-1">
            Timetables subject to change.<br />
            Commences on 02.03.26
          </div>
        </div>

      </div>

      {/* ================= TABLE 1: MAIN POOL ================= */}
      {(facilityFilter === 'all' || facilityFilter === 'main') && (
        <section className="mt-6 mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 lowercase tracking-tight mb-2">
            main pool
          </h2>

          <div className="overflow-x-auto">
            <div className="min-w-[680px]">
              {/* Header row in PDF's signature magenta */}
              <div className="grid grid-cols-7 bg-[#b8175c] text-white text-center font-bold text-xs sm:text-sm py-2 tracking-wider uppercase border border-[#b8175c]">
                {DAYS_OF_WEEK.map((day) => {
                  const isDaySelected = highlightDay === day;
                  const isToday = currentDay === day;
                  return (
                    <div 
                      key={day} 
                      className={`px-1 py-1 border-r border-[#d4377b] last:border-r-0 flex flex-col items-center justify-center ${
                        isDaySelected ? 'bg-[#8d0f45]' : ''
                      }`}
                    >
                      <span className="font-extrabold text-xs sm:text-sm">{day}</span>
                      {isToday && (
                        <span className="text-[9px] bg-white text-[#b8175c] px-1 rounded-sm font-extrabold uppercase mt-0.5">
                          Today
                        </span>
                      )}
                      {onPrintDayReceipt && (
                        <button
                          onClick={() => onPrintDayReceipt(day)}
                          className="mt-1 text-[9px] bg-black/25 hover:bg-black/45 active:scale-95 text-white px-1.5 py-0.5 rounded font-mono transition cursor-pointer flex items-center gap-1 no-print border border-white/20"
                          title={`Print ${day} on Epson receipt printer`}
                        >
                          <span>🧾</span>
                          <span>Print</span>
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Sessions columns grid */}
              <div className="grid grid-cols-7 border-l border-r border-b border-slate-400 bg-white">
                {DAYS_OF_WEEK.map((day) => {
                  const sessions = mainSessionsByDay[day];
                  const isColHighlighted = highlightDay === day;

                  return (
                    <div
                      key={day}
                      className={`flex flex-col border-r border-slate-400 last:border-r-0 ${
                        isColHighlighted ? 'bg-amber-50/50' : ''
                      }`}
                    >
                      {sessions.map((session) => renderCellButton(session))}
                      {/* Empty cell spacer to balance columns */}
                      {sessions.length < 8 && (
                        <div className="flex-1 min-h-[60px] bg-slate-50/30 border-t border-slate-200"></div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ================= TABLE 2: LEARNER POOL ================= */}
      {(facilityFilter === 'all' || facilityFilter === 'learner') && (
        <section className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 lowercase tracking-tight mb-2">
            learner pool
          </h2>

          <div className="overflow-x-auto">
            <div className="min-w-[680px]">
              {/* Header row in PDF's signature magenta */}
              <div className="grid grid-cols-7 bg-[#b8175c] text-white text-center font-bold text-xs sm:text-sm py-2 tracking-wider uppercase border border-[#b8175c]">
                {DAYS_OF_WEEK.map((day) => {
                  const isDaySelected = highlightDay === day;
                  return (
                    <div 
                      key={day} 
                      className={`px-1 border-r border-[#d4377b] last:border-r-0 ${
                        isDaySelected ? 'bg-[#8d0f45]' : ''
                      }`}
                    >
                      {day}
                    </div>
                  );
                })}
              </div>

              {/* Sessions columns grid */}
              <div className="grid grid-cols-7 border-l border-r border-b border-slate-400 bg-white">
                {DAYS_OF_WEEK.map((day) => {
                  const sessions = learnerSessionsByDay[day];
                  const isColHighlighted = highlightDay === day;

                  return (
                    <div
                      key={day}
                      className={`flex flex-col border-r border-slate-400 last:border-r-0 ${
                        isColHighlighted ? 'bg-amber-50/50' : ''
                      }`}
                    >
                      {sessions.map((session) => renderCellButton(session))}
                      {/* Spacer */}
                      <div className="flex-1 min-h-[50px] bg-slate-50/20"></div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ================= TABLE 3: HEALTH SUITE ================= */}
      {(facilityFilter === 'all' || facilityFilter === 'health') && (
        <section className="mb-6">
          <div className="flex items-baseline gap-2 mb-2">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight">
              Health Suite
            </h2>
            <span className="text-sm sm:text-base font-bold text-slate-700">
              (No Under 16's Allowed)
            </span>
          </div>

          <div className="overflow-x-auto">
            <div className="min-w-[680px]">
              {/* Header row */}
              <div className="grid grid-cols-7 bg-[#b8175c] text-white text-center font-bold text-xs sm:text-sm py-2 tracking-wider uppercase border border-[#b8175c]">
                {DAYS_OF_WEEK.map((day) => (
                  <div key={day} className="px-1 border-r border-[#d4377b] last:border-r-0">
                    {day}
                  </div>
                ))}
              </div>

              {/* Times row */}
              <div className="grid grid-cols-7 border-l border-r border-b border-slate-400 bg-white">
                {DAYS_OF_WEEK.map((day) => {
                  const session = healthSessionsByDay[day][0];
                  if (!session) return <div key={day} className="border-r border-slate-400 p-2"></div>;
                  return (
                    <div key={day} className="border-r border-slate-400 last:border-r-0">
                      {renderCellButton(session)}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ================= FOOTER SECTION ================= */}
      <div className="pt-6 border-t border-slate-200 mt-8 space-y-4">
        
        {/* Contact strip */}
        <div className="text-xs sm:text-sm font-semibold text-slate-800 text-center sm:text-left">
          More information at{' '}
          <a
            href="https://www.activeseftonfitness.co.uk"
            target="_blank"
            rel="noopener noreferrer"
            className="text-teal-700 hover:underline font-bold"
          >
            www.activeseftonfitness.co.uk
          </a>
          {' '}or at reception.
        </div>

        {/* 6 Locations & activefitness branding */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-3 border-t border-slate-100">
          
          <div>
            <div className="text-xl font-black text-slate-800 lowercase">
              active<span className="font-normal text-slate-600">fitness</span>
            </div>
            <div className="text-[10px] uppercase tracking-widest text-slate-500 font-extrabold">
              MORE THAN JUST A GYM
            </div>
          </div>

          {/* Six Locations */}
          <div className="text-center md:text-left">
            <div className="text-[11px] font-bold text-slate-700 mb-0.5">
              One membership. Six locations.
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-0.5 text-[11px] text-slate-600">
              <div>Bootle Leisure Centre</div>
              <div>Crosby Lakeside</div>
              <div>Dunes Splash World</div>
              <div className="text-teal-700 font-bold">Meadows Leisure Centre</div>
              <div>Litherland Sports Park</div>
              <div>Netherton Activity Centre</div>
            </div>
          </div>

          {/* Active Sefton / Sefton Council Logo Badge */}
          <div className="text-right flex flex-col items-center md:items-end">
            <div className="text-sm font-black text-teal-800 uppercase tracking-tight">
              active sefton
            </div>
            <div className="text-xs font-bold text-teal-700 flex items-center gap-1">
              <span>Sefton Council</span>
              <span className="text-sm">🏰</span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
