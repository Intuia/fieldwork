import type { Check, Command, CustomData, Tool } from '../types';
import { CommandPanel } from './CommandPanel';
import { linkedTools, toolCommands } from '../lib/model';
export function ToolsView({
  tools,
  data,
  checks,
  selected,
  query,
  target,
  onSelect,
  onCheck,
  onNew,
  onEditTool,
  onDeleteTool,
  onEditCommand,
  onDeleteCommand,
}: {
  tools: Tool[];
  data: CustomData;
  checks: Check[];
  selected: string;
  query: string;
  target: string;
  onSelect: (name: string) => void;
  onCheck: (check: Check) => void;
  onNew: () => void;
  onEditTool: (tool: Tool) => void;
  onDeleteTool: (tool: Tool) => void;
  onEditCommand: (command: Command, tool: Tool) => void;
  onDeleteCommand: (command: Command, tool: Tool) => void;
}) {
  const visible = tools.filter((tool) =>
    [
      tool.tool,
      tool.description,
      ...toolCommands(tool, data).map((command) => command.command + ' ' + command.label),
    ]
      .join(' ')
      .toLowerCase()
      .includes(query.toLowerCase()),
  );
  const tool = visible.find((item) => item.tool === selected) || visible[0];
  return (
    <div className="tools-layout">
      <section className="card tool-list">
        <div className="section-heading">
          <h2>Tool library</h2>
          <button onClick={onNew}>+ Tool</button>
        </div>
        {visible.map((item) => (
          <button
            className={'tool-item ' + (tool?.tool === item.tool ? 'selected' : '')}
            key={item.tool}
            onClick={() => onSelect(item.tool)}
          >
            <span>
              {item.tool}
              {item.custom && <span className="badge">custom</span>}
            </span>
            <span className="count">{toolCommands(item, data).length}</span>
          </button>
        ))}
        {visible.length === 0 && <p>No tools match this search.</p>}
      </section>
      <section className="card tool-detail">
        {tool && (
          <>
            <div className="section-heading">
              <h2>{tool.tool}</h2>
              {tool.custom && (
                <div className="inline-actions">
                  <button onClick={() => onEditTool(tool)}>Edit tool</button>
                  <button className="danger" onClick={() => onDeleteTool(tool)}>
                    Delete tool
                  </button>
                </div>
              )}
            </div>
            <CommandPanel
              key={tool.tool}
              tools={[{ ...tool, commands: toolCommands(tool, data) }]}
              target={target}
              onEdit={onEditCommand}
              onDelete={onDeleteCommand}
            />
            <h3>Checks using {tool.tool}</h3>
            <div className="related-checks">
              {checks
                .filter((check) => linkedTools(check, data).includes(tool.tool))
                .map((check) => (
                  <button key={check.id} onClick={() => onCheck(check)}>
                    <span className="eyebrow">
                      {check.domain} / {check.category}
                    </span>
                    <span>{check.check}</span>
                  </button>
                ))}
            </div>
          </>
        )}
      </section>
    </div>
  );
}
