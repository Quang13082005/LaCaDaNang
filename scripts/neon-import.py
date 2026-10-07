"""
LA CA DA NANG - Real Database Migration + Import Script
========================================================

Connects to Neon PostgreSQL via DATABASE_URL, runs the schema migration,
imports workbook data, and verifies with query-back checks.

Safety:
- Verifies workbook SHA256 before any DB operation
- Checks if DB is empty before import (STOPS on conflict)
- Full transactional import with rollback on any error
- No blind replace/reset/delete
- Supports --dry-run mode (validates without writing)
- Query-back verification after import

Usage:
    # Dry-run (validate only, no DB writes):
    python scripts/neon-import.py <path-to-xlsx> --dry-run

    # Real import:
    python scripts/neon-import.py <path-to-xlsx>

    # Migration only (create tables, no import):
    python scripts/neon-import.py --migrate-only

Requirements:
    pip install psycopg[binary] openpyxl

Environment:
    DATABASE_URL must be set (e.g., via .env.local)
"""

import sys
import os
import json
import hashlib
import math
from datetime import datetime, timedelta
from decimal import Decimal, InvalidOperation
from pathlib import Path
from typing import Any
from urllib.parse import urlparse

try:
    import psycopg
except ImportError:
    print("ERROR: psycopg is required. Install with: pip install 'psycopg[binary]'")
    sys.exit(1)

try:
    import openpyxl
except ImportError:
    print("ERROR: openpyxl is required. Install with: pip install openpyxl")
    sys.exit(1)

# ---------------------------------------------------------------------------
# Constants
# ---------------------------------------------------------------------------
EXPECTED_HASH = "874e7d6d9f5688af85de347051d4fc67a52f44bbd97a249d1f717056f6496bd3"
EXCEL_EPOCH = datetime(1899, 12, 30)
VALID_SECTIONS = {"EAT", "CAFE", "GO", "STAY"}
VALID_LOCALES = {"vi", "en", "ko"}
VALID_DOMAINS = {"EAT", "CAFE", "GO", "STAY", "COMMON"}

SCHEMA_FILE = Path(__file__).resolve().parent.parent / "docs" / "schema" / "001_initial_schema.sql"

CORE_SHEETS = [
    "administrative_units",
    "places",
    "tags",
    "place_tags",
    "tag_translations",
    "place_translations",
]

EXPECTED_COUNTS = {
    "administrative_units": 94,
    "tags": 36,
    "places": 500,
    "place_tags": 841,
    "tag_translations": 108,
    "place_translations": 1500,
}

EXPECTED_SECTIONS = {"EAT": 134, "CAFE": 145, "GO": 94, "STAY": 127}

CORE_TABLES = [
    "administrative_units", "tags", "places",
    "place_tags", "tag_translations", "place_translations",
]


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------
def file_sha256(path: str) -> str:
    h = hashlib.sha256()
    with open(path, "rb") as f:
        for chunk in iter(lambda: f.read(8192), b""):
            h.update(chunk)
    return h.hexdigest()


def excel_serial_to_naive_datetime(serial: float) -> datetime:
    return EXCEL_EPOCH + timedelta(days=serial)


