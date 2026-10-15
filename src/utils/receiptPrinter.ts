import { DayOfWeek } from '../types/timetable';
import { ALL_SESSIONS } from '../data/timetableData';

/**
 * Generates minimal, high-contrast HTML tailored specifically
 * for Epson and thermal receipt printers (250px width).
 */
export function generateReceiptHtml(day: DayOfWeek): string {
  const mainSessions = ALL_SESSIONS.filter(
    (s) => s.day === day && s.facility === 'main'
  );
  const learnerSessions = ALL_SESSIONS.filter(
    (s) => s.day === day && s.facility === 'learner'
  );
  const healthSessions = ALL_SESSIONS.filter(
    (s) => s.day === day && s.facility === 'health'
  );

  const mainRowsHtml = mainSessions
    .map(
      (s) => `<tr>
        <td class="time">${s.startTime} - ${s.endTime}</td>
        <td class="desc">${s.title}</td>
      </tr>`
    )
    .join('');

  const learnerRowsHtml = learnerSessions
    .map(
      (s) => `<tr>
        <td class="time">${s.startTime} - ${s.endTime}</td>
        <td class="desc">${s.title}</td>
      </tr>`
    )
    .join('');

  const healthRowHtml =
    healthSessions.length > 0
      ? `<tr>
          <td class="time">${healthSessions[0].startTime} - ${healthSessions[0].endTime}</td>
          <td class="desc">Sauna & Steam</td>
        </tr>`
      : '';

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>${day} Times - Meadows Leisure Centre Receipt</title>
  <style>
    @page {
      margin: 0;
    }
    html, body {
      margin: 0 !important;
      padding: 0 !important;
      width: 100% !important;
      background: white;
      color: black;
      font-family: 'Helvetica Neue', Helvetica, Arial, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      overflow-x: hidden !important;
      -webkit-font-smoothing: antialiased;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    .receipt {
      width: 250px;
      max-width: 250px;
      margin: 0 auto !important;
      padding: 16px 8px 24px 8px;
      box-sizing: border-box;
      text-align: center;
      page-break-inside: avoid;
      color: #000000;
      font-size: 13.5px;
      line-height: 1.35;
    }
    .day-feature {
      font-size: 36pt;
      font-weight: 700;
      line-height: 1;
      letter-spacing: -0.035em;
      text-align: center;
      white-space: nowrap;
      margin-bottom: 6px;
    }
    .header-group {
      margin-bottom: 24px;
      text-align: center;
    }
    .header-title {
      font-size: 13px;
      font-weight: 600;
      margin: 0;
      line-height: 1.25;
    }
    .header-sub {
      font-size: 11px;
      font-weight: 400;
      margin: 2px 0 0 0;
    }
    .section-group {
      margin-bottom: 20px;
      text-align: left;
    }
    .section-title {
      font-size: 14px;
      font-weight: 700;
      text-align: left;
      margin: 0 0 8px 0;
    }
    table {
      width: 100%;
      margin: 0 auto !important;
      border-collapse: collapse;
      font-size: 13px;
    }
    table td {
      padding: 3px 0;
      vertical-align: top;
      line-height: 1.3;
    }
    table .time {
      font-weight: 400;
      white-space: nowrap;
      text-align: left;
      width: 46%;
      padding-right: 6px;
      font-variant-numeric: tabular-nums;
    }
    table .desc {
      font-weight: 400;
      text-align: right;
      width: 54%;
    }
    .footer {
      margin-top: 28px;
      font-size: 12px;
      font-weight: 500;
      line-height: 1.3;
      text-align: center;
    }
    .no-print-bar {
      text-align: center;
      padding: 10px 0 4px 0;
    }
    .print-btn {
      background: #000000;
      color: #ffffff;
      border: none;
      padding: 6px 14px;
      font-size: 12px;
      font-weight: 600;
      border-radius: 4px;
      cursor: pointer;
      font-family: inherit;
    }
    @media print {
      .no-print {
        display: none !important;
      }
    }
  </style>
  <script>
    window.onload = function() {
      setTimeout(() => {
        window.print();
        window.close();
      }, 500);
    };
  </script>
</head>
<body>
  <div class="no-print no-print-bar">
    <button class="print-btn" onclick="window.print()">🖨️ Print Slip</button>
  </div>
  <div class="receipt">
    <div class="day-feature">${day}</div>
    <div class="header-group">
      <div class="header-title">Meadows Leisure Centre</div>
      <div class="header-sub">Maghull</div>
    </div>

    ${
      mainSessions.length > 0
        ? `<div class="section-group">
             <div class="section-title">Main Pool</div>
             <table>
               <tbody>
                 ${mainRowsHtml}
               </tbody>
             </table>
           </div>`
        : ''
    }

    ${
      learnerSessions.length > 0
        ? `<div class="section-group">
             <div class="section-title">Learner Pool</div>
             <table>
               <tbody>
                 ${learnerRowsHtml}
               </tbody>
             </table>
           </div>`
        : ''
    }

    ${
      healthSessions.length > 0
        ? `<div class="section-group">
             <div class="section-title">Health Suite (16+)</div>
             <table>
               <tbody>
                 ${healthRowHtml}
               </tbody>
             </table>
           </div>`
        : ''
    }

    <div class="footer">
      activeseftonfitness.co.uk
    </div>
  </div>
</body>
</html>`;
}

/**
 * Triggers thermal receipt printing using an isolated popup print handler.
 * If popups are blocked by the browser environment, falls back seamlessly
 * to a hidden iframe print handler or standard window.print().
 */
export function printThermalReceipt(day: DayOfWeek): boolean {
  const html = generateReceiptHtml(day);

  // 1. Primary: Isolated popup window
  try {
    const win = window.open('', '_blank', 'width=400,height=600');
    if (win && !win.closed) {
      win.document.open();
      win.document.write(html);
      win.document.close();
      return true;
    }
  } catch (err) {
    console.warn('Popup print blocked or failed, falling back to hidden iframe:', err);
  }

  // 2. Secondary fallback: Hidden iframe print handler
  try {
    const iframeId = 'thermal-receipt-print-frame';
    let frame = document.getElementById(iframeId) as HTMLIFrameElement;
    if (frame) {
      frame.remove();
    }
    frame = document.createElement('iframe');
    frame.id = iframeId;
    frame.style.position = 'fixed';
    frame.style.right = '0';
    frame.style.bottom = '0';
    frame.style.width = '0';
    frame.style.height = '0';
    frame.style.border = '0';
    document.body.appendChild(frame);

    const doc = frame.contentWindow?.document;
    if (doc) {
      doc.open();
      doc.write(html);
      doc.close();
      setTimeout(() => {
        try {
          frame.contentWindow?.focus();
          frame.contentWindow?.print();
        } catch (e) {
          console.warn('Iframe print error, falling back to window.print():', e);
          window.print();
        }
      }, 500);
      return true;
    }
  } catch (err) {
    console.warn('Iframe printing failed, using direct window.print:', err);
  }

  // 3. Fallback: window.print()
  window.print();
  return true;
}
