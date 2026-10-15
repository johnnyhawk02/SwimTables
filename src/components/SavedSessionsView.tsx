import React from 'react';
import { SwimSession, DayOfWeek } from '../types/timetable';
import { ALL_SESSIONS } from '../data/timetableData';
import { SessionCard } from './SessionCard';
import { Bookmark, Trash2, Calendar, Sparkles } from 'lucide-react';

interface SavedSessionsViewProps {
  savedIds: string[];
  currentDay: DayOfWeek;
  currentTime: string;
  onToggleSave: (id: string) => void;
  onClearAllSaved: () => void;
  onOpenDetails: (session: SwimSession) => void;
  fontSize: 'normal' | 'large' | 'extra-large';
}

export const SavedSessionsView: React.FC<SavedSessionsViewProps> = ({
  savedIds,
  currentDay,
  currentTime,
  onToggleSave,
  onClearAllSaved,
  onOpenDetails,
  fontSize,
}) => {
  const savedSessions = ALL_SESSIONS.filter((s) => savedIds.includes(s.id));

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200/90 p-4 sm:p-5 mb-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4 mb-5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
            <Bookmark className="w-4 h-4 fill-amber-500" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              My Saved Swimming Sessions ({savedSessions.length})
            </h2>
            <p className="text-xs text-slate-500">
              Bookmarked sessions are stored on your device for quick reference
            </p>
          </div>
        </div>

        {savedSessions.length > 0 && (
          <button
            onClick={onClearAllSaved}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition cursor-pointer self-start sm:self-auto"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear All Saved</span>
          </button>
        )}
      </div>

      {savedSessions.length === 0 ? (
        <div className="text-center py-12 px-4">
          <div className="w-16 h-16 bg-slate-100 rounded-3xl flex items-center justify-center text-3xl mx-auto mb-3 text-slate-400">
            ⭐
          </div>
          <h3 className="text-base font-bold text-slate-800 mb-1">
            No Saved Sessions Yet
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto mb-4">
            Tap the bookmark button <span className="inline-block p-1 bg-slate-100 rounded text-slate-700 font-bold">⭐</span> on any session card in the timetable to add it to your personal swim planner.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {savedSessions.map((session) => (
            <SessionCard
              key={session.id}
              session={session}
              currentDay={currentDay}
              currentTime={currentTime}
              isSaved={true}
              onToggleSave={onToggleSave}
              onOpenDetails={onOpenDetails}
              fontSize={fontSize}
            />
          ))}
        </div>
      )}
    </div>
  );
};
