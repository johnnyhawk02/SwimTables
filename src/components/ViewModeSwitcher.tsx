import React from 'react';
import { ViewMode } from '../types/timetable';
import { LayoutGrid, Clock, CalendarRange, Bookmark } from 'lucide-react';

interface ViewModeSwitcherProps {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
  savedCount: number;
}

export const ViewModeSwitcher: React.FC<ViewModeSwitcherProps> = ({
  currentView,
  onViewChange,
  savedCount,
}) => {
  const views: Array<{ id: ViewMode; label: string; icon: React.ReactNode; badge?: number; description: string }> = [
    {
      id: 'cards',
      label: 'Day Cards View',
      icon: <LayoutGrid className="w-4 h-4" />,
      description: 'Card layout with session details & quick actions',
    },
    {
      id: 'timeline',
      label: 'Hourly Timeline',
      icon: <Clock className="w-4 h-4" />,
      description: 'Gantt-style hourly schedule breakdown',
    },
    {
      id: 'weekly',
      label: 'Weekly Timetable Matrix',
      icon: <CalendarRange className="w-4 h-4" />,
      description: 'Complete 7-day printed leisure centre grid',
    },
    {
      id: 'saved',
      label: 'My Saved Sessions',
      icon: <Bookmark className="w-4 h-4" />,
      badge: savedCount,
      description: 'Your bookmarked swim sessions',
    },
  ];

  return (
    <div className="flex flex-wrap items-center gap-2 mb-5">
      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mr-1 hidden sm:inline">
        View Mode:
      </span>
      <div className="grid grid-cols-2 lg:flex lg:flex-wrap gap-2 w-full lg:w-auto">
        {views.map((v) => {
          const isActive = currentView === v.id;
          return (
            <button
              key={v.id}
              onClick={() => onViewChange(v.id)}
              className={`flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-150 cursor-pointer border ${
                isActive
                  ? 'bg-slate-900 text-white border-slate-950 shadow-md ring-2 ring-slate-800/40'
                  : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200/90 hover:border-slate-300 shadow-2xs'
              }`}
              title={v.description}
            >
              <span className={isActive ? 'text-teal-400' : 'text-slate-500'}>
                {v.icon}
              </span>
              <span>{v.label}</span>
              {v.badge !== undefined && v.badge > 0 && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-black ${
                  isActive ? 'bg-teal-400 text-slate-950' : 'bg-teal-100 text-teal-800'
                }`}>
                  {v.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
