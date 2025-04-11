import '@testing-library/jest-dom';
import { expect, afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

// Mock Chakra UI components
vi.mock('@chakra-ui/react', () => ({
  ChakraProvider: ({ children }: { children: React.ReactNode }) => children,
  Box: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Button: ({ children, ...props }: { children: React.ReactNode; [key: string]: any }) => (
    <button {...props}>{children}</button>
  ),
  Container: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Heading: ({ children }: { children: React.ReactNode }) => <h1>{children}</h1>,
  Input: (props: any) => <input {...props} />,
  VStack: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Text: ({ children }: { children: React.ReactNode }) => <span>{children}</span>,
  useColorModeValue: () => 'gray.50',
  useToast: () => ({
    toast: vi.fn(),
  }),
}));

// Extend expect with jest-dom matchers
expect.extend({
  toBeInTheDocument: require('@testing-library/jest-dom').toBeInTheDocument,
  toHaveTextContent: require('@testing-library/jest-dom').toHaveTextContent,
  toHaveAttribute: require('@testing-library/jest-dom').toHaveAttribute,
});

// Cleanup after each test
afterEach(() => {
  vi.clearAllMocks();
}); 