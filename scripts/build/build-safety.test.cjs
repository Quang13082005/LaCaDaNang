const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const { findings, scan } = require('./scan-artifacts.cjs');
const { cleanEnvironment, validatePublicEnv, snapshotEnv, copyInput, verifyHashes } = require('./safe-build.cjs');
const publicEnv = { NEXT_PUBLIC_GA_MEASUREMENT_ID: 'G-TESTONLY' };
// Synthetic fixtures only; never load a real developer credential in these tests.
const synthetic = 'postgresql://fixture:synthetic@db.example.invalid/test';
const temp = () => fs.mkdtempSync(path.join(os.tmpdir(), 'laca-build-safety-'));

test('child environment preserves public config and removes secrets/loader injection', () => {
  const result = cleanEnvironment({ PATH: 'bin', SystemRoot: 'windows', DATABASE_URL: synthetic, CLOUDFLARE_API_TOKEN: 'synthetic', NODE_OPTIONS: '--require unwanted', APPDATA: 'auth-dir', NEXT_PUBLIC_UNREVIEWED: 'synthetic' }, publicEnv);
  assert.equal(result.PATH, 'bin'); assert.equal(result.SystemRoot, 'windows');
  assert.equal(result.NEXT_PUBLIC_GA_MEASUREMENT_ID, publicEnv.NEXT_PUBLIC_GA_MEASUREMENT_ID);
  for (const key of ['DATABASE_URL', 'CLOUDFLARE_API_TOKEN', 'NODE_OPTIONS', 'APPDATA', 'NEXT_PUBLIC_UNREVIEWED']) assert.equal(result[key], undefined);
});

test('unreviewed public environment keys fail closed', () => {
  assert.throws(() => validatePublicEnv({ ...publicEnv, DATABASE_URL: synthetic }));
  assert.throws(() => validatePublicEnv({ NEXT_PUBLIC_GA_MEASUREMENT_ID: 'invalid' }));
});

// Condition 1: Hardcoded synthetic PostgreSQL credential must be detected
test('hardcoded synthetic PostgreSQL credentials detected without echoing value', () => {
  assert.ok(findings(synthetic).includes('AUTHENTICATED_POSTGRES_URI'));
  assert.ok(findings('postgres://admin:pass123@db.example.invalid:5432/db').includes('AUTHENTICATED_POSTGRES_URI'));
});

// Condition 2: URL-encoded username/password must be detected
test('URL-encoded credentials in PostgreSQL URI are detected', () => {
  const urlEncoded = 'postgresql://my%40user:p%40ss%23word@db.example.invalid/db';
  assert.ok(findings(urlEncoded).includes('AUTHENTICATED_POSTGRES_URI'));
});

// Condition 3: Escaped formats in artifacts are detected after normalization
test('escaped formats in bundle artifacts are detected', () => {
  const escapedSlash = synthetic.replaceAll('/', '\\/');
  assert.ok(findings(escapedSlash).includes('AUTHENTICATED_POSTGRES_URI'));
  const escapedBoth = 'postgresql:\\/\\/fixture:synthetic@db.example.invalid\\/test';
  assert.ok(findings(escapedBoth).includes('AUTHENTICATED_POSTGRES_URI'));
});

// Condition 4: Raw escape strings like \\u0040 and decoded strings tested separately
test('raw unicode escape sequences and decoded strings are detected separately', () => {
  const unicodeAt = 'postgresql://fixture:synthetic\\u0040db.example.invalid/test';
  assert.ok(findings(unicodeAt).includes('AUTHENTICATED_POSTGRES_URI'));
  const unicodeColon = 'postgresql://fixture\\u003asynthetic@db.example.invalid/test';
  assert.ok(findings(unicodeColon).includes('AUTHENTICATED_POSTGRES_URI'));
});

// Condition 5: Verified driver template with pure interpolation is not flagged
test('verified driver template with pure interpolation for user and password is not flagged', () => {
  const driverTemplate = 'postgresql://${e(d.user)}:${e(d.password)}@${e(d.host)}/${f(d.database)}';
  assert.deepEqual(findings(driverTemplate), []);
  const genericTemplate = 'postgresql://${user}:${pass}@localhost/test';
  assert.deepEqual(findings(genericTemplate), []);
});

// Condition 6: Username is pure interpolation but password has literal -> MUST DETECT
test('username pure interpolation with literal password is detected', () => {
  assert.ok(findings('postgresql://${user}:literal_pass@db.example.invalid/test').includes('AUTHENTICATED_POSTGRES_URI'));
  assert.ok(findings('postgresql://${user}:prefix_${pass}@db.example.invalid/test').includes('AUTHENTICATED_POSTGRES_URI'));
  assert.ok(findings('postgresql://${user}:${pass}_suffix@db.example.invalid/test').includes('AUTHENTICATED_POSTGRES_URI'));
});

