# E-Commerce Platform

A production-quality full-stack e-commerce application built with Next.js 15, Prisma, and SQLite.

## Features

### Customer Features
- **Home Page** - Hero section with featured products
- **Shop** - Responsive product grid with search and filtering
- **Shopping Cart** - Add/remove products, modify quantities, persistent storage
- **Checkout** - Complete order form with validation
- **Order Confirmation** - Confirmation page with order details

### Admin Features
- **Admin Login** - Secure authentication
- **Dashboard** - Overview of orders and statistics
- **Order Management** - View and update order status
- **Product Management** - Create, edit, and delete products

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Node.js
- **Database**: SQLite with Prisma ORM
- **Validation**: Zod
- **Authentication**: Session-based (simple implementation)

## Project Structure

```
ecommerce/
├── app/
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Home page
│   ├── shop/page.tsx           # Shop page
│   ├── checkout/page.tsx       # Checkout page
│   ├── api/                    # API routes
│   ├── admin/                  # Admin pages
│   └── order-confirmation/     # Order confirmation
├── components/                 # React components
├── lib/                        # Utilities and helpers
├── prisma/schema.prisma        # Database schema
├── styles/globals.css          # Global styles
└── public/                     # Static assets
```

## Setup Instructions

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up the database:**
   ```bash
   npx prisma migrate dev --name init
   ```
   This creates the SQLite database and runs migrations.

3. **Verify the setup:**
   ```bash
   npx prisma studio
   ```
   This opens Prisma Studio to view the database (optional).

### Running the Application

**Development mode:**
```bash
npm run dev
```
The application will be available at `http://localhost:3000`

**Production build:**
```bash
npm run build
npm start
```

## API Documentation

### Products Endpoint
- **GET** `/api/products` - List all products
- **POST** `/api/products` - Create product (admin only)
- **PUT** `/api/products/[id]` - Update product (admin only)
- **DELETE** `/api/products/[id]` - Delete product (admin only)

### Orders Endpoint
- **GET** `/api/orders` - List all orders (admin only)
- **POST** `/api/orders` - Create new order
- **PATCH** `/api/orders/[id]/status` - Update order status (admin only)

### Admin Endpoint
- **POST** `/api/admin/login` - Admin login
- **POST** `/api/admin/logout` - Admin logout

## Database Schema

### Product
- `id`: Unique identifier
- `name`: Product name (unique)
- `description`: Product description
- `price`: Product price
- `image`: Product image URL
- `stock`: Available quantity
- `createdAt`: Creation timestamp
- `updatedAt`: Last update timestamp

### Order
- `id`: Unique identifier
- `orderNumber`: Unique order number
- `customerName`: Customer name
- `phone`: Customer phone
- `email`: Customer email (optional)
- `city`: Delivery city
- `address`: Delivery address
- `notes`: Special instructions (optional)
- `paymentMethod`: Payment method (cash_on_delivery)
- `total`: Order total
- `status`: Order status (pending, confirmed, processing, delivered, cancelled)
- `createdAt`: Creation timestamp
- `updatedAt`: Last update timestamp

### OrderItem
- `id`: Unique identifier
- `orderId`: Related order
- `productId`: Related product
- `quantity`: Quantity ordered
- `price`: Price at time of order

## Admin Access

**Default credentials:**
- Password: `admin123`

**Access admin panel:**
1. Navigate to `http://localhost:3000/admin/login`
2. Enter password: `admin123`
3. Click Login

## Configuration

Environment variables (`.env.local`):
```
DATABASE_URL="file:./prisma/dev.db"
ADMIN_PASSWORD="admin123"
NODE_ENV="development"
```

## Features Implementation Details

### Cart Management
- Cart data stored in localStorage
- React Context for state management
- Automatic persistence and hydration
- Real-time total calculation

### Order Processing
- Stock validation before order creation
- Automatic stock reduction on order
- Unique order number generation
- Form validation (frontend and backend)

### Admin Authentication
- Session-based authentication
- Middleware protection for admin routes
- Automatic redirect to login for unauthorized access

## Validation Rules

### Checkout Form
- Full Name: Required, 3-100 characters
- Phone: Required, 10-15 digits
- Email: Optional, valid email format
- City: Required, 2-50 characters
- Address: Required, 5-200 characters
- Notes: Optional, max 500 characters

### Product Creation
- Name: Required, unique, 2-100 characters
- Description: Required, 10-1000 characters
- Price: Required, must be positive
- Stock: Required, non-negative integer
- Image: Required, valid URL

## Performance Optimizations

- Image optimization with Next.js Image component
- Efficient database queries with Prisma
- Session-based auth without external dependencies
- Tailwind CSS for optimized styling

## Security Features

- Input validation and sanitization
- CSRF protection via Next.js
- HTTP-only session cookies
- SQL injection prevention via Prisma ORM
- Environment variable protection

## Deployment

The application is ready for deployment on platforms that support Node.js:
- Vercel (recommended for Next.js)
- Netlify
- AWS Lambda
- DigitalOcean
- Heroku

## Troubleshooting

### Database Issues
- Delete `prisma/dev.db` and run `npx prisma migrate dev` to reset
- Use `npx prisma studio` to inspect database

### Build Errors
- Delete `node_modules` and `.next` folders
- Run `npm install` again
- Run `npm run build`

### Port Already in Use
- Default port is 3000
- Change with: `npm run dev -- -p 3001`

## License

This project is provided as-is for educational and commercial use.
