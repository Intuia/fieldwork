import { useState } from 'react';
import type { Check, Command } from '../types';
import { CommandRows } from './AddCommandForm';
export function AddCheckForm({
  tools,
  initial,
  onSave,
  onCancel,
}: {
  tools: string[];
  initial?: Check;
  onSave: (text: string, tool: string, commands: Command[]) => void;
  onCancel: () => void;
}) {
  const [text, setText] = useState(initial?.check || '');
  const [tool, setTool] = useState(initial?.tool || '');
  const [rows, setRows] = useState<Command[]>([]);
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        if (text.trim()) {
          onSave(text.trim(), tool.trim().toLowerCase(), rows);
        }
      }}
    >
      <label>
        Check text
        <textarea
          required
          autoFocus
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="What do you want to verify?"
        />
      </label>
      <label>
        Tool (optional)
        <input
          list="check-tools"
          value={tool}
          onChange={(event) => setTool(event.target.value)}
          placeholder="Choose a tool or enter a new name"
        />
      </label>
      <datalist id="check-tools">
        {tools.map((name) => (
          <option key={name} value={name} />
        ))}
      </datalist>
      {!initial && <CommandRows rows={rows} onChange={setRows} />}
      <div className="form-actions">
        <button className="primary" type="submit" disabled={!text.trim()}>
          Save check
        </button>
        <button type="button" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
}
