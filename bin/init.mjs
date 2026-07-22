#!/usr/bin/env node
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import fs from 'node:fs';

const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const skillSource = path.join(packageRoot, 'skills', 'jibaley-ui');
const cwd = process.cwd();

const command = process.argv[2];

if (command !== 'init') {
    console.log('Usage: npx @jibaleysolution/ui init');
    process.exit(command ? 1 : 0);
}

if (!fs.existsSync(skillSource)) {
    console.error(`Could not find the skill to install at ${skillSource}. Is @jibaleysolution/ui installed correctly?`);
    process.exit(1);
}

const targets = [
    path.join(cwd, '.claude', 'skills', 'jibaley-ui'),
    path.join(cwd, '.agents', 'skills', 'jibaley-ui'),
    path.join(cwd, '.github', 'skills', 'jibaley-ui'),
];

for (const target of targets) {
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.cpSync(skillSource, target, { recursive: true, force: true });
    console.log(`Installed skill -> ${path.relative(cwd, target)}`);
}

const snippet = `
## Design system (@jibaleysolution/ui)

This project depends on \`@jibaleysolution/ui\` — a shared component kit (Card, DataTable,
StatusBadge, RowActions, Input/Select/Textarea/Toggle, FormShell, Modal,
ConfirmDialog, Pagination, EmptyState, Toaster, and more).

**Every component it provides MUST be imported from \`@jibaleysolution/ui\`. Never recreate,
copy, or fork a local version.** Full catalog + recipes: see the \`@jibaleysolution/ui\`
package's own \`AGENTS.md\` (in \`node_modules/@jibaleysolution/ui/AGENTS.md\`) and the
\`jibaley-ui\` skill installed in \`.claude/skills/\`, \`.agents/skills/\`, \`.github/skills/\`.
`;

console.log('\nAdd this section to your project CLAUDE.md / AGENTS.md:');
console.log(snippet);
