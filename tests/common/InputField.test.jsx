import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import InputField from '../../src/components/common/InputField';
import ThemeProvider from '../../src/app/providers/ThemeProvider';

// Wrap components in providers to ensure theme context works
const renderWithProviders = (ui) => {
  return render(
    <ThemeProvider>
      {ui}
    </ThemeProvider>
  );
};

describe('InputField Component Primitives', () => {
  it('renders input label and placeholder correctly', () => {
    renderWithProviders(
      <InputField 
        label="Repository URL" 
        placeholder="https://github.com/..." 
        value="" 
        onChange={() => {}} 
      />
    );
    
    expect(screen.getByText('Repository URL')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('https://github.com/...')).toBeInTheDocument();
  });

  it('triggers onChange callback on user typing', () => {
    const handleChange = vi.fn();
    renderWithProviders(
      <InputField 
        label="Username" 
        value="" 
        onChange={handleChange} 
      />
    );

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'johndoe' } });
    
    expect(handleChange).toHaveBeenCalledWith('johndoe');
  });
});
