import type { APIRoute } from 'astro';
import { upcomingCalendarItems } from '@/lib/content';
import { SITE } from '@/config';

/**
 * calendar.ics — an iCalendar (RFC 5545) content-calendar feed of UPCOMING content.
 *
 * The item set (upcoming videos + standalone articles, companions folded in) comes from
 * `upcomingCalendarItems()` in src/lib/content.ts — the single source of truth shared with
 * the human-facing /calendar page. That helper is the deliberate inverse of the prod publish
 * gates: it surfaces the FUTURE-dated content those gates hide.
 *
 * As each publish instant passes, a rebuild drops that item off the feed (the cron in
 * deploy.yml rebuilds every 15 min; Google re-polls the URL on its own schedule, typically
 * every few hours to a day).
 *
 * Subscribe in Google Calendar: Other calendars → From URL → https://prostdev.com/calendar.ics
 */
export const GET: APIRoute = async () => {
  const now = new Date();
  const items = await upcomingCalendarItems(now);
  const dtstamp = toICSDateTimeUTC(now);

  const lines: string[] = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//ProstDev//Content Calendar//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    `X-WR-CALNAME:${esc(`${SITE.name} — Upcoming content`)}`,
    `X-WR-CALDESC:${esc('Scheduled MuleSoft videos & articles from prostdev.com')}`,
    'X-WR-TIMEZONE:UTC',
  ];

  for (const item of items) {
    const start = item.date;
    const emoji = item.kind === 'video' ? '🎥' : '📄';
    const summary = `${emoji} ${item.title}`;
    const descTail = item.companion
      ? `\n\n📄 Companion article: ${item.title === item.companion.title ? '' : item.companion.title + ' — '}${SITE.url}${item.companion.url}`
      : '';

    lines.push('BEGIN:VEVENT');
    lines.push(`UID:${item.kind}-${slugForUid(item.url)}@prostdev.com`);
    lines.push(`DTSTAMP:${dtstamp}`);

    if (item.dateOnly) {
      // All-day event: DTEND is exclusive (the next day).
      const end = new Date(start.getTime() + 24 * 60 * 60 * 1000);
      lines.push(`DTSTART;VALUE=DATE:${toICSDate(start)}`);
      lines.push(`DTEND;VALUE=DATE:${toICSDate(end)}`);
    } else {
      // Timed event: a nominal 30-minute block at the publish instant (UTC).
      const end = new Date(start.getTime() + 30 * 60 * 1000);
      lines.push(`DTSTART:${toICSDateTimeUTC(start)}`);
      lines.push(`DTEND:${toICSDateTimeUTC(end)}`);
    }

    lines.push(`SUMMARY:${esc(summary)}`);
    lines.push(`DESCRIPTION:${esc(`${item.description}${descTail}\n\n${item.url}`)}`);
    lines.push(`URL:${item.url}`);
    lines.push('END:VEVENT');
  }

  lines.push('END:VCALENDAR');

  // RFC 5545 wants CRLF line endings and long lines folded at 75 octets.
  const body = lines.map(fold).join('\r\n') + '\r\n';

  return new Response(body, {
    headers: { 'Content-Type': 'text/calendar; charset=utf-8' },
  });
};

/** A stable UID fragment from the item's URL (last path segment or the youtube id). */
function slugForUid(url: string): string {
  const v = url.match(/[?&]v=([^&]+)/);
  if (v) return v[1];
  return url.replace(/\/+$/, '').split('/').pop() ?? url;
}

/** Escape a TEXT value per RFC 5545 §3.3.11 (backslash, semicolon, comma, newline). */
function esc(text: string): string {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\r?\n/g, '\\n');
}

const pad = (n: number) => String(n).padStart(2, '0');

/** UTC date-time in iCal basic format: YYYYMMDDTHHMMSSZ. */
function toICSDateTimeUTC(d: Date): string {
  return (
    `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}` +
    `T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}${pad(d.getUTCSeconds())}Z`
  );
}

/** UTC date-only in iCal basic format: YYYYMMDD. */
function toICSDate(d: Date): string {
  return `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}`;
}

/** Fold a content line to <=75 octets with CRLF + a single leading space (RFC 5545 §3.1). */
function fold(line: string): string {
  if (line.length <= 75) return line;
  const parts: string[] = [line.slice(0, 75)];
  let i = 75;
  while (i < line.length) {
    parts.push(' ' + line.slice(i, i + 74));
    i += 74;
  }
  return parts.join('\r\n');
}
