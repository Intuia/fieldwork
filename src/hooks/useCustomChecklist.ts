import { useState } from 'react';
import type { CustomData } from '../types';
import { parseCustomData, emptyCustomData } from '../lib/customData';
import { builtTools } from '../lib/model';
export const CUSTOM_STORAGE_KEY = 'customChecklist.v1';
export function useCustomChecklist() {
  const [loaded] = useState(() => {
    try {
      const stored = localStorage.getItem(CUSTOM_STORAGE_KEY);
      if (stored) {
        return { data: parseCustomData(JSON.parse(stored)), warning: '' };
      }
    } catch {
      return {
        data: emptyCustomData(),
        warning:
          'Saved custom data could not be read. Export or recover your previous backup before adding items.',
      };
    }
    return { data: emptyCustomData(), warning: '' };
  });
  const [warning, setWarning] = useState(loaded.warning);
  const [data, setData] = useState<CustomData>(loaded.data);
  function updateData(next: CustomData) {
    // An unfamiliar tool typed into a form becomes a user-owned tool entry.
    const knownNames = new Set([...builtTools, ...next.tools].map((tool) => tool.tool));
    const addedNames = [
      ...new Set([
        ...next.checks.map((check) => check.tool),
        ...next.commands.map((command) => command.tool),
      ]),
    ].filter((name): name is string => Boolean(name) && !knownNames.has(name!));
    next = {
      ...next,
      tools: [
        ...next.tools,
        ...addedNames.map((name) => ({
          id: 'custom-' + crypto.randomUUID(),
          tool: name,
          description: 'User-defined tool',
          commands: [],
          custom: true,
        })),
      ],
    };
    setData(next);
    try {
      localStorage.setItem(CUSTOM_STORAGE_KEY, JSON.stringify(next));
      setWarning('');
    } catch {
      setWarning(
        'Changes are available this session, but browser storage could not save them. Export a backup.',
      );
    }
  }
  return { data, updateData, warning };
}
