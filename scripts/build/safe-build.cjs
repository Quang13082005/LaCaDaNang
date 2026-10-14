// Build a source snapshot with NO local credential files and NO inherited secrets.
// Originals never move/change, so cancellation/crash cannot lose .env.local.
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { spawnSync } = require('node:child_process');
const { scan, findings } = require('./scan-artifacts.cjs');

const INPUTS = ['src', 'public', 'package.json', 'package-lock.json', 'next-env.d.ts', 'next.config.ts', 'open-next.config.ts', 'wrangler.jsonc', 'tsconfig.json', 'postcss.config.mjs', 'eslint.config.mjs'];
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const envFile = name => /^\.env(?:\.|$)/.test(name) || /^\.dev\.vars(?:\.|$)/.test(name);
function cleanEnvironment(parent, publicEnv) {
  const env = {};
  const allowed = /^(PATH|PATHEXT|SYSTEMROOT|WINDIR|COMSPEC|TEMP|TMP|TMPDIR|SYSTEMDRIVE|NUMBER_OF_PROCESSORS|PROCESSOR_ARCHITECTURE|LANG|LC_ALL)$/i;
  for (const [k, v] of Object.entries(parent)) if (allowed.test(k)) env[k] = v;
  // No HOME/APPDATA OAuth access, DATABASE_URL, NODE_OPTIONS or arbitrary NEXT_PUBLIC_* inheritance.
  return { ...env, ...publicEnv, NODE_ENV: 'production', NEXT_TELEMETRY_DISABLED: '1', CI: '1' };
}
function validatePublicEnv(config) {
  if (Object.keys(config).some(k => k !== 'NEXT_PUBLIC_GA_MEASUREMENT_ID') || !/^G-[A-Z0-9]+$/.test(config.NEXT_PUBLIC_GA_MEASUREMENT_ID)) throw new Error('PUBLIC_BUILD_ENV_REQUIRES_REVIEW');
  return config;
}
function snapshotEnv(root, publicEnv) {
  const snapshots = [];
  for (const name of fs.readdirSync(root).filter(envFile)) {
    const file = path.join(root, name);
    if (!fs.lstatSync(file).isFile()) throw new Error('ENV_FILE_TYPE_UNSUPPORTED');
    snapshots.push({ file, hash: hash(file) });
    if (name.endsWith('.example')) continue;
    // Inspect NAMES only, never parse/store/print secret values.
    const names = [...fs.readFileSync(file, 'utf8').matchAll(/^\s*(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=/gm)].map(m => m[1]);
    if (names.some(k => !/DATABASE_URL|SECRET|TOKEN|PASSWORD|PRIVATE_KEY/.test(k) && !(k in publicEnv))) throw new Error('UNDECLARED_NONSECRET_BUILD_ENV');
  }
  return snapshots;
}
function copyInput(from, to, inventory) {
  const stat = fs.lstatSync(from);
  if (stat.isSymbolicLink()) throw new Error('SOURCE_SYMLINK_REQUIRES_REVIEW');
  if (envFile(path.basename(from))) throw new Error('ENV_FILE_IN_SOURCE_INPUT');
  if (stat.isDirectory()) { fs.mkdirSync(to, { recursive: true }); for (const name of fs.readdirSync(from)) copyInput(path.join(from, name), path.join(to, name), inventory); }
  else {
    // Stop before copying if a source file itself contains a literal secret pattern.
    if (findings(fs.readFileSync(from).toString('utf8')).length) throw new Error('SOURCE_SECRET_PATTERN_BLOCKED');
    fs.mkdirSync(path.dirname(to), { recursive: true }); fs.copyFileSync(from, to);
    inventory.push({ file: from, hash: hash(from) });
  }
}
function verifyHashes(items) { if (items.some(x => !fs.existsSync(x.file) || hash(x.file) !== x.hash)) throw new Error('ORIGINAL_INPUT_CHANGED'); }
function runBuild(root, mode) {
  if (!['next', 'worker'].includes(mode)) throw new Error('INVALID_BUILD_MODE');
  const publicEnv = validatePublicEnv(JSON.parse(fs.readFileSync(path.join(root, 'scripts/build/public-env.json'), 'utf8')));
  const protectedEnv = snapshotEnv(root, publicEnv);
  const parent = path.dirname(root);
  // OpenNext detects workspace roots. Never build under an ancestor containing env files.
  for (let p = parent; ; p = path.dirname(p)) {
    if (fs.readdirSync(p).some(n => envFile(n) && !n.endsWith('.example'))) throw new Error('ANCESTOR_ENV_REQUIRES_REVIEW');
    if (path.dirname(p) === p) break;
  }
  const workspace = fs.mkdtempSync(path.join(parent, 'LACA_SECRET_FREE_BUILD_'));
  const inventory = [];
  console.log(`Isolated build workspace: ${workspace}`);
  try {
    for (const name of INPUTS) if (fs.existsSync(path.join(root, name))) copyInput(path.join(root, name), path.join(workspace, name), inventory);
    // A Windows junction breaks Next standalone tracing (EPERM), then OpenNext
    // resolves native sharp outside its shims. Copy installed deps; never reinstall.
    console.log('Copying installed dependencies into isolated workspace (no install).');
    fs.cpSync(path.join(root, 'node_modules'), path.join(workspace, 'node_modules'), {
      recursive: true,
      filter(file) {
        const name = path.basename(file);
        if (envFile(name) || ['.cache', '.git', '.wrangler'].includes(name)) return false;
        if (fs.lstatSync(file).isSymbolicLink()) throw new Error('DEPENDENCY_SYMLINK_REQUIRES_REVIEW');
        return true;
      },
    });
    // Internal OpenNext invokes npm run build. Keep it direct inside the sanitized snapshot.
    const pkgFile = path.join(workspace, 'package.json');
    const pkg = JSON.parse(fs.readFileSync(pkgFile, 'utf8')); pkg.scripts.build = 'next build';
    fs.writeFileSync(pkgFile, JSON.stringify(pkg, null, 2) + '\n');
    const env = cleanEnvironment(process.env, publicEnv);
    const cli = mode === 'worker' ? 'node_modules/@opennextjs/cloudflare/dist/cli/index.js' : 'node_modules/next/dist/bin/next';
    const child = spawnSync(process.execPath, [path.join(workspace, cli), 'build'], { cwd: workspace, env, stdio: 'inherit' });
    if (child.error || child.status !== 0) throw new Error('ISOLATED_BUILD_FAILED');
    const dirs = mode === 'worker' ? ['.next', '.open-next'] : ['.next'];
    const report = scan(workspace, dirs);
    console.log(JSON.stringify(report, null, 2));
    if (!report.pass) throw new Error('ARTIFACT_SECRET_GATE_FAILED');
    verifyHashes(inventory); verifyHashes(protectedEnv);
    // Preserve old generated outputs by rename (never delete/copy credential artifacts).
    // A failed build or scan never replaces existing outputs. Release always scans again.
    const previous = path.join(workspace, 'previous-artifacts'); fs.mkdirSync(previous);
    for (const dir of dirs) {
      const target = path.join(root, dir);
      if (fs.existsSync(target)) fs.renameSync(target, path.join(previous, dir));
      fs.renameSync(path.join(workspace, dir), target);
    }
    fs.writeFileSync(path.join(workspace, 'verification.json'), JSON.stringify({ mode, report, protectedEnv, inventory }, null, 2));
    console.log('PASS: clean artifacts published; originals unchanged. Runtime DATABASE_URL binding required.');
    return { workspace, report };
  } finally { verifyHashes(protectedEnv); }
}
module.exports = { cleanEnvironment, validatePublicEnv, snapshotEnv, copyInput, verifyHashes, runBuild };
if (require.main === module) {
  try { runBuild(path.resolve(__dirname, '../..'), process.argv[2]); }
  catch (e) { console.error(/^[A-Z_]+$/.test(e.message) ? e.message : 'SAFE_BUILD_FAILED_SANITIZED'); process.exitCode = 1; }
}
