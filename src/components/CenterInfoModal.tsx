import React from 'react';
import { CENTRE_INFO, SISTER_LOCATIONS, CENTRE_RULES_AND_INFO } from '../data/timetableData';
import { 
  X, 
  Phone, 
  MapPin, 
  Clock, 
  ShieldAlert, 
  ExternalLink, 
  Building2, 
  BadgeCheck,
  CheckCircle2,
  Navigation
} from 'lucide-react';

interface CenterInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CenterInfoModal: React.FC<CenterInfoModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div 
        className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150 max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-sky-950 to-teal-950 text-white p-5 sm:p-6 relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer"
            title="Close modal"
          >
            <X className="w-4 h-4" />
          </button>

          <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-teal-500/30 text-teal-200 border border-teal-400/30 uppercase tracking-wider mb-2 inline-block">
            Centre Directory & Information
          </span>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
            {CENTRE_INFO.name}
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm mt-1">
            Active Fitness • Active Sefton / Sefton Council
          </p>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 text-slate-700 text-sm">
          
          {/* Contact & Hours Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Hours card */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2.5">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                <Clock className="w-4 h-4 text-sky-600" />
                <span>Centre Opening Hours</span>
              </div>
              <div className="text-xs space-y-1.5 text-slate-600">
                <div className="flex justify-between py-1 border-b border-slate-200/60">
                  <span className="font-semibold text-slate-800">Monday – Friday:</span>
                  <span className="font-mono text-slate-900 font-bold">{CENTRE_INFO.hours.weekday}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200/60">
                  <span className="font-semibold text-slate-800">Saturday:</span>
                  <span className="font-mono text-slate-900 font-bold">{CENTRE_INFO.hours.saturday}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="font-semibold text-slate-800">Sunday:</span>
                  <span className="font-mono text-slate-900 font-bold text-right text-[11px]">
                    8:00am – 3:00pm<br />(Health Suite 4:00pm)
                  </span>
                </div>
              </div>
              <div className="text-[11px] text-teal-700 font-semibold bg-teal-50 px-2 py-1 rounded-lg">
                Current timetable commenced 02.03.26
              </div>
            </div>

            {/* Location & Phone card */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                <MapPin className="w-4 h-4 text-teal-600" />
                <span>Location & Contact</span>
              </div>
              <div className="text-xs text-slate-600 space-y-1">
                <p className="font-medium text-slate-900">{CENTRE_INFO.address}</p>
                <p className="font-bold text-teal-700">{CENTRE_INFO.postcode}</p>
              </div>

              <div className="pt-2 flex flex-col gap-2">
                <a
                  href={`tel:${CENTRE_INFO.phone.replace(/\s+/g, '')}`}
                  className="inline-flex items-center justify-center gap-2 px-3 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call {CENTRE_INFO.phone}</span>
                </a>

                <a
                  href={`https://maps.google.com/?q=Meadows+Leisure+Centre+Hall+Lane+Maghull+${CENTRE_INFO.postcode}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-3 py-2 bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 rounded-xl text-xs font-bold transition cursor-pointer"
                >
                  <Navigation className="w-3.5 h-3.5 text-sky-600" />
                  <span>Get Directions in Google Maps</span>
                </a>
              </div>
            </div>

          </div>

          {/* Admission & General Guidelines */}
          <div className="space-y-3">
            <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider flex items-center gap-2">
              <BadgeCheck className="w-4 h-4 text-sky-600" />
              <span>Pool Rules & Admission Policy</span>
            </h3>
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 space-y-2">
              {CENTRE_RULES_AND_INFO.generalRules.map((rule, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-slate-600">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
                  <span>{rule}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Health Suite Rules */}
          <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 space-y-2">
            <h3 className="font-bold text-rose-900 text-sm flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-600" />
              <span>Health Suite (Sauna & Steam) Regulations</span>
            </h3>
            <p className="text-xs text-rose-800 leading-relaxed">
              <strong>Strictly No Under 16s Allowed.</strong> The Health Suite features thermal sauna and steam facilities. Patrons must shower before entering, sit on towels inside the sauna cabin, and stay well hydrated.
            </p>
          </div>

          {/* Active Sefton - Six Locations */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider flex items-center gap-2">
                <Building2 className="w-4 h-4 text-teal-600" />
                <span>One Membership • Six Active Sefton Centres</span>
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {SISTER_LOCATIONS.map((loc) => (
                <div 
                  key={loc.name}
                  className={`p-2.5 rounded-xl border ${
                    loc.current 
                      ? 'bg-sky-50 border-sky-300 font-semibold text-sky-950' 
                      : 'bg-slate-50 border-slate-200 text-slate-600'
                  }`}
                >
                  <div className="font-bold flex items-center justify-between">
                    <span>{loc.name}</span>
                    {loc.current && (
                      <span className="text-[10px] bg-sky-200 text-sky-900 px-1.5 py-0.2 rounded font-extrabold">
                        This Venue
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">{loc.location}</div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="bg-slate-50 p-4 border-t border-slate-200/80 flex items-center justify-between shrink-0">
          <a
            href={CENTRE_INFO.website}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-bold text-teal-700 hover:text-teal-800 flex items-center gap-1"
          >
            <span>Visit activeseftonfitness.co.uk</span>
            <ExternalLink className="w-3 h-3" />
          </a>

          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition cursor-pointer"
          >
            Close Window
          </button>
        </div>
      </div>
    </div>
  );
};
