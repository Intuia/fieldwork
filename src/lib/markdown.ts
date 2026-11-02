import type { Check, CustomData } from '../types';
import { checkTools } from './model';
import { fillCommand } from './fillCommand';
// Choose a fence longer than any backtick run in user content.
function codeFence(text: string): string {
  return '`'.repeat(
    Math.max(3, ...Array.from(text.matchAll(/`+/g), (match) => match[0].length + 1)),
  );
}
function singleLine(text: string): string {
  return text.replace(/[\r\n]+/g, ' ');
}
export function categoryMarkdown(
  name: string,
  checks: Check[],
  data: CustomData,
  progress: Record<string, boolean>,
  target: string,
): string {
  const lines = ['## ' + singleLine(name), ''];
  for (const check of checks) {
    lines.push(
      `- [${progress[check.id] ? 'x' : ' '}] ${singleLine(check.check)}${check.custom ? ' (custom)' : ''}`,
    );
    if (data.notes[check.id]) {
      lines.push('', '  Notes: ' + singleLine(data.notes[check.id]), '');
    }
    for (const tool of checkTools(check, data)) {
      lines.push('', '  **' + tool.tool + '**');
      for (const command of tool.commands) {
        const text = fillCommand(command.command, { target });
        const fence = codeFence(text);
        lines.push(
          '',
          '  ' +
            singleLine(command.label) +
            (command.custom ? ' (custom)' : '') +
            (command.verify ? ' — verify flags' : ''),
          '',
          '  ' + fence + 'sh',
          ...text.split('\n').map((line) => '  ' + line),
          '  ' + fence,
        );
        if (command.notes) {
          lines.push('  ' + singleLine(command.notes));
        }
      }
    }
    lines.push('');
  }
  return lines.join('\n');
}
