import React, { useState } from 'react';
import { SwimSession, DayOfWeek } from '../types/timetable';
import { CATEGORY_META, FACILITY_META } from '../data/timetableData';
import { isSessionActive, formatTimeRange, formatTime12h, parseMinutes } from '../utils/timeUtils';
import { 
  Radio, 
  Clock, 
  ChevronDown, 
  ChevronUp, 
  SlidersHorizontal, 
  Sparkles, 
  Info,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

interface WhatsOnNowBarProps {
  sessions: SwimSession[];
  currentDay: DayOfWeek;
  currentTime: string;
  simulatedTime: string | null;
  onSetSimulatedTime: (time: string | null) => void;
  onOpenDetails: (session: SwimSession) => void;
}

export const WhatsOnNowBar: React.FC<WhatsOnNowBarProps> = ({
  sessions,
  currentDay,
  currentTime,
  simulatedTime,
  onSetSimulatedTime,
  onOpenDetails,
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const [showTimePicker, setShowTimePicker] = useState(false);

  // Active sessions right now for today
  const activeSessions = sessions.filter((s) =>
    isSessionActive(s, currentDay, currentTime)
  );

  const mainPoolActive = activeSessions.filter((s) => s.facility === 'main');
  const learnerPoolActive = activeSessions.filter((s) => s.facility === 'learner');
  const healthSuiteActive = activeSessions.filter((s) => s.facility === 'health');

  // Quick preset test times
  const timePresets = [
    { label: '6:30am Early', time: '06:30' },
    { label: '9:00am Morning', time: '09:00' },
    { label: '12:00pm Lunch', time: '12:00' },
    { label: '3:30pm Afternoon', time: '15:30' },
    { label: '6:00pm Evening', time: '18:00' },
    { label: '7:30pm Clubs/Aqua', time: '19:30' },
    { label: '9:15pm Adults', time: '21:15' },
  ];

  return (
    <div className="bg-gradient-to-r from-sky-900 via-slate-900 to-teal-950 text-white rounded-2xl shadow-lg border border-sky-700/50 p-3.5 sm:p-4 mb-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        
        {/* Title & Live indicator */}
        <div className="flex items-center gap-2.5">
          <div className="w-3 h-3 rounded-full bg-emerald-400 animate-ping"></div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-emerald-300 flex items-center gap-1">
                <Radio className="w-3.5 h-3.5" />
                {simulatedTime ? 'Simulated Status' : "What's On Right Now"}
              </span>
              <span className="text-slate-300 font-mono text-xs font-bold bg-white/10 px-2 py-0.5 rounded-md">
                {currentDay} • {formatTime12h(currentTime)}
              </span>
            </div>
            <p className="text-xs text-slate-300">
              {activeSessions.length > 0
                ? `${activeSessions.length} active sessions in progress across pools`
                : 'No scheduled sessions at this exact time (check opening hours)'}
            </p>
          </div>
        </div>

        {/* Action button toggles */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          {/* Simulate Time Button */}
          <button
            onClick={() => setShowTimePicker(!showTimePicker)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer border ${
              simulatedTime
                ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-sm'
                : 'bg-white/10 hover:bg-white/20 text-slate-200 border-white/20'
            }`}
            title="Preview what is open at any specific time"
          >
            <Clock className="w-3.5 h-3.5" />
            <span>{simulatedTime ? `Time: ${simulatedTime}` : 'Check Other Hours'}</span>
          </button>

          {/* Expand/Collapse Bar Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 transition cursor-pointer"
            title={isOpen ? 'Collapse panel' : 'Expand panel'}
          >
            {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

      </div>

      {/* Time Picker Slider / Preset Buttons Tray */}
      {showTimePicker && (
        <div className="mt-3 pt-3 border-t border-sky-800/60 bg-black/20 p-3 rounded-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-sky-200 flex items-center gap-1">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Select Hour to Preview Pool Allocation:</span>
            </span>
            {simulatedTime && (
              <button
                onClick={() => onSetSimulatedTime(null)}
                className="text-xs text-rose-300 hover:text-white font-bold cursor-pointer"
              >
                Reset to Current Clock
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-1.5">
            {timePresets.map((preset) => (
              <button
                key={preset.time}
                onClick={() => onSetSimulatedTime(preset.time)}
                className={`text-xs px-2.5 py-1 rounded-lg font-semibold transition cursor-pointer border ${
                  simulatedTime === preset.time
                    ? 'bg-amber-400 text-slate-950 border-amber-300 font-bold'
                    : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border-slate-700'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Expanded Live Status Grid */}
      {isOpen && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 mt-3 pt-3 border-t border-sky-800/60">
          
          {/* Main Pool Live Box */}
          <div className="bg-slate-900/80 rounded-xl p-3 border border-sky-700/40">
            <div className="flex items-center justify-between text-xs font-bold mb-1.5 text-sky-300">
              <span className="flex items-center gap-1">
                <span>🏊‍♂️</span> Main Pool
              </span>
              <span className="text-[10px] bg-sky-500/20 text-sky-200 px-1.5 py-0.2 rounded font-semibold">
                {mainPoolActive.length} active
              </span>
            </div>

            {mainPoolActive.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No public session running right now.</p>
            ) : (
              <div className="space-y-1.5">
                {mainPoolActive.map((s) => {
                  const meta = CATEGORY_META[s.category];
                  return (
                    <button
                      key={s.id}
                      onClick={() => onOpenDetails(s)}
                      className="w-full text-left bg-white/5 hover:bg-white/10 p-2 rounded-lg border border-white/10 transition cursor-pointer"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white flex items-center gap-1">
                          <span>{meta.icon}</span> {s.title}
                        </span>
                        <span className="text-[10px] font-mono text-teal-300 font-bold">
                          until {s.endTime}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Learner Pool Live Box */}
          <div className="bg-slate-900/80 rounded-xl p-3 border border-teal-700/40">
            <div className="flex items-center justify-between text-xs font-bold mb-1.5 text-teal-300">
              <span className="flex items-center gap-1">
                <span>👶</span> Learner Pool
              </span>
              <span className="text-[10px] bg-teal-500/20 text-teal-200 px-1.5 py-0.2 rounded font-semibold">
                {learnerPoolActive.length} active
              </span>
            </div>

            {learnerPoolActive.length === 0 ? (
              <p className="text-xs text-slate-400 italic">Learner pool closed or in private use.</p>
            ) : (
              <div className="space-y-1.5">
                {learnerPoolActive.map((s) => {
                  const meta = CATEGORY_META[s.category];
                  return (
                    <button
                      key={s.id}
                      onClick={() => onOpenDetails(s)}
                      className="w-full text-left bg-white/5 hover:bg-white/10 p-2 rounded-lg border border-white/10 transition cursor-pointer"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white flex items-center gap-1">
                          <span>{meta.icon}</span> {s.title}
                        </span>
                        <span className="text-[10px] font-mono text-teal-300 font-bold">
                          until {s.endTime}
                        </span>
                      </div>
                      {s.ageRestriction && (
                        <div className="text-[11px] text-pink-200 mt-0.5">
                          {s.ageRestriction}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Health Suite Live Box */}
          <div className="bg-slate-900/80 rounded-xl p-3 border border-rose-700/40">
            <div className="flex items-center justify-between text-xs font-bold mb-1.5 text-rose-300">
              <span className="flex items-center gap-1">
                <span>🧖‍♀️</span> Health Suite
              </span>
              <span className="text-[10px] bg-rose-500/20 text-rose-200 px-1.5 py-0.2 rounded font-semibold">
                16+ only
              </span>
            </div>

            {healthSuiteActive.length === 0 ? (
              <p className="text-xs text-slate-400 italic">Health suite closed.</p>
            ) : (
              <div className="space-y-1.5">
                {healthSuiteActive.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => onOpenDetails(s)}
                    className="w-full text-left bg-white/5 hover:bg-white/10 p-2 rounded-lg border border-white/10 transition cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white flex items-center gap-1">
                        <span>🧖</span> Sauna & Steam Open
                      </span>
                      <span className="text-[10px] font-mono text-teal-300 font-bold">
                        until {s.endTime}
                      </span>
                    </div>
                    <div className="text-[11px] text-rose-300 mt-0.5">
                      Relaxation suite active
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

        </div>
      )}

    </div>
  );
};
