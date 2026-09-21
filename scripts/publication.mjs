// Keep one cutoff throughout a build; scheduling uses the same date rules.
export const buildTime = new Date();
export const isReviewPreview = () => ['preview', 'development'].includes(process.env.VERCEL_ENV);

export function publicationDate(value) {
  if (!(value instanceof Date) && (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}(?:T\d{2}:\d{2}:\d{2}(?:\.\d{3})?(?:Z|[+-]\d{2}:\d{2}))?$/.test(value))) {
    throw new Error('Article date must be YYYY-MM-DD or an ISO timestamp with a timezone');
  }
  if (typeof value === 'string') {
    const day = value.slice(0, 10);
    const calendarDate = new Date(`${day}T00:00:00Z`);
    if (!Number.isFinite(+calendarDate) || calendarDate.toISOString().slice(0, 10) !== day) {
      throw new Error('Article publication date must be a real calendar date');
    }
  }
  const date = new Date(value);
  if (!Number.isFinite(+date)) throw new Error('Article publication date must be valid');
  return date;
}

export function articleIsVisible(data, { now = buildTime, preview = isReviewPreview() } = {}) {
  return data.draft === false && (publicationDate(data.date) <= now || preview);
}
