import { useState } from 'react';
import type { Command } from '../types';
import { commandParts, fillCommand, getPlaceholders } from '../lib/fillCommand';
import { copyText } from '../lib/clipboard';
export interface CommandBlockProps {
  command: Command;
  target: string;
  values: Record<string, string>;
  onValue: (name: string, value: string) => void;
  onEdit?: () => void;
  onDelete?: () => void;
}
export function CommandBlock({
  command,
  target,
  values,
  onValue,
  onEdit,
  onDelete,
}: CommandBlockProps) {
  const [status, setStatus] = useState('');
  const replacements = { ...values, target };
  async function copy() {
    try {
      await copyText(fillCommand(command.command, replacements));
      setStatus('Copied');
      setTimeout(() => setStatus(''), 1800);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Copy failed');
    }
  }
  return (
    <article className="command-block">
      <div className="command-label">
        <strong>{command.label}</strong>
        <span className="badges">
          {command.custom && <span className="badge">custom</span>}
          {command.verify && <span className="badge verify">verify flags</span>}
        </span>
        <button onClick={copy}>{status === 'Copied' ? '✓ Copied' : 'Copy'}</button>
      </div>
      {getPlaceholders(command.command).filter((name) => name !== 'target').length > 0 && (
        <div className="placeholders">
          {getPlaceholders(command.command)
            .filter((name) => name !== 'target')
            .map((name) => (
              <label key={name}>
                {name}
                <input
                  aria-label={command.label + ' ' + name}
                  value={values[name] || ''}
                  placeholder={'{{' + name + '}}'}
                  onChange={(event) => onValue(name, event.target.value)}
                />
              </label>
            ))}
        </div>
      )}
      <pre>
        <code>
          {commandParts(command.command, replacements).map((part, index) => (
            <span key={index} className={part.unresolved ? 'unresolved' : undefined}>
              {part.text}
            </span>
          ))}
        </code>
      </pre>
      {command.notes && <p className="muted small">{command.notes}</p>}
      {status && status !== 'Copied' && <p role="alert">{status}</p>}
      {command.custom && (
        <div className="inline-actions">
          {onEdit && <button onClick={onEdit}>Edit command</button>}
          {onDelete && (
            <button className="danger" onClick={onDelete}>
              Delete command
            </button>
          )}
        </div>
      )}
    </article>
  );
}
