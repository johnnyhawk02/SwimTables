import { DayOfWeek } from '../types/timetable';
import { ALL_SESSIONS } from '../data/timetableData';

export function printThermalReceipt(day: DayOfWeek): void {
  const mainSessions = ALL_SESSIONS.filter(
    (s) => s.day === day && s.facility === 'main'
  );
  const learnerSessions = ALL_SESSIONS.filter(
    (s) => s.day === day && s.facility === 'learner'
  );
  const healthSessions = ALL_SESSIONS.filter(
    (s) => s.day === day && s.facility === 'health'
  );

  // 1. Create a print function that opens an isolated window
  const win = window.open('', '_blank', 'width=400,height=600');
  if (!win) {
    // Fallback if popup is blocked
    window.print();
    return;
  }

  // Generate table rows for main pool
  const mainRows = mainSessions.map(
    (s) => `
    <tr>
      <td style="text-align: left; font-weight: 700; white-space: nowrap; padding: 2px 0; vertical-align: top;">${s.startTime} - ${s.endTime}</td>
      <td style="text-align: right; font-weight: 600; padding: 2px 0; vertical-align: top;">${s.title}</td>
    </tr>`
  ).join('');

  // Generate table rows for learner pool
  const learnerRows = learnerSessions.map(
    (s) => `
    <tr>
      <td style="text-align: left; font-weight: 700; white-space: nowrap; padding: 2px 0; vertical-align: top;">${s.startTime} - ${s.endTime}</td>
      <td style="text-align: right; font-weight: 600; padding: 2px 0; vertical-align: top;">${s.title}${s.ageRestriction?.includes('Families') ? ' (Families)' : ''}</td>
    </tr>`
  ).join('');

  // Generate table row for health suite
  const healthRows = healthSessions.length > 0 ? `
    <tr>
      <td style="text-align: left; font-weight: 700; white-space: nowrap; padding: 2px 0; vertical-align: top;">${healthSessions[0].startTime} - ${healthSessions[0].endTime}</td>
      <td style="text-align: right; font-weight: 600; padding: 2px 0; vertical-align: top;">Sauna & Steam Open</td>
    </tr>` : '';

  // 2. Write minimal HTML document into that window with receipt-optimized print styles
  const receiptHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Receipt - ${day}</title>
  <style>
    @page { margin: 0; }
    html, body { 
      margin: 0 !important; 
      padding: 0 !important; 
      width: 100% !important; 
      background: white; 
      color: black; 
      font-family: -apple-system, system-ui, sans-serif; 
      overflow-x: hidden !important; 
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
      line-height: 1.25;
    }
    .divider {
      border-top: 1px dashed #000000;
      margin: 6px 0;
    }
    .section-title {
      font-weight: 700;
      font-size: 13px;
      text-align: left;
      border-bottom: 1px solid #000000;
      padding-bottom: 2px;
      margin-bottom: 4px;
      letter-spacing: 0.5px;
    }
    table {
      width: 100%;
      margin: 0 auto !important;
      border-collapse: collapse;
      font-size: 12px;
    }
  </style>
</head>
<body>
  <div class="receipt">
    <div style="font-weight: 800; font-size: 15px; letter-spacing: 0.5px;">MEADOWS LEISURE CENTRE</div>
    <div style="font-size: 12px; font-weight: 600; margin-top: 2px;">Maghull • Tel: 0151 288 6727</div>
    <div class="divider"></div>

    <div style="font-weight: 800; font-size: 15px; margin: 6px 0; letter-spacing: 0.5px;">
      *** ${day.toUpperCase()} TIMES ***
    </div>

    ${mainSessions.length > 0 ? `
    <div style="margin-bottom: 8px;">
      <div class="section-title">MAIN POOL:</div>
      <table>${mainRows}</table>
    </div>` : ''}

    ${learnerSessions.length > 0 ? `
    <div style="margin-bottom: 8px;">
      <div class="section-title">LEARNER POOL:</div>
      <table>${learnerRows}</table>
    </div>` : ''}

    ${healthSessions.length > 0 ? `
    <div style="margin-bottom: 8px;">
      <div class="section-title">HEALTH SUITE (16+):</div>
      <table>${healthRows}</table>
    </div>` : ''}

    <div class="divider"></div>
    <div style="font-size: 11px; font-weight: 500; margin-top: 4px;">activeseftonfitness.co.uk</div>
    <div style="font-size: 11px; font-weight: 500;">Reception: 0151 288 6727</div>
  </div>

  <script>
    window.onload = function() { 
      setTimeout(() => { 
        window.print(); 
        window.close(); 
      }, 500); 
    };
  </script>
</body>
</html>`;

  win.document.open();
  win.document.write(receiptHtml);
  win.document.close();
}
