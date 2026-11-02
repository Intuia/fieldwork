import { useState } from 'react';
import type { Command, Tool } from '../types';
import { CommandBlock } from './CommandBlock';
import { fillCommand } from '../lib/fillCommand';
import { copyText } from '../lib/clipboard';
export function CommandPanel({
  tools,
  target,
  onEdit,
  onDelete,
}: {
  tools: Tool[];
  target: string;
  onEdit?: (command: Command, tool: Tool) => void;
  onDelete?: (command: Command, tool: Tool) => void;
}) {
  const [values, setValues] = useState<Record<string, Record<string, string>>>({});
  const [status, setStatus] = useState<Record<string, string>>({});
  function commandKey(tool: Tool, command: Command, index: number) {
    return tool.tool + ':' + (command.id || index);
  }
  async function copyAll(tool: Tool) {
    try {
      await copyText(
        tool.commands
          .map((command, index) =>
            fillCommand(command.command, { ...values[commandKey(tool, command, index)], target }),
          )
          .join('\n\n'),
      );
      setStatus((current) => ({ ...current, [tool.tool]: 'Copied' }));
      setTimeout(() => setStatus((current) => ({ ...current, [tool.tool]: '' })), 1800);
    } catch {
      setStatus((current) => ({ ...current, [tool.tool]: 'Copy failed' }));
    }
  }
  return (
    <div className="command-panel">
      {tools.map((tool) => (
        <section key={tool.tool}>
          <div className="tool-heading">
            <div>
              <strong>{tool.tool}</strong>
              {tool.custom && <span className="badge">custom</span>}
              <p className="muted small">{tool.description}</p>
            </div>
            {tool.commands.length > 0 && (
              <button onClick={() => copyAll(tool)}>{status[tool.tool] || 'Copy all'}</button>
            )}
          </div>
          {tool.commands.length === 0 && (
            <p className="muted small">No commands curated yet. Add your own command below.</p>
          )}
          {tool.commands.map((command, index) => {
            const key = commandKey(tool, command, index);
            return (
              <CommandBlock
                key={key}
                command={command}
                target={target}
                values={values[key] || {}}
                onValue={(name, value) =>
                  setValues((current) => ({
                    ...current,
                    [key]: { ...current[key], [name]: value },
                  }))
                }
                onEdit={onEdit ? () => onEdit(command, tool) : undefined}
                onDelete={onDelete ? () => onDelete(command, tool) : undefined}
              />
            );
          })}
          {tool.sources && (
            <div className="small muted">
              Reference:{' '}
              {tool.sources.map((source) => (
                <a key={source} href={source} target="_blank" rel="noreferrer">
                  official documentation ↗
                </a>
              ))}
            </div>
          )}
        </section>
      ))}
    </div>
  );
}
