import flatChecks from '../data/checks_flat.json';
import commandData from '../data/commands.json';
import toolMapData from '../data/checkToolMap.json';
import registry from '../data/toolRegistry.json';
import type { Check, Command, CustomData, Tool } from '../types';
export const builtChecks: Check[] = flatChecks.map((check) => ({ ...check, id: String(check.id) }));
export const domains = [...new Set(builtChecks.map((check) => check.domain))];
const categoryKeys = [
  ...new Set(builtChecks.map((check) => JSON.stringify([check.domain, check.category]))),
];
export const builtCategories = categoryKeys.map((key, index) => {
  const [domain, name] = JSON.parse(key) as [string, string];
  return { id: 'category-' + index, domain, name };
});
export const builtTools: Tool[] = registry.map((entry) => {
  const catalog = commandData.find((tool) => tool.tool === entry.tool);
  if (catalog) {
    return catalog;
  }
  return {
    tool: entry.tool,
    description: 'reason' in entry ? entry.reason || '' : '',
    commands: [],
    sources: 'reference' in entry && entry.reference ? [entry.reference] : undefined,
  };
});
const toolMap: Record<string, string[]> = toolMapData;
function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
export function linkedTools(check: Check, data: CustomData): string[] {
  const names = [...(toolMap[check.id] || [])];
  if (check.custom) {
    for (const entry of registry) {
      if (
        entry.aliases.some((alias) =>
          new RegExp('(^|[^a-z0-9_])' + escapeRegex(alias) + '(?=$|[^a-z0-9_])', 'i').test(
            check.check,
          ),
        )
      ) {
        names.push(entry.tool);
      }
    }
  }
  for (const tool of data.tools) {
    if (
      new RegExp('(^|[^a-z0-9_])' + escapeRegex(tool.tool) + '(?=$|[^a-z0-9_])', 'i').test(
        check.check,
      )
    ) {
      names.push(tool.tool);
    }
  }
  if (check.tool) {
    names.push(check.tool);
  }
  for (const command of data.commands.filter((command) => command.checkId === check.id)) {
    names.push(command.tool || 'Personal commands');
  }
  return [...new Set(names)];
}
export function allTools(data: CustomData): Tool[] {
  return [...builtTools, ...data.tools.map((tool) => ({ ...tool, custom: true }))];
}
export function checkTools(check: Check, data: CustomData): Tool[] {
  const tools = allTools(data);
  return linkedTools(check, data).map((name) => {
    const tool = tools.find((tool) => tool.tool === name) || {
      tool: name,
      description: '',
      commands: [],
    };
    const extras = data.commands
      .filter(
        (command) => command.checkId === check.id && (command.tool || 'Personal commands') === name,
      )
      .map((command) => ({ ...command, custom: true }));
    return {
      ...tool,
      commands: [
        ...tool.commands.map((command) => ({ ...command, custom: tool.custom })),
        ...extras,
      ],
    };
  });
}
export function toolCommands(tool: Tool, data: CustomData): Command[] {
  return [
    ...tool.commands.map((command) => ({ ...command, custom: tool.custom })),
    ...data.commands
      .filter((command) => command.tool === tool.tool)
      .map((command) => ({ ...command, custom: true })),
  ];
}
export function matchesSearch(check: Check, data: CustomData, query: string): boolean {
  const text = [
    check.check,
    check.domain,
    check.category,
    data.notes[check.id] || '',
    ...checkTools(check, data).flatMap((tool) => [
      tool.tool,
      ...tool.commands.flatMap((command) => [command.label, command.command, command.notes || '']),
    ]),
  ]
    .join(' ')
    .toLowerCase();
  return text.includes(query.toLowerCase().trim());
}
