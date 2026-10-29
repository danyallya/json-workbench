import { useMemo, useRef, useState, type KeyboardEvent } from 'react';
import { tokenizeJson } from './domain/jsonSyntax';
import * as Tabs from '@radix-ui/react-tabs';
import { FiCheck, FiChevronDown, FiCopy, FiDownload, FiFileText, FiFolder, FiGitMerge, FiHash, FiHelpCircle, FiMoon, FiPlus, FiSearch, FiSettings, FiShield, FiSun, FiTerminal, FiZap } from 'react-icons/fi';
import { initialDocuments } from './data/sampleDocuments';
import { getJsonRootSummary, parseJsonDocument } from './domain/jsonDocument';
export default function App() {
  const [documents, setDocuments] = useState(initialDocuments); const [activeDocumentId, setActiveDocumentId] = useState(initialDocuments[0].id); const [dark, setDark] = useState(true); const [notice, setNotice] = useState('');
  const shortcutsHelp = useRef<HTMLDetailsElement>(null);
  const shortcutsSummary = useRef<HTMLElement>(null);
  const activeDocument = documents.find(document => document.id === activeDocumentId) ?? documents[0];
  const { source, name: activeFile } = activeDocument;
  const updateSource = (nextSource: string) => setDocuments(current => current.map(document => document.id === activeDocumentId ? { ...document, source: nextSource } : document));
  const parsed = useMemo(() => parseJsonDocument(source), [source]);
  const rootSummary = parsed.ok ? getJsonRootSummary(parsed.value) : null;
  const announce = (message: string) => { setNotice(message); window.setTimeout(() => setNotice(''), 2500); };
  const pretty = () => { if (parsed.ok) updateSource(JSON.stringify(parsed.value, null, 2)); announce(parsed.ok ? 'Document formatted' : 'Fix the syntax error before formatting'); };
  const save = () => {
    try {
      const url = URL.createObjectURL(new Blob([source], { type: 'application/json;charset=utf-8' }));
      const revokeUrl = URL.revokeObjectURL.bind(URL);
      const link = document.createElement('a');
      link.href = url;
      link.download = activeFile;
      link.hidden = true;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(() => revokeUrl(url), 0);
      announce(`Downloaded ${activeFile} to this device`);
    } catch {
      announce('Unable to download this file in this browser');
    }
  };
  const copy = async () => { try { await navigator.clipboard.writeText(source); setNotice('Copied to clipboard'); } catch { setNotice('Clipboard permission is unavailable'); } window.setTimeout(() => setNotice(''), 2500); };
  const handleShortcuts = (event: KeyboardEvent<HTMLDivElement>) => {
    const modifier = event.ctrlKey || event.metaKey;
    if (modifier && event.key === 'Enter') { event.preventDefault(); pretty(); return; }
    if (modifier && event.key.toLowerCase() === 's') { event.preventDefault(); save(); return; }
    const target = event.target;
    const isEditingText = target instanceof HTMLElement && (target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName));
    if (event.key === '?' && !modifier && !event.altKey && !isEditingText) {
      event.preventDefault();
      if (shortcutsHelp.current) shortcutsHelp.current.open = true;
      shortcutsSummary.current?.focus();
    }
    if (event.key === 'Escape' && shortcutsHelp.current?.open) {
      shortcutsHelp.current.open = false;
      shortcutsSummary.current?.focus();
    }
  };
  return <div className={dark ? 'json-app dark' : 'json-app'} onKeyDown={handleShortcuts}>
    <header className="json-topbar"><div className="json-brand"><div className="json-mark"><FiHash/></div><span>VANTA <small>JSON WORKBENCH</small></span></div><div className="top-crumb"><span>Workspace</span><FiChevronDown/><b>Release engineering</b><FiChevronDown/><b className="crumb-file">{activeFile}</b></div><div className="json-header-actions"><div className="saved"><i/> Local session</div><button aria-label="Toggle theme" className="icon-only" onClick={()=>setDark(v=>!v)}>{dark?<FiSun/>:<FiMoon/>}</button><details className="shortcut-help" ref={shortcutsHelp}><summary aria-label="Keyboard shortcuts" ref={shortcutsSummary} title="Keyboard shortcuts"><FiHelpCircle/><span>Help</span></summary><section className="shortcut-help-panel" role="region" aria-label="Keyboard shortcuts"><h2>Keyboard shortcuts</h2><dl><div><dt>Format JSON</dt><dd><kbd>Ctrl</kbd> / <kbd>⌘</kbd> + <kbd>Enter</kbd></dd></div><div><dt>Save current file</dt><dd><kbd>Ctrl</kbd> / <kbd>⌘</kbd> + <kbd>S</kbd></dd></div><div><dt>Open this help</dt><dd><kbd>?</kbd></dd></div></dl><p>Save downloads the current source to your device. The editor does not send payloads to a server.</p></section></details><button className="share-button" aria-label={`Save ${activeFile} to device`} title="Download the active JSON file" onClick={save}><FiDownload/> Save locally</button><div className="json-avatar">DV</div></div></header>
    <aside className="file-sidebar"><div className="project-label">PROJECT</div><button className="project-select"><span className="folder-icon"><FiFolder/></span><b>aster-api</b><FiChevronDown/></button><div className="file-label">FILES <button aria-label="Add file"><FiPlus/></button></div>{documents.map(document=><button key={document.id} className={'file-row '+(activeDocumentId===document.id?'active':'')} onClick={()=>setActiveDocumentId(document.id)}><span>{'{ }'}</span>{document.name}{activeDocumentId===document.id&&<i/>}</button>)}<div className="sidebar-callout"><FiShield/><b>Private by design</b><p>Your payload stays in this browser session. Nothing is sent to a server.</p><a href="#privacy">Learn about privacy</a></div><div className="sidebar-foot"><button><FiSettings/> Preferences</button><button><FiFileText/> Documentation</button></div></aside>
    <main className="json-main"><div className="workbench-heading"><div><div className="eyeline"><span/> LOCAL WORKSPACE <span className="slash">/</span> ASTER API</div><h1>Shape your data.</h1><p>Inspect, validate and compare payloads with precision.</p></div><div className="heading-status"><span className={parsed.ok?'valid-pill':'invalid-pill'} role={parsed.ok?undefined:'status'} aria-live="polite">{parsed.ok?<FiCheck/>:<FiZap/>}{parsed.ok?' Valid document':` Syntax issue · line ${parsed.error.line}, column ${parsed.error.column}`}</span><button className="run-button" onClick={pretty}><FiZap/> Format & validate</button></div></div>
      <div className="editor-toolbar"><Tabs.Root defaultValue="editor" className="workspace-tabs"><Tabs.List aria-label="Workspace views" className="tab-list"><Tabs.Trigger value="editor">Editor</Tabs.Trigger><Tabs.Trigger value="schema">Schema</Tabs.Trigger><Tabs.Trigger value="compare"><FiGitMerge/> Compare</Tabs.Trigger></Tabs.List><div className="editor-tools"><span>{source.split('\n').length} lines <i/> {source.length} chars</span><button onClick={copy} aria-label="Copy JSON"><FiCopy/></button><button onClick={pretty} aria-label="Format JSON"><FiZap/></button></div>
        <Tabs.Content value="editor" className="tab-content"><div className="editor-split"><section className="code-panel"><div className="pane-top"><span><i className="json-file-icon">{'{ }'}</i>{activeFile}</span><span>JSON <FiChevronDown/></span></div><div className="code-editor"><div className="line-numbers">{source.split('\n').map((_,i)=><span key={i}>{String(i+1).padStart(2,'0')}</span>)}</div><textarea spellCheck={false} aria-label="JSON source editor" value={source} onChange={e=>updateSource(e.target.value)}/></div><div className="pane-footer"><span><i/> UTF-8</span><span>Ln {source.split('\n').length}, Col 1</span><span>Spaces: 2</span></div></section><section className="preview-panel"><div className="pane-top"><span>STRUCTURE PREVIEW</span><button className="icon-only" aria-label="Search preview"><FiSearch/></button></div><div className="tree-preview">{parsed.ok?<pre aria-label="Highlighted JSON source">{tokenizeJson(source).map((token,index)=><span key={index} className={`json-token-${token.kind}`}>{token.text}</span>)}</pre>:<div className="error-card"><FiZap/><b>Could not parse document</b><p>{parsed.error.message} Line {parsed.error.line}, column {parsed.error.column}.</p><small>{parsed.error.detail}</small></div>}</div><div className="schema-summary"><span><FiHash/> Root {rootSummary?.type.toLowerCase() ?? 'unavailable'}</span><span>{rootSummary?.itemCount ?? 0} {rootSummary?.type==='Object'?'properties':rootSummary?.type==='Array'?'items':'members'}</span></div></section></div></Tabs.Content>
        <Tabs.Content value="schema" className="tab-content alternate-pane"><div className="empty-state"><div><FiShield/></div><h2>Schema validation</h2><p>Attach a JSON Schema to check contracts, required fields and data types before a payload reaches production.</p><button className="run-button"><FiPlus/> Add a schema</button></div></Tabs.Content>
        <Tabs.Content value="compare" className="tab-content alternate-pane"><div className="empty-state"><div><FiGitMerge/></div><h2>Compare two payloads</h2><p>Open a second document to review added, removed and changed values side by side.</p><button className="run-button"><FiFolder/> Choose a file</button></div></Tabs.Content>
      </Tabs.Root></div><footer className="json-footer"><span><FiTerminal/> Vanta local engine <i/> Session only</span><span aria-live="polite">{notice||'Ready to inspect'} <b>Ctrl/⌘ + Enter format · Ctrl/⌘ + S save · ? help</b></span></footer></main>
  </div>;
}