def get_database_url() -> str:
    """Get DATABASE_URL from environment. Try .env.local first."""
    url = os.environ.get("DATABASE_URL")
    if url:
        return url
    # Try loading from .env.local
    env_local = Path(__file__).resolve().parent.parent / ".env.local"
    if env_local.exists():
        with open(env_local, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if line.startswith("DATABASE_URL=") and not line.startswith("#"):
                    val = line[len("DATABASE_URL="):].strip()
                    # Remove quotes if present
                    if val and val[0] in ('"', "'") and val[-1] == val[0]:
                        val = val[1:-1]
                    if val:
                        return val
    return ""


def read_sheet_rows(wb, sheet_name: str) -> list[dict]:
    ws = wb[sheet_name]
    rows_iter = ws.iter_rows(values_only=True)
    headers = [str(h).strip() if h is not None else "" for h in next(rows_iter)]
    data = []
    for row_values in rows_iter:
        if all(v is None for v in row_values):
            continue
        row_dict = {}
        for i, h in enumerate(headers):
            if h and h != "Column1":
                row_dict[h] = row_values[i] if i < len(row_values) else None
        data.append(row_dict)
    return data


def safe_text(value: Any) -> str | None:
    """Trim text, empty/whitespace -> None."""
    if value is None:
        return None
    if isinstance(value, bool):
        return None
    s = str(value).strip()
    return s if s else None


def safe_bool(value: Any) -> bool | None:
    if isinstance(value, bool):
        return value
    return None


def safe_timestamp(value: Any) -> datetime | None:
    if value is None:
        return None
    if isinstance(value, bool):
        return None
    if not isinstance(value, (int, float)):
        return None
    if math.isnan(value) or math.isinf(value):
        return None
    try:
        return excel_serial_to_naive_datetime(float(value))
    except (OverflowError, ValueError):
        return None


def safe_rating(value: Any) -> Decimal | None:
    if value is None:
        return None
    if isinstance(value, bool):
        return None
    try:
        d = Decimal(str(value))
        if not d.is_finite():
            return None
        if d < 0 or d > 5:
            return None
        return d
    except (InvalidOperation, ValueError):
        return None


def safe_nonneg_int(value: Any) -> int | None:
    if value is None:
        return None
    if isinstance(value, bool):
        return None
    try:
        d = Decimal(str(value))
        if not d.is_finite() or d != int(d):
            return None
        i = int(d)
        return i if i >= 0 else None
    except (InvalidOperation, ValueError):
        return None


def safe_pos_int(value: Any) -> int | None:
    if value is None:
        return None
    if isinstance(value, bool):
        return None
    try:
        d = Decimal(str(value))
        if not d.is_finite() or d != int(d):
            return None
        i = int(d)
        return i if i > 0 else None
    except (InvalidOperation, ValueError):
        return None


# ---------------------------------------------------------------------------
# Database operations
# ---------------------------------------------------------------------------
def check_db_empty(conn) -> dict[str, int]:
    """Check if core tables exist and their row counts. Returns {table: count}."""
    counts = {}
    with conn.cursor() as cur:
        for table in CORE_TABLES:
            cur.execute(
                "SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = %s)",
                (table,),
            )
            exists = cur.fetchone()[0]
            if exists:
                cur.execute(f'SELECT COUNT(*) FROM "{table}"')
                counts[table] = cur.fetchone()[0]
            else:
                counts[table] = -1  # table does not exist
    return counts


def run_migration(conn, dry_run: bool = False) -> bool:
    """Run schema migration. Returns True if successful."""
    if not SCHEMA_FILE.exists():
        print(f"ERROR: Schema file not found: {SCHEMA_FILE}")
        return False

    with open(SCHEMA_FILE, "r", encoding="utf-8") as f:
        sql = f.read()

    if dry_run:
        print("  [DRY-RUN] Would execute schema migration SQL")
        print(f"  Schema file: {SCHEMA_FILE}")
        print(f"  SQL length: {len(sql)} chars")
        return True

    print("  Executing schema migration...")
    with conn.cursor() as cur:
        cur.execute(sql)
    conn.commit()
    print("  Schema migration committed.")
    return True


def import_administrative_units(cur, rows: list[dict]) -> int:
    """Import administrative_units. Returns count inserted."""
    count = 0
    for row in rows:
        pid = safe_pos_int(row.get("id"))
        if pid is None:
            continue
        cur.execute(
            """INSERT INTO administrative_units (id, official_code, official_name, unit_type, active, created_at, updated_at)
               VALUES (%s, %s, %s, %s, %s, %s, %s)""",
            (
                pid,
                safe_text(row.get("official_code")),
                safe_text(row.get("official_name")),
                safe_text(row.get("unit_type")),
                safe_bool(row.get("active")),
                safe_timestamp(row.get("created_at")),
                safe_timestamp(row.get("updated_at")),
            ),
        )
        count += 1
    return count


def import_tags(cur, rows: list[dict]) -> int:
    count = 0
    for row in rows:
        pid = safe_pos_int(row.get("id"))
        if pid is None:
            continue
        cur.execute(
            """INSERT INTO tags (id, code, display_name, domain, active)
               VALUES (%s, %s, %s, %s, %s)""",
            (
                pid,
                safe_text(row.get("code")),
                safe_text(row.get("display_name")),
                safe_text(row.get("domain")),
                safe_bool(row.get("active")),
            ),
        )
        count += 1
    return count


def import_places(cur, rows: list[dict]) -> int:
    count = 0
    for row in rows:
        pid = safe_pos_int(row.get("id"))
        if pid is None:
            continue

        lat = row.get("latitude")
        lng = row.get("longitude")
        if not isinstance(lat, (int, float)) or not isinstance(lng, (int, float)):
            continue

        cur.execute(
            """INSERT INTO places (
                id, google_place_id, name, section, primary_type,
                phone, website_url, address, administrative_unit_id,
                latitude, longitude, google_maps_url,
                google_verified_at, rating, review_count, photo_count,
                business_status, active, featured,
                source_updated_at, created_at, updated_at
               ) VALUES (
                %s, %s, %s, %s, %s,
                %s, %s, %s, %s,
                %s, %s, %s,
                %s, %s, %s, %s,
                %s, %s, %s,
                %s, %s, %s
               )""",
            (
                pid,
                safe_text(row.get("google_place_id")),
                safe_text(row.get("name")),
                safe_text(row.get("section")),
                safe_text(row.get("primary_type")),
                safe_text(row.get("phone")),
                safe_text(row.get("website_url")),
                safe_text(row.get("address")),
                safe_pos_int(row.get("administrative_unit_id")),
                float(lat), float(lng),
                safe_text(row.get("google_maps_url")),
                safe_timestamp(row.get("google_verified_at")),
                safe_rating(row.get("rating")),
                safe_nonneg_int(row.get("review_count")),
                safe_nonneg_int(row.get("photo_count")),
                safe_text(row.get("business_status")),
                safe_bool(row.get("active")),
                safe_bool(row.get("featured")),
                safe_timestamp(row.get("source_updated_at")),
                safe_timestamp(row.get("created_at")),
                safe_timestamp(row.get("updated_at")),
            ),
        )
        count += 1
    return count


def import_place_tags(cur, rows: list[dict]) -> int:
    count = 0
    for row in rows:
        place_id = safe_pos_int(row.get("place_id"))
        tag_id = safe_pos_int(row.get("tag_id"))
        if place_id is None or tag_id is None:
            continue
        cur.execute(
            "INSERT INTO place_tags (place_id, tag_id) VALUES (%s, %s)",
            (place_id, tag_id),
        )
        count += 1
    return count


def import_tag_translations(cur, rows: list[dict]) -> int:
    count = 0
    for row in rows:
        tag_id = safe_pos_int(row.get("tag_id"))
        locale = safe_text(row.get("locale"))
        label = safe_text(row.get("label"))
        if tag_id is None or locale is None or label is None:
            continue
        cur.execute(
            "INSERT INTO tag_translations (tag_id, locale, label) VALUES (%s, %s, %s)",
            (tag_id, locale, label),
        )
        count += 1
    return count


def import_place_translations(cur, rows: list[dict]) -> int:
    count = 0
    for row in rows:
        place_id = safe_pos_int(row.get("place_id"))
        locale = safe_text(row.get("locale"))
        display_name = safe_text(row.get("display_name"))
        primary_type_label = safe_text(row.get("primary_type_label"))
        if place_id is None or locale is None or display_name is None or primary_type_label is None:
            continue
        cur.execute(
            """INSERT INTO place_translations
               (place_id, locale, display_name, primary_type_label, short_description, created_at, updated_at)
               VALUES (%s, %s, %s, %s, %s, %s, %s)""",
            (
                place_id, locale, display_name, primary_type_label,
                safe_text(row.get("short_description")),
                safe_timestamp(row.get("created_at")),
                safe_timestamp(row.get("updated_at")),
            ),
        )
        count += 1
    return count


def query_back_verify(conn) -> dict:
    """Run query-back verification checks after import."""
    results = {}
    with conn.cursor() as cur:
        # Row counts
        for table in CORE_TABLES:
            cur.execute(f'SELECT COUNT(*) FROM "{table}"')
            results[f"{table}_count"] = cur.fetchone()[0]

        # Unique google_place_id
        cur.execute("SELECT COUNT(DISTINCT google_place_id) FROM places")
        results["unique_google_place_id"] = cur.fetchone()[0]

        # Section counts
        cur.execute("SELECT section, COUNT(*) FROM places GROUP BY section ORDER BY section")
        for section, cnt in cur.fetchall():
            results[f"section_{section}"] = cnt

        # Places missing vi/en/ko translations
        cur.execute("""
            SELECT COUNT(*) FROM places p
            WHERE NOT EXISTS (
                SELECT 1 FROM place_translations pt
                WHERE pt.place_id = p.id AND pt.locale = 'vi'
            )
            OR NOT EXISTS (
                SELECT 1 FROM place_translations pt
                WHERE pt.place_id = p.id AND pt.locale = 'en'
            )
            OR NOT EXISTS (
                SELECT 1 FROM place_translations pt
                WHERE pt.place_id = p.id AND pt.locale = 'ko'
            )
        """)
        results["places_missing_locales"] = cur.fetchone()[0]

        # Tags missing vi/en/ko translations
        cur.execute("""
            SELECT COUNT(*) FROM tags t
            WHERE NOT EXISTS (
                SELECT 1 FROM tag_translations tt
                WHERE tt.tag_id = t.id AND tt.locale = 'vi'
            )
            OR NOT EXISTS (
                SELECT 1 FROM tag_translations tt
                WHERE tt.tag_id = t.id AND tt.locale = 'en'
            )
            OR NOT EXISTS (
                SELECT 1 FROM tag_translations tt
                WHERE tt.tag_id = t.id AND tt.locale = 'ko'
            )
        """)
        results["tags_missing_locales"] = cur.fetchone()[0]

        # Untagged places
        cur.execute("""
            SELECT COUNT(*) FROM places p
            WHERE NOT EXISTS (
                SELECT 1 FROM place_tags pt WHERE pt.place_id = p.id
            )
        """)
        results["untagged_places"] = cur.fetchone()[0]

        # FK violations (orphan place_tags)
        cur.execute("""
            SELECT COUNT(*) FROM place_tags pt
            WHERE NOT EXISTS (SELECT 1 FROM places p WHERE p.id = pt.place_id)
               OR NOT EXISTS (SELECT 1 FROM tags t WHERE t.id = pt.tag_id)
        """)
        results["fk_violations_place_tags"] = cur.fetchone()[0]

        # FK violations (orphan translations)
        cur.execute("""
            SELECT COUNT(*) FROM place_translations pt
            WHERE NOT EXISTS (SELECT 1 FROM places p WHERE p.id = pt.place_id)
        """)
        results["fk_violations_place_translations"] = cur.fetchone()[0]

        cur.execute("""
            SELECT COUNT(*) FROM tag_translations tt
            WHERE NOT EXISTS (SELECT 1 FROM tags t WHERE t.id = tt.tag_id)
        """)
        results["fk_violations_tag_translations"] = cur.fetchone()[0]

    return results


def print_verification(results: dict) -> bool:
    """Print verification results and return True if all pass."""
    all_pass = True

    checks = [
        ("administrative_units", results.get("administrative_units_count"), EXPECTED_COUNTS["administrative_units"]),
        ("tags", results.get("tags_count"), EXPECTED_COUNTS["tags"]),
        ("places", results.get("places_count"), EXPECTED_COUNTS["places"]),
        ("place_tags", results.get("place_tags_count"), EXPECTED_COUNTS["place_tags"]),
        ("tag_translations", results.get("tag_translations_count"), EXPECTED_COUNTS["tag_translations"]),
        ("place_translations", results.get("place_translations_count"), EXPECTED_COUNTS["place_translations"]),
        ("unique_google_place_id", results.get("unique_google_place_id"), 500),
        ("EAT", results.get("section_EAT"), 134),
        ("CAFE", results.get("section_CAFE"), 145),
        ("GO", results.get("section_GO"), 94),
        ("STAY", results.get("section_STAY"), 127),
        ("places_missing_locales", results.get("places_missing_locales"), 0),
        ("tags_missing_locales", results.get("tags_missing_locales"), 0),
        ("untagged_places", results.get("untagged_places"), 0),
        ("fk_violations_place_tags", results.get("fk_violations_place_tags"), 0),
        ("fk_violations_place_translations", results.get("fk_violations_place_translations"), 0),
        ("fk_violations_tag_translations", results.get("fk_violations_tag_translations"), 0),
    ]

    for name, actual, expected in checks:
        match = actual == expected
        status = "PASS" if match else "FAIL"
        if not match:
            all_pass = False
        print(f"  {name}: {actual} (expected {expected}) {status}")

    return all_pass


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------
def main():
    import argparse
    parser = argparse.ArgumentParser(description="LA CA DA NANG - Neon PostgreSQL Migration + Import")
    parser.add_argument("xlsx", nargs="?", help="Path to workbook XLSX file")
    parser.add_argument("--dry-run", action="store_true", help="Validate only, no DB writes")
    parser.add_argument("--migrate-only", action="store_true", help="Run schema migration only, no import")
    args = parser.parse_args()

    if not args.migrate_only and not args.xlsx:
        parser.error("xlsx path is required unless --migrate-only is used")

    # 1. Check DATABASE_URL
    print("=" * 60)
    print("LA CA DA NANG - Neon PostgreSQL Migration + Import")
    print("=" * 60)

    db_url = get_database_url()
    if not db_url:
        print("\nERROR: DATABASE_URL not found.")
        print("Set it in .env.local or as an environment variable.")
        print("Get it from: Neon Console > Connection Details > Connection String")
        print("\nNEON_ACCOUNT_REQUIRED")
        sys.exit(1)

    # Mask the URL for display
    parsed = urlparse(db_url)
    masked = f"{parsed.scheme}://{parsed.username}:****@{parsed.hostname}/{parsed.path.lstrip('/')}"
    print(f"\nDATABASE_URL: {masked}")
    print(f"Mode: {'DRY-RUN' if args.dry_run else 'MIGRATE-ONLY' if args.migrate_only else 'REAL IMPORT'}")

    # 2. Verify workbook hash (if importing)
    if args.xlsx:
        xlsx_path = args.xlsx
        if not os.path.isfile(xlsx_path):
            print(f"ERROR: File not found: {xlsx_path}")
            sys.exit(1)

        actual_hash = file_sha256(xlsx_path)
        hash_match = actual_hash == EXPECTED_HASH
        print(f"\nWorkbook: {xlsx_path}")
        print(f"SHA256: {actual_hash}")
        print(f"Hash match: {'PASS' if hash_match else 'FAIL'}")
        if not hash_match:
            print("ERROR: Workbook hash mismatch. Aborting.")
            sys.exit(1)

    # 3. Connect to database
    print("\nConnecting to Neon PostgreSQL...")
    try:
        conn = psycopg.connect(db_url, autocommit=False)
        print("  Connected successfully.")
    except Exception as e:
        print(f"ERROR: Connection failed: {e}")
        sys.exit(1)

    try:
        # 4. Check if DB is empty
        print("\nChecking database state...")
        table_counts = check_db_empty(conn)

        tables_exist = any(c >= 0 for c in table_counts.values())
        tables_have_data = any(c > 0 for c in table_counts.values())

        for table, count in table_counts.items():
            if count == -1:
                print(f"  {table}: does not exist")
            else:
                print(f"  {table}: {count} rows")

        if tables_have_data:
            print("\nERROR: Database is NOT empty. Existing data found.")
            print("This script does not blind-replace or delete existing data.")
            print("To re-import, manually drop tables or use a fresh database.")
            print("\nCONFLICT: EXISTING_DATA")
            conn.close()
            sys.exit(1)

        # 5. Run migration if tables don't exist
        if not tables_exist or any(c == -1 for c in table_counts.values()):
            print("\nRunning schema migration...")
            if args.dry_run:
                print("  [DRY-RUN] Would create tables from schema DDL")
            else:
                if not run_migration(conn):
                    conn.close()
                    sys.exit(1)
                # Re-check tables after migration
                table_counts = check_db_empty(conn)
                missing = [t for t, c in table_counts.items() if c == -1]
                if missing:
                    print(f"ERROR: Tables still missing after migration: {missing}")
                    conn.close()
                    sys.exit(1)
                print("  All 6 tables created successfully.")
        else:
            print("\n  All tables already exist (empty). Skipping migration.")

        if args.migrate_only:
            print("\n  Migration complete. No import requested.")
            conn.close()
            return

        # 6. Import data in FK order
        print("\nOpening workbook...")
        wb = openpyxl.load_workbook(xlsx_path, read_only=True, data_only=True)

        import_order = [
            ("administrative_units", import_administrative_units),
            ("tags", import_tags),
            ("places", import_places),
            ("place_tags", import_place_tags),
            ("tag_translations", import_tag_translations),
            ("place_translations", import_place_translations),
        ]

        if args.dry_run:
            print("\n[DRY-RUN] Validating import (no DB writes)...")
            for table_name, _ in import_order:
                rows = read_sheet_rows(wb, table_name)
                expected = EXPECTED_COUNTS[table_name]
                status = "PASS" if len(rows) == expected else "FAIL"
                print(f"  {table_name}: {len(rows)} rows (expected {expected}) {status}")
            wb.close()
            print("\n[DRY-RUN] Validation complete. No data written.")
            conn.close()
            return

        print("\nImporting data (transactional)...")
        try:
            with conn.cursor() as cur:
                for table_name, import_func in import_order:
                    rows = read_sheet_rows(wb, table_name)
                    count = import_func(cur, rows)
                    expected = EXPECTED_COUNTS[table_name]
                    status = "PASS" if count == expected else "FAIL"
                    print(f"  {table_name}: {count}/{expected} inserted {status}")
                    if count != expected:
                        raise ValueError(f"Count mismatch for {table_name}: got {count}, expected {expected}")

            # Commit the transaction
            conn.commit()
            print("\n  All data committed successfully.")

        except Exception as e:
            print(f"\nERROR during import: {e}")
            print("  Rolling back transaction...")
            conn.rollback()
            print("  Transaction rolled back. Database unchanged.")
            wb.close()
            conn.close()
            sys.exit(1)

        wb.close()

        # 7. Query-back verification
        print("\n" + "-" * 60)
        print("Query-back verification...")
        results = query_back_verify(conn)
        all_pass = print_verification(results)

        print("\n" + "=" * 60)
        if all_pass:
            print("IMPORT RESULT: ALL PASS")
        else:
            print("IMPORT RESULT: VERIFICATION FAILED")
            print("WARNING: Data was committed but verification checks failed.")
            print("Review the results above and investigate.")

        # Write verification report
        report_dir = Path(__file__).resolve().parent.parent / "docs" / "schema"
        report_path = report_dir / "import-verification.json"
        report = {
            "timestamp": datetime.now().isoformat(),
            "database_url_masked": masked,
            "workbook_hash": actual_hash,
            "hash_match": hash_match,
            "verification": results,
            "all_pass": all_pass,
        }
        with open(report_path, "w", encoding="utf-8") as f:
            json.dump(report, f, indent=2, ensure_ascii=False, default=str)
        print(f"\nVerification report: {report_path}")

    finally:
        conn.close()

    sys.exit(0 if all_pass else 1)


if __name__ == "__main__":
    main()
