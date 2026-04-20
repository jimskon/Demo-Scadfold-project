export const ALLOWED_STATUS = ['to_read', 'reading', 'read'];
export function normalizePaper(body) {
  return {
    title: body.title?.trim() || '',
    authors: body.authors?.trim() || null,
    year:
      body.year === '' || body.year === undefined || body.year === null
        ? null
        : Number(body.year),
    url: body.url?.trim() || null,
    status: body.status?.trim() || 'to_read',
    tags: body.tags?.trim() || null,
    summary: body.summary?.trim() || null,
    notes: body.notes?.trim() || null,
    date_read:
      body.date_read === '' || body.date_read === undefined || body.date_read === null
        ? null
        : body.date_read
  };
}
export function validatePaper(paper) {
  const errors = {};  if (!paper.title) {
    errors.title = 'Title is required.';
  }  if (
    paper.year !== null &&
    (!Number.isInteger(paper.year) || paper.year < 0 || paper.year > 3000)
  ) {
    errors.year = 'Year must be a whole number between 0 and 3000.';
  }  if (!ALLOWED_STATUS.includes(paper.status)) {
    errors.status = `Status must be one of: ${ALLOWED_STATUS.join(', ')}`;
  }  return errors;
}