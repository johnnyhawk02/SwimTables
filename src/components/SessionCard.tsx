import React, { useState } from 'react';
import { SwimSession, DayOfWeek } from '../types/timetable';
import { CATEGORY_META, FACILITY_META } from '../data/timetableData';
import { 
  formatTimeRange, 
  calculateDuration, 
  isSessionActive, 
  isSessionUpcoming,
  downloadCalendarEvent,
  getGoogleCalendarUrl
} from '../utils/timeUtils';
import { 
  Bookmark, 
  BookmarkCheck, 
  Calendar, 
  Clock, 
  Info, 
  Share2, 
  ExternalLink, 
  Check, 
  Tag,
  AlertCircle
} from 'lucide-react';

interface SessionCardProps {
  session: SwimSession;
  currentDay: DayOfWeek;
  currentTime: string;
  isSaved: boolean;
  onToggleSave: (id: string) => void;
  onOpenDetails: (session: SwimSession) => void;
  fontSize: 'normal' | 'large' | 'extra-large';
}

export const SessionCard: React.FC<SessionCardProps> = ({
  session,
  currentDay,
  currentTime,
  isSaved,
  onToggleSave,
  onOpenDetails,
  fontSize,
}) => {
  const [copied, setCopied] = useState(false);
  const [showCalendarMenu, setShowCalendarMenu] = useState(false);

  const meta = CATEGORY_META[session.category];
  const facilityMeta = FACILITY_META[session.facility];
  const activeNow = isSessionActive(session, currentDay, currentTime);
  const startingSoon = isSessionUpcoming(session, currentDay, currentTime);
  const duration = calculateDuration(session.startTime, session.endTime);

  const handleShare = () => {
    const text = `${session.title} at Meadows Leisure Centre Maghull on ${session.day} (${formatTimeRange(session.startTime, session.endTime)} in ${session.facilityName}).`;
    if (navigator.share) {
      navigator.share({
        title: session.title,
        text: text,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Font size scale class helper
  const textTitleSize = 
    fontSize === 'extra-large' 
      ? 'text-xl sm:text-2xl' 
      : fontSize === 'large' 
      ? 'text-lg sm:text-xl' 
      : 'text-base sm:text-lg';

  const textTimeSize = 
    fontSize === 'extra-large' 
      ? 'text-lg sm:text-xl' 
      : fontSize === 'large' 
      ? 'text-base sm:text-lg' 
      : 'text-sm sm:text-base';

  return (
    <div
      className={`rounded-2xl transition-all duration-200 border relative overflow-hidden bg-white ${
        activeNow
          ? 'border-emerald-500 shadow-lg shadow-emerald-500/10 ring-2 ring-emerald-400/40'
          : 'border-slate-200 hover:border-slate-300 hover:shadow-md'
      }`}
    >
      {/* Top status indicator strip */}
      {activeNow && (
        <div className="bg-emerald-600 text-white px-3 py-1 text-xs font-black tracking-wide flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping"></span>
            <span>HAPPENING RIGHT NOW</span>
          </div>
          <span className="text-[11px] font-semibold opacity-90">Until {session.endTime}</span>
        </div>
      )}

      {startingSoon && !activeNow && (
        <div className="bg-amber-500 text-amber-950 px-3 py-0.5 text-xs font-black tracking-wide flex items-center gap-1.5">
          <Clock className="w-3 h-3" />
          <span>STARTING SOON (Next 90 mins)</span>
        </div>
      )}

      <div className="p-4 sm:p-5">
        {/* Top Badges: Facility + Category */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
          <div className="flex flex-wrap items-center gap-1.5">
            <span
              className={`text-xs font-bold px-2.5 py-1 rounded-lg border ${facilityMeta.color}`}
            >
              {facilityMeta.name}
            </span>

            <span
              className={`text-xs font-bold px-2.5 py-1 rounded-lg border flex items-center gap-1 ${meta.bgColor}`}
            >
              <span>{meta.icon}</span>
              <span>{meta.label}</span>
            </span>
          </div>

          {/* Quick Save Bookmark Button */}
          <button
            onClick={() => onToggleSave(session.id)}
            className={`p-1.5 rounded-xl border transition cursor-pointer ${
              isSaved
                ? 'bg-amber-100 border-amber-300 text-amber-800'
                : 'bg-slate-50 border-slate-200 text-slate-400 hover:text-slate-700 hover:bg-slate-100'
            }`}
            title={isSaved ? 'Remove from saved' : 'Save this session'}
          >
            {isSaved ? <BookmarkCheck className="w-4 h-4 fill-amber-500 text-amber-700" /> : <Bookmark className="w-4 h-4" />}
          </button>
        </div>

        {/* Title & Timing */}
        <div className="mb-3">
          <h3 className={`font-extrabold text-slate-900 tracking-tight flex items-center gap-2 ${textTitleSize}`}>
            {session.title}
          </h3>

          <div className="flex flex-wrap items-center gap-2 mt-1">
            <div className={`font-mono font-bold text-sky-900 flex items-center gap-1.5 ${textTimeSize}`}>
              <Clock className="w-4 h-4 text-sky-600" />
              <span>{formatTimeRange(session.startTime, session.endTime)}</span>
            </div>
            {duration && (
              <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md font-medium">
                {duration}
              </span>
            )}
          </div>
        </div>


        {/* Special Tags: Price / Restriction */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {session.priceNote && (
            <span className="inline-flex items-center gap-1 text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300 px-2.5 py-1 rounded-lg">
              <Tag className="w-3 h-3 text-amber-700" />
              {session.priceNote}
            </span>
          )}

          {session.ageRestriction && (
            <span className="inline-flex items-center gap-1 text-xs font-bold bg-rose-50 text-rose-800 border border-rose-200 px-2.5 py-1 rounded-lg">
              <AlertCircle className="w-3 h-3 text-rose-600" />
              {session.ageRestriction}
            </span>
          )}
        </div>

        <p className="text-xs text-slate-600 line-clamp-2 mb-4 leading-relaxed">
          {session.description}
        </p>

        {/* Interactive Action Buttons Toolbar */}
        <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
          
          {/* Details Button */}
          <button
            onClick={() => onOpenDetails(session)}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 transition cursor-pointer active:scale-95"
          >
            <Info className="w-3.5 h-3.5" />
            <span>Full Details & Rules</span>
          </button>

          <div className="flex items-center gap-1.5 w-full sm:w-auto justify-end">
            {/* Calendar Button with Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowCalendarMenu(!showCalendarMenu)}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition cursor-pointer"
                title="Add to your calendar"
              >
                <Calendar className="w-3.5 h-3.5 text-slate-600" />
                <span>Add to Calendar</span>
              </button>

              {showCalendarMenu && (
                <div 
                  className="absolute right-0 bottom-full mb-1.5 w-48 bg-white rounded-xl shadow-xl border border-slate-200 py-1 z-20"
                  onMouseLeave={() => setShowCalendarMenu(false)}
                >
                  <a
                    href={getGoogleCalendarUrl(session)}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setShowCalendarMenu(false)}
                    className="flex items-center gap-2 px-3 py-2 text-xs text-slate-700 hover:bg-sky-50 hover:text-sky-900 transition"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-sky-600" />
                    <span>Google Calendar</span>
                  </a>
                  <button
                    onClick={() => {
                      downloadCalendarEvent(session);
                      setShowCalendarMenu(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-700 hover:bg-sky-50 hover:text-sky-900 transition text-left cursor-pointer"
                  >
                    <Calendar className="w-3.5 h-3.5 text-teal-600" />
                    <span>Download (.ics for Apple/Outlook)</span>
                  </button>
                </div>
              )}
            </div>

            {/* Share Button */}
            <button
              onClick={handleShare}
              className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition cursor-pointer"
              title="Share session info"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
