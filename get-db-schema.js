import pg from 'pg';
const { Client } = pg;

// Connection configuration
const client = new Client({
  connectionString: 'postgresql://neondb_owner:npg_7woIGnxLi9Sk@ep-summer-leaf-abqqx24a-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require'
});

async function getSchemaInfo() {
  try {
    // Connect to the database
    await client.connect();
    console.log('Connected to Neon PostgreSQL database');

    // Get table list
    console.log('\n=== TABLES ===');
    const tableRes = await client.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);
    
    tableRes.rows.forEach(row => {
      console.log(`- ${row.table_name}`);
    });

    // Get detailed table structure for each table
    for (const tableRow of tableRes.rows) {
      const tableName = tableRow.table_name;
      console.log(`\n=== TABLE: ${tableName} ===`);
      
      // Get columns
      const columnsRes = await client.query(`
        SELECT 
          column_name, 
          data_type,
          column_default,
          is_nullable
        FROM 
          information_schema.columns
        WHERE 
          table_schema = 'public' AND
          table_name = $1
        ORDER BY 
          ordinal_position
      `, [tableName]);
      
      console.log('Columns:');
      columnsRes.rows.forEach(col => {
        const nullable = col.is_nullable === 'YES' ? 'NULL' : 'NOT NULL';
        const defaultVal = col.column_default ? `DEFAULT ${col.column_default}` : '';
        console.log(`  ${col.column_name} ${col.data_type} ${nullable} ${defaultVal}`);
      });
      
      // Get primary keys
      const pkRes = await client.query(`
        SELECT
          kcu.column_name
        FROM
          information_schema.table_constraints tc
          JOIN information_schema.key_column_usage kcu
            ON tc.constraint_name = kcu.constraint_name
        WHERE
          tc.constraint_type = 'PRIMARY KEY' AND
          tc.table_schema = 'public' AND
          tc.table_name = $1
        ORDER BY
          kcu.ordinal_position
      `, [tableName]);
      
      if (pkRes.rows.length > 0) {
        console.log('Primary Key:');
        pkRes.rows.forEach(pk => {
          console.log(`  ${pk.column_name}`);
        });
      }
      
      // Get foreign keys
      const fkRes = await client.query(`
        SELECT
          kcu.column_name,
          ccu.table_name AS foreign_table_name,
          ccu.column_name AS foreign_column_name
        FROM
          information_schema.table_constraints tc
          JOIN information_schema.key_column_usage kcu
            ON tc.constraint_name = kcu.constraint_name
          JOIN information_schema.constraint_column_usage ccu
            ON tc.constraint_name = ccu.constraint_name
        WHERE
          tc.constraint_type = 'FOREIGN KEY' AND
          tc.table_schema = 'public' AND
          tc.table_name = $1
        ORDER BY
          kcu.ordinal_position
      `, [tableName]);
      
      if (fkRes.rows.length > 0) {
        console.log('Foreign Keys:');
        fkRes.rows.forEach(fk => {
          console.log(`  ${fk.column_name} -> ${fk.foreign_table_name}(${fk.foreign_column_name})`);
        });
      }
      
      // Get indexes
      const idxRes = await client.query(`
        SELECT
          indexname,
          indexdef
        FROM
          pg_indexes
        WHERE
          schemaname = 'public' AND
          tablename = $1
        ORDER BY
          indexname
      `, [tableName]);
      
      if (idxRes.rows.length > 0) {
        console.log('Indexes:');
        idxRes.rows.forEach(idx => {
          console.log(`  ${idx.indexname}: ${idx.indexdef}`);
        });
      }
    }

    // Get all Foreign Key relationships across tables
    console.log('\n=== ALL FOREIGN KEY RELATIONSHIPS ===');
    const allFkRes = await client.query(`
      SELECT
        tc.table_name AS source_table,
        kcu.column_name AS source_column,
        ccu.table_name AS target_table,
        ccu.column_name AS target_column
      FROM
        information_schema.table_constraints tc
        JOIN information_schema.key_column_usage kcu
          ON tc.constraint_name = kcu.constraint_name
        JOIN information_schema.constraint_column_usage ccu
          ON tc.constraint_name = ccu.constraint_name
      WHERE
        tc.constraint_type = 'FOREIGN KEY' AND
        tc.table_schema = 'public'
      ORDER BY
        tc.table_name,
        kcu.column_name
    `);
    
    allFkRes.rows.forEach(fk => {
      console.log(`${fk.source_table}.${fk.source_column} -> ${fk.target_table}.${fk.target_column}`);
    });

    console.log('\nDatabase schema analysis complete.');
  } catch (error) {
    console.error('Error fetching schema information:', error);
  } finally {
    // Close the connection
    await client.end();
    console.log('Connection closed');
  }
}

// Run the function
getSchemaInfo();
