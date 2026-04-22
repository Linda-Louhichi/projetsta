# Resalogic Website - Architecture Diagram

## System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         CLIENT BROWSER                              │
│                                                                     │
│  ┌──────────────┐  ┌──────────────┐  ┌────────────────────────┐    │
│  │   Homepage   │  │  Admin Panel │  │  Public Pages          │    │
│  │              │  │              │  │  - /blog               │    │
│  │ - Hero       │  │ - Dashboard  │  │  - /projects           │    │
│  │ - Services   │  │ - Contacts   │  │  - /contacts           │    │
│  │ - Projects ◄─┼──┼─► Projects  │  │                        │    │
│  │ - Testimon. ◄┼──┼─► Testimon. │  │                        │    │
│  │ - FAQ ◄──────┼──┼─► FAQs      │  │                        │    │
│  │ - Contact    │  │ - Blogs      │  │                        │    │
│  │              │  │ - Users      │  │                        │    │
│  │              │  │ - Settings   │  │                        │    │
│  └──────────────┘  └──────────────┘  └────────────────────────┘    │
│                                                                     │
└────────────────────────────┬────────────────────────────────────────┘
                             │
                    HTTP Requests
                  (fetch API calls)
                             │
┌────────────────────────────▼────────────────────────────────────────┐
│                      NEXT.JS API ROUTES                             │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────┐      │
│  │  /api/contacts        [GET, POST]         [paginated]    │      │
│  │  /api/contacts/[id]   [GET, PUT, DELETE]                 │      │
│  │                                                           │      │
│  │  /api/projects        [GET, POST]         [paginated]    │      │
│  │  /api/projects/[id]   [GET, PUT, DELETE]                 │      │
│  │                                                           │      │
│  │  /api/blogs           [GET, POST]         [paginated]    │      │
│  │  /api/blogs/[id]      [GET, PUT, DELETE]                 │      │
│  │                                                           │      │
│  │  /api/testimonials    [GET, POST]         [paginated]    │      │
│  │  /api/testimonials/[id] [GET, PUT, DELETE]               │      │
│  │                                                           │      │
│  │  /api/faqs            [GET, POST]         [paginated]    │      │
│  │  /api/faqs/[id]       [GET, PUT, DELETE]                 │      │
│  │                                                           │      │
│  │  /api/users           [GET, POST]         [paginated]    │      │
│  │  /api/users/[id]      [GET, PUT, DELETE]                 │      │
│  │                                                           │      │
│  │  /api/settings        [GET, PUT]                         │      │
│  │  /api/auth/login      [POST]                             │      │
│  │  /api/auth/me         [GET]                              │      │
│  └──────────────────────────────────────────────────────────┘      │
│                             │                                       │
└─────────────────────────────┼───────────────────────────────────────┘
                              │
                     mysql2 queries
                     (async/await)
                              │
┌─────────────────────────────▼──────────────────────────────────────┐
│                      DATABASE LAYER                               │
│                        (lib/mysql.ts)                             │
│                                                                     │
│  ┌────────────────────────────────────────────────────────┐        │
│  │  Connection Pool (max 10 connections)                  │        │
│  │  - Host: process.env.MYSQL_HOST                        │        │
│  │  - User: process.env.MYSQL_USER                        │        │
│  │  - Database: process.env.MYSQL_DATABASE                │        │
│  │  - Port: 3306                                           │        │
│  └────────────────────────────────────────────────────────┘        │
│                                                                     │
│  Helper Functions:                                                  │
│  ├─ getAll(table, options)      [with pagination]                  │
│  ├─ getById(table, id)                                             │
│  ├─ create(table, data)                                            │
│  ├─ update(table, id, data)                                        │
│  ├─ remove(table, id)                                              │
│  ├─ count(table, where)                                            │
│  └─ query(sql, values)                                             │
│                                                                     │
└────────────────────────────┬────────────────────────────────────────┘
                             │
                     MySQL Protocol
                             │
