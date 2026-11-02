# Fieldwork checklist

A local React + TypeScript app built around the supplied `checks.json` and `checks_flat.json` files. No original application source was supplied, so this is a standalone implementation.

## Run

Requires Node.js 20.19+ or 22.12+.

```sh
npm install
npm run dev
```

Open the localhost address printed by Vite. Keep the same host and port to retain the same browser storage.

```sh
npm run build
npm run preview
npm test
npm run commands:report
```

## Features

- 8,207 built-in checks across 189 categories and five domains; existing numeric IDs preserved as strings.
- 172 command examples for 54 CLI tools, with 3–5 examples each. The alias registry recognizes 88 tools and services. Commands that have not been confidently confirmed against current documentation have `verify: true` and a visible badge.
- Expandable command panels, live Current target replacement, independent inputs for other placeholders, per-command Copy, and per-tool Copy all.
- Custom checks, attached commands, categories, tool libraries, notes, editing, deletion, progress, and custom badges. Built-in JSON data stays immutable.
- Search across all domains, tool names, command labels/text, and notes; matching command panels expand automatically. Filters include completed, pending, commands, and custom items.
- Tools view shows command counts and related checks. Commands attached to a particular check are only shown on that check; Tools view aggregates them with the tool library.
- JSON backup contains all custom categories, checks, tools, commands, and notes. Import validates the schema and merges by ID. A confirmation chooses overwrite or keep existing; new items are imported either way. Built-in tools/categories cannot be overwritten.
- Copy a complete category as markdown with notes and fenced commands, or download the filtered checklist as markdown.
- Responsive layout and the requested authorization footer.

## Storage and assumptions

- `customChecklist.v1` stores custom data and notes, including notes on built-in checks. `checklist.progress.v1` and `checklist.target.v1` are separate. Storage access uses try/catch and reports write failures. No previous app storage format was supplied, so legacy progress migration is not attempted.
- Progress is global to this browser, not per target. Changing Current target updates `{{target}}` only; other placeholders require explicit input. Inline placeholder inputs live for the lifetime of the mounted panel. Markdown uses the current target and retains other placeholders.
- A new tool typed into a check/command form becomes a custom tool. Custom tool library commands are shared with all checks linked to that tool; commands attached directly to a check remain scoped to it.
- Export JSON backs up custom data and notes; completion progress and Current target are not included. Use markdown to export completion state.
- Only the five supplied domains are supported. Custom categories can be added inside any of them.
- Some checklist references are browser services, GUI workflows, legacy tools, or ambiguous project names. These remain linked with zero curated commands rather than fabricated CLI flags. `npm run commands:report` currently lists 40 checks with gaps and a reason for each missing tool. Add tool aliases to `src/data/toolRegistry.json` and examples to `src/data/commands.json`, then run `npm run commands:map`.
- Commands are copyable text; the app never executes them. Placeholder replacement is literal, without shell escaping. Commands using `printf`, pipes, or redirection assume a POSIX-style shell. Supply arguments appropriate for your shell and installed tool. Some tools need API credentials, platform setup, or elevated privileges.
- A browser storage quota or disabled storage can prevent persistence; export JSON to keep a backup. Data stays in this browser. Google Fonts is optional styling; system font fallbacks work without network access.

## Code guide

- `src/components/CommandPanel.tsx`, `CommandBlock.tsx`, `AddCheckForm.tsx`, `AddCommandForm.tsx`, `ToolsView.tsx`: requested components.
- `src/lib/fillCommand.ts`: all placeholder parsing and literal substitution.
- `src/hooks/useCustomChecklist.ts`: versioned custom storage and write warnings.
- `src/lib/customData.ts`: import validation, conflict counts, and merge rules.
- `src/lib/model.ts`: built-in/custom composition, links, search, and command scope.
- `src/lib/markdown.ts`: markdown with safe code fences.
- `scripts/tool-matching.mjs`: case-insensitive, boundary-aware tool alias matching.
- `tests/core.test.ts`: placeholder edge cases, import validation, merge conflicts, command isolation, markdown, and catalog integrity.

## Command references

Core examples were checked against official documentation where available:

- [Nmap reference](https://nmap.org/book/man.html)
- [ProjectDiscovery tools](https://projectdiscovery.io/open-source)
- [Subfinder](https://github.com/projectdiscovery/subfinder), [httpx](https://github.com/projectdiscovery/httpx)
- [ffuf](https://github.com/ffuf/ffuf), [Gobuster](https://github.com/OJ/gobuster)
- [sqlmap usage](https://github.com/sqlmapproject/sqlmap/wiki/Usage)
- [JADX](https://github.com/skylot/jadx), [Frida processes](https://frida.re/docs/frida-ps/)
- [Objection usage](https://github.com/sensepost/objection/wiki/Using-objection)
- [mitmproxy stable documentation](https://docs.mitmproxy.org/stable/)
- [Amass user guide](https://github.com/owasp-amass/amass/wiki/User-Guide)

The Amass wiki spans older versions, and Objection changed its session command; their examples intentionally retain the verify badge. Other unverified entries also carry the badge. Tool binaries were not installed or executed as part of app validation.

Only test targets you are authorized to test.
