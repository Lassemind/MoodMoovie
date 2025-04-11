import '@testing-library/jest-dom';
import { expect, afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

// Mock Chakra UI
vi.mock('@chakra-ui/react', () => {
  const actual = vi.importActual('@chakra-ui/react');
  return {
    ...actual,
    useToast: () => ({
      toast: vi.fn(),
      closeAll: vi.fn(),
      close: vi.fn(),
      isActive: vi.fn(),
    }),
  };
});

// Extend Vitest's expect method with methods from react-testing-library
expect.extend(matchers);

// Cleanup after each test case
afterEach(() => {
  cleanup();
}); 