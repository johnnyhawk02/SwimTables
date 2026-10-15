import { DayOfWeek, SwimSession } from '../types/timetable';

export function parseMinutes(timeStr: string): number {
  const [h, m] = timeStr.split(':').map(Number);
  return h * 60 + (m || 0);
}

export function formatTime12h(timeStr: string): string {
  const [h, m] = timeStr.split(':').map(Number);
  const period = h >= 12 ? 'pm' : 'am';
  const displayHour = h % 12 === 0 ? 12 : h % 12;
  const displayMin = m === 0 ? '00' : m < 10 ? `0${m}` : `${m}`;
  return `${displayHour}:${displayMin}${period}`;
}

export function formatTimeRange(start: string, end: string): string {
  return `${formatTime12h(start)} – ${formatTime12h(end)}`;
}

export function calculateDuration(start: string, end: string): string {
  const startM = parseMinutes(start);
  const endM = parseMinutes(end);
  const diffM = endM - startM;
  if (diffM <= 0) return '';
  const hours = Math.floor(diffM / 60);
  const mins = diffM % 60;
  if (hours > 0 && mins > 0) return `${hours}h ${mins}m`;
  if (hours > 0) return `${hours} hr${hours > 1 ? 's' : ''}`;
  return `${mins} mins`;
}

export function getCurrentDayOfWeek(): DayOfWeek {
  const days: DayOfWeek[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dayIndex = new Date().getDay();
  return days[dayIndex];
}

export function getCurrentTimeString(): string {
  const now = new Date();
  const h = String(now.getHours()).padStart(2, '0');
  const m = String(now.getMinutes()).padStart(2, '0');
  return `${h}:${m}`;
}

export function isSessionActive(
  session: SwimSession,
  targetDay: DayOfWeek,
  currentTimeStr: string
): boolean {
  if (session.day !== targetDay) return false;
  const currentM = parseMinutes(currentTimeStr);
  const startM = parseMinutes(session.startTime);
  const endM = parseMinutes(session.endTime);
  return currentM >= startM && currentM < endM;
}

export function isSessionUpcoming(
  session: SwimSession,
  targetDay: DayOfWeek,
  currentTimeStr: string
): boolean {
  if (session.day !== targetDay) return false;
  const currentM = parseMinutes(currentTimeStr);
  const startM = parseMinutes(session.startTime);
  return startM > currentM && startM - currentM <= 90; // Starting within next 90 mins
}

export function generateICalData(session: SwimSession): string {
  // Generate RFC 5545 iCalendar content
  const now = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  const cleanSummary = `${session.title} - ${session.facilityName} (Meadows Leisure Centre)`;
  const description = `${session.description}\\nRestrictions: ${session.ageRestriction || 'None'}\\nTel: 0151 288 6727`;
  const location = 'Meadows Leisure Centre, Hall Lane, Maghull, Liverpool L31 7BB';

  return `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Meadows Leisure Centre//Swim Timetable//EN
CALSCALE:GREGORIAN
BEGIN:VEVENT
UID:${session.id}-${Date.now()}@meadowsleisure.co.uk
DTSTAMP:${now}
SUMMARY:${cleanSummary}
DESCRIPTION:${description}
LOCATION:${location}
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;
}

export function downloadCalendarEvent(session: SwimSession) {
  const icsData = generateICalData(session);
  const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${session.title.replace(/\s+/g, '_')}_${session.day}.ics`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function getGoogleCalendarUrl(session: SwimSession): string {
  const text = encodeURIComponent(`${session.title} - ${session.facilityName} (Meadows)`);
  const details = encodeURIComponent(
    `${session.description}\nNotes: ${session.priceNote || ''}\nLocation: Meadows Leisure Centre, Hall Lane, Maghull, Liverpool L31 7BB\nTel: 0151 288 6727`
  );
  const location = encodeURIComponent('Meadows Leisure Centre, Hall Lane, Maghull, Liverpool L31 7BB');
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${text}&details=${details}&location=${location}`;
}
