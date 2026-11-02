import type { CustomData } from '../types';
export function emptyCustomData(): CustomData {
  return { version: 1, checks: [], commands: [], categories: [], tools: [], notes: {} };
}
function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
function hasText(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}
function validId(value: unknown): boolean {
  return hasText(value) && value.startsWith('custom-');
}
function validCommand(value: unknown): boolean {
  if (!isRecord(value)) {
    return false;
  }
  return (
    hasText(value.label) &&
    hasText(value.command) &&
    (value.notes === undefined || typeof value.notes === 'string') &&
    (value.verify === undefined || typeof value.verify === 'boolean')
  );
}
export function parseCustomData(value: unknown): CustomData {
  if (!isRecord(value) || value.version !== 1) {
    throw new Error('Expected a version 1 custom checklist backup.');
  }
  const { checks, commands, categories, tools, notes } = value;
  if (
    !Array.isArray(checks) ||
    !Array.isArray(commands) ||
    !Array.isArray(categories) ||
    !Array.isArray(tools) ||
    !isRecord(notes)
  ) {
    throw new Error('Backup is missing required collections.');
  }
  for (const check of checks) {
    if (
      !isRecord(check) ||
      !validId(check.id) ||
      !hasText(check.check) ||
      !hasText(check.domain) ||
      !hasText(check.category) ||
      (check.tool !== undefined && typeof check.tool !== 'string')
    ) {
      throw new Error('Invalid custom check.');
    }
  }
  for (const command of commands) {
    if (
      !validCommand(command) ||
      !validId(command.id) ||
      !hasText(command.checkId) ||
      (command.tool !== undefined && typeof command.tool !== 'string')
    ) {
      throw new Error('Invalid custom command.');
    }
  }
  for (const category of categories) {
    if (
      !isRecord(category) ||
      !validId(category.id) ||
      !hasText(category.domain) ||
      !hasText(category.name)
    ) {
      throw new Error('Invalid category.');
    }
  }
  for (const tool of tools) {
    if (
      !isRecord(tool) ||
      !validId(tool.id) ||
      !hasText(tool.tool) ||
      typeof tool.description !== 'string' ||
      !Array.isArray(tool.commands) ||
      !tool.commands.every(validCommand)
    ) {
      throw new Error('Invalid custom tool.');
    }
  }
  if (Object.values(notes).some((note) => typeof note !== 'string')) {
    throw new Error('Notes must contain text.');
  }
  for (const collection of [checks, commands, categories, tools]) {
    const ids = collection.map((item) => item.id);
    if (new Set(ids).size !== ids.length) {
      throw new Error('Duplicate IDs inside a backup collection.');
    }
  }
  // Copy only supported fields; imported commands cannot impersonate built-in data.
  const parsed = JSON.parse(JSON.stringify(value)) as CustomData;
  function cleanCommand(command: CustomData['commands'][number], id: string) {
    return {
      id,
      label: command.label,
      command: command.command,
      notes: command.notes,
      verify: Boolean(command.verify),
      custom: true,
    };
  }
  return {
    version: 1,
    checks: parsed.checks.map((check) => ({
      id: check.id,
      domain: check.domain,
      category: check.category,
      check: check.check,
      tool: check.tool?.trim().toLowerCase(),
      custom: true,
    })),
    commands: parsed.commands.map((command) => ({
      ...cleanCommand(command, command.id!),
      checkId: command.checkId,
      tool: command.tool?.trim().toLowerCase(),
    })),
    categories: parsed.categories.map((category) => ({
      id: category.id,
      domain: category.domain,
      name: category.name,
    })),
    tools: parsed.tools.map((tool) => ({
      id: tool.id,
      tool: tool.tool.trim().toLowerCase(),
      description: tool.description,
      custom: true,
      commands: tool.commands.map((command, index) =>
        cleanCommand(command, validId(command.id) ? command.id! : tool.id + '-command-' + index),
      ),
    })),
    notes: Object.fromEntries(Object.entries(parsed.notes)),
  };
}
export function mergeCustomData(
  current: CustomData,
  incoming: CustomData,
  overwrite: boolean,
): CustomData {
  function mergeById<T extends { id?: string }>(existing: T[], additions: T[]): T[] {
    const result = new Map(existing.map((item) => [item.id, item]));
    for (const item of additions) {
      if (!result.has(item.id) || overwrite) {
        result.set(item.id, item);
      }
    }
    return [...result.values()];
  }
  const notes = Object.assign(Object.create(null), current.notes);
  for (const [id, note] of Object.entries(incoming.notes)) {
    if (!Object.hasOwn(notes, id) || overwrite) {
      notes[id] = note;
    }
  }
  return {
    version: 1,
    checks: mergeById(current.checks, incoming.checks),
    commands: mergeById(current.commands, incoming.commands),
    categories: mergeById(current.categories, incoming.categories),
    tools: mergeById(current.tools, incoming.tools),
    notes,
  };
}
export function conflictCount(current: CustomData, incoming: CustomData): number {
  let count = 0;
  for (const key of ['checks', 'commands', 'categories', 'tools'] as const) {
    const ids = new Set(current[key].map((item) => item.id));
    count += incoming[key].filter((item) => ids.has(item.id)).length;
  }
  count += Object.keys(incoming.notes).filter(
    (id) => Object.hasOwn(current.notes, id) && incoming.notes[id] !== current.notes[id],
  ).length;
  return count;
}
