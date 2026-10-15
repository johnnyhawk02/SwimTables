import React from 'react';
import { FacilityId, CategoryId, TimeOfDayFilter } from '../types/timetable';
import { CATEGORY_META, FACILITY_META } from '../data/timetableData';
import { 
  Filter, 
  RotateCcw, 
  Search, 
  X, 
  Clock, 
  Waves, 
  Sparkles,
  Check
} from 'lucide-react';

interface FilterButtonsProps {
  selectedFacility: FacilityId | 'all';
  onSelectFacility: (facility: FacilityId | 'all') => void;
  selectedCategory: CategoryId | 'all';
  onSelectCategory: (category: CategoryId | 'all') => void;
  selectedTimeOfDay: TimeOfDayFilter;
  onSelectTimeOfDay: (time: TimeOfDayFilter) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onResetFilters: () => void;
  activeFilterCount: number;
  totalFilteredCount: number;
}

export const FilterButtons: React.FC<FilterButtonsProps> = ({
  selectedFacility,
  onSelectFacility,
  selectedCategory,
  onSelectCategory,
  selectedTimeOfDay,
  onSelectTimeOfDay,
  searchQuery,
  onSearchChange,
  onResetFilters,
  activeFilterCount,
  totalFilteredCount,
}) => {
  const categories: Array<{ id: CategoryId | 'all'; label: string; icon: string }> = [
    { id: 'all', label: 'All Sessions', icon: '✨' },
    { id: 'public', label: 'Public Swim', icon: '🏊' },
    { id: 'over60', label: '£2 Over 60s', icon: '👵' },
    { id: 'adult', label: 'Adult Only', icon: '🧘' },
    { id: 'aquafit', label: 'Aqua Fit', icon: '⚡' },
    { id: 'splash', label: 'Swim & Splash', icon: '👶' },
    { id: 'club', label: 'Pool closed', icon: '⛔' },
    { id: 'tri', label: 'Tri Club', icon: '🚴' },
  ];

  const facilities: Array<{ id: FacilityId | 'all'; label: string; icon: string }> = [
    { id: 'all', label: 'All Areas', icon: '🏢' },
    { id: 'main', label: 'Main Pool (25m)', icon: '🏊‍♂️' },
    { id: 'learner', label: 'Learner Pool', icon: '👶' },
    { id: 'health', label: 'Health Suite', icon: '🧖‍♀️' },
  ];

  const timeSlots: Array<{ id: TimeOfDayFilter; label: string; icon: string; time: string }> = [
    { id: 'all', label: 'All Hours', icon: '⏱️', time: 'Full day' },
    { id: 'morning', label: 'Morning', icon: '🌅', time: '6:30am – 12:00pm' },
    { id: 'afternoon', label: 'Afternoon', icon: '☀️', time: '12:00pm – 5:00pm' },
    { id: 'evening', label: 'Evening', icon: '🌙', time: '5:00pm – 10:00pm' },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200/90 p-3 sm:p-5 mb-5 space-y-4">
      
      {/* Header and Search row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold">
            <Filter className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-bold text-slate-900">
                Quick Filter Buttons
              </h2>
              {activeFilterCount > 0 && (
                <span className="bg-teal-100 text-teal-800 text-[11px] font-extrabold px-2 py-0.5 rounded-full">
                  {activeFilterCount} active
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500">
              Showing {totalFilteredCount} matching {totalFilteredCount === 1 ? 'session' : 'sessions'}
            </p>
          </div>
        </div>

        {/* Search input + Reset Button */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search (e.g. over 60s, aqua, club)..."
              className="w-full pl-9 pr-8 py-1.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white text-slate-900 placeholder-slate-400"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer p-0.5"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {activeFilterCount > 0 && (
            <button
              onClick={onResetFilters}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-semibold rounded-xl transition cursor-pointer active:scale-95 whitespace-nowrap"
              title="Reset all filters"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Button Group 1: Facility / Pool */}
      <div>
        <div className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <Waves className="w-3.5 h-3.5 text-sky-600" />
          <span>Pool or Facility:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {facilities.map((fac) => {
            const isSelected = selectedFacility === fac.id;
            return (
              <button
                key={fac.id}
                onClick={() => onSelectFacility(fac.id)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer border ${
                  isSelected
                    ? 'bg-sky-700 text-white border-sky-800 shadow-sm ring-2 ring-sky-500/50'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200 hover:border-slate-300'
                }`}
              >
                <span>{fac.icon}</span>
                <span>{fac.label}</span>
                {isSelected && <Check className="w-3.5 h-3.5 ml-0.5" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Button Group 2: Session Category */}
      <div>
        <div className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-teal-600" />
          <span>Session Type:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer border ${
                  isSelected
                    ? 'bg-teal-700 text-white border-teal-800 shadow-sm ring-2 ring-teal-500/50'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200 hover:border-slate-300'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
                {isSelected && <Check className="w-3.5 h-3.5 ml-0.5" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Button Group 3: Time of Day */}
      <div>
        <div className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-amber-600" />
          <span>Time of Day:</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {timeSlots.map((slot) => {
            const isSelected = selectedTimeOfDay === slot.id;
            return (
              <button
                key={slot.id}
                onClick={() => onSelectTimeOfDay(slot.id)}
                className={`flex flex-col items-start p-2.5 rounded-xl text-xs font-medium transition cursor-pointer border text-left ${
                  isSelected
                    ? 'bg-amber-50 border-amber-300 text-amber-900 ring-2 ring-amber-400/50 shadow-xs'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="font-bold flex items-center gap-1">
                    <span>{slot.icon}</span>
                    <span>{slot.label}</span>
                  </span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-amber-600" />}
                </div>
                <span className="text-[11px] text-slate-500 mt-0.5">
                  {slot.time}
                </span>
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
};
