# Urban Plant Life - E-Commerce Application

A full-stack e-commerce web application for buying and selling plants. Built with **Express.js** backend and **Next.js** frontend, featuring user authentication, shopping cart, order management, and admin dashboard.

<div align="center">

**[🌐 Live Demo](#)** • **[📖 Documentation](#documentation)** • **[🚀 Quick Start](#quick-start)** • **[🛠 Tech Stack](#tech-stack)**

[![Node.js](https://img.shields.io/badge/Node.js-18+-43853D?style=flat&logo=node.js)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-19.2-61DAFB?style=flat&logo=react)](https://react.dev)
[![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=flat&logo=next.js)](https://nextjs.org)
[![Express](https://img.shields.io/badge/Express-5.1-000000?style=flat&logo=express)](https://expressjs.com)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-12+-336791?style=flat&logo=postgresql)](https://www.postgresql.org)
</div>

---

## 📋 Table of Contents

- [Overview](#🌿-overview)
- [Features](#✨-features)
- [Tech Stack](#🛠-tech-stack)
- [Quick Start](#🚀-quick-start)
- [Documentation](#📚-documentation)
- [Architecture](#🏗-architecture)
- [Directory Structure](#📁-directory-structure)
- [API Endpoints](#📡-api-endpoints)
- [User Roles](#👥-user-roles)
- [Database Schema](#🗄-database-schema)
- [Environment Setup](#⚙️-environment-setup)
- [Troubleshooting](#🔧-troubleshooting)
- [Testing the application](#🧪=testing-the-application)
- [Deployment](#🚀-deployment)
- [Contributing](#🤝-contributing)
- [Attribution](#attribution)

---

## 🌿 Overview

Urban Plant Life is a modern, responsive e-commerce platform for purchasing plants online. It features a professional admin dashboard for inventory management and order processing, seamless shopping experience with persistent cart storage, and secure user authentication.

### Key Capabilities

✅ **Complete CRUD Operations** - Create, read, update, delete plants and orders  
✅ **User Authentication** - Register, login, profile management with JWT  
✅ **Shopping Cart** - Database-backed persistent cart across sessions  
✅ **Order Management** - Track orders, update status, view history  
✅ **Image Management** - CDN integration with Uploadcare for fast delivery  
✅ **Admin Dashboard** - Inventory and order management tools  
✅ **Role-Based Access Control** - Customer, staff, and admin roles  
✅ **Responsive Design** - Mobile-first, works on all devices  

---

## ✨ Features

### 🛒 Customer Features
- Browse plant catalog with search and filtering
- Add items to shopping cart
- Persistent cart storage (database-backed)
- Checkout with billing information
- Multiple payment method support
- Order history and tracking
- Secure user authentication
- Profile management

### 👨‍💼 Admin Features
- Add, edit, delete plants
- Manage inventory and stock levels
- View all customer orders
- Update order status and tracking
- Monitor sales and analytics
- User management (coming soon)

### 🔧 Technical Features
- RESTful API with Express.js
- PostgreSQL database with optimized queries
- JWT-based authentication with 7-day expiration
- Argon2 password hashing for security
- Database-backed cart system
- Uploadcare CDN integration for images
- CORS enabled for cross-origin requests
- Comprehensive error handling
- Role-based authorization middleware
- Development and production ready

---

## 🛠 Tech Stack

### Backend
| Component | Technology | Version |
|-----------|-----------|---------|
| Runtime | Node.js | 18+ |
| Framework | Express.js | 5.1.0 |
| Database | PostgreSQL | 12+ |
| Auth | JWT (jsonwebtoken) | 9.0.3 |
| Password Hashing | Argon2 | 0.44.0 |
| Environment | dotenv | 16.4.4 |

### Frontend
| Component | Technology | Version |
|-----------|-----------|---------|
| Framework | Next.js | 16.0.10 |
| UI Library | React | 19.2.1 |
| Styling | Tailwind CSS | 4 |
| CDN | Uploadcare | 1.11.1 |
| State Management | Context API | Built-in |

### Database
| Entity | Purpose |
|--------|---------|
| users | User accounts and authentication |
| plants | Plant catalog |
| orders | Customer orders |
| order_items | Items within orders |
| payments | Payment records |
| carts | Shopping carts |
| cart_items | Items within carts |

---

## 🚀 Quick Start

### Prerequisites
- Node.js v18 or higher
- PostgreSQL 12 or higher
- npm or yarn
- Git

### Installation & Running (5 minutes)

**1. Clone repository**
```bash
git clone https://github.com/vinuri16/CA2_Programming-Assignment.git
cd CA2_Programming-Assignment
```

**2. Backend Setup**
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your database credentials
npm run dev
```

Backend runs on `http://localhost:5000`

**3. Frontend Setup** (in new terminal)
```bash
cd frontend
npm install
cp .env.example .env.local
# Edit .env.local with your Uploadcare public key
npm run dev
```

Frontend runs on `http://localhost:3000`

**4. Database Setup**
```bash
# In PostgreSQL
psql -U postgres -d urban_plant_life -f backend/scripts/db_init.sql
psql -U postgres -d urban_plant_life -f backend/scripts/sample_data.sql
```

**5. Open in Browser**
```
http://localhost:3000
```

➡️ **[📖 Detailed Setup Guide →](./SETUP_GUIDE.md)**

---

## 📚 Documentation

Comprehensive documentation is available in three main files:

### 📖 Backend README
**Location:** `/backend/README.md`

Complete guide to the Express.js API including:
- Installation and configuration
- 15+ API endpoints with examples
- Database schema documentation
- Authentication and authorization
- Error handling and status codes
- Troubleshooting common issues
- API flow examples

### 📖 Frontend README
**Location:** `/frontend/README.md`

Complete guide to the Next.js frontend including:
- Features overview
- Installation and configuration
- Pages and routes documentation
- Component documentation
- State management with CartContext
- API integration guide
- Uploadcare integration
- Troubleshooting guide

### 📖 Setup Guide
**Location:** `/SETUP_GUIDE.md`

Step-by-step setup instructions for:
- Database initialization
- Backend configuration
- Frontend configuration
- Environment variables
- Verification steps
- Troubleshooting common setup issues

---

## 🏗 Architecture

### Application Flow

```
User Browser
    ↓
┌─────────────────────────┐
│   Next.js Frontend      │
│ - React Components      │
│ - CartContext (State)   │
│ - Tailwind CSS Styling  │
└──────────┬──────────────┘
           ↓ HTTP/JSON
┌─────────────────────────┐
│ Express.js Backend API  │
│ - JWT Authentication    │
│ - Route Handlers        │
│ - Business Logic        │
│ - Error Handling        │
└──────────┬──────────────┘
           ↓ SQL Queries
┌─────────────────────────┐
│   PostgreSQL Database   │
│ - users, plants, orders │
│ - carts, cart_items     │
│ - payments, order_items │
└─────────────────────────┘
```

### Data Flow - Shopping Example

```
1. User browses catalog
   Frontend → GET /api/plants → Backend → Database
   ↓ Response with plant data
   
2. User adds to cart
   Frontend → POST /api/carts/items → Backend → Database
   ↓ Cart item saved, response with confirmation
   
3. User proceeds to checkout
   Frontend → GET /api/carts → Backend → Database
   ↓ Response with cart items and total
   
4. User places order
   Frontend → POST /api/orders → Backend → Database
   ↓ Order created, items saved, cart cleared
   ↓ Response with order confirmation
```

---

## 📁 Directory Structure

```
CA2_Programming-Assignment/
│
├── backend/                          # Express.js API Server
│   ├── controllers/
│   │   ├── authController.js         # Login, register, profile
│   │   ├── plantController.js        # Plant CRUD operations
│   │   ├── orderController.js        # Order management
│   │   └── cartController.js         # Cart operations
│   │
│   ├── models/
│   │   ├── User.js                   # User database queries
│   │   ├── Plant.js                  # Plant database queries
│   │   ├── Order.js                  # Order database queries
│   │   ├── Cart.js                   # Cart database queries
│   │   └── Payment.js                # Payment database queries
│   │
│   ├── routes/
│   │   ├── authRoutes.js             # Auth endpoints
│   │   ├── plantRoutes.js            # Plant endpoints
│   │   ├── orderRoutes.js            # Order endpoints
│   │   └── cartRoutes.js             # Cart endpoints
│   │
│   ├── middleware/
│   │   └── authMiddleware.js         # JWT verification
│   │
│   ├── utils/
│   │   ├── db.js                     # PostgreSQL connection
│   │   └── helpers.js                # JWT, Argon2, helpers
│   │
│   ├── scripts/
│   │   ├── db_init.sql               # Database schema
│   │   └── sample_data.sql           # Test data
│   │
│   ├── server.js                     # Entry point
│   ├── package.json                  # Dependencies
│   ├── .env.example                  # Environment template
│   └── README.md                     # Backend documentation
│
├── frontend/                         # Next.js React Application
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.js             # Root layout
│   │   │   ├── page.js               # Home page
│   │   │   ├── globals.css           # Global styles
│   │   │   │
│   │   │   ├── catalog/page.js       # Plant catalog
│   │   │   ├── cart/page.js          # Shopping cart
│   │   │   ├── checkout/page.js      # Checkout/payment
│   │   │   ├── orders/page.js        # Order history
│   │   │   │
│   │   │   ├── login/page.js         # Login page
│   │   │   ├── register/page.js      # Register page
│   │   │   │
│   │   │   └── admin/
│   │   │       ├── inventory/page.js # Plant management
│   │   │       └── orders/page.js    # Order dashboard
│   │   │
│   │   ├── components/
│   │   │   ├── Navbar.js             # Navigation bar
│   │   │   ├── Footer.js             # Footer
│   │   │   ├── ImageUploader.js      # Image upload widget
│   │   │   ├── HeroSection.js        # Hero banner
│   │   │   └── FeaturedPlants.js     # Featured section
│   │   │
│   │   ├── context/
│   │   │   └── CartContext.js        # Cart state management
│   │   │
│   │   └── lib/
│   │       └── api.js                # API client functions
│   │
│   ├── public/                       # Static assets
│   ├── package.json                  # Dependencies
│   ├── .env.example                  # Environment template
│   ├── next.config.mjs               # Next.js config
│   ├── tailwind.config.js            # Tailwind config
│   └── README.md                     # Frontend documentation
│
├── README.md                         # Main project README (this file)
├── SETUP_GUIDE.md                    # Detailed setup instructions
└── LICENSE                           # ISC License
```

---

## 📡 API Endpoints

### Authentication Endpoints
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login user | No |
| GET | `/api/auth/profile` | Get user profile | Yes |
| PUT | `/api/auth/profile` | Update profile | Yes |

### Plant Endpoints
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/plants` | Get all plants | No |
| GET | `/api/plants/:id` | Get plant by ID | No |
| POST | `/api/plants` | Create plant | Admin |
| PUT | `/api/plants/:id` | Update plant | Admin |
| DELETE | `/api/plants/:id` | Delete plant | Admin |

### Order Endpoints
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/orders` | Create order | Yes |
| GET | `/api/orders` | Get orders | Yes |
| GET | `/api/orders/:id` | Get order details | Yes |
| PUT | `/api/orders/:id/status` | Update status | Admin |

### Cart Endpoints
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/carts` | Get user cart | Yes |
| POST | `/api/carts/items` | Add item to cart | Yes |
| PUT | `/api/carts/items/:id` | Update quantity | Yes |
| DELETE | `/api/carts/items/:id` | Remove item | Yes |
| DELETE | `/api/carts` | Clear cart | Yes |

**Full API documentation with examples:** [Backend README](./backend/README.md)

---

## 👥 User Roles

### 1. **Customer** (Default)
- Browse plant catalog
- Add items to cart
- Place orders
- View own order history
- Upload profile picture
- Update profile information

### 2. **Staff**
- All customer features
- View all orders (read-only)
- Add and manage plants (inventory)

### 3. **Admin**
- All customer and staff features
- Complete order management
- Update order status

---

## 🗄 Database Schema

### Users Table
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'customer',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Plants Table
```sql
CREATE TABLE plants (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  stock_quantity INTEGER NOT NULL,
  image_url VARCHAR(500),
  care_level VARCHAR(50),
  sunlight_requirement VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Orders Table
```sql
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  total_amount DECIMAL(10, 2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Carts Table
```sql
CREATE TABLE carts (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL UNIQUE REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Full schema details:** [Backend README](./backend/README.md#database-schema)

---

## ⚙️ Environment Setup

### Backend (.env)
```env
# Server
PORT=5000
NODE_ENV=development

# Database
DB_USER=postgres
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=urban_plant_life

# JWT
JWT_SECRET=your_secret_key
JWT_EXPIRY=7d

# CORS
CORS_ORIGIN=http://localhost:3000
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_UPLOADCARE_PUBLIC_KEY=your_public_key
```

**Full configuration guide:** [SETUP_GUIDE.md](./SETUP_GUIDE.md)

---

## 🔧 Troubleshooting

### Database Connection Failed
```
Error: connect ECONNREFUSED 127.0.0.1:5432
```
- Ensure PostgreSQL is running
- Check database name in .env
- Verify credentials are correct

### API Not Responding
```
Error: Failed to fetch from http://localhost:5000
```
- Check backend is running on port 5000
- Verify CORS_ORIGIN in backend .env
- Check NEXT_PUBLIC_API_URL in frontend .env.local

### Images Not Uploading
```
Error: Failed to upload image
```
- Verify Uploadcare public key is correct
- Check internet connection
- Ensure Uploadcare account is active

### Authentication Issues
```
Error: 401 Unauthorized
```
- Token may have expired (7 days)
- User must login again
- Check JWT_SECRET in backend .env

**More troubleshooting:** [SETUP_GUIDE.md](./SETUP_GUIDE.md#-troubleshooting)

---

## 🧪 Testing the Application

### Test Accounts (from sample data)

**Admin Account**
- Email: `admin@example.com`
- Password: `Admin@1234`

**Staff Account**
- Email: `staff@example.com`
- Password: `Staff@1234`

**Customer Account**
- Email: `customer@example.com`
- Password: `Customer@1234`

### Testing Workflow
1. ✅ Register a new user
2. ✅ Login with the account
3. ✅ Browse catalog
4. ✅ Add items to cart
5. ✅ Proceed to checkout
6. ✅ Place order
7. ✅ View order history

---

## 🚀 Deployment

### Frontend (Vercel)
```bash
# Already optimized for Vercel
vercel deploy
```

### Backend (Heroku/Railway)
```bash
# Add your database connection string
git push heroku main
``` 

**Deployment guides in respective READMEs**

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/YourFeature`
3. Commit changes: `git commit -m 'Add YourFeature'`
4. Push to branch: `git push origin feature/YourFeature`
5. Open a Pull Request

---

## Attribution

- This README and setup guides were produced with the support of ChatGPT (From Copilot). Also, some parts of the code was generated by the help of [ChatGPT](https://chatgpt.com), [Claude](https://claude.ai/) and [Grok](https://grok.com/).
- Code for the UploadCare's File Uploader component was directly taken from their [documentation](https://uploadcare.com)
- Images taken for this demo was downloaded from [Unsplash](https://unsplash.com/).

<div align="center">

**Made with ❤️ for plant lovers everywhere 🌱**

[⬆ Back to Top](#urban-plant-life---e-commerce-application)

</div>