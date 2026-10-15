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
      <td style="text-align: left; font-weight: 400; white-space: nowrap; padding: 3px 0; vertical-align: top;">${s.startTime} - ${s.endTime}</td>
      <td style="text-align: right; font-weight: 400; padding: 3px 0; vertical-align: top;">${s.title}</td>
    </tr>`
  ).join('');

  // Generate table rows for learner pool
  const learnerRows = learnerSessions.map(
    (s) => `
    <tr>
      <td style="text-align: left; font-weight: 400; white-space: nowrap; padding: 3px 0; vertical-align: top;">${s.startTime} - ${s.endTime}</td>
      <td style="text-align: right; font-weight: 400; padding: 3px 0; vertical-align: top;">${s.title}</td>
    </tr>`
  ).join('');

  // Generate table row for health suite
  const healthRows = healthSessions.length > 0 ? `
    <tr>
      <td style="text-align: left; font-weight: 400; white-space: nowrap; padding: 3px 0; vertical-align: top;">${healthSessions[0].startTime} - ${healthSessions[0].endTime}</td>
      <td style="text-align: right; font-weight: 400; padding: 3px 0; vertical-align: top;">Sauna & Steam</td>
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
      font-family: 'Helvetica Neue', Helvetica, Arial, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
      overflow-x: hidden !important; 
      -webkit-font-smoothing: antialiased;
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
    .section-title { 
      font-weight: 700; 
      font-size: 14px; 
      text-align: left; 
      margin-bottom: 8px; 
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
  </style>
</head>
<body>
  <div class="receipt">
    <div style="font-size: 36pt; font-weight: 700; line-height: 1; letter-spacing: -0.035em; text-align: center; white-space: nowrap; margin-bottom: 6px;">
      ${day}
    </div>
    <div style="margin-bottom: 24px; text-align: center;">
      <div style="font-weight: 600; font-size: 13px; line-height: 1.25;">Meadows Leisure Centre</div>
      <div style="font-size: 11px; font-weight: 400; margin-top: 2px;">Maghull</div>
    </div>

    ${mainSessions.length > 0 ? `
    <div style="margin-bottom: 20px; text-align: left;">
      <div class="section-title">Main Pool</div>
      <table>${mainRows}</table>
    </div>` : ''}

    ${learnerSessions.length > 0 ? `
    <div style="margin-bottom: 20px; text-align: left;">
      <div class="section-title">Learner Pool</div>
      <table>${learnerRows}</table>
    </div>` : ''}

    ${healthSessions.length > 0 ? `
    <div style="margin-bottom: 20px; text-align: left;">
      <div class="section-title">Health Suite (16+)</div>
      <table>${healthRows}</table>
    </div>` : ''}

    <div style="font-size: 12px; font-weight: 500; margin-top: 28px; text-align: center;">activeseftonfitness.co.uk</div>
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
