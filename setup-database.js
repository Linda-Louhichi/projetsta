/**
 * MySQL Database Setup Script
 * 
 * This script creates the MySQL database and initializes all tables.
 * Run this script once before starting the application.
 * 
 * Usage: node setup-database.js
 */

const mysql = require('mysql2/promise')
require('dotenv').config()

const dbConfig = {
  host: process.env.MYSQL_HOST || 'localhost',
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '',
  database: process.env.MYSQL_DATABASE || 'resalogic_db',
  port: parseInt(process.env.MYSQL_PORT || '3306'),
}

async function setupDatabase() {
  console.log('🔧 Starting MySQL database setup...\n')

  let connection

  try {
    // Step 1: Create database if it doesn't exist
    console.log('📦 Step 1: Creating database...')
    const tempConnection = await mysql.createConnection({
      host: dbConfig.host,
      user: dbConfig.user,
      password: dbConfig.password,
      port: dbConfig.port,
    })

    await tempConnection.execute(
      `CREATE DATABASE IF NOT EXISTS \`${dbConfig.database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
    )
    console.log(`✅ Database '${dbConfig.database}' created or already exists\n`)
    await tempConnection.end()

    // Step 2: Connect to the database
    console.log('📦 Step 2: Connecting to database...')
    connection = await mysql.createConnection(dbConfig)
    console.log('✅ Connected to database\n')

    // Step 3: Create tables
    console.log('📦 Step 3: Creating tables...')

    // Create contacts table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS contacts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(50),
        company VARCHAR(255),
        message TEXT,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_email (email),
        INDEX idx_createdAt (createdAt)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `)
    console.log('  ✓ contacts table')

    // Create projects table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS projects (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        sector VARCHAR(100) NOT NULL,
        description TEXT NOT NULL,
        context TEXT,
        solution TEXT,
        result TEXT,
        technologies JSON,
        imageUrl VARCHAR(500),
        status VARCHAR(50) DEFAULT 'completed',
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_sector (sector),
        INDEX idx_status (status),
        INDEX idx_createdAt (createdAt)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `)
    console.log('  ✓ projects table')

    // Create blogs table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS blogs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        excerpt TEXT NOT NULL,
        content LONGTEXT NOT NULL,
        author VARCHAR(255),
        category VARCHAR(100),
        tags JSON,
        imageUrl VARCHAR(500),
        published TINYINT(1) DEFAULT 0,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_category (category),
        INDEX idx_published (published),
        INDEX idx_createdAt (createdAt)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `)
    console.log('  ✓ blogs table')

    // Create testimonials table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS testimonials (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        role VARCHAR(255) NOT NULL,
        company VARCHAR(255),
        content TEXT NOT NULL,
        avatar VARCHAR(500),
        rating INT DEFAULT 5,
        published TINYINT(1) DEFAULT 1,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_published (published),
        INDEX idx_rating (rating)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `)
    console.log('  ✓ testimonials table')

    // Create faqs table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS faqs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        question TEXT NOT NULL,
        answer TEXT NOT NULL,
        category VARCHAR(100),
        orderIndex INT DEFAULT 0,
        published TINYINT(1) DEFAULT 1,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_category (category),
        INDEX idx_published (published),
        INDEX idx_orderIndex (orderIndex)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `)
    console.log('  ✓ faqs table')

    // Create services table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS services (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        icon VARCHAR(100),
        orderIndex INT DEFAULT 0,
        published TINYINT(1) DEFAULT 1,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_orderIndex (orderIndex),
        INDEX idx_published (published)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `)
    console.log('  ✓ services table')

    // Create team_members table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS team_members (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        role VARCHAR(255) NOT NULL,
        bio TEXT,
        imageUrl VARCHAR(500),
        linkedin VARCHAR(500),
        twitter VARCHAR(500),
        orderIndex INT DEFAULT 0,
        published TINYINT(1) DEFAULT 1,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_orderIndex (orderIndex),
        INDEX idx_published (published)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `)
    console.log('  ✓ team_members table')

    // Create site_settings table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS site_settings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        setting_key VARCHAR(100) UNIQUE NOT NULL,
        setting_value TEXT,
        setting_type VARCHAR(50) DEFAULT 'text',
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_key (setting_key)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `)
    console.log('  ✓ site_settings table')

    // Create users table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'moderator',
        avatar VARCHAR(500),
        active TINYINT(1) DEFAULT 1,
        lastLogin TIMESTAMP NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_email (email),
        INDEX idx_role (role),
        INDEX idx_active (active)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `)
    console.log('  ✓ users table')

    console.log('\n✅ All tables created successfully!\n')

    // Step 4: Seed default data
    console.log('📦 Step 4: Seeding default data...')

    // Insert default admin user
    const [existingUsers] = await connection.execute(
      'SELECT id FROM users WHERE email = ?',
      ['admin@resalogic.com']
    )

    if (existingUsers.length === 0) {
      await connection.execute(
        'INSERT INTO users (email, password, name, role, active) VALUES (?, ?, ?, ?, ?)',
        ['admin@resalogic.com', 'password', 'Super Admin', 'admin', 1]
      )
      console.log('  ✓ Default admin user created')
    } else {
      console.log('  - Default admin user already exists')
    }

    // Insert default settings
    const defaultSettings = [
      { key: 'site_title', value: 'Resalogic | Microsoft Technology Partner', type: 'text' },
      { key: 'site_email', value: 'contact@resalogic.com', type: 'email' },
      { key: 'site_phone', value: '+216 55 444 536', type: 'text' },
      { key: 'site_address', value: 'Mahdia, Tunisie', type: 'text' },
      { key: 'social_linkedin', value: '#', type: 'url' },
      { key: 'social_twitter', value: '#', type: 'url' },
      { key: 'social_github', value: '#', type: 'url' },
    ]

    for (const setting of defaultSettings) {
      const [existing] = await connection.execute(
        'SELECT id FROM site_settings WHERE setting_key = ?',
        [setting.key]
      )

      if (existing.length === 0) {
        await connection.execute(
          'INSERT INTO site_settings (setting_key, setting_value, setting_type) VALUES (?, ?, ?)',
          [setting.key, setting.value, setting.type]
        )
      }
    }
    console.log('  ✓ Default site settings created')

    console.log('\n' + '='.repeat(60))
    console.log('🎉 Database setup complete!')
    console.log('='.repeat(60))
    console.log('\n📋 Summary:')
    console.log('   - Database: ' + dbConfig.database)
    console.log('   - Tables: 9 tables created')
    console.log('   - Admin user: admin@resalogic.com / password')
    console.log('\n🚀 Next step: npm run dev')
    console.log('🔐 Login: http://localhost:3000/admin/login')
    console.log('')

  } catch (error) {
    console.error('\n❌ Error setting up database:', error.message)
    console.error('\nPlease check:')
    console.error('  1. MySQL server is running')
    console.error('  2. MySQL credentials in .env file are correct')
    console.error('  3. MySQL user has CREATE DATABASE permission')
    process.exit(1)
  } finally {
    if (connection) {
      await connection.end()
    }
  }
}

// Run the setup
setupDatabase()