┌────────────────────────────▼────────────────────────────────────────┐
│                       MySQL DATABASE                                │
│                    (resalogic_db)                                   │
│                                                                     │
│  ┌──────────────────────────────────────────────────────┐          │
│  │  TABLES (InnoDB Engine, utf8mb4)                     │          │
│  │                                                       │          │
│  │  contacts          Form submissions                  │          │
│  │    ├─ id (PK, AUTO_INCREMENT)                        │          │
│  │    ├─ name, email, phone, company, message           │          │
│  │    └─ createdAt (TIMESTAMP)                          │          │
│  │    INDEXES: email, createdAt                         │          │
│  │                                                       │          │
│  │  projects          Portfolio items                   │          │
│  │    ├─ id (PK, AUTO_INCREMENT)                        │          │
│  │    ├─ title, sector, description                     │          │
│  │    ├─ context, solution, result                      │          │
│  │    ├─ technologies (JSON)                            │          │
│  │    ├─ imageUrl, status                               │          │
│  │    └─ createdAt (TIMESTAMP)                          │          │
│  │    INDEXES: sector, status, createdAt                │          │
│  │                                                       │          │
│  │  blogs             Blog posts                        │          │
│  │    ├─ id (PK, AUTO_INCREMENT)                        │          │
│  │    ├─ title, excerpt, content (LONGTEXT)             │          │
│  │    ├─ author, category, tags (JSON)                  │          │
│  │    ├─ published (TINYINT)                            │          │
│  │    ├─ createdAt, updatedAt (TIMESTAMP)               │          │
│  │    └─ imageUrl                                       │          │
│  │    INDEXES: category, published, createdAt           │          │
│  │                                                       │          │
│  │  testimonials      Client reviews                    │          │
│  │    ├─ id (PK, AUTO_INCREMENT)                        │          │
│  │    ├─ name, role, company, content                   │          │
│  │    ├─ avatar, rating (1-5)                           │          │
│  │    ├─ published (TINYINT)                            │          │
│  │    └─ createdAt (TIMESTAMP)                          │          │
│  │    INDEXES: published, rating                        │          │
│  │                                                       │          │
│  │  faqs              Frequently asked questions        │          │
│  │    ├─ id (PK, AUTO_INCREMENT)                        │          │
│  │    ├─ question, answer (TEXT)                        │          │
│  │    ├─ category, orderIndex                           │          │
│  │    ├─ published (TINYINT)                            │          │
│  │    └─ createdAt (TIMESTAMP)                          │          │
│  │    INDEXES: category, published, orderIndex          │          │
│  │                                                       │          │
│  │  services          Service offerings                 │          │
│  │    ├─ id, title, description                         │          │
│  │    ├─ icon, orderIndex, published                    │          │
│  │    └─ createdAt                                      │          │
│  │                                                       │          │
│  │  team_members      Team profiles                     │          │
│  │    ├─ id, name, role, bio                            │          │
│  │    ├─ imageUrl, linkedin, twitter                    │          │
│  │    ├─ orderIndex, published                          │          │
│  │    └─ createdAt                                      │          │
│  │                                                       │          │
│  │  site_settings     Configuration                     │          │
│  │    ├─ id, setting_key (UNIQUE)                       │          │
│  │    ├─ setting_value (TEXT)                           │          │
│  │    ├─ setting_type                                   │          │
│  │    └─ updatedAt (TIMESTAMP)                          │          │
│  │                                                       │          │
│  │  users             Admin accounts                    │          │
│  │    ├─ id, email (UNIQUE), password                   │          │
│  │    ├─ name, role, avatar                             │          │
│  │    ├─ active (TINYINT), lastLogin                    │          │
│  │    └─ createdAt                                      │          │
│  │    INDEXES: email, role, active                      │          │
│  └──────────────────────────────────────────────────────┘          │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Data Flow Examples

### 1. User Views Homepage Projects

```
User Browser
    │
    ├─► Loads Homepage (/)
    │
    ├─► Projects section mounts
    │   └─► useEffect triggers
    │       └─► fetch('/api/projects?limit=6')
    │           │
    │           ▼
    │       Next.js API Route (/api/projects)
    │           │
    │           ├─► getAll('projects', {limit: 6, offset: 0})
    │           │   └─► lib/mysql.ts
    │           │       │
    │           │       ├─► Get connection from pool
    │           │       │
    │           │       └─► Execute: 
    │           │           SELECT * FROM projects 
    │           │           ORDER BY createdAt DESC 
    │           │           LIMIT 6 OFFSET 0
    │           │               │
    │           │               ▼
    │           │           MySQL Database
    │           │               │
    │           │               └─► Returns 6 projects
    │           │                       │
    │           ◄───────────────────────┘
    │               │
    │               └─► JSON response
    │                       │
    ◄───────────────────────┘
    │
    └─► Renders project cards on page
```

### 2. Admin Adds New Project

```
Admin User
    │
    ├─► Login to /admin/projects
    │
    ├─► Click "Add Project"
    │   └─► Fill form & submit
    │       │
    │       └─► POST /api/projects
    │           │   {title, sector, description, ...}
    │           │
    │           ▼
    │       Next.js API Route (/api/projects)
    │           │
    │           ├─► Validate input
    │           │
    │           └─► create('projects', data)
    │               └─► lib/mysql.ts
    │                   │
    │                   ├─► Get connection from pool
    │                   │
    │                   └─► Execute:
    │                       INSERT INTO projects 
    │                       (title, sector, ...) 
    │                       VALUES (?, ?, ...)
    │                           │
    │                           ▼
    │                       MySQL Database
    │                           │
    │                           └─► Insert row, return new ID
    │                                   │
    │                       ◄───────────┘
    │                           │
    │                           └─► JSON response
    │                                   │
    ◄───────────────────────────────────┘
    │
    └─► Show success toast
        │
        └─► Refresh project list
            └─► New project visible
```

