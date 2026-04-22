# 🔧 Fix: "Unknown database 'resalogic_db'" Error

## ✅ Solution - Auto-Create Database on Start

The application now **automatically creates** the MySQL database if it doesn't exist!

---

## 🚀 Quick Fix (Choose ONE Method)

### Method 1: Auto-Setup on App Start (Easiest)

Just start your application - the database will be created automatically:

```bash
npm run dev
```

**That's it!** The app will:
1. ✅ Create the database `resalogic_db` if it doesn't exist
2. ✅ Create all tables
3. ✅ Seed default data (admin user, settings)
4. ✅ Start the server

You'll see this in the console:
```
✅ Database 'resalogic_db' created or already exists
✅ MySQL database initialized successfully
```

---

### Method 2: Manual Setup Script (Recommended)

If you want more control, run the setup script first:

```bash
npm run setup:db
```

This will:
1. Create the database
2. Create all 9 tables
3. Insert default data
4. Show you a summary

Then start the app:
```bash
npm run dev
```

---

### Method 3: Manual SQL Command

If you prefer to do it manually in MySQL:

```sql
-- Open MySQL command line or MySQL Workbench
CREATE DATABASE IF NOT EXISTS resalogic_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Then start the app:
```bash
npm run dev
```

The app will create all tables and seed data automatically.

---

## 🔍 Verify Setup

After running one of the methods above, verify everything works:

### 1. Check Console Output
You should see:
```
✅ Database 'resalogic_db' created or already exists
✅ MySQL database initialized successfully
```

### 2. Test in Browser
- Homepage: http://localhost:3000
- Admin Login: http://localhost:3000/admin/login

### 3. Login to Admin
- **Email:** admin@resalogic.com
- **Password:** password

### 4. Verify Database
```sql
USE resalogic_db;
SHOW TABLES;
-- Should show 9 tables

SELECT COUNT(*) FROM users;
-- Should show 1 (the admin user)
```

---

## 🐛 Troubleshooting

### Error: "Access denied for user 'root'@'localhost'"

**Problem:** MySQL password in `.env` is incorrect

**Solution:**
1. Open `.env` file
2. Update `MYSQL_PASSWORD` with your correct MySQL password
3. Try again

Example:
```env
MYSQL_HOST=localhost
MYSQL_USER=root
MYSQL_PASSWORD=your_actual_mysql_password
MYSQL_DATABASE=resalogic_db
MYSQL_PORT=3306
```

---

### Error: "Can't connect to MySQL server"

**Problem:** MySQL server is not running

**Solution:**

**Windows:**
```cmd
# Check if MySQL is running
mysqladmin ping

# Start MySQL service
net start MySQL
```

**Mac/Linux:**
```bash
# Check if MySQL is running
mysqladmin ping

# Start MySQL service
sudo systemctl start mysql
# or
brew services start mysql
```

---

### Error: "Unknown database" still appears

**Problem:** MySQL user doesn't have CREATE DATABASE permission

**Solution:**
```sql
-- Login to MySQL as root
mysql -u root -p

-- Grant permissions
GRANT ALL PRIVILEGES ON *.* TO 'root'@'localhost' WITH GRANT OPTION;
FLUSH PRIVILEGES;

-- Then create database manually
CREATE DATABASE resalogic_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Then run:
```bash
npm run dev
```

---

## 📊 What Gets Created Automatically

### Database
- **Name:** resalogic_db
- **Charset:** utf8mb4 (supports emojis and special characters)
- **Collation:** utf8mb4_unicode_ci

### Tables (9 total)
1. ✅ `contacts` - Contact form submissions
2. ✅ `projects` - Portfolio projects
3. ✅ `blogs` - Blog posts
4. ✅ `testimonials` - Client reviews
5. ✅ `faqs` - FAQ entries
6. ✅ `services` - Service offerings
7. ✅ `team_members` - Team profiles
8. ✅ `site_settings` - Site configuration
9. ✅ `users` - Admin accounts

### Default Data
- **1 Admin User:** admin@resalogic.com / password
- **7 Site Settings:** email, phone, address, social links

---

## 🎯 How It Works

The `lib/mysql.ts` file now has this logic:

```typescript
export async function initializeDatabase(): Promise<void> {
  if (isInitialized) return
  
  try {
    // 1. Create database if it doesn't exist
    await ensureDatabaseExists()
    
    // 2. Create connection pool with database
    const connection = await getPool().getConnection()
    
    // 3. Create all tables
    await connection.execute('CREATE TABLE IF NOT EXISTS contacts ...')
    await connection.execute('CREATE TABLE IF NOT EXISTS projects ...')
    // ... (7 more tables)
    
    // 4. Seed default data
    // Insert admin user if not exists
    // Insert site settings
    
    // 5. Mark as initialized
    isInitialized = true
  } catch (error) {
    // Handle errors
  }
}
```

**Key Feature:** The `ensureDatabaseExists()` function creates a temporary connection WITHOUT specifying a database, creates the database, then closes the connection. Then the main pool connects to it.

---

## 📝 Files Modified

- ✅ `lib/mysql.ts` - Added `ensureDatabaseExists()` function
- ✅ `setup-database.js` - Standalone setup script
- ✅ `package.json` - Added `setup:db` script
- ✅ `.env` - MySQL configuration

---

## ✨ Benefits

1. **Zero Manual Steps** - Database created automatically
2. **Idempotent** - Safe to run multiple times (won't duplicate data)
3. **Error Handling** - Clear error messages if something fails
4. **Flexible** - Choose automatic or manual setup
5. **Production Ready** - Works in any environment

---

## 🚀 Next Steps

After database is created:

1. **Start the app:**
   ```bash
   npm run dev
   ```

2. **Add sample data (optional):**
   ```bash
   mysql -u root -p resalogic_db < database/seed.sql
   ```

3. **Login to admin panel:**
   - URL: http://localhost:3000/admin/login
   - Email: admin@resalogic.com
   - Password: password

4. **Start adding content!**

---

**Last Updated:** April 8, 2026  
**Status:** ✅ Fixed and Tested
