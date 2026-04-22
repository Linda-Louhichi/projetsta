# Resalogic Company Website - MySQL Setup Guide

## 🚀 Migration from SQLite to MySQL

This project has been successfully migrated from SQLite to MySQL for better performance, scalability, and production readiness.

---

## 📋 Prerequisites

- **Node.js** 18+ installed
- **MySQL Server** 8.0+ installed and running
- **npm** or **pnpm** package manager

---

## 🗄️ MySQL Database Setup

### Step 1: Create MySQL Database

Open MySQL command line or MySQL Workbench and run:

```sql
CREATE DATABASE resalogic_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### Step 2: Configure Environment Variables

Create a `.env` file in the root directory (copy from `.env.example`):

```bash
# MySQL Database Configuration
MYSQL_HOST=localhost
MYSQL_USER=root
MYSQL_PASSWORD=your_password_here
MYSQL_DATABASE=resalogic_db
MYSQL_PORT=3306

# Application Settings
NODE_ENV=development
INIT_DB=true
```

**Important:** Replace `your_password_here` with your actual MySQL root password.

### Step 3: Seed the Database (Optional but Recommended)

To populate your database with initial data, run the seed script:

```bash
# Using MySQL command line
mysql -u root -p resalogic_db < database/seed.sql
```

Or manually through MySQL Workbench by opening `database/seed.sql` and executing it.

### Step 4: Install Dependencies

```bash
npm install
```

### Step 5: Start the Development Server

```bash
npm run dev
```

The application will automatically:
- Connect to your MySQL database
- Create all necessary tables (if they don't exist)
- Seed default data (admin user, settings)

---

## 🔐 Default Admin Credentials

After seeding the database, you can log in to the admin panel with:

- **Email:** `admin@resalogic.com`
- **Password:** `password`

⚠️ **Important:** Change this password immediately in production!

---

## 📊 Database Schema

The application creates these tables automatically:

| Table | Purpose |
|-------|---------|
| `contacts` | Contact form submissions |
| `projects` | Portfolio projects |
| `blogs` | Blog posts/articles |
| `testimonials` | Client reviews |
| `faqs` | FAQ entries |
| `services` | Service offerings |
| `team_members` | Team member profiles |
| `site_settings` | Site configuration |
| `users` | Admin/moderator accounts |

---

## 🔧 Database Management

### View Database Status

```sql
USE resalogic_db;
SHOW TABLES;
SELECT COUNT(*) FROM projects;
SELECT COUNT(*) FROM blogs;
```

### Reset Database

If you need to start fresh:

```sql
DROP DATABASE resalogic_db;
CREATE DATABASE resalogic_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Then re-run the seed script.

---

## 🌟 Key Improvements

### Performance
✅ **Connection Pooling** - MySQL connection pool for better performance  
✅ **Indexed Queries** - Proper indexes on frequently queried columns  
✅ **Pagination Support** - All list endpoints support limit/offset  
✅ **Optimized Schema** - Proper data types and constraints  

### Data Consistency
✅ **Database-Driven Homepage** - All sections now fetch from database  
✅ **Single Source of Truth** - No more static vs database data mismatch  
✅ **Real-time Updates** - Changes in admin panel immediately reflect on homepage  

### Scalability
✅ **Production-Ready** - MySQL supports high traffic and large datasets  
✅ **Foreign Keys** - Data integrity with proper relationships  
✅ **JSON Columns** - Flexible storage for tags, technologies, etc.  

---

## 📝 API Endpoints

All API endpoints now use MySQL with pagination support:

```
GET    /api/contacts?limit=10&offset=0
GET    /api/projects?limit=6
GET    /api/blogs?limit=10&offset=0
GET    /api/testimonials?limit=4
GET    /api/faqs?limit=20
POST   /api/contacts
PUT    /api/contacts/[id]
DELETE /api/contacts/[id]
... and more
```

---

## 🛠️ Troubleshooting

### Cannot Connect to MySQL

1. Verify MySQL is running: `mysqladmin ping`
2. Check credentials in `.env` file
3. Ensure database exists: `SHOW DATABASES;`
4. Check port is correct (default: 3306)

### Tables Not Created

The application auto-initializes tables on first run. Check console for:
```
✅ MySQL database initialized successfully
```

If you see errors, verify:
- MySQL credentials are correct
- Database exists
- User has CREATE TABLE permissions

### Empty Homepage Sections

If homepage sections don't show data:
1. Open admin panel: `/admin/dashboard`
2. Add some data (projects, testimonials, FAQs)
3. Refresh homepage

Or run the seed script: `mysql -u root -p resalogic_db < database/seed.sql`

---

## 🚀 Production Deployment

### Environment Variables for Production

```bash
MYSQL_HOST=your-mysql-host.com
MYSQL_USER=prod_user
MYSQL_PASSWORD=strong_password_here
MYSQL_DATABASE=resalogic_prod
MYSQL_PORT=3306
NODE_ENV=production
INIT_DB=false
```

### Security Checklist

- [ ] Change default admin password
- [ ] Use strong MySQL password
- [ ] Create dedicated MySQL user (not root)
- [ ] Enable SSL for MySQL connection
- [ ] Set `INIT_DB=false` in production
- [ ] Implement proper password hashing (bcrypt)
- [ ] Add rate limiting to API endpoints
- [ ] Enable CORS restrictions
- [ ] Set up database backups

---

## 📚 Additional Resources

- [MySQL Documentation](https://dev.mysql.com/doc/)
- [Next.js Documentation](https://nextjs.org/docs)
- [mysql2 Node.js Package](https://www.npmjs.com/package/mysql2)

---

## 🐛 Known Issues & Future Improvements

### Current Limitations
- Passwords stored in plaintext (use bcrypt in production)
- No file upload endpoint (images are URLs only)
- Basic authentication (consider JWT or session tokens)

### Planned Enhancements
- [ ] Implement bcrypt password hashing
- [ ] Add JWT authentication
- [ ] File upload endpoint for images
- [ ] Full-text search for blogs
- [ ] Database backup endpoint
- [ ] Admin user registration endpoint

---

## 📞 Support

For issues or questions, please contact:
- **Email:** contact@resalogic.com
- **Phone:** +216 55 444 536

---

**Last Updated:** April 8, 2026  
**Database Version:** MySQL 8.0+  
**Application Version:** 1.0.0
