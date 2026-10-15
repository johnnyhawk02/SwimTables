import React from 'react';
import { SwimSession, DayOfWeek, FacilityId } from '../types/timetable';
import { CATEGORY_META, FACILITY_META } from '../data/timetableData';
import { parseMinutes, formatTimeRange, isSessionActive } from '../utils/timeUtils';
import { Clock, Info } from 'lucide-react';

interface TimelineViewProps {
  sessions: SwimSession[];
  selectedDay: DayOfWeek;
  currentTime: string;
  onOpenDetails: (session: SwimSession) => void;
}

export const TimelineView: React.FC<TimelineViewProps> = ({
  sessions,
  selectedDay,
  currentTime,
  onOpenDetails,
}) => {
  // Day boundaries: 06:00 (360m) to 22:30 (1350m)
  const START_HOUR = 6;
  const END_HOUR = 22;
  const totalMinutes = (END_HOUR - START_HOUR + 1) * 60; // 17 hours = 1020 mins

  const hours = Array.from({ length: END_HOUR - START_HOUR + 1 }, (_, i) => START_HOUR + i);

  const getPositionPercent = (timeStr: string) => {
    const m = parseMinutes(timeStr);
    const startM = START_HOUR * 60;
    const clamped = Math.max(startM, Math.min(startM + totalMinutes, m));
    return ((clamped - startM) / totalMinutes) * 100;
  };

  const getWidthPercent = (startStr: string, endStr: string) => {
    const startM = parseMinutes(startStr);
    const endM = parseMinutes(endStr);
    const diff = Math.max(15, endM - startM);
    return (diff / totalMinutes) * 100;
  };

  // Group by facility
  const facilitiesList: FacilityId[] = ['main', 'learner', 'health'];

  // Current time position
  const currentM = parseMinutes(currentTime);
  const nowPercent = ((currentM - START_HOUR * 60) / totalMinutes) * 100;
  const isNowInRange = nowPercent >= 0 && nowPercent <= 100;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200/90 p-4 sm:p-5 mb-5 overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Clock className="w-4 h-4 text-sky-600" />
            <span>Hourly Timeline Schedule ({selectedDay})</span>
          </h2>
          <p className="text-xs text-slate-500">
            See concurrent sessions, overlap periods, and open pool hours at a glance. Tap any block for full details.
          </p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="flex items-center gap-1 text-slate-600 font-medium">
            <span className="w-2.5 h-2.5 rounded-sm bg-cyan-500"></span> Public
          </span>
          <span className="flex items-center gap-1 text-slate-600 font-medium">
            <span className="w-2.5 h-2.5 rounded-sm bg-amber-500"></span> Over 60s
          </span>
          <span className="flex items-center gap-1 text-slate-600 font-medium">
            <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500"></span> Adult Only
          </span>
          <span className="flex items-center gap-1 text-slate-600 font-medium">
            <span className="w-2.5 h-2.5 rounded-sm bg-fuchsia-500"></span> Aqua Fit
          </span>
          <span className="flex items-center gap-1 text-slate-600 font-medium">
            <span className="w-2.5 h-2.5 rounded-sm bg-purple-500"></span> Pool closed
          </span>
        </div>
      </div>

      <div className="overflow-x-auto pb-4">
        <div className="min-w-[760px] relative">
          
          {/* Hour markers row */}
          <div className="flex border-b border-slate-200 pb-2 mb-3 text-[11px] font-mono text-slate-500">
            <div className="w-32 shrink-0 font-sans font-bold text-slate-700">Area</div>
            <div className="flex-1 flex justify-between relative px-2">
              {hours.map((h) => (
                <span key={h} className="text-center w-8 -ml-4">
                  {h === 12 ? '12pm' : h > 12 ? `${h - 12}pm` : `${h}am`}
                </span>
              ))}
            </div>
          </div>

          {/* Current time vertical indicator line */}
          {isNowInRange && (
            <div
              className="absolute top-0 bottom-0 z-20 pointer-events-none"
              style={{ left: `calc(8rem + (100% - 8rem) * ${nowPercent / 100})` }}
            >
              <div className="w-0.5 h-full bg-rose-500 shadow-sm relative">
                <span className="absolute -top-1 -translate-x-1/2 bg-rose-500 text-white text-[9px] font-bold px-1 rounded-sm uppercase tracking-wider">
                  Now
                </span>
              </div>
            </div>
          )}

          {/* Facility Rows */}
          <div className="space-y-4">
            {facilitiesList.map((facId) => {
              const facMeta = FACILITY_META[facId];
              const facSessions = sessions.filter((s) => s.facility === facId);

              return (
                <div key={facId} className="flex items-start border-b border-slate-100 pb-3">
                  {/* Facility label header */}
                  <div className="w-32 shrink-0 pr-3">
                    <span className="text-xs font-bold text-slate-900 block leading-tight">
                      {facMeta.name}
                    </span>
                    <span className="text-[10px] text-slate-500 block">
                      {facMeta.badge}
                    </span>
                  </div>

                  {/* Lane canvas */}
                  <div className="flex-1 h-20 bg-slate-50 rounded-xl relative border border-slate-200/80 p-1 overflow-hidden">
                    {/* Hour grid lines */}
                    <div className="absolute inset-0 flex justify-between pointer-events-none">
                      {hours.map((h) => (
                        <div key={h} className="h-full border-r border-slate-200/50 w-full" />
                      ))}
                    </div>

                    {facSessions.length === 0 ? (
                      <div className="h-full flex items-center justify-center text-xs text-slate-400 italic">
                        No scheduled sessions on this day
                      </div>
                    ) : (
                      facSessions.map((session, idx) => {
                        const meta = CATEGORY_META[session.category];
                        const left = getPositionPercent(session.startTime);
                        const width = getWidthPercent(session.startTime, session.endTime);
                        const isActive = isSessionActive(session, selectedDay, currentTime);

                        // Stack slightly if multiple sessions overlap
                        const topOffset = idx % 2 === 0 ? 'top-1' : 'top-9';

                        return (
                          <button
                            key={session.id}
                            onClick={() => onOpenDetails(session)}
                            className={`absolute h-7 rounded-lg text-xs font-bold px-2 flex items-center justify-between shadow-xs transition-all duration-150 cursor-pointer overflow-hidden border ${topOffset} ${
                              isActive
                                ? 'ring-2 ring-emerald-500 ring-offset-1 z-10'
                                : 'hover:scale-[1.01] hover:z-10'
                            } ${meta.bgColor}`}
                            style={{
                              left: `${left}%`,
                              width: `${width}%`,
                              minWidth: '45px',
                            }}
                            title={`${session.title} (${session.startTime} - ${session.endTime})`}
                          >
                            <span className="truncate flex items-center gap-1">
                              <span>{meta.icon}</span>
                              <span className="truncate">{session.title}</span>
                            </span>
                            <span className="text-[10px] opacity-80 shrink-0 font-mono hidden md:inline ml-1">
                              {session.startTime}
                            </span>
                          </button>
                        );
                      })
                    )}
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </div>
  );
};
