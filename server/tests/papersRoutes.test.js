import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest'; vi.mock('../db.js', () => {
  return {
    default: {
      query: vi.fn()
    }
  };
});
import app from '../app.js';
import pool from '../db.js';
describe('GET /api/papers', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  it('returns papers', async () => {
    pool.query.mockResolvedValueOnce([[
      { id: 1, title: 'Paper A', status: 'to_read' },
      { id: 2, title: 'Paper B', status: 'reading' }
    ]]);
    const response = await request(app).get('/api/papers'); expect(response.status).toBe(200);
    expect(response.body).toHaveLength(2);
    expect(response.body[0].title).toBe('Paper A');
  });
  it('handles database errors', async () => {
    pool.query.mockRejectedValueOnce(new Error('DB failed'));
    const response = await request(app).get('/api/papers');
    expect(response.status).toBe(500);
    expect(response.body.error).toBe('Failed to fetch papers.');
  });
});
