const { Client } = require('pg');

async function getSchemaInfo() {
  // Create a new PostgreSQL client
  const client = new Client({
    connectionString: "postgresql://neondb_owner:npg_7woIGnxLi9Sk@ep-summer-leaf-abqqx24a-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
  });

  try {
    // Connect to the database
    await client.connect();
    console.log('Connected to Neon PostgreSQL database');

    // Get table structure
    console.log('\n=== TABLE STRUCTURES ===');
    const tableResult = await client.query(`
      SELECT table_name, 
             column_name, 
             data_type, 
             column_default, 
             is_nullable
      FROM information_schema.columns
      WHERE table_schema = 'public'
      ORDER BY table_name, ordinal_position;
    `);
    
    // Process and display table structure in a more readable format
    let currentTable = '';
    tableResult.rows.forEach(row => {
      if (row.table_name !== currentTable) {
        currentTable = row.table_name;
        console.log(`\n-- TABLE: ${currentTable} --`);
      }
      console.log(`  ${row.column_name}: ${row.data_type}${row.is_nullable === 'YES' ? ' (nullable)' : ''}${row.column_default ? ` (default: ${row.column_default})` : ''}`);
    });

    // Get foreign key relationships
    console.log('\n\n=== FOREIGN KEY RELATIONSHIPS ===');
    const fkResult = await client.query(`
      SELECT
          tc.table_schema, 
          tc.constraint_name, 
          tc.table_name, 
          kcu.column_name, 
          ccu.table_schema AS foreign_table_schema,
          ccu.table_name AS foreign_table_name,
          ccu.column_name AS foreign_column_name 
      FROM 
          information_schema.table_constraints AS tc 
          JOIN information_schema.key_column_usage AS kcu
            ON tc.constraint_name = kcu.constraint_name
            AND tc.table_schema = kcu.table_schema
          JOIN information_schema.constraint_column_usage AS ccu
            ON ccu.constraint_name = tc.constraint_name
            AND ccu.table_schema = tc.table_schema
      WHERE tc.constraint_type = 'FOREIGN KEY';
    `);
    
    fkResult.rows.forEach(row => {
      console.log(`${row.table_name}.${row.column_name} -> ${row.foreign_table_name}.${row.foreign_column_name}`);
    });

    // Get indexes
    console.log('\n\n=== INDEXES ===');
    const indexResult = await client.query(`
      SELECT
          tablename,
          indexname,
          indexdef
      FROM
          pg_indexes
      WHERE
          schemaname = 'public'
      ORDER BY
          tablename,
          indexname;
    `);
    
    indexResult.rows.forEach(row => {
      console.log(`Table: ${row.tablename}, Index: ${row.indexname}`);
      console.log(`  ${row.indexdef}`);
    });

  } catch (err) {
    console.error('Error fetching database schema:', err);
  } finally {
    // Close the connection
    await client.end();
    console.log('\nDisconnected from database');
  }
}

// Execute the function
getSchemaInfo();
