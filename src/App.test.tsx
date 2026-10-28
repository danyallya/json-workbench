import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import App from './App';

afterEach(cleanup);

describe('Vanta JSON Workbench', () => {
  it('announces stable diagnostics and renders markup as inert highlighted text', () => {
    render(<App />);
    const editor = screen.getByRole('textbox', { name: /JSON source editor/i });
    fireEvent.change(editor, { target: { value: '{\n "x": }' } });
    expect(screen.getByRole('status')).toHaveTextContent('Line 2, column 7');
    fireEvent.change(editor, { target: { value: '{"html":"<img src=x onerror=alert(1)>"}' } });
    const preview = screen.getByLabelText('Highlighted JSON source');
    expect(preview).toHaveTextContent('<img src=x onerror=alert(1)>');
    expect(preview.querySelector('img')).toBeNull();
  });
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
