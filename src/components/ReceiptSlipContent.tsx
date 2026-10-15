import React from 'react';
import { DayOfWeek } from '../types/timetable';
import { ALL_SESSIONS } from '../data/timetableData';

interface ReceiptSlipContentProps {
  day: DayOfWeek;
}

export const ReceiptSlipContent: React.FC<ReceiptSlipContentProps> = ({ day }) => {
  const mainSessions = ALL_SESSIONS.filter(
    (s) => s.day === day && s.facility === 'main'
  );
  const learnerSessions = ALL_SESSIONS.filter(
    (s) => s.day === day && s.facility === 'learner'
  );
  const healthSessions = ALL_SESSIONS.filter(
    (s) => s.day === day && s.facility === 'health'
  );

  return (
    <div
      id="receipt-print-area"
      className="receipt receipt-slip bg-white text-black text-center w-[250px] max-w-[250px] mx-auto box-border"
      style={{
        width: '250px',
        maxWidth: '250px',
        margin: '0 auto',
        padding: '12px 6px',
        boxSizing: 'border-box',
        textAlign: 'center',
        pageBreakInside: 'avoid',
        fontFamily: '-apple-system, system-ui, sans-serif',
        color: '#000000',
        backgroundColor: '#ffffff',
        fontSize: '14px',
        lineHeight: '1.3',
      }}
    >
      {/* HEADER */}
      <div className="border-t border-dashed border-black pt-1 mb-1"></div>
      <div className="font-bold text-[15px] uppercase tracking-wide text-black">
        MEADOWS LEISURE CENTRE
      </div>
      <div className="text-xs font-medium text-black mt-0.5">
        Maghull • Tel: 0151 288 6727
      </div>
      <div className="border-b border-dashed border-black pb-1 my-1.5"></div>

      {/* DAY TITLE */}
      <div className="my-2 text-center font-bold text-sm tracking-wide uppercase text-black">
        {day.toUpperCase()} TIMES
      </div>

      {/* 1. MAIN POOL */}
      {mainSessions.length > 0 && (
        <div className="mb-2.5">
          <div className="font-bold text-xs text-left border-b border-black pb-0.5 mb-1 tracking-wide uppercase text-black">
            MAIN POOL:
          </div>
          <table className="w-full text-xs text-black border-collapse">
            <tbody>
              {mainSessions.map((session) => (
                <tr key={session.id} className="align-top">
                  <td className="font-bold text-left whitespace-nowrap pr-1.5 py-0.5 text-black w-[48%]">
                    {session.startTime} - {session.endTime}
                  </td>
                  <td className="font-medium text-right py-0.5 text-black w-[52%]">
                    {session.title}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 2. LEARNER POOL */}
      {learnerSessions.length > 0 && (
        <div className="mb-2.5">
          <div className="font-bold text-xs text-left border-b border-black pb-0.5 mb-1 tracking-wide uppercase text-black">
            LEARNER POOL:
          </div>
          <table className="w-full text-xs text-black border-collapse">
            <tbody>
              {learnerSessions.map((session) => (
                <tr key={session.id} className="align-top">
                  <td className="font-bold text-left whitespace-nowrap pr-1.5 py-0.5 text-black w-[48%]">
                    {session.startTime} - {session.endTime}
                  </td>
                  <td className="font-medium text-right py-0.5 text-black w-[52%]">
                    {session.title}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 3. HEALTH SUITE */}
      {healthSessions.length > 0 && (
        <div className="mb-2.5">
          <div className="font-bold text-xs text-left border-b border-black pb-0.5 mb-1 tracking-wide uppercase text-black">
            HEALTH SUITE (16+):
          </div>
          <table className="w-full text-xs text-black border-collapse">
            <tbody>
              <tr className="align-top">
                <td className="font-bold text-left whitespace-nowrap pr-1.5 py-0.5 text-black w-[48%]">
                  {healthSessions[0].startTime} - {healthSessions[0].endTime}
                </td>
                <td className="font-medium text-right py-0.5 text-black w-[52%]">
                  Sauna & Steam Open
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* FOOTER */}
      <div className="border-t border-dashed border-black pt-1.5 mt-2 text-center text-[11px] font-medium text-black leading-tight">
        <div>activeseftonfitness.co.uk</div>
        <div>Reception: 0151 288 6727</div>
      </div>
      <div className="border-b border-dashed border-black pb-1 mt-1.5"></div>
    </div>
  );
};
