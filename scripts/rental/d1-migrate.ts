import * as fs from "fs";
import * as path from "path";
import * as crypto from "crypto";
// @ts-ignore
import ws from "ws";
import { Client, neonConfig, neon } from "@neondatabase/serverless";

neonConfig.webSocketConstructor = ws;

function calculateFileSha256(filePath: string): string {
  const content = fs.readFileSync(filePath);
  return crypto.createHash("sha256").update(content).digest("hex");
}

export async function executeD1Migration(prodCs: string) {
  console.log("================================================================================");
  console.log("       LA CÀ ĐÀ NẴNG — STAGE D1 PRODUCTION SCHEMA MIGRATION EXECUTION           ");
  console.log("================================================================================");

  const rootDir = path.resolve(__dirname, "..", "..");
  const proposalPath = path.join(rootDir, "docs", "RENTAL_DATABASE_PROPOSAL.md");
  const migrationPath = path.join(rootDir, "scripts", "rental", "migrations", "001_rental_schema_v2.1.sql");

  const migrationHash = calculateFileSha256(migrationPath);
  const migrationSql = fs.readFileSync(migrationPath, "utf8");

  console.log(`\n[1] Verifying Migration File:`);
  console.log(`  Path:   ${migrationPath}`);
  console.log(`  SHA256: ${migrationHash}`);

  // 1. Preflight baseline check
  const client = new Client(prodCs);
  await client.connect();

  console.log(`\n[2] Connecting stateful PostgreSQL session to Production...`);
  const sessionCheck = await client.query("SELECT current_database() as db, current_schema() as schema, current_user as usr;");
  console.log(`  Session: db=${sessionCheck.rows[0].db}, schema=${sessionCheck.rows[0].schema}, user=${sessionCheck.rows[0].usr}`);

  const preRentalCheck = await client.query(
    "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name LIKE 'rental_%';"
  );
  if (preRentalCheck.rows.length > 0) {
    throw new Error(`ABORT: Rental tables already exist: ${preRentalCheck.rows.map((r: any) => r.table_name).join(", ")}`);
  }
  console.log("  Preflight Check: 0 rental tables confirmed before write.");

  // Baseline row counts of all 7 core tables
  const baseAdmin = (await client.query("SELECT count(*)::int as c FROM administrative_units;")).rows[0].c;
  const baseTags = (await client.query("SELECT count(*)::int as c FROM tags;")).rows[0].c;
  const baseTagTrans = (await client.query("SELECT count(*)::int as c FROM tag_translations;")).rows[0].c;
  const basePlaces = (await client.query("SELECT count(*)::int as c FROM places;")).rows[0].c;
  const basePlaceTags = (await client.query("SELECT count(*)::int as c FROM place_tags;")).rows[0].c;
  const basePlaceTrans = (await client.query("SELECT count(*)::int as c FROM place_translations;")).rows[0].c;
  const baseAnalytics = (await client.query("SELECT count(*)::int as c FROM analytics_events;")).rows[0].c;

  console.log(`  Preflight Baseline (7 core tables):`);
  console.log(`    administrative_units: ${baseAdmin}`);
  console.log(`    tags:                 ${baseTags}`);
  console.log(`    tag_translations:     ${baseTagTrans}`);
  console.log(`    places:               ${basePlaces}`);
  console.log(`    place_tags:           ${basePlaceTags}`);
  console.log(`    place_translations:   ${basePlaceTrans}`);
  console.log(`    analytics_events:     ${baseAnalytics}`);

  // 2. Atomic Transaction Execution
  console.log(`\n[3] Executing Atomic Transaction (BEGIN -> DDL -> COMMIT)...`);
  await client.query("BEGIN;");
  try {
    await client.query(migrationSql);
    await client.query("COMMIT;");
    console.log("  TRANSACTION COMMITTED SUCCESSFULLY.");
  } catch (err) {
    console.error("  TRANSACTION FAILED. Executing ROLLBACK...");
    await client.query("ROLLBACK;");
    throw err;
  }

  // 3. Post-migration Verification
  console.log(`\n[4] Running Post-Migration Verification (SELECT ONLY):`);
  const postRentalTables = await client.query(
    "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name LIKE 'rental_%' ORDER BY table_name;"
  );
  const createdTables = postRentalTables.rows.map((r: any) => r.table_name);
  console.log(`  Created Rental Tables (${createdTables.length}/4): ${createdTables.join(", ")}`);
  if (createdTables.length !== 4) {
    throw new Error(`Expected exactly 4 rental tables, found ${createdTables.length}`);
  }

  // Check 0 rows in each rental table
  const mCount = (await client.query("SELECT count(*)::int as c FROM rental_vehicle_models;")).rows[0].c;
  const vCount = (await client.query("SELECT count(*)::int as c FROM rental_vehicles;")).rows[0].c;
  const mediaCount = (await client.query("SELECT count(*)::int as c FROM rental_vehicle_media;")).rows[0].c;
  const cCount = (await client.query("SELECT count(*)::int as c FROM rental_contact_settings;")).rows[0].c;

  console.log(`  Empty Table Verification: models=${mCount}/0, vehicles=${vCount}/0, media=${mediaCount}/0, contact=${cCount}/0`);
  if (mCount !== 0 || vCount !== 0 || mediaCount !== 0 || cCount !== 0) {
    throw new Error("Rental tables are NOT empty after D1!");
  }

  // Check the 3 created indexes
  const indexCheck = await client.query(`
    SELECT indexname, tablename, indexdef 
    FROM pg_indexes 
    WHERE schemaname = 'public' AND tablename LIKE 'rental_%'
    ORDER BY tablename, indexname;
  `);
  console.log(`\n  Verified Indexes on Rental Tables (${indexCheck.rows.length} total indexes):`);
  for (const idx of indexCheck.rows) {
    console.log(`    [${idx.tablename}] ${idx.indexname} -> ${idx.indexdef}`);
  }

  // Check column defaults (active DEFAULT false)
  const defaultCheck = await client.query(`
    SELECT table_name, column_name, column_default 
    FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name LIKE 'rental_%' AND column_name = 'active'
    ORDER BY table_name;
  `);
  console.log("\n  Column 'active' Defaults:");
  for (const col of defaultCheck.rows) {
    console.log(`    [${col.table_name}] ${col.column_name} DEFAULT = ${col.column_default}`);
  }

  // Check constraints (CHECK, FK, UNIQUE, PK)
  const constraintCheck = await client.query(`
    SELECT r.relname as table_name, c.conname, c.contype, pg_get_constraintdef(c.oid) as def
    FROM pg_constraint c
    JOIN pg_class r ON c.conrelid = r.oid
    JOIN pg_namespace n ON r.relnamespace = n.oid
    WHERE n.nspname = 'public' AND r.relname LIKE 'rental_%'
    ORDER BY r.relname, c.contype, c.conname;
  `);
  console.log(`\n  Verified Constraints on Rental Tables (${constraintCheck.rows.length} total constraints):`);
  for (const con of constraintCheck.rows) {
    console.log(`    [${con.table_name}] (${con.contype}) ${con.conname}: ${con.def}`);
  }

  // Check 7 core tables baseline comparison
  const postAdmin = (await client.query("SELECT count(*)::int as c FROM administrative_units;")).rows[0].c;
  const postTags = (await client.query("SELECT count(*)::int as c FROM tags;")).rows[0].c;
  const postTagTrans = (await client.query("SELECT count(*)::int as c FROM tag_translations;")).rows[0].c;
  const postPlaces = (await client.query("SELECT count(*)::int as c FROM places;")).rows[0].c;
  const postPlaceTags = (await client.query("SELECT count(*)::int as c FROM place_tags;")).rows[0].c;
  const postPlaceTrans = (await client.query("SELECT count(*)::int as c FROM place_translations;")).rows[0].c;
  const postAnalytics = (await client.query("SELECT count(*)::int as c FROM analytics_events;")).rows[0].c;

  const coreUnaffected = 
    baseAdmin === postAdmin &&
    baseTags === postTags &&
    baseTagTrans === postTagTrans &&
    basePlaces === postPlaces &&
    basePlaceTags === postPlaceTags &&
    basePlaceTrans === postPlaceTrans &&
    baseAnalytics === postAnalytics;

  console.log(`\n  Core Tables Protection Check (7 tables):`);
  console.log(`    administrative_units: ${postAdmin}/${baseAdmin} (${postAdmin === baseAdmin ? 'MATCH' : 'MISMATCH'})`);
  console.log(`    tags:                 ${postTags}/${baseTags} (${postTags === baseTags ? 'MATCH' : 'MISMATCH'})`);
  console.log(`    tag_translations:     ${postTagTrans}/${baseTagTrans} (${postTagTrans === baseTagTrans ? 'MATCH' : 'MISMATCH'})`);
  console.log(`    places:               ${postPlaces}/${basePlaces} (${postPlaces === basePlaces ? 'MATCH' : 'MISMATCH'})`);
  console.log(`    place_tags:           ${postPlaceTags}/${basePlaceTags} (${postPlaceTags === basePlaceTags ? 'MATCH' : 'MISMATCH'})`);
  console.log(`    place_translations:   ${postPlaceTrans}/${basePlaceTrans} (${postPlaceTrans === basePlaceTrans ? 'MATCH' : 'MISMATCH'})`);
  console.log(`    analytics_events:     ${postAnalytics}/${baseAnalytics} (${postAnalytics === baseAnalytics ? 'MATCH' : 'MISMATCH'})`);
  console.log(`  Overall Core Tables Status: ${coreUnaffected ? "PASS (100% Unaffected)" : "FAIL"}`);

  if (!coreUnaffected) {
    throw new Error("CRITICAL: Core tables row counts changed during migration!");
  }

  await client.end();

  console.log("\n================================================================================");
  console.log("       STAGE D1 MIGRATION COMPLETE — STOPPING FOR CHATGPT & OWNER REVIEW        ");
  console.log("================================================================================");

  return {
    migrationHash,
    createdTables,
    counts: { models: mCount, vehicles: vCount, media: mediaCount, contact: cCount },
    coreUnaffected,
    indexes: indexCheck.rows,
    constraints: constraintCheck.rows
  };
}

if (require.main === module) {
  const { execSync } = require("child_process");
  const projectId = "flat-lake-94547160";
  const branchId = "br-shiny-band-b3mlezx7";
  console.log(`\n[0] Neon Target Metadata:`);
  console.log(`  Project ID:          ${projectId}`);
  console.log(`  Branch ID:           ${branchId} (production)`);
  const prodCs = execSync(`npx -y neonctl connection-string ${branchId} --project-id ${projectId}`, { encoding: "utf8" }).trim();
  const maskedCs = prodCs.replace(/:[^:@]+@/, ":***@");
  console.log(`  Connection Endpoint: ${maskedCs}`);

  executeD1Migration(prodCs).catch(err => {
    console.error("FATAL ERROR in d1-migrate:", err);
    process.exit(1);
  });
}
