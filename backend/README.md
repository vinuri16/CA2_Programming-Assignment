# Urban Plant Life - Backend API

A comprehensive REST API for the Urban Plant Life e-commerce platform, built with Express.js and PostgreSQL.

## 📋 Table of Contents

- [Features](#✨-features)
- [Tech Stack](#🛠-tech-stack)
- [Installation](#🚀-installation)
- [Configuration](#⚙️-configuration)
- [Database Setup](#💾-database-setup)
- [Running the Server](#🎯-running-the-server)
- [API Endpoints](#📡-api-endpoints)
- [Authentication](#🔐-authentication)
- [Database Schema](#📊-database-schema)
- [Error Handling](#⚠️-error-handling)
- [Troubleshooting](#🔧-troubleshooting)
- [API Examples](#📝-api-examples)
- [Logging](#🐛-logging)
- [Additional Resources](#📚-additional-resources)
- [Contributing](#🤝-contributing)
- [Attribution](#attribution)

## ✨ Features

### Core Features
- **User Authentication** - JWT-based authentication with argon2 password hashing
- **Plant Management** - Full CRUD operations for plant inventory
- **Shopping Cart** - Database-backed persistent cart system
- **Order Management** - Complete order lifecycle management (pending → processing → shipped → delivered)
- **Payment Integration** - Support for Stripe and PayPal payment methods
- **Role-Based Access Control** - Three user roles (customer, staff, admin)

### API Capabilities
- RESTful API design
- Error handling and validation
- CORS support for frontend integration
- JWT token-based authorization
- Database transaction support
- Pagination and filtering

## 🛠 Tech Stack

| Technology | Version | Purpose |
|-----------|---------|---------|
| **Node.js** | v18+ | Runtime environment |
| **Express.js** | v5.1.0 | Web framework |
| **PostgreSQL** | 13+ | Database |
| **JWT** | v9.0.3 | Authentication |
| **Argon2** | v0.44.0 | Password hashing |
| **CORS** | v2.8.5 | Cross-origin requests |
| **Nodemon** | v3.0.2 | Development auto-reload |

## 🚀 Installation

### Prerequisites
- Node.js v18 or higher
- PostgreSQL 13 or higher
- npm or yarn package manager
- Git

### Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/vinuri16/CA2_Programming-Assignment.git
   cd CA2_Programming-Assignment/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create environment file**
   ```bash
   cp .env.example .env
   ```

4. **Configure environment variables** (see Configuration section below)

5. **Set up database**
   ```bash
   npm run setup-db
   ```

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the backend directory with the following variables:

```env
# Database Configuration
DB_USER=postgres
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=neondb

# Server Configuration
PORT=5000
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRY=7d

# CORS
CORS_ORIGIN=http://localhost:3000
```

### Environment Variables Explained

| Variable | Description | Default |
|----------|-------------|---------|
| `DB_USER` | PostgreSQL username | postgres |
| `DB_PASSWORD` | PostgreSQL password | (required) |
| `DB_HOST` | Database host | localhost |
| `DB_PORT` | Database port | 5432 |
| `DB_NAME` | Database name | neondb |
| `PORT` | Server port | 5000 |
| `NODE_ENV` | Environment mode | development |
| `JWT_SECRET` | Secret key for JWT signing | (required) |
| `JWT_EXPIRY` | JWT token expiration | 7d |
| `CORS_ORIGIN` | Frontend origin URL | http://localhost:3000 |

## 💾 Database Setup

### Initialize Database

The database is initialized using SQL migration scripts in `/scripts`:

1. **db_init.sql** - Creates tables for users, plants, orders, order_items, payments, and carts
2. **sample_data.sql** - Populates sample data for testing

### Running Migrations

```bash
# Using psql directly
psql -U postgres -d neondb -f scripts/db_init.sql
psql -U postgres -d neondb -f scripts/sample_data.sql
```

### Database Schema

See [Database Schema](#database-schema) section below for detailed table structures.

## 🎯 Running the Server

### Development Mode (with auto-reload)
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will start on `http://localhost:5000` (or your configured PORT).

## 📡 API Endpoints

### Authentication Routes (`/api/auth`)

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response (201):**
```json
{
  "message": "User registered successfully",
  "user": {
    "user_id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "role": "customer"
  }
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response (200):**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "user_id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "role": "customer"
  }
}
```

#### Get Profile
```http
GET /api/auth/profile
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "user_id": 1,
  "username": "john_doe",
  "email": "john@example.com",
  "role": "customer",
  "created_at": "2024-12-14T10:00:00Z"
}
```

### Plant Routes (`/api/plants`)

#### Get All Plants
```http
GET /api/plants?search=monstera&sort=newest&category=indoor
```

**Query Parameters:**
- `search` - Search by plant name or description
- `sort` - Sort by: `newest`, `price_asc`, `price_desc`, `name`
- `category` - Filter by category (Indoor/Outdoor)

#### Get Plant by ID
```http
GET /api/plants/:id
```

#### Create Plant (Admin only)
```http
POST /api/plants
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "name": "Monstera Deliciosa",
  "description": "Popular houseplant with large leaves",
  "price": 29.99,
  "stock_quantity": 50,
  "low_stock_threshold": 10,
  "image": "https://ucarecdn.com/example-uuid/"
}
```

#### Update Plant (Admin only)
```http
PUT /api/plants/:id
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "name": "Updated Plant Name",
  "price": 34.99,
  "stock_quantity": 45
}
```

#### Delete Plant (Admin only)
```http
DELETE /api/plants/:id
Authorization: Bearer {admin_token}
```

#### Get Low Stock Plants (Staff/Admin)
```http
GET /api/plants/low-stock
Authorization: Bearer {staff_or_admin_token}
```

### Cart Routes (`/api/cart`)

#### Get User's Cart
```http
GET /api/cart
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "message": "Cart retrieved successfully",
  "cart": {
    "cart_id": 1,
    "user_id": 1,
    "items": [
      {
        "cart_item_id": 1,
        "plant_id": 5,
        "plant_name": "Monstera",
        "quantity": 2,
        "price": 29.99,
        "image_url": "https://..."
      }
    ],
    "total_items": 2,
    "total_price": 59.98
  }
}
```

#### Add Item to Cart
```http
POST /api/cart/items
Authorization: Bearer {token}
Content-Type: application/json

{
  "plant_id": 5,
  "quantity": 2
}
```

#### Update Cart Item Quantity
```http
PUT /api/cart/items/:cartItemId
Authorization: Bearer {token}
Content-Type: application/json

{
  "quantity": 3
}
```

#### Remove Item from Cart
```http
DELETE /api/cart/items/:cartItemId
Authorization: Bearer {token}
```

#### Clear Cart
```http
DELETE /api/cart
Authorization: Bearer {token}
```

### Order Routes (`/api/orders`)

#### Get Orders
```http
GET /api/orders
Authorization: Bearer {token}

// Admin gets all orders, customers get their own
```

#### Get Order by ID
```http
GET /api/orders/:id
Authorization: Bearer {token}
```

#### Create Order (from cart)
```http
POST /api/orders
Authorization: Bearer {token}
Content-Type: application/json

{
  "items": [
    {
      "plant_id": 5,
      "quantity": 2,
      "price": 29.99
    }
  ],
  "total_amount": 59.98,
  "payment_method": "stripe"
}
```

#### Update Order Status (Admin/Staff only)
```http
PUT /api/orders/:id/status
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "status": "shipped"
}
```

**Valid Statuses:** `pending`, `processing`, `shipped`, `delivered`, `cancelled`

## 🔐 Authentication

### JWT Token Usage

Include the JWT token in the `Authorization` header:

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Token Generation

- Generated on successful login
- Expires after 7 days (configurable via `JWT_EXPIRY`)
- Contains user_id and role claims

### Role-Based Access Control

| Endpoint | Customer | Staff | Admin |
|----------|----------|-------|-------|
| View Plants | ✅ | ✅ | ✅ |
| Manage Cart | ✅ | ✅ | ✅ |
| Create Order | ✅ | ✅ | ✅ |
| View Own Orders | ✅ | ✅ | ✅ |
| View All Orders | ❌ | ✅ | ✅ |
| Create Plant | ❌ | ❌ | ✅ |
| Update Plant | ❌ | ❌ | ✅ |
| Delete Plant | ❌ | ❌ | ✅ |
| Update Order Status | ❌ | ✅ | ✅ |

## 📊 Database Schema

### Users Table
```sql
CREATE TABLE users (
  user_id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL CHECK (role IN ('customer', 'staff', 'admin')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Plants Table
```sql
CREATE TABLE plants (
  plant_id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
  stock_quantity INT NOT NULL DEFAULT 0,
  low_stock_threshold INT DEFAULT 10,
  image_url VARCHAR(255),
  image_alt TEXT DEFAULT 'Image',
  category VARCHAR(50) DEFAULT 'Indoor',
  care_level VARCHAR(50) DEFAULT 'Easy',
  light_requirement VARCHAR(100) DEFAULT 'Bright Indirect',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Carts Table
```sql
CREATE TABLE carts (
  cart_id SERIAL PRIMARY KEY,
  user_id INT NOT NULL UNIQUE REFERENCES users(user_id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Cart Items Table
```sql
CREATE TABLE cart_items (
  cart_item_id SERIAL PRIMARY KEY,
  cart_id INT NOT NULL REFERENCES carts(cart_id) ON DELETE CASCADE,
  plant_id INT NOT NULL REFERENCES plants(plant_id) ON DELETE RESTRICT,
  quantity INT NOT NULL CHECK (quantity > 0),
  UNIQUE(cart_id, plant_id)
);
```

### Orders Table
```sql
CREATE TABLE orders (
  order_id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  total_amount DECIMAL(10, 2) NOT NULL CHECK (total_amount >= 0),
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Order Items Table
```sql
CREATE TABLE order_items (
  order_item_id SERIAL PRIMARY KEY,
  order_id INT NOT NULL REFERENCES orders(order_id) ON DELETE CASCADE,
  plant_id INT NOT NULL REFERENCES plants(plant_id) ON DELETE RESTRICT,
  quantity INT NOT NULL CHECK (quantity > 0),
  price DECIMAL(10, 2) NOT NULL CHECK (price >= 0)
);
```

### Payments Table
```sql
CREATE TABLE payments (
  payment_id SERIAL PRIMARY KEY,
  order_id INT NOT NULL REFERENCES orders(order_id) ON DELETE CASCADE,
  payment_method VARCHAR(50) NOT NULL CHECK (payment_method IN ('stripe', 'paypal')),
  transaction_id VARCHAR(100),
  payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status VARCHAR(20) NOT NULL DEFAULT 'pending'
);
```

## ⚠️ Error Handling

### Standard Error Response

```json
{
  "message": "Error description",
  "error": "Detailed error information"
}
```

### HTTP Status Codes

| Status | Meaning |
|--------|---------|
| 200 | OK - Request successful |
| 201 | Created - Resource created successfully |
| 400 | Bad Request - Invalid input parameters |
| 401 | Unauthorized - Missing or invalid token |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource not found |
| 409 | Conflict - Resource already exists |
| 500 | Internal Server Error - Server error |

## 🔧 Troubleshooting

### Common Issues

#### 1. **Database Connection Failed**
```
Error: connect ECONNREFUSED 127.0.0.1:5432
```
**Solution:**
- Ensure PostgreSQL is running
- Check DB_HOST and DB_PORT in .env
- Verify database credentials
- Ensure database exists

#### 2. **JWT Token Invalid**
```
Error: Invalid token
```
**Solution:**
- Token may have expired (7 days)
- User must login again to get new token
- Check JWT_SECRET in .env matches

#### 3. **CORS Errors**
```
Access-Control-Allow-Origin header missing
```
**Solution:**
- Ensure CORS_ORIGIN in .env matches frontend URL
- Update origin if frontend URL changes
- Restart server after changing .env

#### 4. **Port Already in Use**
```
Error: listen EADDRINUSE :::5000
```
**Solution:**
```bash
# Find process using port
lsof -i :5000

# Kill process (on macOS/Linux)
kill -9 <PID>

# Or change PORT in .env
```

#### 5. **Password Hashing Issues**
```
Error: argon2 binding not found
```
**Solution:**
```bash
npm install --build-from-source argon2
```

## 📝 API Examples

### Complete Order Flow Example

```bash
# 1. Register User
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "plantlover",
    "email": "user@example.com",
    "password": "SecurePass123!"
  }'

# 2. Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123!"
  }'
# Save token from response

# 3. Get Plants
curl http://localhost:5000/api/plants

# 4. Add to Cart
curl -X POST http://localhost:5000/api/cart/items \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"plant_id": 1, "quantity": 2}'

# 5. View Cart
curl http://localhost:5000/api/cart \
  -H "Authorization: Bearer TOKEN"

# 6. Create Order
curl -X POST http://localhost:5000/api/orders \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "items": [{"plant_id": 1, "quantity": 2, "price": 29.99}],
    "total_amount": 59.98,
    "payment_method": "stripe"
  }'

# 7. View Orders
curl http://localhost:5000/api/orders \
  -H "Authorization: Bearer TOKEN"
```

## 🐛 Logging

The application logs important events and errors:

- **Console Output** - Real-time server logs
- **Error Logging** - Detailed error messages for debugging
- **Query Logging** - Database queries in development mode (optional)

## 📚 Additional Resources

- [Express.js Documentation](https://expressjs.com/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [JWT Introduction](https://jwt.io/introduction)
- [Argon2 Documentation](https://github.com/ranisalt/node-argon2)

## 🤝 Contributing

1. Create a feature branch (`git checkout -b feature/AmazingFeature`)
2. Commit changes (`git commit -m 'Add AmazingFeature'`)
3. Push to branch (`git push origin feature/AmazingFeature`)
4. Open a Pull Request

## Attribution

- This README and setup guides were produced with the support of ChatGPT (From Copilot). Also, some parts of the code was generated by the help of [ChatGPT](https://chatgpt.com), [Claude](https://claude.ai/) and [Grok](https://grok.com/).

---

**Last Updated:** December 14, 2024
**Version:** 1.0.0
