// Only paths and finding categories may leave this scanner. Never print matches.
const fs = require('node:fs');
const path = require('node:path');

function findings(text) {
  const normalized = text.replace(/\\u00([0-9a-f]{2})/gi, (_, h) => String.fromCharCode(parseInt(h, 16))).replace(/\\\//g, '/');
  const result = [];
  const isPureInterpolation = (part) => /^\$\{[^{}]+\}$/.test(part);
  for (const match of normalized.matchAll(/postgres(?:ql)?:\/\/([^\s"'`<>/]+):([^\s"'`<>]*)(?=@)/gi)) {
    const user = match[1];
    const pass = match[2];
    if (!(isPureInterpolation(user) && isPureInterpolation(pass))) {
      if (!result.includes('AUTHENTICATED_POSTGRES_URI')) {
        result.push('AUTHENTICATED_POSTGRES_URI');
      }
    }
  }
  if (/["'](?:DATABASE_URL|[A-Z_]*(?:SECRET|PASSWORD|PRIVATE_KEY|API_TOKEN))["']\s*:\s*["'][^"']+/i.test(normalized)) result.push('LITERAL_SECRET_CONFIGURATION');
  if (/-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/.test(normalized)) result.push('PRIVATE_KEY');
  return result;
}

function scan(root, directories = ['.next', '.open-next']) {
  const report = { pass: true, files: 0, sourceMaps: 0, findings: [] };
  function walk(file) {
    const stat = fs.lstatSync(file);
    if (stat.isSymbolicLink()) throw new Error('ARTIFACT_SYMLINK_UNVERIFIED');
    if (stat.isDirectory()) { for (const name of fs.readdirSync(file)) walk(path.join(file, name)); return; }
    report.files++;
    if (file.endsWith('.map')) report.sourceMaps++;
    for (const type of findings(fs.readFileSync(file).toString('utf8'))) report.findings.push({ file: path.relative(root, file), type });
  }
  for (const dir of directories) {
    const absolute = path.resolve(root, dir);
    if (!absolute.startsWith(path.resolve(root) + path.sep) || !fs.existsSync(absolute)) throw new Error('ARTIFACT_MISSING_OR_OUTSIDE_ROOT');
    walk(absolute);
  }
  report.pass = report.findings.length === 0;
  return report;
}

module.exports = { findings, scan };
if (require.main === module) {
  try { const report = scan(process.cwd()); console.log(JSON.stringify(report, null, 2)); if (!report.pass) process.exitCode = 1; }
  catch { console.error('ARTIFACT_SCAN_FAILED_CLOSED'); process.exitCode = 1; }
}
