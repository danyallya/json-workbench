import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import App from './App';

afterEach(cleanup);

describe('Vanta JSON Workbench', () => {
  it('announces stable diagnostics and renders markup as inert highlighted text', () => {
    render(<App />);
    const editor = screen.getByRole('textbox', { name: /JSON source editor/i });
    fireEvent.change(editor, { target: { value: '{\n "x": }' } });
    const diagnostic = screen.getByRole('status');
    expect(diagnostic).toHaveTextContent('line 2, column 7');
    expect(diagnostic.closest('.preview-panel')).toBeNull();
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

  it('formats valid source with Ctrl or Command plus Enter', () => {
    render(<App />);
    const editor = screen.getByRole('textbox', { name: /JSON source editor/i });
    fireEvent.change(editor, { target: { value: '{"compact":true}' } });
    fireEvent.keyDown(editor, { key: 'Enter', ctrlKey: true });

    expect(editor).toHaveValue(`{
  "compact": true
}`);
    expect(screen.getByText(/Document formatted/)).toBeInTheDocument();

    fireEvent.change(editor, { target: { value: '{"command":true}' } });
    fireEvent.keyDown(editor, { key: 'Enter', metaKey: true });
    expect(editor).toHaveValue(`{
  "command": true
}`);
  });

  it('downloads the active source locally with Ctrl or Command plus S', () => {
    render(<App />);
    const editor = screen.getByRole('textbox', { name: /JSON source editor/i });
    const createObjectURL = vi.fn(() => 'blob:local-json');
    const revokeObjectURL = vi.fn();
    const urlDescriptor = Object.getOwnPropertyDescriptor(URL, 'createObjectURL');
    const revokeDescriptor = Object.getOwnPropertyDescriptor(URL, 'revokeObjectURL');
    let downloadedFilename = '';
    Object.defineProperty(URL, 'createObjectURL', { configurable: true, writable: true, value: createObjectURL });
    Object.defineProperty(URL, 'revokeObjectURL', { configurable: true, writable: true, value: revokeObjectURL });
    const click = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(function (this: HTMLAnchorElement) {
      downloadedFilename = this.download;
    });

    try {
      fireEvent.keyDown(editor, { key: 's', ctrlKey: true });

      expect(createObjectURL).toHaveBeenCalledWith(expect.any(Blob));
      expect(downloadedFilename).toBe('release-config.json');
      expect(screen.getByText(/Downloaded release-config.json to this device/)).toBeInTheDocument();

      fireEvent.keyDown(editor, { key: 's', metaKey: true });
      expect(createObjectURL).toHaveBeenCalledTimes(2);
      expect(downloadedFilename).toBe('release-config.json');
    } finally {
      click.mockRestore();
      if (urlDescriptor) Object.defineProperty(URL, 'createObjectURL', urlDescriptor);
      else Reflect.deleteProperty(URL, 'createObjectURL');
      if (revokeDescriptor) Object.defineProperty(URL, 'revokeObjectURL', revokeDescriptor);
      else Reflect.deleteProperty(URL, 'revokeObjectURL');
    }
  });

  it('opens a local JSON file into the in-memory document list', async () => {
    const { container } = render(<App />);
    const input = container.querySelector('input[type="file"]');
    const editor = screen.getByRole('textbox', { name: /JSON source editor/i });
    expect(input).not.toBeNull();
    fireEvent.change(input!, { target: { files: [new File(['{"opened":true}'], 'opened.json', { type: 'application/json' })] } });

    expect(await screen.findByText(/Opened opened.json in this session/)).toBeInTheDocument();
    expect(editor).toHaveValue('{"opened":true}');
    expect(container.querySelector('.file-row.active')).toHaveTextContent('opened.json');
  });

  it('rejects non-JSON and oversized files before reading them', async () => {
    const { container } = render(<App />);
    const input = container.querySelector('input[type="file"]')!;
    fireEvent.change(input, { target: { files: [new File(['{}'], 'notes.txt')] } });
    expect(await screen.findByText(/Choose a \.json file to open/)).toBeInTheDocument();

    fireEvent.change(input, { target: { files: [new File(['x'.repeat(1024 * 1024 + 1)], 'large.json')] } });
    expect(await screen.findByText(/This file is over the 1 MiB limit/)).toBeInTheDocument();
    expect(container.querySelectorAll('.file-row')).toHaveLength(3);
  });

  it('reports a local file read failure without adding a partial document', async () => {
    const { container } = render(<App />);
    const input = container.querySelector('input[type="file"]')!;
    const readAsText = vi.spyOn(FileReader.prototype, 'readAsText').mockImplementation(() => { throw new Error('read failed'); });
    try {
      fireEvent.change(input, { target: { files: [new File(['{}'], 'unreadable.json')] } });
      expect(await screen.findByText(/Unable to read this file in this browser/)).toBeInTheDocument();
      expect(container.querySelectorAll('.file-row')).toHaveLength(3);
    } finally {
      readAsText.mockRestore();
    }
  });

  it('blocks oversized downloads and reports browser download errors', () => {
    render(<App />);
    const editor = screen.getByRole('textbox', { name: /JSON source editor/i });
    fireEvent.change(editor, { target: { value: ' '.repeat(1024 * 1024 + 1) } });
    fireEvent.click(screen.getByRole('button', { name: /Save release-config.json to device/i }));
    expect(screen.getByText(/This document is over the 1 MiB download limit/)).toBeInTheDocument();

    const descriptor = Object.getOwnPropertyDescriptor(URL, 'createObjectURL');
    Object.defineProperty(URL, 'createObjectURL', { configurable: true, writable: true, value: () => { throw new Error('download blocked'); } });
    try {
      fireEvent.change(editor, { target: { value: '{"small":true}' } });
      fireEvent.click(screen.getByRole('button', { name: /Save release-config.json to device/i }));
      expect(screen.getByText(/Unable to download this file in this browser/)).toBeInTheDocument();
    } finally {
      if (descriptor) Object.defineProperty(URL, 'createObjectURL', descriptor);
      else Reflect.deleteProperty(URL, 'createObjectURL');
    }
  });

  it('opens accessible keyboard help with ? and closes it with Escape', () => {
    render(<App />);
    const editor = screen.getByRole('textbox', { name: /JSON source editor/i });
    const helpDisclosure = screen.getByRole('region', { name: /keyboard shortcuts/i, hidden: true });

    fireEvent.keyDown(editor, { key: '?', shiftKey: true });
    expect(helpDisclosure).not.toBeVisible();

    fireEvent.keyDown(screen.getByRole('button', { name: /toggle theme/i }), { key: '?' });
    expect(helpDisclosure).toBeVisible();
    expect(helpDisclosure).toHaveTextContent('Ctrl / ⌘ + Enter');
    expect(helpDisclosure).toHaveTextContent('Ctrl / ⌘ + S');

    fireEvent.keyDown(screen.getByRole('button', { name: /toggle theme/i }), { key: 'Escape' });
    expect(helpDisclosure).not.toBeVisible();
  });
});
