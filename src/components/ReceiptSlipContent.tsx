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
      className="receipt receipt-slip bg-white text-black text-center w-[250px] max-w-[250px] mx-auto box-border select-none"
      style={{
        width: '250px',
        maxWidth: '250px',
        margin: '0 auto',
        padding: '16px 8px 24px 8px',
        boxSizing: 'border-box',
        textAlign: 'center',
        pageBreakInside: 'avoid',
        fontFamily: "'Helvetica Neue', Helvetica, Arial, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        color: '#000000',
        backgroundColor: '#ffffff',
        fontSize: '13.5px',
        lineHeight: '1.35',
        WebkitFontSmoothing: 'antialiased',
      }}
    >
      {/* FULL WORD FOR THE DAY IN 36 POINT FONT BOLD */}
      <div
        className="font-bold text-black leading-none text-center whitespace-nowrap mb-2 tracking-[-0.035em] select-none"
        style={{ fontSize: '36pt', fontWeight: 700, lineHeight: 1 }}
      >
        {day}
      </div>

      {/* CENTRE LOCKUP */}
      <header className="mb-6 text-center">
        <h1 className="font-semibold text-[13px] text-black leading-snug m-0">
          Meadows Leisure Centre
        </h1>
        <p className="text-[11px] font-normal text-black mt-0.5 m-0">
          Maghull
        </p>
      </header>

      {/* 1. MAIN POOL - BOLD SECTION TITLE, LARGER READABLE ROWS */}
      {mainSessions.length > 0 && (
        <section className="mb-5 text-left">
          <div className="font-bold text-[14px] text-black mb-2">
            Main Pool
          </div>
          <table className="w-full text-black border-collapse">
            <tbody>
              {mainSessions.map((session) => (
                <tr key={session.id} className="align-top leading-snug">
                  <td className="font-normal text-left whitespace-nowrap pr-2 py-1 text-black w-[46%] tabular-nums text-[13px]">
                    {session.startTime} - {session.endTime}
                  </td>
                  <td className="font-normal text-right py-1 text-black w-[54%] text-[13px]">
                    {session.title}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      {/* 2. LEARNER POOL - BOLD SECTION TITLE, LARGER READABLE ROWS */}
      {learnerSessions.length > 0 && (
        <section className="mb-5 text-left">
          <div className="font-bold text-[14px] text-black mb-2">
            Learner Pool
          </div>
          <table className="w-full text-black border-collapse">
            <tbody>
              {learnerSessions.map((session) => (
                <tr key={session.id} className="align-top leading-snug">
                  <td className="font-normal text-left whitespace-nowrap pr-2 py-1 text-black w-[46%] tabular-nums text-[13px]">
                    {session.startTime} - {session.endTime}
                  </td>
                  <td className="font-normal text-right py-1 text-black w-[54%] text-[13px]">
                    {session.title}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      {/* 3. HEALTH SUITE - BOLD SECTION TITLE, LARGER READABLE ROWS */}
      {healthSessions.length > 0 && (
        <section className="mb-5 text-left">
          <div className="font-bold text-[14px] text-black mb-2">
            Health Suite (16+)
          </div>
          <table className="w-full text-black border-collapse">
            <tbody>
              <tr className="align-top leading-snug">
                <td className="font-normal text-left whitespace-nowrap pr-2 py-1 text-black w-[46%] tabular-nums text-[13px]">
                  {healthSessions[0].startTime} - {healthSessions[0].endTime}
                </td>
                <td className="font-normal text-right py-1 text-black w-[54%] text-[13px]">
                  Sauna &amp; Steam
                </td>
              </tr>
            </tbody>
          </table>
        </section>
      )}

      {/* FOOTER - CLEAN, LARGER FOR THERMAL READABILITY */}
      <footer className="mt-7 pt-1 text-center">
        <span className="text-[12px] font-medium text-black block">
          activeseftonfitness.co.uk
        </span>
      </footer>
    </div>
  );
};
