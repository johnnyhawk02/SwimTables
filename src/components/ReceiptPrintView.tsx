import React, { useState, useEffect } from 'react';
import { DayOfWeek } from '../types/timetable';
import { DAYS_OF_WEEK } from '../data/timetableData';
import { getCurrentDayOfWeek } from '../utils/timeUtils';
import { ReceiptSlipContent } from './ReceiptSlipContent';
import { printThermalReceipt } from '../utils/receiptPrinter';
import { Printer, BookmarkPlus } from 'lucide-react';

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

  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  // PWA Install prompt listener (e.g. Chrome / Edge Save to Taskbar)
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        setDeferredPrompt(null);
      }
    }
  };

  return (
    <div className="bg-[#f5f6f8] min-h-screen text-[#111827] p-3 sm:p-6 antialiased selection:bg-neutral-200">
      
      {/* ================= REFINED NON-PRINTING TOOLBAR ================= */}
      <header className="no-print max-w-xl mx-auto mb-8 bg-white rounded-2xl p-4 sm:p-6 shadow-[0_2px_16px_rgba(0,0,0,0.04)]">
        
        {/* Top Header & Direct Print Action */}
        <div className="flex items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-3">
            <img 
              src="/icon.svg" 
              alt="Meadows Swimming Icon" 
              className="w-9 h-9 rounded-xl shadow-xs shrink-0" 
            />
            <div>
              <h1 className="text-[15px] font-bold text-neutral-900 tracking-tight leading-snug">
                Meadows Leisure Centre
              </h1>
              <p className="text-[11px] text-neutral-400 font-medium tracking-wider uppercase mt-0.5">
                Thermal Slip Print Mode
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {deferredPrompt && (
              <button
                onClick={handleInstallClick}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-neutral-100 hover:bg-neutral-200 text-neutral-800 transition cursor-pointer"
                title="Pin app to taskbar or desktop"
              >
                <BookmarkPlus className="w-3.5 h-3.5 text-neutral-600" />
                <span className="hidden sm:inline">Save to Taskbar</span>
                <span className="sm:hidden">Save</span>
              </button>
            )}

            {/* Primary Print Button */}
            <button
              onClick={triggerPrint}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold bg-neutral-950 hover:bg-neutral-850 active:scale-[0.98] text-white transition cursor-pointer shadow-sm tracking-wide"
              title="Print receipt on Epson thermal printer (Ctrl+P)"
            >
              <Printer className="w-3.5 h-3.5 text-emerald-400" />
              <span>Print Slip</span>
              <span className="hidden sm:inline-block text-[10px] text-neutral-400 font-mono ml-0.5">Ctrl+P</span>
            </button>
          </div>
        </div>

        {/* Day selection */}
        <div>
          <div className="text-[11px] font-semibold text-neutral-400 uppercase tracking-[0.14em] mb-3 flex items-center justify-between">
            <span>Select Day</span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setSelectedDay(today)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition cursor-pointer ${
                  selectedDay === today
                    ? 'bg-neutral-900 text-white'
                    : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-600'
                }`}
              >
                Today
              </button>
              <button
                onClick={() => setSelectedDay(tomorrow)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition cursor-pointer ${
                  selectedDay === tomorrow
                    ? 'bg-neutral-900 text-white'
                    : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-600'
                }`}
              >
                Tomorrow
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1.5">
            {DAYS_OF_WEEK.map((day) => {
              const isSelected = selectedDay === day;
              return (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={`py-2.5 px-1 rounded-xl text-xs transition cursor-pointer text-center ${
                    isSelected
                      ? 'bg-neutral-900 text-white font-semibold shadow-xs'
                      : 'bg-neutral-50 hover:bg-neutral-100 text-neutral-700 font-medium'
                  }`}
                >
                  <span>{day.slice(0, 3)}</span>
                </button>
              );
            })}
          </div>
        </div>

      </header>

      {/* ================= THE EXACT 250PX RECEIPT SLIP PREVIEW ================= */}
      <main className="flex justify-center pb-16">
        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.05)] print:p-0 print:border-none print:shadow-none print:rounded-none">
          <ReceiptSlipContent day={selectedDay} />
        </div>
      </main>

    </div>
  );
};
