/**
 * Builds an "Add to Google Calendar" link — one tap on this URL creates the
 * event directly in the admin's own Google Calendar with the right title,
 * date/time, venue and description. This is the pragmatic alternative to a
 * full Google Calendar API integration (which needs OAuth credentials the
 * shop must set up separately); it works today with no keys.
 *
 * Docs: the render URL is Google's official share format.
 */

/** Formats a Date to Google Calendar's compact UTC "YYYYMMDDTHHMMSSZ" form. */
function formatUtc(d: Date): string {
  const pad = (n: number) => n.toString().padStart(2, "0");
  return (
    `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}` +
    `T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}${pad(d.getUTCSeconds())}Z`
  );
}

/**
 * Google will accept a range like `YYYYMMDDTHHMMSSZ/YYYYMMDDTHHMMSSZ`.
 * `startIST` is an IST Date; we default to a 2-hour slot which suits most
 * decoration jobs and shop pickups.
 */
export function googleCalendarUrl(params: {
  title: string;
  startIST: Date;
  durationMinutes?: number;
  details?: string;
  location?: string;
}): string {
  const { title, startIST, durationMinutes = 120, details = "", location = "" } = params;
  const end = new Date(startIST.getTime() + durationMinutes * 60_000);
  const query = new URLSearchParams({
    action: "TEMPLATE",
    text: title,
    dates: `${formatUtc(startIST)}/${formatUtc(end)}`,
    details,
    location,
  });
  return `https://calendar.google.com/calendar/render?${query.toString()}`;
}

/**
 * Parses "yyyy-mm-dd" + a slot like "11:00 AM" / "Morning (8AM-12PM)" into an
 * IST Date. Falls back to 10:00 AM IST when the time is unparseable. Wrong
 * time is better than a broken link.
 */
export function parseISTDateTime(date: string, time?: string | null): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return null;

  let hour = 10;
  let minute = 0;
  if (time) {
    const m = time.match(/(\d{1,2}):?(\d{2})?\s*(AM|PM)?/i);
    if (m) {
      hour = parseInt(m[1], 10);
      minute = m[2] ? parseInt(m[2], 10) : 0;
      const meridian = m[3]?.toUpperCase();
      if (meridian === "PM" && hour < 12) hour += 12;
      if (meridian === "AM" && hour === 12) hour = 0;
    } else if (/morning/i.test(time)) {
      hour = 9;
    } else if (/afternoon/i.test(time)) {
      hour = 13;
    } else if (/evening/i.test(time)) {
      hour = 17;
    } else if (/night/i.test(time)) {
      hour = 19;
    }
  }

  // Construct as IST (UTC+5:30) so the resulting Date's UTC fields are correct.
  const pad = (n: number) => n.toString().padStart(2, "0");
  return new Date(`${date}T${pad(hour)}:${pad(minute)}:00+05:30`);
}
