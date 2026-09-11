import { pool, initPostgres, query } from "../db/postgres.js";
import { db } from "../db/store.js";

async function runMigration() {
  console.log("=================================================");
  console.log("🐘 JSICP Database Migration & Deployment Sync");
  console.log("=================================================");
  console.log("Target Database URL:", process.env.DATABASE_URL ? process.env.DATABASE_URL.replace(/:[^:@]+@/, ":****@") : "Local Database");

  try {
    const ok = await initPostgres(db.get());
    if (!ok) {
      console.error("❌ Migration failed: Could not establish active connection to target PostgreSQL database.");
      console.error("👉 If using Neon Tech: Ensure your IP is allowed in Neon Console (Project Settings -> IP Allowlist) or that your compute endpoint is active.");
      process.exit(1);
    }

    const tableCounts = await query(`
      SELECT table_name, 
             (xpath('/row/cnt/text()', xml_count))[1]::text::int as row_count
      FROM (
        SELECT table_name, 
               query_to_xml(format('select count(*) as cnt from %I', table_name), false, true, '') as xml_count
        FROM information_schema.tables 
        WHERE table_schema = 'public'
      ) t ORDER BY table_name;
    `);

    console.log("\n✅ All tables and initial datasets successfully verified / shifted on target database:\n");
    for (const row of tableCounts.rows) {
      console.log(` - ${row.table_name.padEnd(25)} : ${row.row_count} rows`);
    }

    console.log("\n=================================================");
    console.log("🎉 Database Migration Completed Successfully!");
    console.log("=================================================");
    process.exit(0);
  } catch (err) {
    console.error("❌ Migration error:", err.message);
    process.exit(1);
  }
}

runMigration();
