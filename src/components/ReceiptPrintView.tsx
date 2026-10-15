import React, { useState, useEffect } from 'react';
import { DayOfWeek } from '../types/timetable';
import { DAYS_OF_WEEK } from '../data/timetableData';
import { getCurrentDayOfWeek } from '../utils/timeUtils';
import { ReceiptSlipContent } from './ReceiptSlipContent';
import { printThermalReceipt } from '../utils/receiptPrinter';
import { Printer, Receipt } from 'lucide-react';

interface ReceiptPrintViewProps {
  initialDay?: DayOfWeek;
}

export const ReceiptPrintView: React.FC<ReceiptPrintViewProps> = ({
  initialDay,
}) => {
  const today = getCurrentDayOfWeek();
  const todayIdx = DAYS_OF_WEEK.indexOf(today);
  const tomorrow = DAYS_OF_WEEK[(todayIdx + 1) % 7];

  const [selectedDay, setSelectedDay] = useState<DayOfWeek>(initialDay || today);

  // Isolated print handler
  const triggerPrint = () => {
    printThermalReceipt(selectedDay);
  };

  // Keyboard shortcut listener for Ctrl+P / Cmd+P
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'p') {
        e.preventDefault();
        printThermalReceipt(selectedDay);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedDay]);

  return (
    <div className="bg-slate-50 min-h-screen text-black font-sans p-3 sm:p-6">
      
      {/* ================= CLEAN NON-PRINTING TOOLBAR ================= */}
      <header className="no-print max-w-xl mx-auto mb-6 bg-white border border-slate-200 rounded-2xl p-3.5 sm:p-4 shadow-sm">
        
        {/* Top Header & Direct Print Action */}
        <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center">
              <Receipt className="w-4 h-4" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-slate-900 leading-tight">
                Meadows Leisure Centre
              </h1>
              <p className="text-[11px] text-slate-500 font-medium">
                Swim Timetable Receipt Slip
              </p>
            </div>
          </div>

          {/* Primary Print Button */}
          <button
            onClick={triggerPrint}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 active:scale-95 text-white transition cursor-pointer shadow-sm"
            title="Print receipt on Epson thermal printer (Ctrl+P)"
          >
            <Printer className="w-3.5 h-3.5 text-emerald-400" />
            <span>Print Slip</span>
            <span className="hidden sm:inline-block text-[10px] text-slate-400 font-mono ml-0.5">Ctrl+P</span>
          </button>
        </div>

        {/* Day selection */}
        <div className="pt-3">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center justify-between">
            <span>Select Day:</span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setSelectedDay(today)}
                className={`px-2.5 py-0.5 rounded-md text-[11px] font-bold transition cursor-pointer ${
                  selectedDay === today
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                Today
              </button>
              <button
                onClick={() => setSelectedDay(tomorrow)}
                className={`px-2.5 py-0.5 rounded-md text-[11px] font-bold transition cursor-pointer ${
                  selectedDay === tomorrow
                    ? 'bg-sky-600 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                Tomorrow
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1 sm:gap-1.5">
            {DAYS_OF_WEEK.map((day) => {
              const isSelected = selectedDay === day;
              return (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={`py-2 px-1 rounded-lg text-xs font-bold transition cursor-pointer text-center border ${
                    isSelected
                      ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                  }`}
                >
                  <span className="sm:hidden">{day.slice(0, 3)}</span>
                  <span className="hidden sm:inline">{day.slice(0, 3)}</span>
                </button>
              );
            })}
          </div>
        </div>

      </header>

      {/* ================= THE EXACT 250PX RECEIPT SLIP PREVIEW ================= */}
      <main className="flex justify-center pb-12">
        <div className="bg-white p-2 sm:p-4 rounded-xl border border-slate-200/80 shadow-sm print:p-0 print:border-none print:shadow-none print:rounded-none">
          <ReceiptSlipContent day={selectedDay} />
        </div>
      </main>

    </div>
  );
};
