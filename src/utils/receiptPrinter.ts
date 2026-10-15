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
          <td class="desc">Sauna & Steam Open</td>
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
      font-family: -apple-system, system-ui, sans-serif;
      overflow-x: hidden !important;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    .receipt {
      width: 250px;
      max-width: 250px;
      margin: 0 auto !important;
      padding: 12px 6px;
      box-sizing: border-box;
      text-align: center;
      page-break-inside: avoid;
      color: #000000;
      font-size: 14px;
      line-height: 1.3;
    }
    .header-title {
      font-size: 15px;
      font-weight: 700;
      margin: 0 0 2px 0;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .header-sub {
      font-size: 12px;
      font-weight: 500;
      margin: 0 0 4px 0;
    }
    .divider {
      border-top: 1px dashed #000000;
      margin: 6px 0;
    }
    .day-title {
      font-size: 14px;
      font-weight: 700;
      margin: 6px 0;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .section-title {
      font-size: 13px;
      font-weight: 700;
      text-align: left;
      border-bottom: 1px solid #000000;
      padding-bottom: 2px;
      margin: 8px 0 3px 0;
      letter-spacing: 0.3px;
    }
    table {
      width: 100%;
      margin: 0 auto !important;
      border-collapse: collapse;
      font-size: 13px;
    }
    table td {
      padding: 2.5px 0;
      vertical-align: top;
    }
    table .time {
      font-weight: 700;
      white-space: nowrap;
      text-align: left;
      width: 48%;
      padding-right: 4px;
    }
    table .desc {
      font-weight: 500;
      text-align: right;
      width: 52%;
    }
    .footer {
      margin-top: 8px;
      font-size: 11px;
      font-weight: 500;
      line-height: 1.35;
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
      font-weight: bold;
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
    <div class="divider"></div>
    <div class="header-title">MEADOWS LEISURE CENTRE</div>
    <div class="header-sub">Maghull • Tel: 0151 288 6727</div>
    <div class="divider"></div>

    <div class="day-title">${day.toUpperCase()} TIMES</div>

    ${
      mainSessions.length > 0
        ? `<div class="section-title">MAIN POOL:</div>
           <table>
             <tbody>
               ${mainRowsHtml}
             </tbody>
           </table>`
        : ''
    }

    ${
      learnerSessions.length > 0
        ? `<div class="section-title">LEARNER POOL:</div>
           <table>
             <tbody>
               ${learnerRowsHtml}
             </tbody>
           </table>`
        : ''
    }

    ${
      healthSessions.length > 0
        ? `<div class="section-title">HEALTH SUITE (16+):</div>
           <table>
             <tbody>
               ${healthRowHtml}
             </tbody>
           </table>`
        : ''
    }

    <div class="divider"></div>
    <div class="footer">
      activeseftonfitness.co.uk<br />
      Reception: 0151 288 6727
    </div>
    <div class="divider"></div>
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
