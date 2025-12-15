# Urban Plant Life - Frontend

A modern, responsive e-commerce web application for buying and selling plants, built with Next.js 16, React 19, and Tailwind CSS.

## 📋 Table of Contents

- [Features](#✨-features)
- [Tech Stack](#🛠-tech-stack)
- [Installation](#🚀-installation)
- [Configuration](#⚙️-configuration)
- [Running the Application](#🎯-running-the-application)
- [Project Structure](#📁-project-structure)
- [Pages & Routes](#🛣-pages--routes)
- [Components](#🧩-components)
- [State Management](#🔄-state-management)
- [API Integration](#📡-api-integration)
- [Authentication](#🔐-authentication)
- [Uploadcare Integration](#📸-uploadcare-integration)
- [Troubleshooting](#🔧-troubleshooting)
- [Styling](#🎨-styling)
- [Performance](#🚀-performance)
- [Learn More](#📚-learn-more)
- [Contributing](#🤝-contributing)
- [Quick Start Commands](#🎯-quick-start-commands)
- [Attribution](#attribution)

## ✨ Features

### Customer Features
- **Browse Plant Catalog** - Search, filter, and sort plants
- **Shopping Cart** - Add items, manage quantities, persistent storage (database-backed)
- **Checkout** - Complete order processing with payment method selection
- **Order Tracking** - View order history with status updates
- **User Authentication** - Register and login securely
- **Image Upload** - Upload plant images via Uploadcare CDN

### Admin Features
- **Inventory Management** - Add, edit, delete plants
- **Stock Control** - Monitor stock levels, low-stock alerts
- **Order Dashboard** - View all customer orders
- **Order Status Updates** - Track order progress through fulfillment
- **Plant Analytics** - View inventory statistics

### Technical Features
- **Responsive Design** - Mobile-first, works on all devices
- **Real-time Cart Updates** - Instant cart count in navbar
- **Database-Backed Cart** - Cart persists across sessions
- **Image CDN Integration** - Fast image delivery via Uploadcare
- **Role-Based Access Control** - Customer, staff, and admin roles

## 🛠 Tech Stack

| Technology | Version | Purpose |
|-----------|---------|---------|
| **Next.js** | 16.0.10 | React framework |
| **React** | 19.2.1 | UI library |
| **Tailwind CSS** | 4 | Styling |
| **Uploadcare** | ^1.11.1 | Image hosting CDN |
| **Node.js** | 18+ | Runtime |
| **npm/yarn** | Latest | Package manager |

## 🚀 Installation

### Prerequisites
- Node.js v18 or higher
- npm or yarn package manager
- Git
- Backend API running on `http://localhost:5000`

### Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/vinuri16/CA2_Programming-Assignment.git
   cd CA2_Programming-Assignment/frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Create environment file**
   ```bash
   cp .env.example .env.local
   ```

4. **Configure environment variables** (see Configuration section)

5. **Start development server**
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:3000`

## ⚙️ Configuration

### Environment Variables

Create a `.env.local` file in the frontend directory:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:5000/api

# Uploadcare Configuration
NEXT_PUBLIC_UPLOADCARE_PUBLIC_KEY=your_uploadcare_public_key
```

### Environment Variables Explained

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API base URL | http://localhost:5000/api |
| `NEXT_PUBLIC_UPLOADCARE_PUBLIC_KEY` | Uploadcare public key for image uploads | 3a6653e208047eaa2e61 |

### Getting Uploadcare API Key

1. Visit [Uploadcare.com](https://uploadcare.com)
2. Sign up for a free account
3. Create a new project
4. Copy your Public Key from the project settings
5. Add to `.env.local`

## 🎯 Running the Application

### Development Mode
```bash
npm run dev
```
Runs on `http://localhost:3000` with hot reload

### Production Build
```bash
npm run build
npm start
```

### Linting
```bash
npm run lint
```

## 📁 Project Structure

```
frontend/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── layout.js                 # Root layout with CartProvider
│   │   ├── page.js                   # Home page
│   │   ├── globals.css               # Global styles
│   │   ├── admin/                    # Admin routes
│   │   │   ├── inventory/page.js     # Plant management
│   │   │   └── orders/page.js        # Order management
│   │   ├── cart/page.js              # Shopping cart
│   │   ├── catalog/page.js           # Plant catalog
│   │   ├── checkout/page.js          # Checkout/payment
│   │   ├── login/page.js             # Login page
│   │   ├── orders/page.js            # Order history
│   │   └── register/page.js          # Registration page
│   ├── components/                   # Reusable components
│   │   ├── Navbar.js                 # Navigation bar
│   │   ├── Footer.js                 # Footer
│   │   ├── ImageUploader.js          # Uploadcare image widget
│   │   ├── HeroSection.js            # Hero banner
│   │   └── FeaturedPlants.js         # Featured plants section
│   ├── context/                      # React Context
│   │   └── CartContext.js            # Cart state management
│   └── lib/                          # Utilities
│       └── api.js                    # API client functions
├── public/                           # Static assets
├── .env.example                      # Environment template
├── .env.local                        # Local environment (git ignored)
├── next.config.mjs                   # Next.js configuration
├── tailwind.config.js                # Tailwind CSS configuration
├── postcss.config.mjs                # PostCSS configuration
└── package.json                      # Dependencies
```

## 🛣 Pages & Routes

### Public Routes

| Route | Page | Description |
|-------|------|-------------|
| `/` | Home | Landing page with hero section |
| `/catalog` | Catalog | Browse all plants |
| `/login` | Login | User login page |
| `/register` | Register | User registration page |

### Protected Routes (Customer)

| Route | Page | Description |
|-------|------|-------------|
| `/cart` | Cart | Shopping cart management |
| `/checkout` | Checkout | Order checkout and payment |
| `/orders` | Orders | Order history and tracking |

### Protected Routes (Admin/Staff)

| Route | Page | Description |
|-------|------|-------------|
| `/admin/inventory` | Inventory | Plant management (CRUD) |
| `/admin/orders` | Orders | Order management dashboard |

## 🧩 Components

### Navbar
```javascript
// Location: src/components/Navbar.js
// Features:
// - Navigation links
// - User authentication status
// - Shopping cart icon with item count
// - Admin/staff links for privileged users
```

**Props:**
- `user` - Current logged-in user
- `setUser` - Function to update user state

### Footer
```javascript
// Location: src/components/Footer.js
// Features:
// - Company info
// - Quick links
// - Contact information
// - Social media links
```

### ImageUploader
```javascript
// Location: src/components/ImageUploader.js
// Features:
// - Uploadcare file upload widget
// - Image preview
// - File validation
// - CDN URL integration
```

**Props:**
- `label` - Form field label
- `value` - Current image URL
- `onImageSelect` - Callback when image is uploaded

### HeroSection
```javascript
// Location: src/components/HeroSection.js
// Features:
// - Banner image/video background
// - Call-to-action buttons
// - Promotional text
```

### FeaturedPlants
```javascript
// Location: src/components/FeaturedPlants.js
// Features:
// - Display featured plants
// - Quick "Add to Cart" buttons
// - Limited to featured items
```

## 🔄 State Management

### CartContext

The application uses React Context API for cart state management with database persistence.

```javascript
import { useCart } from '@/context/CartContext';

// Usage in component
const { 
  cartItems,        // Array of cart items
  addToCart,        // Add item to cart
  removeFromCart,   // Remove item from cart
  updateQuantity,   // Update item quantity
  clearCart,        // Clear entire cart
  getTotalPrice,    // Get total price
  getTotalItems     // Get item count
} = useCart();
```

### Cart Persistence

Cart data is stored in the database (backend), not localStorage. Cart is synced with database on every operation.

## 📡 API Integration

### API Client

All API calls are centralized in `/lib/api.js`

```javascript
import { 
  authAPI, 
  plantAPI, 
  orderAPI, 
  cartAPI 
} from '@/lib/api';
```

### Authentication API

```javascript
// Register
await authAPI.register(username, email, password);

// Login
const { token, user } = await authAPI.login(email, password);

// Get profile
const user = await authAPI.getProfile();
```

### Plant API

```javascript
// Get all plants
const plants = await plantAPI.getAll(options);

// Get single plant
const plant = await plantAPI.getById(id);

// Create plant (admin)
const newPlant = await plantAPI.create(plantData);

// Update plant (admin)
const updated = await plantAPI.update(id, plantData);

// Delete plant (admin)
await plantAPI.delete(id);
```

### Cart API

```javascript
// Get cart
const cart = await cartAPI.getCart();

// Add to cart
await cartAPI.addItem(plantId, quantity);

// Update quantity
await cartAPI.updateItem(cartItemId, quantity);

// Remove item
await cartAPI.removeItem(cartItemId);

// Clear cart
await cartAPI.clearCart();
```

### Order API

```javascript
// Get orders (customer gets own, admin gets all)
const orders = await orderAPI.getAll();

// Get single order
const order = await orderAPI.getById(id);

// Create order
const newOrder = await orderAPI.create(orderData);

// Update status (admin)
await orderAPI.updateStatus(id, status);
```

## 🔐 Authentication

### Login Flow

1. User enters email and password on `/login`
2. Frontend sends credentials to backend
3. Backend validates and returns JWT token
4. Token stored in localStorage
5. Token sent with every API request in Authorization header

### Protected Routes

Routes check for logged-in user:

```javascript
const savedUser = localStorage.getItem('user');
if (!savedUser) {
  router.push('/login'); // Redirect if not authenticated
}
```

### Role-Based Access

Different components render based on user role:

```javascript
if (user.role === 'admin') {
  // Show admin menu
} else if (user.role === 'staff') {
  // Show staff menu
} else {
  // Show customer menu
}
```

## 📸 Uploadcare Integration

### Setup

1. Get public key from [uploadcare.com](https://uploadcare.com)
2. Add to `.env.local`:
   ```env
   NEXT_PUBLIC_UPLOADCARE_PUBLIC_KEY=your_key
   ```

### Usage

```javascript
import ImageUploader from '@/components/ImageUploader';

function MyComponent() {
  const [image, setImage] = useState('');
  
  return (
    <ImageUploader
      label="Upload Image"
      value={image}
      onImageSelect={(url) => setImage(url)}
    />
  );
}
```

### Image URLs

- Format: `https://ucarecdn.com/{FILE_UUID}/`
- Images are CDN-hosted globally
- Fast delivery with caching
- No size/bandwidth limits on free tier

## 🔧 Troubleshooting

### Common Issues

#### 1. **API Connection Error**
```
Failed to fetch from http://localhost:5000
```
**Solution:**
- Ensure backend is running on port 5000
- Check NEXT_PUBLIC_API_URL in .env.local
- Verify CORS_ORIGIN in backend .env

#### 2. **Authentication Fails**
```
401 Unauthorized
```
**Solution:**
- Token may have expired (7 days)
- User must login again
- Check token is being sent in Authorization header

#### 3. **Images Not Loading**
```
Failed to load image from Uploadcare
```
**Solution:**
- Verify NEXT_PUBLIC_UPLOADCARE_PUBLIC_KEY
- Check internet connection
- Ensure image URL is valid
- Verify Uploadcare account is active

#### 4. **Build Errors**
```
Module not found: Can't resolve '@/...'
```
**Solution:**
- Verify file paths use correct aliases (@/ for src/)
- Check files exist in src/ directory
- Clear .next folder: `rm -rf .next`
- Rebuild: `npm run build`

#### 5. **Port Already in Use**
```
Error: EADDRINUSE :::3000
```
**Solution:**
```bash
# Kill process using port 3000
lsof -i :3000
kill -9 <PID>

# Or change port
npm run dev -- -p 3001
```

#### 6. **Node Modules Issues**
```
npm ERR! peer dep missing
```
**Solution:**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

## 🎨 Styling

### Tailwind CSS

All styling uses Tailwind CSS utility classes:

```javascript
<div className="max-w-7xl mx-auto px-8 py-12 bg-gray-50">
  <h1 className="text-3xl font-bold text-gray-800">Heading</h1>
</div>
```

### Global Styles

Located in `src/app/globals.css`:
- Base styles
- Custom color palette
- Typography settings
- Animation definitions

### Color Palette

| Color | Usage |
|-------|-------|
| Green-600 | Primary buttons, active states |
| Blue-600 | Secondary actions |
| Red-600 | Danger actions, delete |
| Gray-600 | Text, borders |

## 📱 Responsive Design

All pages are fully responsive:

- **Mobile** - Touch-friendly, single column
- **Tablet** - 2-column layout where appropriate
- **Desktop** - Full multi-column layout

Breakpoints:
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

## 🚀 Performance

### Optimizations

- **Image Optimization** - Next.js Image component for responsive images
- **Code Splitting** - Automatic route-based code splitting
- **Dynamic Imports** - Components loaded on-demand
- **Caching** - HTTP caching headers set by backend
- **CDN** - Uploadcare CDN for image delivery

### Build Size

```bash
npm run build
# Shows optimized bundle size
```

## 🧪 Development

### ESLint

```bash
# Run linter
npm run lint

# Fix issues automatically
npm run lint -- --fix
```

### Next.js Development Features

- **Fast Refresh** - Instant feedback on file changes
- **Path Alias** - `@/` points to `src/`
- **API Routes** - Could be added for backend calls
- **Image Optimization** - Automatic image optimization

## 📚 Learn More

### Next.js Documentation
- [Next.js Docs](https://nextjs.org/docs)
- [React Docs](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com/docs)

### Uploadcare Docs
- [Uploadcare React](https://uploadcare.com/docs/react/)
- [File Uploader Widget](https://uploadcare.com/docs/uploads/widget/)

## 🤝 Contributing

1. Create feature branch: `git checkout -b feature/YourFeature`
2. Commit changes: `git commit -m 'Add YourFeature'`
3. Push branch: `git push origin feature/YourFeature`
4. Open Pull Request


## 🎯 Quick Start Commands

```bash
# Install dependencies
npm install

# Set up environment
cp .env.example .env.local
# Edit .env.local with your config

# Start development server
npm run dev

# Visit in browser
# http://localhost:3000

# Build for production
npm run build
npm start

# Run linter
npm run lint
```

---

## Attribution

- This README and setup guides were produced with the support of ChatGPT (From Copilot). Also, some parts of the code was generated by the help of [ChatGPT](https://chatgpt.com), [Claude](https://claude.ai/) and [Grok](https://grok.com/).

---

**Last Updated:** December 14, 2025
**Version:** 1.0.0

**Happy Planting! 🌱**
