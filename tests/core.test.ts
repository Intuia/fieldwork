import test from 'node:test';
import assert from 'node:assert/strict';
import { fillCommand, getPlaceholders, commandParts } from '../src/lib/fillCommand';
import {
  emptyCustomData,
  parseCustomData,
  mergeCustomData,
  conflictCount,
} from '../src/lib/customData';
import { builtChecks, checkTools, matchesSearch } from '../src/lib/model';
import { categoryMarkdown } from '../src/lib/markdown';
import commands from '../src/data/commands.json';
import mapping from '../src/data/checkToolMap.json';
test('literal replacements preserve dollar signs and do not recurse into supplied values', () => {
  assert.equal(
    fillCommand('nmap {{target}} {{port}} {{target}}', { target: '$&{{port}}', port: '443' }),
    'nmap $&{{port}} 443 $&{{port}}',
  );
  assert.equal(fillCommand('{{url}}', {}), '{{url}}');
  assert.deepEqual(getPlaceholders('{{url}} {{url}} {{file}}'), ['url', 'file']);
  assert.equal(commandParts('{{target}}', {})[1].unresolved, true);
});
test('imports reject malformed structures and built-in-style custom IDs', () => {
  assert.throws(() =>
    parseCustomData({
      ...emptyCustomData(),
      checks: [{ id: '1', check: 'oops', category: 'A', domain: 'Web' }],
    }),
  );
  assert.throws(() =>
    parseCustomData({
      ...emptyCustomData(),
      tools: [{ id: 'custom-x', tool: 'x', description: '', commands: [null] }],
    }),
  );
  assert.throws(() => parseCustomData({ ...emptyCustomData(), version: 2 }));
  assert.deepEqual(parseCustomData(emptyCustomData()), emptyCustomData());
});
test('custom library command IDs survive a backup round trip and cannot impersonate attached commands', () => {
  const data = {
    ...emptyCustomData(),
    tools: [
      {
        id: 'custom-tool',
        tool: 'MyTool',
        description: '',
        commands: [
          { id: 'custom-command', checkId: '1', label: 'Test', command: 'mytool {{target}}' },
        ],
      },
    ],
  };
  const parsed = parseCustomData(data);
  assert.equal(parsed.tools[0].commands[0].id, 'custom-command');
  assert.equal(parsed.tools[0].commands[0].checkId, undefined);
  assert.equal(parsed.tools[0].tool, 'mytool');
  assert.throws(() =>
    parseCustomData({
      ...emptyCustomData(),
      categories: [
        { id: 'custom-same', domain: 'Web', name: 'A' },
        { id: 'custom-same', domain: 'Web', name: 'B' },
      ],
    }),
  );
});
test('merge keeps current data without approval and overwrites only matching IDs after approval', () => {
  const current = {
    ...emptyCustomData(),
    checks: [{ id: 'custom-1', check: 'Old', domain: 'Web', category: 'A' }],
    notes: { '1': 'Existing note' },
  };
  const incoming = {
    ...emptyCustomData(),
    checks: [
      { id: 'custom-1', check: 'New', domain: 'Web', category: 'A' },
      { id: 'custom-2', check: 'Second', domain: 'Web', category: 'A' },
    ],
    notes: { '1': 'New note' },
  };
  assert.equal(conflictCount(current, incoming), 2);
  assert.equal(mergeCustomData(current, incoming, false).checks[0].check, 'Old');
  assert.equal(mergeCustomData(current, incoming, false).checks.length, 2);
  assert.equal(mergeCustomData(current, incoming, true).notes['1'], 'New note');
});
test('tool search and scoped custom commands work together without altering built-in commands', () => {
  const check = builtChecks.find((check) => check.check.includes('nmap'))!;
  const data = {
    ...emptyCustomData(),
    commands: [
      {
        id: 'custom-cmd',
        checkId: check.id,
        tool: 'nmap',
        label: 'Personal command',
        command: 'nmap --reason {{target}}',
      },
    ],
  };
  assert.equal(matchesSearch(check, data, 'nmap'), true);
  assert.equal(matchesSearch(check, data, '--reason'), true);
  assert.equal(
    checkTools(check, data)
      .find((tool) => tool.tool === 'nmap')!
      .commands.at(-1)!.custom,
    true,
  );
  const other = builtChecks.find((item) => item.id !== check.id && item.check.includes('nmap'))!;
  assert.equal(matchesSearch(other, data, '--reason'), false);
});
test('markdown includes custom status, notes, filled target, and safe command fences', () => {
  const check = {
    id: 'custom-1',
    domain: 'Web',
    category: 'Mine',
    check: 'My check',
    custom: true,
  };
  const data = {
    ...emptyCustomData(),
    checks: [check],
    commands: [
      { id: 'custom-c', checkId: check.id, label: 'Test', command: 'echo ``` {{target}}' },
    ],
    notes: { 'custom-1': 'Evidence' },
  };
  const markdown = categoryMarkdown('Mine', [check], data, { 'custom-1': true }, 'example.test');
  assert.match(markdown, /\[x\] My check \(custom\)/);
  assert.match(markdown, /Notes: Evidence/);
  assert.match(markdown, /````sh/);
  assert.match(markdown, /echo ``` example.test/);
});
test('every linked ID exists, and each curated tool has three to eight real commands', () => {
  const ids = new Set(builtChecks.map((check) => check.id));
  for (const id of Object.keys(mapping)) {
    assert.ok(ids.has(id));
  }
  for (const tool of commands) {
    assert.ok(tool.sources.length > 0, tool.tool + ' needs a source');
    assert.equal(
      new Set(tool.commands.map((command) => command.command)).size,
      tool.commands.length,
    );
    assert.ok(tool.commands.length >= 3 && tool.commands.length <= 8, tool.tool);
    for (const command of tool.commands) {
      assert.ok(command.command.trim());
      for (const placeholder of getPlaceholders(command.command)) {
        assert.ok(['target', 'domain', 'url', 'wordlist', 'port', 'file'].includes(placeholder));
      }
    }
  }
});

test('researched corrections use documented Objection, Fingerprintx, and BuiltWith interfaces', () => {
  const objection = commands.find((tool) => tool.tool === 'objection')!;
  assert.equal(
    objection.commands.some((command) => command.command.includes('list-applications')),
    false,
  );
  const fingerprint = commands.find((tool) => tool.tool === 'fingerprintx')!;
  assert.equal(
    fingerprint.commands.some((command) => /(^|\s)-json(\s|$)/.test(command.command)),
    false,
  );
  assert.ok(fingerprint.commands.some((command) => command.command.includes('--json')));
  const builtwith = commands.find((tool) => tool.tool === 'builtwith')!;
  assert.ok(builtwith.commands.every((command) => command.command.includes('/v26/')));
  assert.ok(
    builtwith.commands.every((command) =>
      command.command.includes('Authorization: API $BUILTWITH_API_KEY'),
    ),
  );
});

test('API request bodies remain valid JSON after normal placeholder replacement', () => {
  let requestCount = 0;
  for (const tool of commands) {
    for (const example of tool.commands) {
      const command = fillCommand(example.command, {
        domain: 'example.test',
        url: 'https://example.test',
        target: '192.0.2.1',
      });
      for (const match of command.matchAll(/--data '({[^']*})'/g)) {
        assert.doesNotThrow(() => JSON.parse(match[1]), tool.tool + ': ' + example.label);
        requestCount += 1;
      }
    }
  }
  assert.ok(requestCount > 0, 'At least one API body must be validated');
});
