import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, waitFor, cleanup } from '@testing-library/react';
import App from './App';

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe('App', () => {
  it('shows loading initially', () => {
    vi.stubGlobal('fetch', vi.fn(() => new Promise(() => {})));

    render(<App />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('renders papers after fetch succeeds', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve([
              {
                id: 1,
                title: 'Testing Paper',
                authors: 'A. Author',
                year: 2024,
                status: 'reading'
              }
            ])
        })
      )
    );

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('Testing Paper')).toBeInTheDocument();
    });
  });

it('shows error if fetch fails', async () => {
  vi.stubGlobal(
    'fetch',
    vi.fn(() => Promise.reject(new Error('Network error')))
  );

  render(<App />);

  await waitFor(() => {
    expect(screen.getByRole('alert')).toHaveTextContent(/could not load papers/i);
  });
});
});