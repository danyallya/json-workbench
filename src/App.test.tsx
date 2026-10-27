import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import App from './App';

afterEach(cleanup);

describe('Vanta JSON Workbench', () => {
  it('renders its local data workspace', () => {
    render(<App />);
    expect(screen.getByRole('heading', { name: /Shape your data/i })).toBeInTheDocument();
  });

  it('keeps the active document source separate when switching files', () => {
    render(<App />);
    const editor = screen.getByRole('textbox', { name: /JSON source editor/i });
    fireEvent.change(editor, { target: { value: '{"draft":true}' } });

    fireEvent.click(screen.getByRole('button', { name: /routing-rules.json/i }));
    expect((editor as HTMLTextAreaElement).value).toContain('defaultRegion');

    fireEvent.click(screen.getByRole('button', { name: /release-config.json/i }));
    expect(editor).toHaveValue('{"draft":true}');
  });
});
