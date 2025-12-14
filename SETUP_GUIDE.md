# Urban Plant Life - Complete Setup Guide

This guide walks you through setting up the entire Urban Plant Life application from scratch.

## 📋 Prerequisites

Before you begin, ensure you have installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org)
- **Git** - [Download](https://git-scm.com)
- **PostgreSQL** (v12 or higher) - [Download](https://www.postgresql.org/download)
- **Text Editor** - VS Code, Sublime Text, or your preferred editor
- **Uploadcare Account** - [Sign up free](https://uploadcare.com)

### Verify Installation

```bash
# Check Node.js
node --version
npm --version

# Check PostgreSQL
psql --version
```

## 🔧 Step 1: Database Setup

### 1.1 Create PostgreSQL Database

```bash
# Log in to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE urban_plant_life;

# Connect to the new database
\c urban_plant_life

# Exit PostgreSQL
\q
```

### 1.2 Initialize Database Schema

```bash
# Navigate to backend scripts directory
cd backend/scripts

# Run initialization script
psql -U postgres -d urban_plant_life -f db_init.sql

# Run sample data script
psql -U postgres -d urban_plant_life -f sample_data.sql
```

### 1.3 Verify Database

```bash
psql -U postgres -d urban_plant_life

# List tables
\dt

# View users table
SELECT * FROM users;

# Exit
\q
```

## 🔙 Step 2: Backend Setup

### 2.1 Install Dependencies

```bash
cd backend
npm install
```

### 2.2 Configure Environment

```bash
# Copy environment template
cp .env.example .env

# Edit .env with your configuration
nano .env
```

**Required environment variables:**

```env
# Server Configuration
PORT=5000
NODE_ENV=development
LOG_LEVEL=debug

# Database Configuration
DB_USER=postgres
DB_PASSWORD=your_password_here
DB_HOST=localhost
DB_PORT=5432
DB_NAME=urban_plant_life
DB_SSL=false
DB_POOL_SIZE=10

# JWT Configuration
JWT_SECRET=your_secret_key_change_this_in_production
JWT_EXPIRY=7d

# CORS Configuration
CORS_ORIGIN=http://localhost:3000

# Email Configuration (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
```

### 2.3 Generate JWT Secret

```bash
# Generate a strong random string
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Copy the output and set as JWT_SECRET in .env
```

### 2.4 Test Database Connection

```bash
# Run in the backend directory
npm run test-db
```

You should see:
```
✓ Database connected successfully
✓ All tables created
✓ Sample data loaded
```

### 2.5 Start Backend Server

```bash
# Start development server
npm run dev

# Server should start on http://localhost:5000
# You should see:
# ✓ Server running on port 5000
# ✓ Database pool initialized with 10 connections
# ✓ CORS enabled for http://localhost:3000
```

### 2.6 Test API Endpoints

```bash
# In a new terminal, test the API
curl http://localhost:5000/api/health

# Expected response:
# {"status":"ok","timestamp":"2024-12-14T10:00:00Z"}
```

## 🎨 Step 3: Frontend Setup

### 3.1 Install Dependencies

```bash
cd frontend
npm install
```

### 3.2 Get Uploadcare API Key

1. Visit [uploadcare.com](https://uploadcare.com)
2. Sign up for a free account
3. Create a new project
4. Go to "Project settings"
5. Copy your **Public Key**

### 3.3 Configure Environment

```bash
# Copy environment template
cp .env.example .env.local

# Edit .env.local with your configuration
nano .env.local
```

**Required environment variables:**

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:5000/api

# Uploadcare Configuration
NEXT_PUBLIC_UPLOADCARE_PUBLIC_KEY=your_public_key_here
```

### 3.4 Start Frontend Server

```bash
# Make sure you're in the frontend directory
npm run dev

# Frontend should start on http://localhost:3000
# You should see:
# ▲ Next.js 16.0.10
# - Ready in 2.5s
# - Listening on http://localhost:3000
```

## ✅ Step 4: Verification

### 4.1 Test User Registration

1. Open `http://localhost:3000`
2. Click "Register"
3. Fill in the form:
   - Username: `testuser`
   - Email: `test@example.com`
   - Password: `Test@1234`
4. Click "Register"

Expected: User created, redirected to login page

### 4.2 Test User Login

1. On login page, enter:
   - Email: `test@example.com`
   - Password: `Test@1234`
2. Click "Login"

Expected: Logged in, redirected to home page, navbar shows username

### 4.3 Test Catalog

1. Click "Catalog" in navbar
2. Should see list of sample plants

Expected: Plants display with images, prices, and "Add to Cart" buttons

### 4.4 Test Shopping Cart

1. On Catalog page, click "Add to Cart" on any plant
2. Click cart icon in navbar
3. Check cart page

Expected: Item shows in cart, quantity controls work, total price updates

### 4.5 Test Checkout

1. On Cart page, click "Proceed to Checkout"
2. Fill in billing information
3. Select payment method
4. Click "Place Order"

Expected: Order created, redirected to orders page, order shows with items

### 4.6 Test Admin Features

1. Logout and login with admin account:
   - Email: `admin@example.com`
   - Password: `Admin@1234`
2. Navbar should show "Inventory" and "Orders" links
3. Click "Inventory" → add/edit/delete plants
4. Click "Orders" → view all orders, update status

Expected: Full CRUD operations work, status updates persist

## 🐛 Troubleshooting

### Backend Won't Start

```bash
# Check if port 5000 is in use
lsof -i :5000

# Kill the process using port 5000
kill -9 <PID>

# Try starting again
npm run dev
```

### Database Connection Error

```bash
# Verify PostgreSQL is running
psql -U postgres -d urban_plant_life

# Check .env file has correct credentials
cat .env

# Verify database exists
psql -U postgres -l
```

### Frontend API Calls Failing

```bash
# Check backend is running
curl http://localhost:5000/api/health

# Check NEXT_PUBLIC_API_URL in .env.local
cat .env.local

# Clear Next.js cache
rm -rf .next
npm run dev
```

### CORS Errors

Backend shows:
```
Error: CORS policy blocked request
```

Solution:
1. Check `CORS_ORIGIN` in backend `.env`
2. Should be `http://localhost:3000`
3. Restart backend server

### Images Not Uploading

```
Failed to upload image
```

Solution:
1. Verify Uploadcare account is active
2. Check `NEXT_PUBLIC_UPLOADCARE_PUBLIC_KEY` in `.env.local`
3. Try uploading a smaller image (< 5MB)
4. Check browser console for errors

### Port Already in Use

```bash
# Find process using port 3000
lsof -i :3000

# Kill it
kill -9 <PID>

# Or run on different port
npm run dev -- -p 3001
```

## 📚 Project Structure

```
CA2_Programming-Assignment/
├── backend/
│   ├── controllers/        # Business logic
│   ├── models/            # Database queries
│   ├── routes/            # API endpoints
│   ├── middleware/        # Auth, CORS, etc
│   ├── utils/             # Helpers, DB connection
│   ├── scripts/           # Database setup SQL
│   ├── server.js          # Entry point
│   ├── package.json       # Dependencies
│   ├── .env.example       # Environment template
│   └── README.md          # Backend documentation
│
├── frontend/
│   ├── src/
│   │   ├── app/           # Pages
│   │   ├── components/    # Reusable components
│   │   ├── context/       # React Context
│   │   └── lib/           # Utilities
│   ├── public/            # Static assets
│   ├── package.json       # Dependencies
│   ├── .env.example       # Environment template
│   ├── next.config.mjs    # Next.js config
│   ├── tailwind.config.js # Tailwind config
│   └── README.md          # Frontend documentation
│
├── README.md              # Main project README
└── SETUP_GUIDE.md        # This file
```

## 🚀 Running Both Servers

### Option 1: Two Terminal Windows

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### Option 2: tmux/screen

```bash
# If you prefer using a terminal multiplexer
tmux new-session -d -s backend -c /path/to/backend 'npm run dev'
tmux new-session -d -s frontend -c /path/to/frontend 'npm run dev'
```

## 🔐 Security Tips

1. **Change JWT_SECRET** in production
2. **Use environment variables** for all secrets
3. **Enable HTTPS** in production
4. **Set strong database password**
5. **Use `.env` for local config** (never commit)
6. **Enable email verification** for registration
7. **Implement rate limiting** on login endpoint
8. **Use HTTPS for Uploadcare** in production

## 📝 First Time Checklist

- [ ] Node.js and PostgreSQL installed
- [ ] Database created and initialized
- [ ] Backend `.env` configured
- [ ] Backend starts without errors
- [ ] Backend API responds to `/api/health`
- [ ] Uploadcare account created
- [ ] Frontend `.env.local` configured
- [ ] Frontend starts without errors
- [ ] Frontend loads at `http://localhost:3000`
- [ ] Can register new user
- [ ] Can login with registered user
- [ ] Can add items to cart
- [ ] Can place order
- [ ] Can view order history
- [ ] Admin can access inventory and orders

## 🆘 Getting Help

1. **Check backend README** - `/backend/README.md`
2. **Check frontend README** - `/frontend/README.md`
3. **Check this setup guide** - Search for your error
4. **Check browser console** - Press F12 in browser
5. **Check terminal output** - Look for error messages
6. **Enable debug logging** - Set `LOG_LEVEL=debug` in backend `.env`

## 📞 Common Commands Reference

### Backend Commands

```bash
cd backend

# Install dependencies
npm install

# Start development server
npm run dev

# Test database connection
npm run test-db

# Run linter
npm run lint

# Build for production
npm run build

# Start production server
npm start
```

### Frontend Commands

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint

# Check types
npm run type-check
```

### PostgreSQL Commands

```bash
# Connect to database
psql -U postgres -d urban_plant_life

# List all tables
\dt

# Describe table structure
\d table_name

# View all data in table
SELECT * FROM table_name;

# Exit psql
\q
```

## 🎓 Next Steps After Setup

1. **Explore the codebase** - Read the code comments
2. **Test all features** - Try different user roles
3. **Read documentation** - Check backend and frontend READMEs
4. **Customize styling** - Modify Tailwind CSS classes
5. **Add new features** - Extend with your own functionality
6. **Deploy to production** - Follow deployment guides

## 📖 Documentation Files

- **Backend Documentation** - `/backend/README.md`
- **Frontend Documentation** - `/frontend/README.md`
- **Main README** - `/README.md`
- **This Setup Guide** - `/SETUP_GUIDE.md`

---

## 🎯 Success!

If you see both servers running without errors and can:
- Register a new user ✓
- Login successfully ✓
- Browse the catalog ✓
- Add items to cart ✓
- Place an order ✓
- View order history ✓

**Congratulations! Urban Plant Life is fully set up and running! 🌱**

---

**Last Updated:** December 14, 2024
**Version:** 1.0.0
