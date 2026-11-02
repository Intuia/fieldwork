import { useDeferredValue, useMemo, useRef, useState } from 'react';
import type { Category, Check, Command, CustomData, Tool } from './types';
import { useCustomChecklist } from './hooks/useCustomChecklist';
import {
  allTools,
  builtCategories,
  builtChecks,
  builtTools,
  checkTools,
  domains,
  matchesSearch,
} from './lib/model';
import { conflictCount, mergeCustomData, parseCustomData } from './lib/customData';
import { categoryMarkdown } from './lib/markdown';
import { copyText } from './lib/clipboard';
import { AddCheckForm } from './components/AddCheckForm';
import { AddCommandForm, CommandRows } from './components/AddCommandForm';
import { CommandPanel } from './components/CommandPanel';
import { ToolsView } from './components/ToolsView';

type Modal =
  | { kind: 'check'; category: Category; check?: Check }
  | { kind: 'command'; checkId: string; command?: Command }
  | { kind: 'category'; category?: Category }
  | { kind: 'tool'; tool?: Tool }
  | { kind: 'tool-command'; tool: Tool; command: Command };
function newId() {
  return 'custom-' + crypto.randomUUID();
}
function download(name: string, content: string, type: string) {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const link = document.createElement('a');
  link.href = url;
  link.download = name;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
function readProgress(): Record<string, boolean> {
  try {
    const value = JSON.parse(localStorage.getItem('checklist.progress.v1') || '{}');
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      return Object.fromEntries(
        Object.entries(value).filter(([, done]) => typeof done === 'boolean'),
      ) as Record<string, boolean>;
    }
  } catch {
    /* Progress can be recovered from a future session. */
  }
  return {};
}
function readTarget(): string {
  try {
    return localStorage.getItem('checklist.target.v1') || '';
  } catch {
    return '';
  }
}

function NamedForm({
  kind,
  initial,
  tools,
  onSave,
  onCancel,
}: {
  kind: 'category' | 'tool';
  initial?: Category | Tool;
  tools: Tool[];
  onSave: (name: string, description: string, commands: Command[]) => void;
  onCancel: () => void;
}) {
  const initialTool = initial && 'tool' in initial ? initial : undefined;
  const [name, setName] = useState(
    initialTool?.tool || (initial && 'name' in initial ? initial.name : ''),
  );
  const [description, setDescription] = useState(initialTool?.description || '');
  const [commands, setCommands] = useState<Command[]>(initialTool?.commands || []);
  const [error, setError] = useState('');
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        const cleanName = kind === 'tool' ? name.trim().toLowerCase() : name.trim();
        if (
          kind === 'tool' &&
          tools.some(
            (tool) =>
              tool.tool.toLowerCase() === cleanName && (!initialTool || tool.id !== initialTool.id),
          )
        ) {
          setError('This tool already exists. Attach a custom command to a check instead.');
          return;
        }
        if (cleanName) {
          onSave(cleanName, description, commands);
        }
      }}
    >
      <label>
        {kind === 'tool' ? 'Tool name' : 'Category name'}
        <input required autoFocus value={name} onChange={(event) => setName(event.target.value)} />
      </label>
      {kind === 'tool' && (
        <>
          <label>
            Description
            <input value={description} onChange={(event) => setDescription(event.target.value)} />
          </label>
          <CommandRows rows={commands} onChange={setCommands} />
        </>
      )}
      {error && <p role="alert">{error}</p>}
      <div className="form-actions">
        <button type="submit" className="primary">
          Save {kind}
        </button>
        <button type="button" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
}

