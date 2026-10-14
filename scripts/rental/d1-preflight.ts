import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { neon } from "@neondatabase/serverless";

function calculateFileSha256(filePath: string): string {
  const content = fs.readFileSync(filePath);
  return crypto.createHash("sha256").update(content).digest("hex");
}

function runNeonctl(args: string): any {
  const cmd = `npx -y neonctl ${args}`;
  const out = execSync(cmd, { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
  try {
    return JSON.parse(out.trim());
  } catch {
    return out.trim();
  }
}

async function main() {
  console.log("================================================================================");
  console.log("       LA CÀ ĐÀ NẴNG — STAGE D1 MANDATORY READ-ONLY PREFLIGHT AUDIT             ");
  console.log("================================================================================");

  const rootDir = path.resolve(__dirname, "..", "..");
  const proposalPath = path.join(rootDir, "docs", "RENTAL_DATABASE_PROPOSAL.md");
  const migrationPath = path.join(rootDir, "scripts", "rental", "migrations", "001_rental_schema_v2.1.sql");
  const envLocalPath = path.join(rootDir, ".env.local");

  // 1. Artifact Verification & Hashes
  console.log("\n[1] Artifact Verification & Hashes:");
  const proposalHash = calculateFileSha256(proposalPath);
  const migrationHash = calculateFileSha256(migrationPath);
  console.log(`  Proposal SHA256:  ${proposalHash}`);
  console.log(`  Migration SHA256: ${migrationHash}`);

  const proposalContent = fs.readFileSync(proposalPath, "utf8");
  const migrationSql = fs.readFileSync(migrationPath, "utf8");

  // Verify that migration SQL matches proposal DDL
  const ddlBlockStart = proposalContent.indexOf("```sql\nCREATE TABLE rental_vehicle_models");
  const ddlBlockEnd = proposalContent.indexOf("```", ddlBlockStart + 6);
  let proposalDdl = "";
  if (ddlBlockStart !== -1 && ddlBlockEnd !== -1) {
    proposalDdl = proposalContent.substring(ddlBlockStart + 7, ddlBlockEnd).trim();
  }

  // Normalize whitespace for exact SQL comparison
  const normalizeSql = (s: string) => s.replace(/--.*$/gm, "").replace(/\s+/g, " ").trim();
  const ddlMatches = normalizeSql(proposalDdl) === normalizeSql(migrationSql);
  console.log(`  DDL Exact Match with Proposal V2.1: ${ddlMatches ? "YES (100% Exact Match)" : "NO"}`);
  if (!ddlMatches) {
    throw new Error("FATAL: Migration SQL does not match DDL block in Proposal V2.1!");
  }

  // 2. Discover Neon Target via Neon API
  console.log("\n[2] Discovering Neon Project & Production Target via Neon API:");
  const projects = runNeonctl("projects list --org-id org-rough-leaf-83854871 --output json");
  const targetProject = Array.isArray(projects)
    ? projects.find((p: any) => p.name === "la-ca-da-nang" || p.id === "flat-lake-94547160")
    : null;
  if (!targetProject) throw new Error("Could not find project 'la-ca-da-nang' in Neon API!");

  const projectId = targetProject.id;
  const projectName = targetProject.name;
  const projectRegion = targetProject.region_id;
  console.log(`  Project ID:   ${projectId}`);
  console.log(`  Project Name: ${projectName}`);
  console.log(`  Region:       ${projectRegion}`);

  const branches = runNeonctl(`branches list --project-id ${projectId} --output json`);
  const prodBranch = branches.find((b: any) => b.default === true && b.primary === true);
  if (!prodBranch) throw new Error("Could not find primary/default branch in Neon project!");

  const prodBranchId = prodBranch.id;
  const prodBranchName = prodBranch.name;
  console.log(`  Production Branch ID:   ${prodBranchId}`);
  console.log(`  Production Branch Name: ${prodBranchName}`);
  console.log(`  Is Default / Primary:   ${prodBranch.default} / ${prodBranch.primary}`);

  // Get Production Connection String dynamically
  const prodCs = runNeonctl(`connection-string ${prodBranchId} --project-id ${projectId}`);
  const csMatch = prodCs.match(/postgres(?:ql)?:\/\/([^:]+):([^@]+)@([^/:]+)(?::(\d+))?\/([^?]+)/);
  if (!csMatch) throw new Error("Could not parse production connection string!");

  const dbRole = csMatch[1];
  const dbHost = csMatch[3];
  const dbName = csMatch[5];
  console.log(`  Target Host:     ${dbHost}`);
  console.log(`  Target Database: ${dbName}`);
  console.log(`  Connection Role: ${dbRole}`);

  // Check matching with .env.local DATABASE_URL without printing credentials
  if (fs.existsSync(envLocalPath)) {
    const envContent = fs.readFileSync(envLocalPath, "utf8");
    const m = envContent.match(/DATABASE_URL=postgres(?:ql)?:\/\/[^@]+@([^/]+)\/([^?]+)/);
    if (m) {
      const envHost = m[1];
      const envDb = m[2];
      const hostMatch = envHost === dbHost;
      console.log(`  Matches .env.local DATABASE_URL Host: ${hostMatch ? "YES (" + envHost + ")" : "NO (" + envHost + " vs " + dbHost + ")"}`);
    }
  }

  // 3. Read-Only Production Database Audit
  console.log("\n[3] Connecting Read-Only to Neon Production Database...");
  const sql = neon(prodCs);

  const verRes = await sql`SELECT version() as ver;`;
  const pgVersion = verRes[0].ver;
  console.log(`  PostgreSQL Engine: ${pgVersion}`);

  const uuidRes = await sql`SELECT gen_random_uuid() as uuid;`;
  console.log(`  gen_random_uuid() Test: PASS (Sample: ${uuidRes[0].uuid})`);

  const sessionInfo = await sql`SELECT current_database() as db, current_schema() as schema, current_user as usr;`;
  console.log(`  Database Context: db=${sessionInfo[0].db}, schema=${sessionInfo[0].schema}, user=${sessionInfo[0].usr}`);

  // Check existing core tables and row counts
  console.log("\n[4] Existing Core Tables Baseline:");
  const coreTables = [
    "administrative_units",
    "tags",
    "tag_translations",
    "places",
    "place_tags",
    "place_translations",
    "analytics_events"
  ];

  const tableCounts: Record<string, number> = {};
  for (const tbl of coreTables) {
    try {
      const res = await sql.query(`SELECT count(*)::int as c FROM ${tbl};`);
      tableCounts[tbl] = res[0].c;
      console.log(`  Table [${tbl}]: ${res[0].c} rows`);
    } catch (e: any) {
      console.log(`  Table [${tbl}]: ERROR (${e.message})`);
    }
  }

  // Check if any rental_* tables already exist
  console.log("\n[5] Rental Tables Preflight Check (Must be 0):");
  const rentalTablesRes = await sql`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_name LIKE 'rental_%';
  `;
  const existingRentalTables = rentalTablesRes.map((r: any) => r.table_name);
  console.log(`  Existing Rental Tables Count: ${existingRentalTables.length}`);
  if (existingRentalTables.length > 0) {
    console.log(`  WARNING: Found existing rental tables: ${existingRentalTables.join(", ")}`);
  } else {
    console.log("  CONFIRMED: Exactly 0 rental_* tables exist on Neon Production.");
  }

  // Check if any conflicting indexes exist
  const existingIndexesRes = await sql`
    SELECT indexname 
    FROM pg_indexes 
    WHERE schemaname = 'public' AND indexname LIKE 'rental_%';
  `;
  console.log(`  Existing Rental Indexes Count: ${existingIndexesRes.length}`);

  console.log("\n================================================================================");
  console.log("       PREFLIGHT AUDIT COMPLETE — STOPPING FOR OWNER APPROVAL                   ");
  console.log("================================================================================");
}

main().catch(err => {
  console.error("FATAL ERROR in d1-preflight:", err);
  process.exit(1);
});
