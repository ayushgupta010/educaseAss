const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function setupDatabase() {
  // Use environment variables instead of hardcoded localhost
  const connectionConfig = {
    host: process.env.DB_HOST || process.env.MYSQL_HOST || 'mysql.railway.internal',
    port: parseInt(process.env.DB_PORT || process.env.MYSQL_PORT || '3306'),
    user: process.env.DB_USER || process.env.MYSQL_USER || 'root',
    password: process.env.DB_PASSWORD || process.env.MYSQL_PASSWORD || 'root',
    // Don't specify database initially - we'll create it
    ssl: process.env.DB_HOST && process.env.DB_HOST.includes('railway') ? {
      rejectUnauthorized: false
    } : false
  };

  console.log('Setting up database with configuration:');
  console.log('Host:', connectionConfig.host);
  console.log('Port:', connectionConfig.port);
  console.log('User:', connectionConfig.user);
  console.log('SSL:', connectionConfig.ssl ? 'enabled' : 'disabled');

  try {
    // Connect to MySQL server (without specifying database)
    const connection = await mysql.createConnection(connectionConfig);
    console.log('✅ Connected to MySQL server');

    // Create database if it doesn't exist
    const databaseName = process.env.DB_NAME || 'school_management';
    await connection.execute(`CREATE DATABASE IF NOT EXISTS \`${databaseName}\``);
    console.log(`✅ Database '${databaseName}' created or verified`);

    // Use the database
    await connection.execute(`USE \`${databaseName}\``);
    console.log(`✅ Using database '${databaseName}'`);

    // Check if schema file exists
    const schemaPath = path.join(__dirname, 'src', 'database', 'schema.sql');
    console.log('Looking for schema file at:', schemaPath);
    
    if (fs.existsSync(schemaPath)) {
      console.log('📄 Found schema file, executing...');
      const schema = fs.readFileSync(schemaPath, 'utf8');
      
      // Split and execute SQL statements
      const statements = schema.split(';').filter(stmt => stmt.trim());
      
      for (const statement of statements) {
        if (statement.trim()) {
          try {
            await connection.query(statement);
            console.log('✅ Executed:', statement.trim().substring(0, 50) + '...');
          } catch (err) {
            console.warn('⚠️  Statement failed (might be OK):', err.message);
            console.warn('Statement was:', statement.trim().substring(0, 100));
          }
        }
      }
    } else {
      console.log('📄 No schema file found, creating basic tables...');
      
      // Create a basic table structure if no schema file exists
      const basicTables = [
        `CREATE TABLE IF NOT EXISTS users (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) UNIQUE NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`,
        `CREATE TABLE IF NOT EXISTS schools (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          address TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`
      ];
      
      for (const table of basicTables) {
        await connection.execute(table);
        console.log('✅ Created basic table');
      }
    }

    // Test the database
    const [rows] = await connection.execute('SELECT 1 as test');
    console.log('✅ Database test successful:', rows[0]);

    await connection.end();
    console.log('🎉 Database setup completed successfully!');
    
  } catch (error) {
    console.error('❌ Error setting up database:', error.message);
    console.error('Error details:', {
      code: error.code,
      errno: error.errno,
      sqlState: error.sqlState
    });
    
    if (error.code === 'ECONNREFUSED') {
      console.error('🔍 Connection refused - check your database host and port');
      console.error('💡 Make sure you\'re using the correct Railway MySQL host');
    } else if (error.code === 'ETIMEDOUT') {
      console.error('🔍 Connection timeout - check network connectivity');
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('🔍 Access denied - check your username and password');
    }
    
    process.exit(1);
  }
}

if (require.main === module) {
  setupDatabase();
}

module.exports = setupDatabase;