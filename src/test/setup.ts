import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Polyfill window.matchMedia if not available in jsdom
if (typeof window !== 'undefined') {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }),
  });
}

// Mock Supabase in unit tests to ensure fast, deterministic offline execution
vi.mock('../config/supabase', () => {
  return {
    isSupabaseConfigured: vi.fn(() => false),
    supabase: {
      from: vi.fn(() => ({
        select: vi.fn().mockReturnThis(),
        insert: vi.fn().mockReturnThis(),
        update: vi.fn().mockReturnThis(),
        delete: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: null, error: new Error('Database offline') }),
      })),
    },
    default: {},
  };
});
