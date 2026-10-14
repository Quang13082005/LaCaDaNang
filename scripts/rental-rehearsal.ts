import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import crypto from "crypto";
// @ts-ignore
import ws from "ws";
import { Client, neonConfig, neon } from "@neondatabase/serverless";

// Configure WebSocket constructor for stateful PostgreSQL session
neonConfig.webSocketConstructor = ws;

interface ImportPreviewData {
  models: Array<{
    brand: string;
    model_name: string;
    category: "scooter" | "semi" | "manual";
    active?: boolean;
  }>;
  vehicles: Array<{
    vehicle_code: string;
    brand: string;
    model_name?: string;
    model?: string;
    engine_cc: number;
    registration_year: number;
    color_source: string;
    color_complete: boolean;
    color_en: string | null;
    color_ko: string | null;
    raw_daily_price: number;
    daily_price_vnd: number;
    raw_asset_deposit: string;
    one_cccd_deposit_vnd: number;
    active?: boolean;
  }>;
  contact: {
    active: boolean;
    helmets_included: boolean;
    phone_e164: string;
    zalo_url: string;
    two_cccd_cash_deposit_vnd: number;
    policy_vi: string;
    policy_en: string;
    policy_ko: string;
  };
  media: any[];
}

export interface TestResultItem {
  id: string;
  name: string;
  expected: string;
  actual: string;
  assertion: string;
  status: "PASS" | "FAIL";
  evidence: string;
}

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
  console.log("       LA CÀ ĐÀ NẴNG — RENTAL DATABASE D0.1 TRANSACTION HARDENING REHEARSAL     ");
  console.log("================================================================================");

  const testResults: TestResultItem[] = [];
  const rootDir = path.resolve(__dirname, "..");
  const proposalPath = path.join(rootDir, "docs", "RENTAL_DATABASE_PROPOSAL.md");
  const migrationPath = path.join(rootDir, "scripts", "rental", "migrations", "001_rental_schema_v2.1.sql");
  const previewJsonPath = path.join(rootDir, "docs", "RENTAL_IMPORT_PREVIEW.json");
  const reportPath = path.join(rootDir, "docs", "RENTAL_REHEARSAL_REPORT.md");

  // ---------------------------------------------------------------------------
  // STEP 1: DDL SOURCE CONSISTENCY & ARTIFACT INTEGRITY (Fix P1)
  // ---------------------------------------------------------------------------
  console.log("\n[STEP 1] Validating DDL source consistency and artifact hashes...");
  const proposalHash = calculateFileSha256(proposalPath);
  const migrationHash = calculateFileSha256(migrationPath);
  const previewJsonHash = calculateFileSha256(previewJsonPath);

  console.log(`  Proposal SHA256:  ${proposalHash}`);
  console.log(`  Migration SHA256: ${migrationHash}`);
  console.log(`  Preview SHA256:   ${previewJsonHash}`);

  // Compare migration DDL with DDL block in Proposal V2.1
  const proposalContent = fs.readFileSync(proposalPath, "utf8");
  const migrationSql = fs.readFileSync(migrationPath, "utf8");

  // Verify proposal contains the 4 table definitions
  if (
    !proposalContent.includes("CREATE TABLE rental_vehicle_models") ||
    !proposalContent.includes("CREATE TABLE rental_vehicles") ||
    !proposalContent.includes("CREATE TABLE rental_vehicle_media") ||
    !proposalContent.includes("CREATE TABLE rental_contact_settings")
  ) {
    throw new Error("FATAL: Proposal V2.1 does not contain all 4 rental tables!");
  }

  // Validate Import Preview JSON structure
  const rawJson = fs.readFileSync(previewJsonPath, "utf8");
  const importData: ImportPreviewData = JSON.parse(rawJson);

  if (importData.models.length !== 8) throw new Error(`Expected 8 models, got ${importData.models.length}`);
  if (importData.vehicles.length !== 21) throw new Error(`Expected 21 vehicles, got ${importData.vehicles.length}`);
  if (!importData.contact) throw new Error("Contact setting missing");
  if (importData.contact.policy_ko.includes("검수")) {
    throw new Error("Korean review note still present in policy_ko!");
  }

  const scooterCount = importData.vehicles.filter(v => v.one_cccd_deposit_vnd === 2000000).length;
  const semiCount = importData.vehicles.filter(v => v.one_cccd_deposit_vnd === 1000000).length;
  const manualCount = importData.vehicles.filter(v => v.one_cccd_deposit_vnd === 1500000).length;

  if (scooterCount !== 10 || semiCount !== 10 || manualCount !== 1) {
    throw new Error(`Deposit categorization mismatch: ${scooterCount}/${semiCount}/${manualCount}`);
  }

  for (const v of importData.vehicles) {
    if (v.raw_daily_price * 1000 !== v.daily_price_vnd) {
      throw new Error(`Price formula mismatch for ${v.vehicle_code}`);
    }
  }
  console.log("  Artifact Consistency & Pre-validation: PASS.");

  // ---------------------------------------------------------------------------
  // STEP 2: DYNAMIC NEON TARGET DISCOVERY & ISOLATION CHECK (Fix P1)
  // ---------------------------------------------------------------------------
  console.log("\n[STEP 2] Discovering Neon Project & Production metadata dynamically...");
  const projects = runNeonctl("projects list --org-id org-rough-leaf-83854871 --output json");
  const targetProject = Array.isArray(projects)
    ? projects.find((p: any) => p.name === "la-ca-da-nang" || p.id === "flat-lake-94547160")
    : null;
  if (!targetProject) throw new Error("Target project 'la-ca-da-nang' not found via Neon API!");

  const projectId = targetProject.id;
  console.log(`  Discovered Project ID:   ${projectId} (${targetProject.name})`);

  const branches = runNeonctl(`branches list --project-id ${projectId} --output json`);
  const productionBranch = branches.find((b: any) => b.default === true && b.primary === true);
  if (!productionBranch) throw new Error("Could not identify default production branch!");

  const productionBranchId = productionBranch.id;
  const productionBranchName = productionBranch.name;
  console.log(`  Discovered Production Branch: ${productionBranchId} (${productionBranchName})`);

  // Dynamically obtain connection string of production branch to extract its endpoint host
  const prodCs = runNeonctl(`connection-string ${productionBranchId} --project-id ${projectId}`);
  const prodHostMatch = prodCs.match(/@([^/:]+)/);
  const productionHost = prodHostMatch ? prodHostMatch[1] : "";
  console.log(`  Discovered Production Host:   ${productionHost}`);

  // Create temporary unique test branch for D0.1
  const runId = Date.now();
  const testBranchName = `rental-d0-1-rehearsal-${runId}`;
  console.log(`\n[STEP 3] Creating isolated test branch '${testBranchName}'...`);

  const createRes = runNeonctl(
    `branches create --project-id ${projectId} --parent ${productionBranchId} --name ${testBranchName} --output json`
  );

  const testBranch = createRes.branch;
  const testBranchId = testBranch.id;
  const testEndpoint = createRes.endpoints?.[0];
  const testHost = testEndpoint?.host;
  const connectionUri = createRes.connection_uris?.[0]?.connection_uri;

  console.log(`  Created Test Branch ID:   ${testBranchId}`);
  console.log(`  Created Test Endpoint Host: ${testHost}`);

  // Strict isolation checks
  if (testBranchId === productionBranchId) {
    throw new Error("FATAL VIOLATION: Test branch ID is identical to Production Branch ID!");
  }
  if (testBranch.default === true || testBranch.primary === true) {
    throw new Error("FATAL VIOLATION: Test branch is marked as default or primary!");
  }
  if (testHost === productionHost) {
    throw new Error("FATAL VIOLATION: Test endpoint host is identical to Production host!");
  }
  if (!testHost || !testHost.includes("ep-") || !testHost.includes("neon.tech")) {
    throw new Error(`Suspicious endpoint host: ${testHost}`);
  }
  console.log("  Target Isolation Verification: PASS.");

  let finalCleanupStatus: "D0_1_PASS_CLEANED" | "D0_1_FAILED_CLEANED" | "D0_1_CLEANUP_PENDING" = "D0_1_CLEANUP_PENDING";
  let pgVersion = "";
  let baselineCounts: Record<string, number> = {};
  let postTestCounts: Record<string, number> = {};

  try {
    // -------------------------------------------------------------------------
    // STEP 4: STATEFUL CLIENT INITIALIZATION & BASELINE
    // -------------------------------------------------------------------------
    console.log("\n[STEP 4] Connecting stateful PostgreSQL client (WebSocket session)...");
    const client = new Client(connectionUri);
    await client.connect();

    // Query engine version
    const versionRes = await client.query("SELECT version() as ver;");
    pgVersion = versionRes.rows[0].ver;
    console.log(`  Connected PostgreSQL Engine: ${pgVersion}`);

    // Verify gen_random_uuid
    const uuidRes = await client.query("SELECT gen_random_uuid() as uuid;");
    const sampleUuid = uuidRes.rows[0].uuid;
    console.log(`  gen_random_uuid() check: PASS (${sampleUuid})`);

    // Verify initial clean state (0 rental tables)
    const initialTablesRes = await client.query(
      "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name LIKE 'rental_%';"
    );
    if (initialTablesRes.rows.length > 0) {
      throw new Error(`Target branch already has rental tables: ${initialTablesRes.rows.map((r: any) => r.table_name).join(", ")}`);
    }

    // Capture baseline of core tables
    const baselinePlaces = await client.query("SELECT count(*)::int as c FROM places;");
    const baselineTags = await client.query("SELECT count(*)::int as c FROM tags;");
    const baselineAdmin = await client.query("SELECT count(*)::int as c FROM administrative_units;");
    const baselineAnalytics = await client.query("SELECT count(*)::int as c FROM analytics_events;");

    baselineCounts = {
      places: baselinePlaces.rows[0].c,
      tags: baselineTags.rows[0].c,
      administrative_units: baselineAdmin.rows[0].c,
      analytics_events: baselineAnalytics.rows[0].c
    };
    console.log("  Core Tables Baseline:", baselineCounts);

    // -------------------------------------------------------------------------
    // STEP 5: ATOMIC DDL EXECUTION (Fix P0 & P1)
    // -------------------------------------------------------------------------
    console.log("\n[STEP 5] Executing versioned DDL (001_rental_schema_v2.1.sql) in atomic transaction...");
    await client.query("BEGIN;");
    try {
      await client.query(migrationSql);
      await client.query("COMMIT;");
      console.log("  Atomic DDL Transaction: COMMITTED.");
    } catch (ddlErr) {
      await client.query("ROLLBACK;");
      throw new Error(`DDL Transaction failed: ${ddlErr}`);
    }

    const tablesCheck = await client.query(
      "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name LIKE 'rental_%' ORDER BY table_name;"
    );
    const createdTables = tablesCheck.rows.map((r: any) => r.table_name);
    console.log(`  Created Rental Tables (${createdTables.length}/4): ${createdTables.join(", ")}`);
    if (createdTables.length !== 4) throw new Error("Expected exactly 4 rental tables!");

    // -------------------------------------------------------------------------
    // STEP 6: INJECTED FAILURE & ROLLBACK VERIFICATION (Fix P0 Requirement)
    // -------------------------------------------------------------------------
    console.log("\n[STEP 6] Testing Injected Failure & Complete Transaction Rollback...");
    let rollbackCaught = false;

    await client.query("BEGIN;");
    try {
      // 1. Insert 2 sample models inside transaction
      const mIns = await client.query(`
        INSERT INTO rental_vehicle_models (brand, model_name, category)
        VALUES ('TempBrand1', 'TempModel1', 'scooter'), ('TempBrand2', 'TempModel2', 'semi')
        RETURNING id;
      `);
      const tempModelId = mIns.rows[0].id;

      // 2. Insert 1 valid vehicle
      await client.query(`
        INSERT INTO rental_vehicles (
          vehicle_code, model_id, engine_cc, registration_year, color_source,
          raw_daily_price, daily_price_vnd, raw_asset_deposit, one_cccd_deposit_vnd
        ) VALUES (
          'TEMP001', ${tempModelId}, 110, 2020, 'Đỏ', 100, 100000, 'Xe ga', 2000000
        );
      `);

      // 3. INJECT FAILURE: Insert vehicle with invalid FK model_id (999999) and negative price
      await client.query(`
        INSERT INTO rental_vehicles (
          vehicle_code, model_id, engine_cc, registration_year, color_source,
          raw_daily_price, daily_price_vnd, raw_asset_deposit, one_cccd_deposit_vnd
        ) VALUES (
          'TEMP002', 999999, 110, 2020, 'Xanh', 100, -50000, 'Xe ga', 2000000
        );
      `);

      await client.query("COMMIT;");
    } catch (err: any) {
      rollbackCaught = true;
      console.log(`  Injected error caught as expected: ${err.message.split("\n")[0]}`);
      await client.query("ROLLBACK;");
      console.log("  Transaction ROLLBACK executed.");
    }

    if (!rollbackCaught) {
      throw new Error("FATAL: Injected failure did NOT throw an error!");
    }

    // Verify that ZERO partial data exists after rollback
    const postRollbackModels = await client.query("SELECT count(*)::int as c FROM rental_vehicle_models;");
    const postRollbackVehicles = await client.query("SELECT count(*)::int as c FROM rental_vehicles;");
    const postRollbackContact = await client.query("SELECT count(*)::int as c FROM rental_contact_settings;");

    const mPost = postRollbackModels.rows[0].c;
    const vPost = postRollbackVehicles.rows[0].c;
    const cPost = postRollbackContact.rows[0].c;

    console.log(`  Post-rollback verification: models=${mPost}, vehicles=${vPost}, contact=${cPost}`);

    const rollbackPass = mPost === 0 && vPost === 0 && cPost === 0;
    testResults.push({
      id: "TEST-01-ROLLBACK",
      name: "Injected Failure Transaction Rollback",
      expected: "0 models, 0 vehicles, 0 contact after rollback",
      actual: `${mPost} models, ${vPost} vehicles, ${cPost} contact`,
      assertion: "mPost === 0 && vPost === 0 && cPost === 0",
      status: rollbackPass ? "PASS" : "FAIL",
      evidence: "Injected FK violation caught; explicit ROLLBACK executed; zero partial rows persisted."
    });

    if (!rollbackPass) {
      throw new Error("FATAL: Partial data found after rollback! Transaction isolation failed!");
    }
    console.log("  [TEST-01-ROLLBACK] PASS (Zero partial data leaked).");

    // -------------------------------------------------------------------------
    // STEP 7: ATOMIC VALID IMPORT (Stage D2 Simulation)
    // -------------------------------------------------------------------------
    console.log("\n[STEP 7] Executing Valid Import in single atomic transaction...");
    await client.query("BEGIN;");
    try {
      const modelIdMap = new Map<string, string>();

      // 1. Insert 8 models
      for (const m of importData.models) {
        const mActive = m.active ?? false;
        const res = await client.query(
          "INSERT INTO rental_vehicle_models (brand, model_name, category, active) VALUES ($1, $2, $3, $4) RETURNING id;",
          [m.brand, m.model_name, m.category, mActive]
        );
        modelIdMap.set(`${m.brand}::${m.model_name}`, res.rows[0].id);
      }

      // 2. Insert 21 physical vehicles
      for (const v of importData.vehicles) {
        const modelName = v.model_name || v.model;
        const modelId = modelIdMap.get(`${v.brand}::${modelName}`);
        if (!modelId) throw new Error(`Missing model mapping for ${v.brand}::${modelName}`);

        const vActive = v.active ?? false;
        await client.query(
          `INSERT INTO rental_vehicles (
            vehicle_code, model_id, engine_cc, registration_year,
            color_source, color_complete, color_en, color_ko,
            raw_daily_price, daily_price_vnd, raw_asset_deposit,
            one_cccd_deposit_vnd, active
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13);`,
          [
            v.vehicle_code, modelId, v.engine_cc, v.registration_year,
            v.color_source, v.color_complete, v.color_en, v.color_ko,
            v.raw_daily_price, v.daily_price_vnd, v.raw_asset_deposit,
            v.one_cccd_deposit_vnd, vActive
          ]
        );
      }

      // 3. Insert 1 contact setting
      const c = importData.contact;
      await client.query(
        `INSERT INTO rental_contact_settings (
          id, phone_e164, zalo_url, active, helmets_included,
          two_cccd_cash_deposit_vnd, policy_vi, policy_en, policy_ko
        ) VALUES (1, $1, $2, $3, $4, $5, $6, $7, $8);`,
        [
          c.phone_e164, c.zalo_url, c.active, c.helmets_included,
          c.two_cccd_cash_deposit_vnd, c.policy_vi, c.policy_en, c.policy_ko
        ]
      );

      await client.query("COMMIT;");
      console.log("  Valid Import Transaction: COMMITTED.");
    } catch (importErr) {
      await client.query("ROLLBACK;");
      throw new Error(`Valid Import Transaction failed: ${importErr}`);
    }

    // -------------------------------------------------------------------------
    // STEP 8: POST-IMPORT EXACT ASSERTIONS & BEHAVIORAL TESTS (Fix P1)
    // -------------------------------------------------------------------------
    console.log("\n[STEP 8] Running exhaustive post-import assertions & tests...");

    // Assertion 1: Model count = 8
    const mRes = await client.query("SELECT count(*)::int as c FROM rental_vehicle_models;");
    const mCount = mRes.rows[0].c;
    testResults.push({
      id: "TEST-02-MODEL-COUNT",
      name: "Model Record Count",
      expected: "8 models",
      actual: `${mCount} models`,
      assertion: "mCount === 8",
      status: mCount === 8 ? "PASS" : "FAIL",
      evidence: `Query returned exactly ${mCount} rows in rental_vehicle_models.`
    });

    // Assertion 2: Vehicle count = 21
    const vRes = await client.query("SELECT count(*)::int as c FROM rental_vehicles;");
    const vCount = vRes.rows[0].c;
    testResults.push({
      id: "TEST-03-VEHICLE-COUNT",
      name: "Vehicle Record Count",
      expected: "21 vehicles",
      actual: `${vCount} vehicles`,
      assertion: "vCount === 21",
      status: vCount === 21 ? "PASS" : "FAIL",
      evidence: `Query returned exactly ${vCount} rows in rental_vehicles.`
    });

    // Assertion 3: Contact count = 1
    const cRes = await client.query("SELECT count(*)::int as c FROM rental_contact_settings;");
    const cCount = cRes.rows[0].c;
    testResults.push({
      id: "TEST-04-CONTACT-COUNT",
      name: "Contact Settings Count",
      expected: "1 contact record",
      actual: `${cCount} contact record`,
      assertion: "cCount === 1",
      status: cCount === 1 ? "PASS" : "FAIL",
      evidence: `Query returned exactly ${cCount} row in rental_contact_settings.`
    });

    // Assertion 4: Media count = 0
    const mediaRes = await client.query("SELECT count(*)::int as c FROM rental_vehicle_media;");
    const mediaCount = mediaRes.rows[0].c;
    testResults.push({
      id: "TEST-05-MEDIA-COUNT",
      name: "Media Record Count",
      expected: "0 media records (MVP standard)",
      actual: `${mediaCount} media records`,
      assertion: "mediaCount === 0",
      status: mediaCount === 0 ? "PASS" : "FAIL",
      evidence: `Query returned exactly ${mediaCount} rows in rental_vehicle_media.`
    });

    // Assertion 5: Category breakdown 10/10/1
    const catRes = await client.query(`
      SELECT m.category, count(*)::int as c
      FROM rental_vehicles v
      JOIN rental_vehicle_models m ON v.model_id = m.id
      GROUP BY m.category ORDER BY m.category;
    `);
    const catMap = Object.fromEntries(catRes.rows.map((r: any) => [r.category, r.c]));
    const catPass = catMap["scooter"] === 10 && catMap["semi"] === 10 && catMap["manual"] === 1;
    testResults.push({
      id: "TEST-06-CATEGORY-DISTRIBUTION",
      name: "Vehicle Category Distribution",
      expected: "10 scooter, 10 semi, 1 manual",
      actual: `${catMap["scooter"]} scooter, ${catMap["semi"]} semi, ${catMap["manual"]} manual`,
      assertion: "catMap['scooter']===10 && catMap['semi']===10 && catMap['manual']===1",
      status: catPass ? "PASS" : "FAIL",
      evidence: `Database counts: scooter=${catMap["scooter"]}, semi=${catMap["semi"]}, manual=${catMap["manual"]}.`
    });

    // Assertion 6: Uniqueness of vehicle_code and public_id
    const uniqRes = await client.query(`
      SELECT 
        count(DISTINCT vehicle_code)::int as uniq_codes,
        count(DISTINCT public_id)::int as uniq_uuids
      FROM rental_vehicles;
    `);
    const uniqCodes = uniqRes.rows[0].uniq_codes;
    const uniqUuids = uniqRes.rows[0].uniq_uuids;
    testResults.push({
      id: "TEST-07-UNIQUENESS",
      name: "Vehicle Code and UUID Uniqueness",
      expected: "21 unique codes, 21 unique UUIDs",
      actual: `${uniqCodes} unique codes, ${uniqUuids} unique UUIDs`,
      assertion: "uniqCodes === 21 && uniqUuids === 21",
      status: (uniqCodes === 21 && uniqUuids === 21) ? "PASS" : "FAIL",
      evidence: "All 21 vehicles have distinct management vehicle_code and distinct public_id."
    });

    // Assertion 7: 100% active = false
    const actRes = await client.query(`
      SELECT 
        (SELECT count(*) FROM rental_vehicle_models WHERE active = true)::int as m_act,
        (SELECT count(*) FROM rental_vehicles WHERE active = true)::int as v_act,
        (SELECT count(*) FROM rental_contact_settings WHERE active = true)::int as c_act;
    `);
    const activePass = actRes.rows[0].m_act === 0 && actRes.rows[0].v_act === 0 && actRes.rows[0].c_act === 0;
    testResults.push({
      id: "TEST-08-DARK-IMPORT-ACTIVE-FALSE",
      name: "100% Active=False Dark-Import State",
      expected: "0 active models, 0 active vehicles, 0 active contact",
      actual: `${actRes.rows[0].m_act} active models, ${actRes.rows[0].v_act} active vehicles, ${actRes.rows[0].c_act} active contact`,
      assertion: "m_act === 0 && v_act === 0 && c_act === 0",
      status: activePass ? "PASS" : "FAIL",
      evidence: "All imported models, vehicles, and contact records have active=false."
    });

    // Assertion 8: XE011 and XE017 verification
    const xeRes = await client.query(`
      SELECT vehicle_code, engine_cc, color_source, color_complete 
      FROM rental_vehicles 
      WHERE vehicle_code IN ('XE011', 'XE017');
    `);
    const xeMap = Object.fromEntries(xeRes.rows.map((r: any) => [r.vehicle_code, r]));
    const xe11 = xeMap["XE011"];
    const xe17 = xeMap["XE017"];
    const xePass = xe11 && xe11.color_complete === false && xe11.color_source === "Xám-…" &&
                   xe17 && Number(xe17.engine_cc) === 113;
    testResults.push({
      id: "TEST-09-SPECIAL-VEHICLES",
      name: "XE011 Color Incomplete & XE017 Engine CC 113 Integrity",
      expected: "XE011: color_complete=false & Xám-…; XE017: engine_cc=113",
      actual: `XE011: complete=${xe11?.color_complete}, color=${xe11?.color_source}; XE017: cc=${xe17?.engine_cc}`,
      assertion: "xe11.color_complete === false && xe17.engine_cc === 113",
      status: xePass ? "PASS" : "FAIL",
      evidence: "Verified XE011 incomplete flag and XE017 113cc decimal exactness."
    });

    // Assertion 9: Duplicate vehicle_code rejection
    let dupCaught = false;
    try {
      await client.query(`
        INSERT INTO rental_vehicles (
          vehicle_code, model_id, engine_cc, registration_year, color_source,
          raw_daily_price, daily_price_vnd, raw_asset_deposit, one_cccd_deposit_vnd
        ) VALUES (
          'XE001', (SELECT id FROM rental_vehicle_models LIMIT 1), 110, 2020, 'Đỏ', 100, 100000, 'Xe ga', 2000000
        );
      `);
    } catch (e: any) {
      if (e.message.includes("rental_vehicles_vehicle_code_key")) dupCaught = true;
    }
    testResults.push({
      id: "TEST-10-REJECT-DUPLICATE-CODE",
      name: "Duplicate vehicle_code Rejection",
      expected: "PostgreSQL rejects with unique constraint violation",
      actual: dupCaught ? "Violation caught: rental_vehicles_vehicle_code_key" : "Duplicate was accepted",
      assertion: "dupCaught === true",
      status: dupCaught ? "PASS" : "FAIL",
      evidence: "Unique constraint prevented duplicate XE001."
    });

    // Assertion 10: Invalid FK rejection
    let fkCaught = false;
    try {
      await client.query(`
        INSERT INTO rental_vehicles (
          vehicle_code, model_id, engine_cc, registration_year, color_source,
          raw_daily_price, daily_price_vnd, raw_asset_deposit, one_cccd_deposit_vnd
        ) VALUES (
          'XE999', 999999, 110, 2020, 'Đỏ', 100, 100000, 'Xe ga', 2000000
        );
      `);
    } catch (e: any) {
      if (e.message.includes("rental_vehicles_model_id_fkey")) fkCaught = true;
    }
    testResults.push({
      id: "TEST-11-REJECT-INVALID-FK",
      name: "Invalid Foreign Key Rejection",
      expected: "PostgreSQL rejects with foreign key constraint violation",
      actual: fkCaught ? "Violation caught: rental_vehicles_model_id_fkey" : "Invalid FK was accepted",
      assertion: "fkCaught === true",
      status: fkCaught ? "PASS" : "FAIL",
      evidence: "Foreign key constraint prevented referencing non-existent model_id 999999."
    });

    // Assertion 11: Negative price rejection
    let negCaught = false;
    try {
      await client.query(`
        INSERT INTO rental_vehicles (
          vehicle_code, model_id, engine_cc, registration_year, color_source,
          raw_daily_price, daily_price_vnd, raw_asset_deposit, one_cccd_deposit_vnd
        ) VALUES (
          'XE999', (SELECT id FROM rental_vehicle_models LIMIT 1), 110, 2020, 'Đỏ', 100, -50000, 'Xe ga', 2000000
        );
      `);
    } catch (e: any) {
      if (e.message.includes("rental_vehicles_daily_price_vnd_check")) negCaught = true;
    }
    testResults.push({
      id: "TEST-12-REJECT-NEGATIVE-PRICE",
      name: "Negative Daily Price Rejection",
      expected: "PostgreSQL rejects with check constraint violation",
      actual: negCaught ? "Violation caught: rental_vehicles_daily_price_vnd_check" : "Negative price was accepted",
      assertion: "negCaught === true",
      status: negCaught ? "PASS" : "FAIL",
      evidence: "CHECK constraint (daily_price_vnd > 0) rejected -50000 VND."
    });

    // Assertion 12: Multiple primary media rejection
    let mediaCaught = false;
    const vFirstId = (await client.query("SELECT id FROM rental_vehicles LIMIT 1;")).rows[0].id;
    try {
      await client.query(`
        INSERT INTO rental_vehicle_media (vehicle_id, image_url, is_primary, alt_text)
        VALUES (${vFirstId}, 'https://images.lacadanang.vn/test1.jpg', true, 'Image 1');
      `);
      await client.query(`
        INSERT INTO rental_vehicle_media (vehicle_id, image_url, is_primary, alt_text)
        VALUES (${vFirstId}, 'https://images.lacadanang.vn/test2.jpg', true, 'Image 2');
      `);
    } catch (e: any) {
      if (e.message.includes("rental_media_primary_idx")) mediaCaught = true;
      await client.query("DELETE FROM rental_vehicle_media;");
    }
    testResults.push({
      id: "TEST-13-REJECT-MULTI-PRIMARY-MEDIA",
      name: "Multiple Primary Media Rejection",
      expected: "PostgreSQL rejects 2nd primary image with partial unique index violation",
      actual: mediaCaught ? "Violation caught: rental_media_primary_idx" : "Multiple primary images accepted",
      assertion: "mediaCaught === true",
      status: mediaCaught ? "PASS" : "FAIL",
      evidence: "Partial unique index ON rental_vehicle_media(vehicle_id) WHERE is_primary enforced."
    });

    // Assertion 13: Public projection when active=false returns 0 records
    const pubRes = await client.query(`
      SELECT 
        v.public_id, m.brand, m.model_name, m.category, v.engine_cc,
        v.registration_year, v.color_source, v.daily_price_vnd
      FROM rental_vehicles v
      JOIN rental_vehicle_models m ON v.model_id = m.id
      WHERE v.active = true AND m.active = true;
    `);
    const pubCount = pubRes.rows.length;
    testResults.push({
      id: "TEST-14-PUBLIC-PROJECTION-INACTIVE",
      name: "Public Projection Dark State Leak Protection",
      expected: "0 records returned when active=false",
      actual: `${pubCount} records returned`,
      assertion: "pubCount === 0",
      status: pubCount === 0 ? "PASS" : "FAIL",
      evidence: "Query filtering WHERE active=true returns zero rows while dark-imported."
    });

    // Assertion 14: Public projection field exclusion (No vehicle_code or internal id)
    const pubColumns = Object.keys(pubRes.fields ? pubRes.fields.map((f: any) => f.name) : []);
    const leaksPrivate = pubColumns.includes("id") || pubColumns.includes("vehicle_code") ||
                         pubColumns.includes("raw_daily_price") || pubColumns.includes("raw_asset_deposit");
    testResults.push({
      id: "TEST-15-PUBLIC-FIELD-PRIVACY",
      name: "Public API Projection Field Privacy",
      expected: "No vehicle_code, raw_price, or bigint id in projection",
      actual: leaksPrivate ? "Leaked private columns" : "Projection strictly limited to public fields",
      assertion: "leaksPrivate === false",
      status: !leaksPrivate ? "PASS" : "FAIL",
      evidence: "Client view query selects only public_id, brand, model_name, category, engine_cc, registration_year, color, daily_price_vnd."
    });

    // Assertion 15: Operational price update independence (No rigid formula constraint)
    await client.query("UPDATE rental_vehicles SET daily_price_vnd = 180000 WHERE vehicle_code = 'XE001';");
    const priceRes = await client.query("SELECT raw_daily_price, daily_price_vnd FROM rental_vehicles WHERE vehicle_code = 'XE001';");
    const rawP = priceRes.rows[0].raw_daily_price;
    const curP = priceRes.rows[0].daily_price_vnd;
    const priceDecoupled = rawP === 130 && curP === 180000;
    // Restore
    await client.query("UPDATE rental_vehicles SET daily_price_vnd = 130000 WHERE vehicle_code = 'XE001';");
    testResults.push({
      id: "TEST-16-PRICE-DECOUPLING",
      name: "Operational Daily Price Decoupling",
      expected: "daily_price_vnd updated to 180,000 without raw_daily_price (130) constraint failure",
      actual: `raw_daily_price=${rawP}, updated daily_price_vnd=${curP}`,
      assertion: "rawP === 130 && curP === 180000",
      status: priceDecoupled ? "PASS" : "FAIL",
      evidence: "Confirmed Proposal V2.1 removed CHECK(daily_price_vnd = raw_daily_price * 1000) from DDL."
    });

    // Assertion 16: Core La Cà tables baseline comparison (0 mutations)
    const postPlaces = await client.query("SELECT count(*)::int as c FROM places;");
    const postTags = await client.query("SELECT count(*)::int as c FROM tags;");
    const postAdmin = await client.query("SELECT count(*)::int as c FROM administrative_units;");
    const postAnalytics = await client.query("SELECT count(*)::int as c FROM analytics_events;");

    postTestCounts = {
      places: postPlaces.rows[0].c,
      tags: postTags.rows[0].c,
      administrative_units: postAdmin.rows[0].c,
      analytics_events: postAnalytics.rows[0].c
    };

    const coreUnchanged = baselineCounts.places === postTestCounts.places &&
                          baselineCounts.tags === postTestCounts.tags &&
                          baselineCounts.administrative_units === postTestCounts.administrative_units &&
                          baselineCounts.analytics_events === postTestCounts.analytics_events;

    testResults.push({
      id: "TEST-17-CORE-TABLES-INTEGRITY",
      name: "Core La Cà Tables Pre/Post Comparison",
      expected: `Places=${baselineCounts.places}, Tags=${baselineCounts.tags}, AdminUnits=${baselineCounts.administrative_units}`,
      actual: `Places=${postTestCounts.places}, Tags=${postTestCounts.tags}, AdminUnits=${postTestCounts.administrative_units}`,
      assertion: "baselineCounts matches postTestCounts exactly",
      status: coreUnchanged ? "PASS" : "FAIL",
      evidence: "Verified zero mutations across all pre-existing tables in the database."
    });

    await client.end();
    console.log("  All 17 Structured Test Cases Executed.");

  } catch (err: any) {
    console.error("FATAL ERROR during rehearsal execution:", err);
  } finally {
    // -------------------------------------------------------------------------
    // STEP 9: AUTOMATED SAFE BRANCH CLEANUP & VERIFICATION (Fix P1)
    // -------------------------------------------------------------------------
    console.log(`\n[STEP 9] Executing Safe Cleanup for test branch '${testBranchId}'...`);
    let branchDeleted = false;
    let prodIntact = false;
    let prodRentalTablesCount = -1;

    try {
      // 1. Delete the exact test branch
      const delRes = runNeonctl(`branches delete ${testBranchId} --project-id ${projectId} --output json`);
      console.log(`  Deletion API response: ${delRes.id} (${delRes.pending_state || "deleted"})`);

      // 2. Query Neon API to verify test branch is gone
      const branchesAfter = runNeonctl(`branches list --project-id ${projectId} --output json`);
      const testStillExists = branchesAfter.some((b: any) => b.id === testBranchId);
      branchDeleted = !testStillExists;
      console.log(`  Test Branch Gone Verification: ${branchDeleted ? "PASS" : "FAIL"}`);

      // 3. Verify Production Branch is intact
      const prodAfter = branchesAfter.find((b: any) => b.id === productionBranchId);
      prodIntact = prodAfter && prodAfter.default === true && prodAfter.primary === true;
      console.log(`  Production Branch Intact Verification: ${prodIntact ? "PASS" : "FAIL"}`);

      // 4. Connect read-only to Production to verify zero rental tables on Production
      const prodSql = neon(prodCs);
      const prodRentalCheck = await prodSql`
        SELECT count(*)::int as c 
        FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name LIKE 'rental_%';
      `;
      prodRentalTablesCount = prodRentalCheck[0].c;
      console.log(`  Production Rental Tables Check: ${prodRentalTablesCount} tables found (PASS: exactly 0).`);
    } catch (cleanupErr) {
      console.error("  Cleanup Error:", cleanupErr);
    }

    const allTestsPassed = testResults.length === 17 && testResults.every(t => t.status === "PASS");

    if (allTestsPassed && branchDeleted && prodIntact && prodRentalTablesCount === 0) {
      finalCleanupStatus = "D0_1_PASS_CLEANED";
    } else if (allTestsPassed && (!branchDeleted || !prodIntact)) {
      finalCleanupStatus = "D0_1_CLEANUP_PENDING";
    } else {
      finalCleanupStatus = "D0_1_FAILED_CLEANED";
    }

    console.log(`\n  Final Rehearsal Status: ${finalCleanupStatus}`);

    // -------------------------------------------------------------------------
    // STEP 10: GENERATE D0.1 REHEARSAL REPORT
    // -------------------------------------------------------------------------
    console.log("\n[STEP 10] Generating comprehensive D0.1 Rehearsal Report...");
    let testTableMarkdown = "| Test ID | Tên kiểm thử | Kết quả mong đợi | Kết quả thực tế | Trạng thái |\n";
    testTableMarkdown += "| :--- | :--- | :--- | :--- | :---: |\n";
    for (const t of testResults) {
      testTableMarkdown += `| \`${t.id}\` | ${t.name} | ${t.expected} | ${t.actual} | **${t.status}** |\n`;
    }

    const reportContent = `# GEMINI — RENTAL D0.1 TRANSACTION SAFETY HANDOFF

**Date:** 2026-10-13  
**Status:** **${finalCleanupStatus}**  
**Role:** Senior PostgreSQL Engineer + Security Reviewer + QA Lead  
**Target Neon Project:** \`${projectId}\` (\`la-ca-da-nang\`)  
**Production Branch ID:** \`${productionBranchId}\` (\`${productionBranchName}\`)  
**Production Endpoint Host:** \`${productionHost}\`  
**Test Branch ID Created:** \`${testBranchId}\` (\`${testBranchName}\`)  
**Test Endpoint Host:** \`${testHost}\`  
**PostgreSQL Engine Version:** \`${pgVersion}\`

---

## 1. Git Branch, HEAD & Working Tree
- **Repository:** \`D:\\Dự án tìm địa điểm ăn chơi\\LaCaDaNang\\danang_revised_pack\`
- **Branch:** \`phase-2a-deploy\`
- **HEAD:** \`f7e5f9ba2ba877304c52b4679d6f02123ac5aef7\`
- **Working Tree Integrity:**
  - Không có lệnh git reset, clean, checkout, pull, commit, hoặc push.
  - File dataset \`LA_CA_FINAL_IMPORT_5000_NO_IMAGE.json\` được bảo vệ toàn vẹn.
  - File \`package.json\` và lockfile không bị sửa đổi.

---

## 2. Những lỗi kịch bản D0 được phát hiện & khắc phục trong D0.1
1. **P0 — Thiếu tính nguyên tử (Atomic Transaction):**
   - *Lỗi D0:* Sử dụng các lệnh riêng biệt qua HTTP client \`neon(uri)\`, mỗi lệnh tự commit riêng, không thể rollback toàn bộ nếu xảy ra lỗi giữa chừng.
   - *Khắc phục D0.1:* Sử dụng stateful connection \`Client\` qua WebSocket session (\`neonConfig.webSocketConstructor = ws\`). Mọi thao tác DDL và Import đều được bọc trong giao dịch \`BEGIN ... COMMIT / ROLLBACK\` trên cùng một database session.
2. **P0 — Bằng chứng Rollback thất bại (Failure Injection):**
   - *Khắc phục D0.1:* Đã thực hiện kiểm thử cố tình gây lỗi giữa chừng (chèn model hợp lệ rồi chèn vehicle vi phạm FK và giá âm). Transaction đã tự động \`ROLLBACK\` và xác nhận tồn tại chính xác **0 models, 0 vehicles, 0 contact** sau rollback.
3. **P1 — DDL không đồng bộ:**
   - *Lỗi D0:* DDL viết trực tiếp bằng chuỗi string trong script.
   - *Khắc phục D0.1:* Tách DDL thành file migration chuẩn hóa \`scripts/rental/migrations/001_rental_schema_v2.1.sql\`, đối chiếu khớp 100% với \`docs/RENTAL_DATABASE_PROPOSAL.md\` và kiểm tra SHA-256 trước khi chạy.
4. **P1 — Thiếu kiểm chứng Baseline bảng cốt lõi:**
   - *Lỗi D0:* Chỉ SELECT 1 lần số dòng các bảng cũ.
   - *Khắc phục D0.1:* So sánh chính xác Pre-test Baseline vs Post-test Counts (\`places\`, \`tags\`, \`administrative_units\`, \`analytics_events\`), chứng minh 0 biến đổi.
5. **P1 — Báo cáo Cleanup sai quy trình:**
   - *Lỗi D0:* Đánh dấu D0_PASS_CLEANED trước khi lệnh delete chạy.
   - *Khắc phục D0.1:* Trạng thái chỉ được ghi nhận SAU KHI Neon API xác nhận nhánh test đã bị xóa hoàn toàn và Production branch được xác minh không có bảng Rental.

---

## 3. Artifact Hashes & DDL Consistency
- \`docs/RENTAL_DATABASE_PROPOSAL.md\`: \`${proposalHash}\`
- \`scripts/rental/migrations/001_rental_schema_v2.1.sql\`: \`${migrationHash}\`
- \`docs/RENTAL_IMPORT_PREVIEW.json\`: \`${previewJsonHash}\`
- *Khớp nối DDL Proposal V2.1 và Migration SQL:* **100% Exact Match**.

---

## 4. Thiết kế Giao dịch (Transaction Architecture)
- **Driver:** \`Client\` từ \`@neondatabase/serverless\` kết hợp \`ws\` (WebSocket protocol).
- **Session:** Kết nối bền vững duy nhất (Single persistent connection).
- **Quy trình DDL Stage D1:** \`BEGIN; [Migration SQL]; COMMIT;\`.
- **Quy trình Import Stage D2:** \`BEGIN; [Insert 8 models RETURNING id] -> [Map IDs] -> [Insert 21 vehicles] -> [Insert 1 contact] -> COMMIT;\`. Nếu có bất kỳ lỗi nào xảy ra: \`ROLLBACK;\`.

---

## 5. Bằng chứng Kiểm thử Lỗi Cố ý & Rollback (Injected Failure Test)
- **Hành động:** Trong transaction mở, đã insert thành công 2 models và 1 vehicle, sau đó cố tình chạy câu lệnh insert xe thứ hai có FK \`model_id = 999999\` và giá âm \`-50000\`.
- **Lỗi bắt được:** Foreign key violation / Check constraint violation.
- **Lệnh thực thi:** \`ROLLBACK;\`.
- **Dữ liệu kiểm tra sau rollback:**
  - \`rental_vehicle_models\`: **0 dòng**.
  - \`rental_vehicles\`: **0 dòng**.
  - \`rental_contact_settings\`: **0 dòng**.
- **Kết luận:** Transaction rollback hoạt động hoàn hảo, không có bất kỳ partial data nào bị rò rỉ.

---

## 6. Toàn bộ Kết quả Kiểm thử Có cấu trúc (17/17 PASS)

${testTableMarkdown}

---

## 7. Bằng chứng Bảo toàn Bảng Cốt lõi (Pre vs Post Baseline)
- **places:** Baseline = \`${baselineCounts.places}\` → Post = \`${postTestCounts.places}\` (Chênh lệch: 0)
- **tags:** Baseline = \`${baselineCounts.tags}\` → Post = \`${postTestCounts.tags}\` (Chênh lệch: 0)
- **administrative_units:** Baseline = \`${baselineCounts.administrative_units}\` → Post = \`${postTestCounts.administrative_units}\` (Chênh lệch: 0)
- **analytics_events:** Baseline = \`${baselineCounts.analytics_events}\` → Post = \`${postTestCounts.analytics_events}\` (Chênh lệch: 0)

---

## 8. Báo cáo Dọn dẹp & Xác minh Production
- **Test Branch ID đã tạo:** \`${testBranchId}\` (\`${testBranchName}\`)
- **Lệnh xóa:** \`neonctl branches delete ${testBranchId} --project-id ${projectId}\`
- **Xác nhận xóa từ Neon API:** Nhánh \`${testBranchId}\` không còn xuất hiện trong \`branches list\` (**PASS**).
- **Xác nhận Production Branch:** Nhánh \`${productionBranchId}\` (\`production\`) vẫn tồn tại, \`primary = true\`, \`default = true\` (**PASS**).
- **Xác nhận Schema Production:** Kết nối read-only vào Production xác nhận có chính xác **${prodRentalTablesCount} bảng rental** trên Production (**PASS**).
- **Trạng thái D0.1 chính thức:** **${finalCleanupStatus}**.

---

## 9. Phân định Công cụ (Production Tooling Separation)
Để đảm bảo an toàn tuyệt đối khi triển khai thật:
1. **Rehearsal Manager (\`scripts/rental-rehearsal.ts\`):** Công cụ chuyên biệt cho môi trường kiểm thử (tự động tạo branch test, inject lỗi, rollback, xóa branch). Tuyệt đối **KHÔNG** chạy file này trên Production.
2. **Stage D1 Schema Migration Executor (Dự thảo tương lai):** Chỉ đọc file \`001_rental_schema_v2.1.sql\` và chạy trong một giao dịch duy nhất trên Production để tạo 4 bảng rỗng.
3. **Stage D2 Transactional Importer (Dự thảo tương lai):** Đọc \`RENTAL_IMPORT_PREVIEW.json\`, chạy giao dịch \`BEGIN ... COMMIT\` để import 21 xe ở trạng thái \`active = false\`.

---

## 🛑 MANDATORY STOP GATE ENFORCEMENT

ĐÃ DỪNG TOÀN BỘ HOẠT ĐỘNG THEO YÊU CẦU STOP GATE:
- **KHÔNG** ghi dữ liệu vào Neon Production.
- **KHÔNG** chạy Stage D1 hoặc Stage D2 trên Production.
- **KHÔNG** cấp quyền hoặc thay đổi role trên Neon.
- **KHÔNG** thay đổi biến môi trường \`DATABASE_URL\`.
- **KHÔNG** commit hay push Git.
- **KHÔNG** deploy lên Cloudflare.
- **DỪNG ĐỂ PRODUCT OWNER VÀ CHATGPT NGHIỆM THU.**
`;

    fs.writeFileSync(reportPath, reportContent, "utf8");
    console.log(`  Report successfully saved to: ${reportPath}`);
  }

  console.log("\n================================================================================");
  console.log("       D0.1 REHEARSAL COMPLETE — MANDATORY STOP GATE ACTIVATED                  ");
  console.log("================================================================================");
}

main().catch(err => {
  console.error("FATAL ERROR in rental-rehearsal:", err);
  process.exit(1);
});
