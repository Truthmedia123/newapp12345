# 🏠 Local Installation Guide - TheGoanWedding.com Directory

## 📋 Prerequisites

Before you begin, ensure you have the following installed on your local machine:

### Required Software
- **Node.js 18.0.0 or higher** - [Download from nodejs.org](https://nodejs.org/)
- **PostgreSQL 12.0 or higher** - [Download from postgresql.org](https://www.postgresql.org/download/)
- **Git** - [Download from git-scm.com](https://git-scm.com/)
- **npm** (comes with Node.js) or **yarn**

### Verify Installation
```bash
# Check Node.js version (should be 18+)
node --version

# Check npm version
npm --version

# Check PostgreSQL version
psql --version

# Check Git version
git --version
```

---

## 🚀 Step-by-Step Installation

### Step 1: Clone the Repository
```bash
# Clone the project
git clone <your-repository-url>
cd wedding-directory-platform

# Or if you downloaded the zip file, extract it and navigate to the folder
cd TheGoanWedding-Directory
```

### Step 2: Install Dependencies
```bash
# Install all project dependencies
npm install

# If you encounter any errors, try:
npm install --legacy-peer-deps
```

### Step 3: Database Setup

#### Option A: Using Local PostgreSQL (Recommended)
```bash
# 1. Start PostgreSQL service
# On macOS with Homebrew:
brew services start postgresql

# On Ubuntu/Debian:
sudo systemctl start postgresql

# On Windows: Start PostgreSQL from Services or pgAdmin

# 2. Create a new database
createdb wedding_directory

# Or using psql:
psql -U postgres -c "CREATE DATABASE wedding_directory;"

# 3. Create a database user (optional but recommended)
psql -U postgres -c "CREATE USER wedding_user WITH PASSWORD 'your_password';"
psql -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE wedding_directory TO wedding_user;"
```

#### Option B: Using Docker PostgreSQL
```bash
# Run PostgreSQL in Docker
docker run --name wedding-postgres \
  -e POSTGRES_PASSWORD=your_password \
  -e POSTGRES_DB=wedding_directory \
  -p 5432:5432 \
  -d postgres:13

# Wait for container to start
docker ps
```

### Step 4: Environment Configuration
```bash
# Copy the environment template
cp .env.example .env

# Edit the .env file with your configuration
nano .env
# or
code .env
```

#### Required Environment Variables:
Edit your `.env` file with these values:

```bash
# Database Configuration (REQUIRED)
DATABASE_URL=postgresql://username:password@localhost:5432/wedding_directory

# Replace with your actual values:
# - username: your PostgreSQL username (default: postgres)
# - password: your PostgreSQL password
# - wedding_directory: your database name

# Server Configuration
NODE_ENV=development
PORT=5000
SITE_URL=http://localhost:5000
DOMAIN_URL=http://localhost:5000
FRONTEND_URL=http://localhost:5000

# Database Pool Settings (Optional - defaults are fine)
DB_MAX_CONNECTIONS=20
DB_IDLE_TIMEOUT=30000
DB_CONNECT_TIMEOUT=10000
```

#### Example Configuration:
```bash
# Example for local PostgreSQL
DATABASE_URL=postgresql://postgres:mypassword@localhost:5432/wedding_directory

# Example for Docker PostgreSQL
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/wedding_directory
```

### Step 5: Database Migration and Seeding
```bash
# Push the database schema
npm run db:push

# If you get errors, try forcing the push
npm run db:push --force

# Seed the database with sample data (optional)
npm run db:seed
```

### Step 6: Build the Frontend
```bash
# Build the React frontend application
npm run build

# This creates optimized production files in the dist/public directory
```

### Step 7: Start the Application
```bash
# Start the development server
npm run dev

# The server will start on http://localhost:5000
```

---

## 🌐 Accessing Your Local Application

### Main Application
- **URL:** http://localhost:5000
- **Status:** Should show the wedding directory homepage

### API Endpoints
- **Health Check:** http://localhost:5000/health
- **API Base:** http://localhost:5000/api/

### Testing the Installation
1. **Open Browser:** Navigate to http://localhost:5000
2. **Check Homepage:** You should see the wedding directory interface
3. **Test Categories:** Click on "Categories" to view vendor categories
4. **Test Search:** Try the search functionality
5. **Health Check:** Visit http://localhost:5000/health for system status

---

## 🛠️ Development Workflow

### Running in Development Mode
```bash
# Start with auto-reload
npm run dev

# The server will restart automatically when you make changes
```

### Building for Production
```bash
# Build optimized version
npm run build:production

# Start production server
npm start
```

### Database Management
```bash
# Reset database and reseed
npm run db:reset

# Generate new migration files
npm run db:generate

# Apply migrations
npm run db:migrate
```

### Testing
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run with coverage
npm run test:coverage
```

---

## 🔧 Troubleshooting Common Issues

### Database Connection Issues

#### Problem: "database does not exist"
```bash
# Solution: Create the database
createdb wedding_directory
```

#### Problem: "role does not exist"
```bash
# Solution: Create PostgreSQL user
createuser -s postgres
# or
psql -c "CREATE USER postgres WITH SUPERUSER;"
```

#### Problem: "password authentication failed"
```bash
# Solution: Reset PostgreSQL password
sudo -u postgres psql
\password postgres
# Enter new password when prompted
```

### Application Won't Start

#### Problem: Port 5000 already in use
```bash
# Find what's using port 5000
lsof -i :5000

# Kill the process
kill -9 <PID>

# Or change port in .env file
PORT=5001
```

#### Problem: Node modules issues
```bash
# Clear node modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### Problem: Build failures
```bash
# Clear build cache
rm -rf dist
npm run build
```

### Frontend Not Loading

#### Problem: Blank page or loading issues
```bash
# Rebuild the frontend
npm run build

# Check if static files exist
ls -la dist/public/

# Restart the server
npm run dev
```

### Database Migration Issues

#### Problem: Migration conflicts
```bash
# Force push schema changes
npm run db:push --force

# Reset and rebuild database
npm run db:reset
```

---

## 📁 Project Structure Overview

```
wedding-directory-platform/
├── client/                 # React frontend application
│   ├── src/
│   │   ├── components/     # UI components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom hooks
│   │   └── styles/        # CSS files
│   └── public/            # Static assets
├── server/                # Express backend
│   ├── db/               # Database configuration
│   ├── routes.ts         # API routes
│   └── index.ts          # Server entry point
├── shared/               # Shared TypeScript schemas
├── migrations/           # Database migrations
├── .env.example          # Environment variables template
├── package.json          # Dependencies and scripts
└── README.md            # Project documentation
```

---

## 🎯 Available Features Locally

### Vendor Directory
- Browse 43+ wedding vendor categories
- Search and filter vendors
- View vendor profiles with contact information
- Social media integration

### RSVP System
- Create wedding invitation pages
- Generate QR codes for easy sharing
- Manage guest lists and responses
- Track RSVP analytics

### Blog System
- Wedding planning articles
- SEO-optimized content
- Category management

### Business Management
- Vendor registration forms
- Business inquiry handling
- Contact management

---

## 🚀 Ready to Develop!

Your local Goan Wedding Directory is now running! Here's what you can do:

### Immediate Next Steps:
1. **Explore the Interface:** Navigate through all pages and features
2. **Test Functionality:** Try creating vendors, RSVP events, and blog posts
3. **Check API Endpoints:** Test the REST API at http://localhost:5000/api/
4. **Review Database:** Check your PostgreSQL database for populated tables

### Development Tasks:
- **Customize Design:** Modify components in `client/src/components/`
- **Add Features:** Extend functionality in `server/routes.ts`
- **Update Database:** Modify schemas in `shared/schema.ts`
- **Style Changes:** Update CSS in `client/src/styles/`

### Production Deployment:
- **Build for Production:** `npm run build:production`
- **Deploy to Server:** Follow deployment guides in README.md
- **Configure Domain:** Update environment variables for your domain

---

## 📞 Support

If you encounter issues:

1. **Check the Logs:** Look at terminal output for error messages
2. **Verify Environment:** Ensure all environment variables are correct
3. **Test Database:** Verify PostgreSQL connection with `psql`
4. **Check Dependencies:** Ensure all npm packages are installed
5. **Review Documentation:** Check README.md for additional guidance

**Status: 🟢 LOCAL DEVELOPMENT READY**

Your Goan Wedding Directory is now successfully running locally! Start building amazing wedding experiences! 🎉