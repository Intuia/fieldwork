import fs from 'node:fs';
import checks from '../src/data/checks_flat.json' with { type: 'json' };
import groups from '../src/data/checks.json' with { type: 'json' };
import commands from '../src/data/commands.json' with { type: 'json' };
import registry from '../src/data/toolRegistry.json' with { type: 'json' };
import { matchTools } from './tool-matching.mjs';
// Check both input files so a new grouped check cannot silently disappear.
const flatTexts = new Set(
  checks.map((check) => JSON.stringify([check.domain, check.category, check.check])),
);
const unmapped = groups.flatMap((group) =>
  group.checks
    .filter((text) => !flatTexts.has(JSON.stringify([group.domain, group.category, text])))
    .map((text) => ({ domain: group.domain, category: group.category, text })),
);
if (unmapped.length > 0) {
  console.error('Grouped checks without a flat ID:', unmapped);
  process.exitCode = 1;
}
const mapping = Object.fromEntries(
  checks
    .map((check) => [String(check.id), matchTools(check.check)])
    .filter(([, tools]) => tools.length > 0),
);
if (process.argv.includes('--write')) {
  fs.writeFileSync(
    new URL('../src/data/checkToolMap.json', import.meta.url),
    JSON.stringify(mapping, null, 2) + '\n',
  );
}
const catalog = new Map(commands.map((tool) => [tool.tool, tool]));
let gaps = 0;
for (const check of checks) {
  const missing = (mapping[String(check.id)] || []).filter(
    (tool) => !catalog.get(tool)?.commands.length,
  );
  if (missing.length > 0) {
    gaps += 1;
    console.log(
      `[${check.id}] ${check.domain} / ${check.category}: ${check.check}\n  Missing: ${missing.join(', ')}`,
    );
  }
}
console.log(
  `\n${checks.length} checks scanned; ${Object.keys(mapping).length} linked checks; ${commands.length} command tools; ${gaps} checks with command gaps.`,
);
for (const tool of registry.filter((tool) => !catalog.has(tool.tool))) {
  console.log(`${tool.tool}: ${tool.reason || 'Commands not yet curated.'}`);
}
console.log(
  'Matching uses the reviewed alias registry. Add new tool names to src/data/toolRegistry.json.',
);
