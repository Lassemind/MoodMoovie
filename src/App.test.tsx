import { describe, it, expect } from 'vitest';
import { screen, render } from './test/test-utils';
import App from './App';

describe('App', () => {
  it('renders the app with routing', () => {
    render(<App />);

    // Check if the app renders without crashing and shows the mood input page
    const headingElement = screen.getByText('Wie fühlst du dich gerade?');
    expect(headingElement).toBeInTheDocument();
  });
});