export default function App() {
  const { data, updateData, warning } = useCustomChecklist();
  const [progress, setProgress] = useState(readProgress);
  const [target, setTarget] = useState(readTarget);
  const [domain, setDomain] = useState('Web');
  const [view, setView] = useState<'checks' | 'tools'>('checks');
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);
  const [filter, setFilter] = useState('all');
  const [selectedTool, setSelectedTool] = useState('nmap');
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [searchCollapsed, setSearchCollapsed] = useState<Record<string, boolean>>({});
  const [limit, setLimit] = useState(10);
  const [modal, setModal] = useState<Modal | null>(null);
  const [notice, setNotice] = useState('');
  const importInput = useRef<HTMLInputElement>(null);
  const checks = useMemo(
    () => [...builtChecks, ...data.checks.map((check) => ({ ...check, custom: true }))],
    [data.checks],
  );
  const categories = useMemo(() => [...builtCategories, ...data.categories], [data.categories]);
  const tools = useMemo(() => allTools(data), [data]);
  const names = tools.map((tool) => tool.tool).sort();
  const filtered = useMemo(
    () =>
      checks.filter((check) => {
        if (!deferredQuery && check.domain !== domain) {
          return false;
        }
        if (filter === 'done' && !progress[check.id]) {
          return false;
        }
        if (filter === 'pending' && progress[check.id]) {
          return false;
        }
        if (
          filter === 'custom' &&
          !check.custom &&
          !data.commands.some((command) => command.checkId === check.id)
        ) {
          return false;
        }
        if (
          filter === 'commands' &&
          !checkTools(check, data).some((tool) => tool.commands.length > 0)
        ) {
          return false;
        }
        return matchesSearch(check, data, deferredQuery);
      }),
    [checks, data, deferredQuery, domain, filter, progress],
  );
  const visibleCategories = categories.filter((category) => {
    if (!deferredQuery && filter === 'all') {
      return category.domain === domain;
    }
    return filtered.some(
      (check) => check.domain === category.domain && check.category === category.name,
    );
  });
  const domainChecks = checks.filter((check) => check.domain === domain);
  const done = domainChecks.filter((check) => progress[check.id]).length;
  const percent = domainChecks.length ? Math.round((done / domainChecks.length) * 100) : 0;
  function save(next: CustomData) {
    updateData(next);
    setModal(null);
  }
  function toggleDone(id: string) {
    const next = { ...progress, [id]: !progress[id] };
    setProgress(next);
    try {
      localStorage.setItem('checklist.progress.v1', JSON.stringify(next));
    } catch {
      setNotice('Progress could not be saved to browser storage.');
    }
  }
  function changeTarget(value: string) {
    setTarget(value);
    try {
      localStorage.setItem('checklist.target.v1', value);
    } catch {
      setNotice('The current target could not be saved.');
    }
  }
  function deleteCommand(command: Command, tool: Tool) {
    if (!window.confirm('Delete this custom command?')) {
      return;
    }
    if (command.checkId) {
      updateData({ ...data, commands: data.commands.filter((item) => item.id !== command.id) });
    } else {
      updateData({
        ...data,
        tools: data.tools.map((item) =>
          item.id === tool.id
            ? {
                ...item,
                commands: item.commands.filter((itemCommand) => itemCommand.id !== command.id),
              }
            : item,
        ),
      });
    }
  }
  function editCommand(command: Command, tool: Tool) {
    if (command.checkId) {
      setModal({ kind: 'command', checkId: command.checkId, command });
    } else {
      setModal({ kind: 'tool-command', tool, command });
    }
  }
  function deleteCheck(check: Check) {
    if (!window.confirm('Delete this custom check, its commands, and its note?')) {
      return;
    }
    const notes = { ...data.notes };
    delete notes[check.id];
    updateData({
      ...data,
      checks: data.checks.filter((item) => item.id !== check.id),
      commands: data.commands.filter((item) => item.checkId !== check.id),
      notes,
    });
  }
  function deleteCategory(category: Category) {
    if (!window.confirm('Delete this custom category and all of its custom checks?')) {
      return;
    }
    const removed = new Set(
      data.checks
        .filter((check) => check.domain === category.domain && check.category === category.name)
        .map((check) => check.id),
    );
    updateData({
      ...data,
      categories: data.categories.filter((item) => item.id !== category.id),
      checks: data.checks.filter((check) => !removed.has(check.id)),
      commands: data.commands.filter((command) => !removed.has(command.checkId || '')),
      notes: Object.fromEntries(Object.entries(data.notes).filter(([id]) => !removed.has(id))),
    });
  }
  async function importFile(file: File) {
    try {
      if (file.size > 10_000_000) {
        throw new Error('Backup is larger than 10 MB.');
      }
      const incoming = parseCustomData(JSON.parse(await file.text()));
      if (
        incoming.tools.some((tool) =>
          builtTools.some((built) => built.tool.toLowerCase() === tool.tool.toLowerCase()),
        )
      ) {
        throw new Error('A custom tool cannot overwrite a built-in tool. Rename it in the backup.');
      }
      if (
        incoming.categories.some((category) =>
          builtCategories.some(
            (built) => built.domain === category.domain && built.name === category.name,
          ),
        )
      ) {
        throw new Error('A custom category duplicates a built-in category.');
      }
      const conflicts = conflictCount(data, incoming);
      let overwrite = false;
      if (conflicts > 0) {
        overwrite = window.confirm(
          `${conflicts} existing custom items or notes have matching IDs. OK overwrites them; Cancel keeps existing versions and imports only new items.`,
        );
      }
      const merged = mergeCustomData(data, incoming, overwrite);
      const availableCategories = [...builtCategories, ...merged.categories];
      if (
        merged.categories.some((category) => !domains.includes(category.domain)) ||
        merged.checks.some(
          (check) =>
            !availableCategories.some(
              (category) => category.domain === check.domain && category.name === check.category,
            ),
        )
      ) {
        throw new Error(
          'A check references an unknown domain or category. Include its category in the backup.',
        );
      }
      const checkIds = new Set([...builtChecks, ...merged.checks].map((check) => check.id));
      if (merged.commands.some((command) => !checkIds.has(command.checkId || ''))) {
        throw new Error('A custom command references an unknown check.');
      }
      const seenTools = new Set<string>();
      for (const tool of merged.tools) {
        const name = tool.tool.toLowerCase();
        if (seenTools.has(name)) {
          throw new Error('Two custom tool IDs have the same name. Rename one before importing.');
        }
        seenTools.add(name);
      }
      updateData(merged);
      setNotice('Custom items and notes imported.');
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Import failed.');
    }
  }
  async function copyCategory(category: Category) {
    try {
      await copyText(
        categoryMarkdown(
          category.name,
          checks.filter(
            (check) => check.domain === category.domain && check.category === category.name,
          ),
          data,
          progress,
          target,
        ),
      );
      setNotice('Category copied as markdown, including commands and notes.');
    } catch {
      setNotice('Clipboard unavailable. Use Export markdown to download the content.');
    }
  }
  function revealCheck(check: Check) {
    setDomain(check.domain);
    setView('checks');
    setFilter('all');
    setQuery(check.check);
    setLimit(10);
    setExpanded((current) => ({ ...current, [check.id]: true }));
  }
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-mark">
            f<span>↗</span>
          </span>
          <div>
            fieldwork<span className="brand-sub">SECURITY WORKSPACE</span>
          </div>
        </div>
        <p className="sidebar-label">WORKSPACE</p>
        <button
          className={'nav-button ' + (view === 'checks' ? 'active' : '')}
          onClick={() => setView('checks')}
        >
          <span>☷</span> Checklists{' '}
          <span className="nav-count">{checks.length.toLocaleString()}</span>
        </button>
        <button
          className={'nav-button ' + (view === 'tools' ? 'active' : '')}
          onClick={() => setView('tools')}
        >
          <span>⌘</span> Tools <span className="nav-count">{tools.length}</span>
        </button>
        <p className="sidebar-label domain-label">DOMAINS</p>
        {domains.map((name, index) => (
          <button
            key={name}
            className={
              'nav-button ' + (view === 'checks' && domain === name ? 'domain-active' : '')
            }
            onClick={() => {
              setDomain(name);
              setView('checks');
              setQuery('');
              setLimit(10);
            }}
          >
            <span className="domain-icon">{['◎', '◇', '△', '▣', '⌁'][index]}</span>
            {name}
            <span className="nav-count">
              {checks.filter((check) => check.domain === name).length.toLocaleString()}
            </span>
          </button>
        ))}
        <div className="sidebar-bottom">
          <span className="status-dot" /> Stored in this browser<p>Your checks. Your workflow.</p>
        </div>
      </aside>
      <main>
        <header className="topbar">
          <span>
            Workspace <span className="slash">/</span> {view === 'tools' ? 'Tools' : domain}
          </span>
          <span className="local-badge">
            <span className="status-dot" /> LOCAL WORKSPACE
          </span>
        </header>
        <div className="main-content">
          <div className="page-heading">
            <div>
              <div className="eyebrow">
                {view === 'tools'
                  ? 'YOUR COMMAND REFERENCE'
                  : 'A LITTLE STRUCTURE. BETTER COVERAGE.'}
              </div>
              <h1>
                {view === 'tools' ? 'Tools & commands' : 'Security checklists'}
                <span className="accent-dot">.</span>
              </h1>
              <p className="muted">
                {view === 'tools'
                  ? 'Practical commands, connected to the checks that need them.'
                  : 'Keep track of what you tested. Keep the next command close.'}
              </p>
            </div>
            <button
              className="primary"
              onClick={() => setModal(view === 'tools' ? { kind: 'tool' } : { kind: 'category' })}
            >
              {view === 'tools' ? '+ New tool' : '+ New category'}
            </button>
          </div>
          <section className="workspace-bar">
            <label className="target-label">
              <span className="eyebrow">CURRENT TARGET</span>
              <div>
                <span className="target-icon">⌖</span>
                <input
                  value={target}
                  onChange={(event) => changeTarget(event.target.value)}
                  placeholder="Set a hostname, IP, or app identifier"
                  aria-label="Current target"
                />
              </div>
            </label>
            <div className="progress-summary">
              <div>
                <span>{domain} coverage</span>
                <strong>
                  {done.toLocaleString()} <span>/ {domainChecks.length.toLocaleString()}</span>
                </strong>
              </div>
              <div className="progress-track">
                <span style={{ width: percent + '%' }} />
              </div>
              <small>{percent}% complete</small>
            </div>
          </section>
          <div className="toolbar">
            <label className="search">
              <span>⌕</span>
              <input
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setLimit(10);
                  setSearchCollapsed({});
                }}
                placeholder="Search checks, tools, and commands…"
                aria-label="Search checks, tools, and commands"
              />
              {query && (
                <button aria-label="Clear search" onClick={() => setQuery('')}>
                  ×
                </button>
              )}
            </label>
            {view === 'checks' && (
              <select
                aria-label="Filter checks"
                value={filter}
                onChange={(event) => {
                  setFilter(event.target.value);
                  setLimit(10);
                }}
              >
                <option value="all">All checks</option>
                <option value="pending">Pending</option>
                <option value="done">Completed</option>
                <option value="commands">With commands</option>
                <option value="custom">Custom items</option>
              </select>
            )}
            <details className="export-menu">
              <summary>Import / Export ↗</summary>
              <div>
                <button
                  onClick={() =>
                    download(
                      'custom-checklist.json',
                      JSON.stringify(data, null, 2),
                      'application/json',
                    )
                  }
                >
                  Export custom JSON
                </button>
                <button onClick={() => importInput.current?.click()}>Import custom JSON</button>
                <button
                  onClick={() =>
                    download(
                      'checklist.md',
                      visibleCategories
                        .map((category) =>
                          categoryMarkdown(
                            category.domain + ' / ' + category.name,
                            filtered.filter(
                              (check) =>
                                check.domain === category.domain &&
                                check.category === category.name,
                            ),
                            data,
                            progress,
                            target,
                          ),
                        )
                        .join('\n'),
                      'text/markdown',
                    )
                  }
                >
                  Export filtered markdown
                </button>
              </div>
            </details>
            <input
              ref={importInput}
              type="file"
              accept=".json,application/json"
              hidden
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) {
                  void importFile(file);
                }
                event.target.value = '';
              }}
            />
          </div>
          {(notice || warning) && (
            <div className="notice" role="status">
              <span>{warning || notice}</span>
              <button aria-label="Dismiss message" onClick={() => setNotice('')}>
                ×
              </button>
            </div>
          )}
          {view === 'tools' ? (
            <ToolsView
              tools={tools}
              data={data}
              checks={checks}
              selected={selectedTool}
              query={deferredQuery}
              target={target}
              onSelect={setSelectedTool}
              onCheck={revealCheck}
              onNew={() => setModal({ kind: 'tool' })}
              onEditTool={(tool) => setModal({ kind: 'tool', tool })}
              onDeleteTool={(tool) => {
                if (
                  window.confirm(
                    'Delete this custom tool and its library commands? Commands attached directly to checks are kept.',
                  )
                ) {
                  updateData({ ...data, tools: data.tools.filter((item) => item.id !== tool.id) });
                }
              }}
              onEditCommand={editCommand}
              onDeleteCommand={deleteCommand}
            />
          ) : (
            <>
              <div className="results-line">
                <h2>{query ? 'Search results · all domains' : domain + ' checklist'}</h2>
                <span>
                  {filtered.length.toLocaleString()} checks · {visibleCategories.length} categories
                </span>
              </div>
              <div className="categories">
                {visibleCategories.slice(0, limit).map((category) => {
                  const categoryChecks = filtered.filter(
                    (check) => check.domain === category.domain && check.category === category.name,
                  );
                  const allCategoryChecks = checks.filter(
                    (check) => check.domain === category.domain && check.category === category.name,
                  );
                  const completed = allCategoryChecks.filter((check) => progress[check.id]).length;
                  return (
                    <section className="card category-card" key={category.id}>
                      <div className="category-heading">
                        <div className="category-number">
                          {String(categories.indexOf(category) + 1).padStart(2, '0')}
                        </div>
                        <div className="category-title">
                          {query && <span className="eyebrow">{category.domain}</span>}
                          <h3>
                            {category.name}{' '}
                            {category.id.startsWith('custom-') && (
                              <span className="badge">custom</span>
                            )}
                          </h3>
                          <span className="muted small">
                            {completed} of {allCategoryChecks.length} completed
                          </span>
                        </div>
                        <button className="category-copy" onClick={() => copyCategory(category)}>
                          Copy category as markdown
                        </button>
                        {category.id.startsWith('custom-') && (
                          <div className="inline-actions">
                            <button onClick={() => setModal({ kind: 'category', category })}>
                              Edit
                            </button>
                            <button className="danger" onClick={() => deleteCategory(category)}>
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                      <div>
                        {categoryChecks.map((check) => {
                          const linked = checkTools(check, data);
                          const hasTools = linked.length > 0;
                          const isOpen =
                            Boolean(expanded[check.id]) ||
                            (Boolean(deferredQuery) && hasTools && !searchCollapsed[check.id]);
                          return (
                            <article
                              className={'check-item ' + (progress[check.id] ? 'is-done' : '')}
                              id={'check-' + check.id}
                              key={check.id}
                            >
                              <div className="check-line">
                                <input
                                  type="checkbox"
                                  checked={Boolean(progress[check.id])}
                                  onChange={() => toggleDone(check.id)}
                                  aria-label={'Complete: ' + check.check}
                                />
                                <div className="check-content">
                                  <span className="check-text">{check.check}</span>
                                  {check.custom && <span className="badge">custom</span>}
                                  <div className="check-actions">
                                    {hasTools && (
                                      <button
                                        className={'command-toggle ' + (isOpen ? 'open' : '')}
                                        aria-expanded={isOpen}
                                        aria-controls={'commands-' + check.id}
                                        onClick={() => {
                                          setExpanded((current) => ({
                                            ...current,
                                            [check.id]: !isOpen,
                                          }));
                                          setSearchCollapsed((current) => ({
                                            ...current,
                                            [check.id]: isOpen,
                                          }));
                                        }}
                                      >
                                        {'</>'} commands <span>{isOpen ? '−' : '+'}</span>
                                      </button>
                                    )}
                                    <button
                                      onClick={() =>
                                        setModal({ kind: 'command', checkId: check.id })
                                      }
                                    >
                                      + Add command
                                    </button>
                                    <details className="note">
                                      <summary>
                                        {data.notes[check.id] ? 'Edit note' : '+ Note'}
                                      </summary>
                                      <textarea
                                        aria-label={'Note for ' + check.check}
                                        value={data.notes[check.id] || ''}
                                        onChange={(event) =>
                                          updateData({
                                            ...data,
                                            notes: {
                                              ...data.notes,
                                              [check.id]: event.target.value,
                                            },
                                          })
                                        }
                                        placeholder="Evidence, observations, next steps…"
                                      />
                                    </details>
                                    {check.custom && (
                                      <>
                                        <button
                                          onClick={() =>
                                            setModal({ kind: 'check', category, check })
                                          }
                                        >
                                          Edit check
                                        </button>
                                        <button
                                          className="danger"
                                          onClick={() => deleteCheck(check)}
                                        >
                                          Delete check
                                        </button>
                                      </>
                                    )}
                                  </div>
                                </div>
                              </div>
                              {isOpen && (
                                <div id={'commands-' + check.id}>
                                  <CommandPanel
                                    tools={linked}
                                    target={target}
                                    onEdit={editCommand}
                                    onDelete={deleteCommand}
                                  />
                                </div>
                              )}
                            </article>
                          );
                        })}
                      </div>
                      <div className="category-footer">
                        <button onClick={() => setModal({ kind: 'check', category })}>
                          + Add check
                        </button>
                        <span>{categoryChecks.length} checks</span>
                      </div>
                    </section>
                  );
                })}
              </div>
              {visibleCategories.length === 0 && (
                <div className="empty">
                  <h3>No checks found</h3>
                  <p>Try another search or filter, or add a custom category.</p>
                </div>
              )}
              {visibleCategories.length > limit && (
                <button className="load-more" onClick={() => setLimit(limit + 10)}>
                  Show 10 more categories ({visibleCategories.length - limit} remaining)
                </button>
              )}
            </>
          )}
          <footer>
            <span>
              fieldwork <span className="muted">/ your testing companion</span>
            </span>
            <span>Only test targets you are authorized to test.</span>
          </footer>
        </div>
      </main>
      {modal && (
        <div
          className="modal-backdrop"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              setModal(null);
            }
          }}
          onKeyDown={(event) => {
            if (event.key === 'Escape') {
              setModal(null);
            }
          }}
        >
          <section className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
            <div className="section-heading">
              <h2 id="modal-title">
                {modal.kind === 'tool-command'
                  ? 'Edit custom command'
                  : (('check' in modal && modal.check) ||
                    ('command' in modal && modal.command) ||
                    ('tool' in modal && modal.tool) ||
                    ('category' in modal && modal.kind === 'category' && modal.category)
                      ? 'Edit '
                      : 'Add ') + modal.kind}
              </h2>
              <button aria-label="Close form" onClick={() => setModal(null)}>
                ×
              </button>
            </div>
            {modal.kind === 'check' && (
              <AddCheckForm
                tools={names}
                initial={modal.check}
                onCancel={() => setModal(null)}
                onSave={(text, tool, commands) => {
                  const id = modal.check?.id || newId();
                  const check: Check = {
                    id,
                    check: text,
                    tool,
                    domain: modal.category.domain,
                    category: modal.category.name,
                    custom: true,
                  };
                  const nextChecks = modal.check
                    ? data.checks.map((item) => (item.id === id ? check : item))
                    : [...data.checks, check];
                  save({
                    ...data,
                    checks: nextChecks,
                    commands: [
                      ...data.commands,
                      ...commands.map((command) => ({
                        ...command,
                        id: newId(),
                        checkId: id,
                        tool,
                        custom: true,
                      })),
                    ],
                  });
                }}
              />
            )}
            {modal.kind === 'command' && (
              <AddCommandForm
                tools={names}
                initial={modal.command}
                onCancel={() => setModal(null)}
                onSave={(commands, tool) => {
                  const additions = commands.map((command) => ({
                    ...command,
                    id: command.id || newId(),
                    checkId: modal.checkId,
                    tool,
                    custom: true,
                  }));
                  save({
                    ...data,
                    commands: [
                      ...data.commands.filter((command) => command.id !== modal.command?.id),
                      ...additions,
                    ],
                  });
                  setExpanded((current) => ({ ...current, [modal.checkId]: true }));
                }}
              />
            )}
            {modal.kind === 'category' && (
              <NamedForm
                kind="category"
                initial={modal.category}
                tools={tools}
                onCancel={() => setModal(null)}
                onSave={(name) => {
                  const categoryDomain = modal.category?.domain || domain;
                  if (
                    categories.some(
                      (item) =>
                        item.domain === categoryDomain &&
                        item.name.toLowerCase() === name.toLowerCase() &&
                        item.id !== modal.category?.id,
                    )
                  ) {
                    setNotice('A category with this name already exists.');
                    return;
                  }
                  const category = {
                    id: modal.category?.id || newId(),
                    domain: categoryDomain,
                    name,
                  };
                  save({
                    ...data,
                    categories: [
                      ...data.categories.filter((item) => item.id !== category.id),
                      category,
                    ],
                    checks: data.checks.map((check) =>
                      check.domain === categoryDomain && check.category === modal.category?.name
                        ? { ...check, category: name }
                        : check,
                    ),
                  });
                  setQuery('');
                  setFilter('all');
                  setLimit(categories.length + 1);
                }}
              />
            )}
            {modal.kind === 'tool' && (
              <NamedForm
                kind="tool"
                initial={modal.tool}
                tools={tools}
                onCancel={() => setModal(null)}
                onSave={(name, description, commands) => {
                  const tool = {
                    id: modal.tool?.id || newId(),
                    tool: name,
                    description,
                    commands: commands.map((command) => ({
                      ...command,
                      id: command.id || newId(),
                      custom: true,
                    })),
                    custom: true,
                  };
                  save({
                    ...data,
                    tools: [...data.tools.filter((item) => item.id !== tool.id), tool],
                    checks: data.checks.map((check) =>
                      modal.tool && check.tool === modal.tool.tool
                        ? { ...check, tool: name }
                        : check,
                    ),
                    commands: data.commands.map((command) =>
                      modal.tool && command.tool === modal.tool.tool
                        ? { ...command, tool: name }
                        : command,
                    ),
                  });
                  setSelectedTool(name);
                  setView('tools');
                  setQuery('');
                }}
              />
            )}
            {modal.kind === 'tool-command' && (
              <AddCommandForm
                lockTool
                tools={names}
                initial={{ ...modal.command, tool: modal.tool.tool }}
                onCancel={() => setModal(null)}
                onSave={(commands) =>
                  save({
                    ...data,
                    tools: data.tools.map((tool) =>
                      tool.id === modal.tool.id
                        ? {
                            ...tool,
                            commands: tool.commands.flatMap((command) =>
                              command.id === modal.command.id ? commands : [command],
                            ),
                          }
                        : tool,
                    ),
                  })
                }
              />
            )}
          </section>
        </div>
      )}
    </div>
  );
}
