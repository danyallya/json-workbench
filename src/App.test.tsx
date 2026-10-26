import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';
describe('Vanta JSON Workbench', () => {
  it('renders its local data workspace', () => {
    render(<App />);
    expect(screen.getByRole('heading', { name: /Shape your data/i })).toBeInTheDocument();
  });
});
