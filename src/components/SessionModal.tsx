import React from 'react';
import { SwimSession } from '../types/timetable';
import { CATEGORY_META, FACILITY_META, CENTRE_INFO } from '../data/timetableData';
import { formatTimeRange, calculateDuration, getGoogleCalendarUrl, downloadCalendarEvent } from '../utils/timeUtils';
import { 
  X, 
  Calendar, 
  Clock, 
  Waves, 
  Tag, 
  AlertCircle, 
  ExternalLink, 
  Bookmark, 
  BookmarkCheck, 
  Phone,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

interface SessionModalProps {
  session: SwimSession | null;
  onClose: () => void;
  isSaved: boolean;
  onToggleSave: (id: string) => void;
}

export const SessionModal: React.FC<SessionModalProps> = ({
  session,
  onClose,
  isSaved,
  onToggleSave,
}) => {
  if (!session) return null;

  const meta = CATEGORY_META[session.category];
  const facilityMeta = FACILITY_META[session.facility];
  const duration = calculateDuration(session.startTime, session.endTime);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div 
        className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-slate-900 to-sky-950 text-white p-5 relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer"
            title="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-sky-500/30 text-sky-200 border border-sky-400/30">
              {session.day}
            </span>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-teal-500/30 text-teal-200 border border-teal-400/30">
              {facilityMeta.name}
            </span>
          </div>

          <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
            <span>{meta.icon}</span>
            <span>{session.title}</span>
          </h3>

          <div className="flex items-center gap-3 mt-2 text-sky-200 text-sm font-mono font-bold">
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-teal-400" />
              <span>{formatTimeRange(session.startTime, session.endTime)}</span>
            </div>
            {duration && (
              <span className="text-xs font-sans bg-white/10 px-2 py-0.5 rounded-md font-normal text-slate-200">
                {duration}
              </span>
            )}
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-slate-700 text-sm">
          
          {/* Key specs highlight box */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                Pool Facility
              </span>
              <span className="font-bold text-slate-900 text-sm mt-0.5 block">
                {session.facilityName}
              </span>
            </div>
            <span className="text-xs font-semibold text-slate-600 bg-white border border-slate-200 px-2.5 py-1 rounded-lg">
              {facilityMeta.badge}
            </span>
          </div>

          {/* Pricing & Age Special Badges */}
          {(session.priceNote || session.ageRestriction) && (
            <div className="flex flex-wrap gap-2">
              {session.priceNote && (
                <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 text-amber-900 px-3 py-1.5 rounded-xl text-xs font-bold">
                  <Tag className="w-4 h-4 text-amber-600" />
                  <span>Price: {session.priceNote}</span>
                </div>
              )}
              {session.ageRestriction && (
                <div className="flex items-center gap-1.5 bg-rose-50 border border-rose-200 text-rose-900 px-3 py-1.5 rounded-xl text-xs font-bold">
                  <AlertCircle className="w-4 h-4 text-rose-600" />
                  <span>Restriction: {session.ageRestriction}</span>
                </div>
              )}
            </div>
          )}

          {/* Detailed description */}
          <div>
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-1">
              About This Session
            </h4>
            <p className="text-slate-600 leading-relaxed text-sm bg-slate-50 p-3 rounded-2xl border border-slate-100">
              {session.description}
            </p>
          </div>

          {/* Important Swimmer Notes */}
          <div className="bg-sky-50/70 border border-sky-100 rounded-2xl p-3.5 space-y-2">
            <h4 className="font-bold text-sky-950 text-xs uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-sky-600" />
              <span>Visitor Guidelines & What to Bring</span>
            </h4>
            <ul className="text-xs text-slate-600 space-y-1.5">
              <li className="flex items-start gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
                <span><strong>Lockers:</strong> £1 coin returnable or token required.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
                <span><strong>Members:</strong> Free with Active Fitness memberships. Casual swim payable at reception.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
                <span><strong>Under 8s:</strong> Must be accompanied in the water by an adult (max 2 children per adult).</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Modal Action Buttons Footer */}
        <div className="bg-slate-50 p-4 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-2 shrink-0">
          
          {/* Bookmark Button */}
          <button
            onClick={() => onToggleSave(session.id)}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer border ${
              isSaved
                ? 'bg-amber-100 border-amber-300 text-amber-800'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            {isSaved ? <BookmarkCheck className="w-4 h-4 fill-amber-500 text-amber-700" /> : <Bookmark className="w-4 h-4" />}
            <span>{isSaved ? 'Bookmarked' : 'Save Session'}</span>
          </button>

          {/* Calendar Actions */}
          <div className="flex items-center gap-2">
            <a
              href={getGoogleCalendarUrl(session)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 transition cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5 text-sky-600" />
              <span>Google Cal</span>
            </a>

            <button
              onClick={() => downloadCalendarEvent(session)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-500 text-white transition cursor-pointer shadow-sm active:scale-95"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Add to Phone (.ics)</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
