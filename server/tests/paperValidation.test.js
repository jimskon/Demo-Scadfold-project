import { describe, it, expect } from 'vitest';
import { normalizePaper, validatePaper } from '../utils/paperValidation.js';describe('normalizePaper', () => {
  it('trims strings and converts blank values to null', () => {
    const result = normalizePaper({
      title: '  Test Paper  ',
      authors: '  Jane Doe  ',
      year: '',
      url: '   ',
      status: 'reading',
      tags: '',
      summary: '',
      notes: '  some notes  ',
      date_read: ''
    });    expect(result).toEqual({
      title: 'Test Paper',
      authors: 'Jane Doe',
      year: null,
      url: null,
      status: 'reading',
      tags: null,
      summary: null,
      notes: 'some notes',
      date_read: null
    });
  });
});describe('validatePaper', () => {
  it('requires a title', () => {
    const errors = validatePaper({
      title: '',
      year: 2024,
      status: 'to_read'
    });    expect(errors.title).toBe('Title is required.');
  });  it('rejects invalid year', () => {
    const errors = validatePaper({
      title: 'Good Paper',
      year: 4000,
      status: 'to_read'
    });    expect(errors.year).toBe('Year must be a whole number between 0 and 3000.');
  });  it('rejects invalid status', () => {
    const errors = validatePaper({
      title: 'Good Paper',
      year: 2024,
      status: 'done'
    });    expect(errors.status).toMatch(/Status must be one of/);
  });  it('accepts valid paper data', () => {
    const errors = validatePaper({
      title: 'Good Paper',
      year: 2024,
      status: 'reading'
    });    expect(errors).toEqual({});
  });
});