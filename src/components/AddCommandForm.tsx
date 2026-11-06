import { useState } from 'react';
import type { Command } from '../types';
export function CommandRows({
  rows,
  onChange,
}: {
  rows: Command[];
  onChange: (rows: Command[]) => void;
}) {
  return (
    <div className="command-rows">
      {rows.map((row, index) => (
        <fieldset key={index}>
          <legend>Command {index + 1}</legend>
          <label>
            Label
            <input
              required
              value={row.label}
              onChange={(event) =>
                onChange(
                  rows.map((item, itemIndex) =>
                    itemIndex === index ? { ...item, label: event.target.value } : item,
                  ),
                )
              }
              placeholder="e.g. Full TCP scan"
            />
          </label>
          <label>
            Command
            <textarea
              required
              value={row.command}
              onChange={(event) =>
                onChange(
                  rows.map((item, itemIndex) =>
                    itemIndex === index ? { ...item, command: event.target.value } : item,
                  ),
                )
              }
              placeholder="nmap -sV {{target}}"
            />
          </label>
          <label>
            Notes
            <input
              value={row.notes || ''}
              onChange={(event) =>
                onChange(
                  rows.map((item, itemIndex) =>
                    itemIndex === index ? { ...item, notes: event.target.value } : item,
                  ),
                )
              }
            />
          </label>
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={Boolean(row.verify)}
              onChange={(event) =>
                onChange(
                  rows.map((item, itemIndex) =>
                    itemIndex === index ? { ...item, verify: event.target.checked } : item,
                  ),
                )
              }
            />{' '}
            Show verify flags badge
          </label>
          <button
            type="button"
            className="danger"
            onClick={() => onChange(rows.filter((_, itemIndex) => itemIndex !== index))}
          >
            Remove row
          </button>
        </fieldset>
      ))}
      <button type="button" onClick={() => onChange([...rows, { label: '', command: '' }])}>
        + Command row
      </button>
    </div>
  );
}
export function AddCommandForm({
  tools,
  initial,
  lockTool = false,
  onSave,
  onCancel,
}: {
  tools: string[];
  initial?: Command;
  lockTool?: boolean;
  onSave: (commands: Command[], tool: string) => void;
  onCancel: () => void;
}) {
  const [tool, setTool] = useState(initial?.tool || '');
  const [rows, setRows] = useState<Command[]>([initial || { label: '', command: '' }]);
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        if (rows.length > 0) {
          onSave(
            rows.map((row) => ({ ...row, label: row.label.trim(), command: row.command.trim() })),
            tool.trim().toLowerCase(),
          );
        }
      }}
    >
      <label>
        Tool (optional)
        <input
          readOnly={lockTool}
          value={tool}
          onChange={(event) => setTool(event.target.value)}
          list="command-tools"
          placeholder="e.g. nmap"
        />
      </label>
      <datalist id="command-tools">
        {tools.map((name) => (
          <option key={name} value={name} />
        ))}
      </datalist>
      <CommandRows rows={rows} onChange={setRows} />
      <div className="form-actions">
        <button className="primary" type="submit" disabled={rows.length === 0}>
          Save {initial ? 'command' : 'commands'}
        </button>
        <button type="button" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
}