### 3. User Submits Contact Form

```
Website Visitor
    │
    ├─► Scroll to Contact section
    │
    ├─► Fill form (name, email, message)
    │   └─► Click "Send message"
    │       │
    │       └─► POST /api/contacts
    │           │   {name, email, phone, company, message}
    │           │
    │           ▼
    │       Next.js API Route (/api/contacts)
    │           │
    │           ├─► Validate name & email
    │           │
    │           └─► create('contacts', data)
    │               └─► lib/mysql.ts
    │                   │
    │                   └─► INSERT INTO contacts ...
    │                           │
    │                           ▼
    │                       MySQL Database
    │                           │
    │                           └─► Save contact
    │                                   │
    │                       ◄───────────┘
    │                           │
    │                           └─► Success response
    │                                   │
    ◄───────────────────────────────────┘
    │
    └─► Show success message
        └─► Clear form
```

---

## Configuration Flow

```
Application Start (npm run dev)
    │
    ├─► Load .env file
    │   └─► MYSQL_HOST, MYSQL_USER, MYSQL_PASSWORD, etc.
    │
    ├─► Import lib/mysql.ts
    │   │
    │   └─► Create connection pool
    │       └─► pool = mysql.createPool(config)
    │
    ├─► Check NODE_ENV & INIT_DB
    │   └─► If development or INIT_DB=true
    │       │
    │       └─► initializeDatabase()
    │           │
    │           ├─► CREATE TABLE IF NOT EXISTS contacts
    │           ├─► CREATE TABLE IF NOT EXISTS projects
    │           ├─► CREATE TABLE IF NOT EXISTS blogs
    │           ├─► CREATE TABLE IF NOT EXISTS testimonials
    │           ├─► CREATE TABLE IF NOT EXISTS faqs
    │           ├─► CREATE TABLE IF NOT EXISTS services
    │           ├─► CREATE TABLE IF NOT EXISTS team_members
    │           ├─► CREATE TABLE IF NOT EXISTS site_settings
    │           └─► CREATE TABLE IF NOT EXISTS users
    │               │
    │               ├─► Insert default admin user (if not exists)
    │               └─► Insert default settings (if not exists)
    │                   │
    │                   └─► ✅ MySQL database initialized successfully
    │
    └─► Start Next.js dev server
        └─► http://localhost:3000
```

---

## Security Layers

```
┌─────────────────────────────────────────────────────────┐
│  Layer 1: Environment Variables                         │
│  - Database credentials in .env (not in code)           │
│  - Ignored by git (.gitignore)                          │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────┐
│  Layer 2: Connection Pool                               │
│  - Limited to 10 connections                            │
│  - Prevents connection exhaustion                       │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────┐
│  Layer 3: Parameterized Queries                         │
│  - All queries use ? placeholders                       │
│  - Prevents SQL injection                               │
│  Example: SELECT * FROM users WHERE email = ?           │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────┐
│  Layer 4: Input Validation                              │
│  - Zod schemas validate all input                       │
│  - Type checking with TypeScript                        │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────┐
│  Layer 5: Middleware Protection                         │
│  - /admin/* routes require auth_token cookie            │
│  - Redirects to /admin/login if not authenticated       │
└─────────────────────────────────────────────────────────┘
```

---

## Technology Stack

```
┌──────────────────────────────────────────┐
│           Frontend Layer                 │
│                                          │
│  React 19.2.0                            │
│  Next.js 16.0.10 (App Router)            │
│  TypeScript 5                            │
│  Tailwind CSS 4.1.9                      │
│  Radix UI Components                     │
│  Lucide React (Icons)                    │
└──────────────────────────────────────────┘
                  │
┌─────────────────▼────────────────────────┐
│           Backend Layer                  │
│                                          │
│  Next.js API Routes                      │
│  Serverless Functions                    │
│  Async/Await Pattern                     │
│  Error Handling                          │
└──────────────────────────────────────────┘
                  │
┌─────────────────▼────────────────────────┐
│        Database Access Layer             │
│                                          │
│  mysql2 (MySQL client for Node.js)       │
│  Connection Pooling                      │
│  Prepared Statements                     │
│  Transaction Support                     │
└──────────────────────────────────────────┘
                  │
┌─────────────────▼────────────────────────┐
│          Database Layer                  │
│                                          │
│  MySQL 8.0+                              │
│  InnoDB Engine                           │
│  utf8mb4 Character Set                   │
│  Indexes & Foreign Keys                  │
└──────────────────────────────────────────┘
```

---

**Architecture Version:** 1.0  
**Last Updated:** April 8, 2026  
**Status:** Production-Ready ✅
