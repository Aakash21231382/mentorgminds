// Test if Top Programs tables exist
const { sql, config } = require('./config/database');

async function testTopPrograms() {
  try {
    console.log('🔍 Connecting to database...');
    const pool = await sql.connect(config);
    
    // Check tables
    console.log('\n📋 Checking tables...');
    const tables = await pool.request().query(`
      SELECT name FROM sys.tables WHERE name IN ('TopProgramCategories', 'TopPrograms', 'TopProgramDetails')
    `);
    
    console.log('Tables found:', tables.recordset.map(t => t.name));
    
    if (tables.recordset.length === 0) {
      console.log('\n❌ ERROR: Tables NOT found!');
      console.log('👉 Please run: backend/online_courses_FINAL.sql');
      process.exit(1);
    }
    
    // Check procedures
    console.log('\n📋 Checking procedures...');
    const procs = await pool.request().query(`
      SELECT name FROM sys.procedures WHERE name LIKE 'sp_%TopProgram%'
    `);
    
    console.log('Procedures found:', procs.recordset.map(p => p.name));
    
    if (procs.recordset.length === 0) {
      console.log('\n❌ ERROR: Stored procedures NOT found!');
      console.log('👉 Please run: backend/online_courses_FINAL.sql');
      process.exit(1);
    }
    
    console.log('\n✅ SUCCESS! All tables and procedures exist.');
    
  } catch (error) {
    console.error('\n❌ ERROR:', error.message);
  } finally {
    process.exit(0);
  }
}

testTopPrograms();