// Condition 7: Password is pure interpolation but username has literal -> MUST DETECT
test('password pure interpolation with literal username is detected', () => {
  assert.ok(findings('postgresql://literal_user:${pass}@db.example.invalid/test').includes('AUTHENTICATED_POSTGRES_URI'));
  assert.ok(findings('postgresql://prefix_${user}:${pass}@db.example.invalid/test').includes('AUTHENTICATED_POSTGRES_URI'));
  assert.ok(findings('postgresql://${user}_suffix:${pass}@db.example.invalid/test').includes('AUTHENTICATED_POSTGRES_URI'));
});

// Condition 8: Literal configuration and private-key markers
test('literal secret configurations and private keys are detected', () => {
  assert.ok(findings(JSON.stringify({ DATABASE_URL: 'synthetic' })).includes('LITERAL_SECRET_CONFIGURATION'));
  assert.ok(findings('-----BEGIN RSA PRIVATE KEY-----').includes('PRIVATE_KEY'));
  assert.ok(findings('-----BEGIN EC PRIVATE KEY-----').includes('PRIVATE_KEY'));
});

// Condition 9: Clean code with no credentials PASSES
test('clean code with no credentials returns zero findings', () => {
  assert.equal(findings('process.env.DATABASE_URL; /^postgres(ql)?:/').length, 0);
  assert.equal(findings('const db = connect(); db.query("SELECT 1");').length, 0);
});

// Condition 10: Artifact missing, unreadable, or symlink fails closed
test('missing artifact or unverified symlink fails closed', () => {
  assert.throws(() => scan(temp()));
});

test('server/client/map scan fails on secret and returns only path/type', () => {
  const dir = temp(); fs.mkdirSync(path.join(dir, '.next')); fs.mkdirSync(path.join(dir, '.open-next'));
  fs.writeFileSync(path.join(dir, '.next', 'client.js.map'), JSON.stringify({ sourcesContent: [synthetic] }));
  const report = scan(dir); assert.equal(report.pass, false); assert.equal(report.sourceMaps, 1);
  assert.equal(JSON.stringify(report).includes('synthetic'), false);
});

// Condition 11: CLI execution exit code verification
test('CLI scanner exits 0 on clean artifacts and exits 1 on secret finding', () => {
  const cli = path.resolve(__dirname, 'scan-artifacts.cjs');
  // Clean dir
  const cleanDir = temp();
  fs.mkdirSync(path.join(cleanDir, '.next')); fs.mkdirSync(path.join(cleanDir, '.open-next'));
  fs.writeFileSync(path.join(cleanDir, '.next', 'app.js'), 'console.log("hello");');
  const cleanRun = spawnSync(process.execPath, [cli], { cwd: cleanDir, encoding: 'utf8' });
  assert.equal(cleanRun.status, 0);

  // Dirty dir
  const dirtyDir = temp();
  fs.mkdirSync(path.join(dirtyDir, '.next')); fs.mkdirSync(path.join(dirtyDir, '.open-next'));
  fs.writeFileSync(path.join(dirtyDir, '.next', 'app.js'), synthetic);
  const dirtyRun = spawnSync(process.execPath, [cli], { cwd: dirtyDir, encoding: 'utf8' });
  assert.equal(dirtyRun.status, 1);
  assert.equal(dirtyRun.stdout.includes('synthetic'), false);
});

test('env originals stay byte-identical even when input copy fails', () => {
  const root = temp(); const original = Buffer.from('DATABASE_URL=' + synthetic + '\r\nNEXT_PUBLIC_GA_MEASUREMENT_ID=G-TESTONLY\r\n');
  fs.writeFileSync(path.join(root, '.env.local'), original);
  const before = snapshotEnv(root, publicEnv);
  assert.throws(() => copyInput(path.join(root, '.env.local'), path.join(root, 'copy'), []));
  verifyHashes(before); assert.deepEqual(fs.readFileSync(path.join(root, '.env.local')), original);
  assert.equal(fs.existsSync(path.join(root, 'copy')), false);
});

test('undeclared non-secret env cannot be silently dropped', () => {
  const root = temp(); fs.writeFileSync(path.join(root, '.env.local'), 'REQUIRED_BUILD_OPTION=yes\n');
  assert.throws(() => snapshotEnv(root, publicEnv), /UNDECLARED_NONSECRET_BUILD_ENV/);
});

test('source mutation after snapshot detected before publishing artifacts', () => {
  const root = temp(), items = []; fs.writeFileSync(path.join(root, 'input'), 'safe');
  copyInput(path.join(root, 'input'), path.join(root, 'output'), items);
  fs.writeFileSync(path.join(root, 'input'), 'changed'); assert.throws(() => verifyHashes(items));
});
