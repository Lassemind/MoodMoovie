import { describe, it, expect } from 'vitest';
import { screen, fireEvent, render } from '../test/test-utils';
import MoodInput from './MoodInput';

describe('MoodInput', () => {
  it('renders the mood input form', () => {
    render(<MoodInput />);

    // Check if the heading is present
    const headingElement = screen.getByText('Wie fühlst du dich gerade?');
    expect(headingElement).toBeInTheDocument();

    // Check if the input field is present
    const inputElement = screen.getByPlaceholderText(/z\.B\. 'Ich bin melancholisch'/i);
    expect(inputElement).toBeInTheDocument();

    // Check if the submit button is present
    const buttonElement = screen.getByRole('button', { name: /filme entdecken/i });
    expect(buttonElement).toBeInTheDocument();
  });

  it('handles input changes correctly', () => {
    render(<MoodInput />);

    const inputElement = screen.getByPlaceholderText(/z\.B\. 'Ich bin melancholisch'/i);
    fireEvent.change(inputElement, { target: { value: 'glücklich' } });

    expect(inputElement).toHaveValue('glücklich');
  });

  it('submit button is disabled when input is empty', () => {
    render(<MoodInput />);

    const buttonElement = screen.getByRole('button', { name: /filme entdecken/i });
    expect(buttonElement).toBeDisabled();
  });

  it('submit button is enabled when input has value', () => {
    render(<MoodInput />);

    const inputElement = screen.getByPlaceholderText(/z\.B\. 'Ich bin melancholisch'/i);
    const buttonElement = screen.getByRole('button', { name: /filme entdecken/i });

    fireEvent.change(inputElement, { target: { value: 'glücklich' } });
    expect(buttonElement).not.toBeDisabled();
  });
}); 