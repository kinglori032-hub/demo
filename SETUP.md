# E-Commerce Platform - Quick Start Guide

## Prerequisites

- **Node.js 18+** - Download from https://nodejs.org/
- **npm** - Comes with Node.js
- **Git** (optional) - For version control

## Step-by-Step Setup

### 1. Navigate to Project Directory

```bash
cd "c:\Users\Loris\Desktop\Demo"
```

### 2. Install Dependencies

```bash
npm install
```

**Expected output:**
```
added XXX packages in X.XXs
```

### 3. Initialize Database

```bash
npx prisma migrate dev --name init
```

**Expected output:**
```
✓ Your database has been created at ./prisma/dev.db
✓ Migration init created and applied
```

This command:
- Creates the SQLite database file
- Runs all migrations
- Generates Prisma Client

### 4. Verify Database (Optional)

```bash
npx prisma studio
```

This opens Prisma Studio at `http://localhost:5555` where you can:
- View database tables
- Add sample data
- Inspect relationships

Press `Ctrl+C` to close when done.

### 5. Start Development Server

```bash
npm run dev
```

**Expected output:**
```
- ready started server on 0.0.0.0:3000, url: http://localhost:3000
- event compiled client and server successfully
```

## Access the Application

### Customer Site
- **URL:** http://localhost:3000
- **Home Page:** Hero section with featured products
- **Shop:** Full product catalog
- **Checkout:** Order placement

### Admin Panel
- **URL:** http://localhost:3000/admin/login
- **Password:** `admin123`
- **Access:** Dashboard, Orders, Products management

## Available Commands

```bash
# Development
npm run dev           # Start dev server

# Production
npm run build         # Build for production
npm start             # Run production server

# Database
npx prisma migrate dev --name <name>  # Create migration
npx prisma studio                     # Open database GUI
npx prisma generate                   # Generate Prisma Client

# Quality
npm run lint          # Run ESLint
```

## Testing the Application Locally

### 1. Add Sample Products

1. Go to http://localhost:3000/admin/login
2. Enter password: `admin123`
3. Click "Manage Products"
4. Click "Add New Product"
5. Fill in product details:
   - Name: "Sample Product"
   - Description: "This is a sample product for testing"
   - Price: 29.99
   - Stock: 50
   - Image URL: https://via.placeholder.com/300?text=Product
6. Click "Create Product"

### 2. Browse Products

1. Go to http://localhost:3000/shop
2. See all products listed
3. Click "Add to Cart"
4. View cart in sidebar

### 3. Place Order

1. Click "Proceed to Checkout"
2. Fill in delivery information:
   - Full Name: John Doe
   - Phone: 1234567890
   - City: New York
   - Address: 123 Main Street
3. Click "Place Order"
4. See confirmation page with order number

### 4. Manage Orders

1. Go to http://localhost:3000/admin/login
2. Enter password: `admin123`
3. Go to Dashboard
4. See all orders
5. Update status by selecting from dropdown

## Project Structure

```
c:\Users\Loris\Desktop\Demo\
├── app/                 # Next.js app directory
│   ├── api/            # API routes
│   ├── admin/          # Admin pages
│   ├── shop/           # Shop page
│   ├── checkout/       # Checkout page
│   ├── layout.tsx      # Root layout
│   └── page.tsx        # Home page
├── components/         # React components
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── ProductCard.tsx
│   ├── Cart/          # Cart components
│   └── Admin/         # Admin components
├── lib/               # Utilities
│   ├── prisma.ts      # Database client
│   ├── types.ts       # TypeScript types
│   ├── validation.ts  # Form validation
│   ├── auth.ts        # Authentication
├── prisma/
│   └── schema.prisma  # Database schema
├── styles/
│   └── globals.css    # Global styles
├── public/            # Static files
├── package.json       # Dependencies
├── tsconfig.json      # TypeScript config
├── next.config.ts     # Next.js config
└── tailwind.config.ts # Tailwind config
```

## Configuration

### Environment Variables (`.env.local`)

```env
DATABASE_URL="file:./prisma/dev.db"
ADMIN_PASSWORD="admin123"
NODE_ENV="development"
```

### Customize Admin Password

Edit `.env.local`:
```env
ADMIN_PASSWORD="your_new_password"
```

Restart the server for changes to take effect.

## Database Operations

### Reset Database

To start fresh:

```bash
# Delete the database file
rm prisma/dev.db

# Recreate with migrations
npx prisma migrate dev --name init
```

### Backup Database

Copy `prisma/dev.db` to a safe location.

### View Database

```bash
npx prisma studio
```

Opens GUI at http://localhost:5555

## Troubleshooting

### Port 3000 Already in Use

Use a different port:
```bash
npm run dev -- -p 3001
```
Then access at http://localhost:3001

### Database Lock Error

```bash
# Kill any lingering Prisma processes
rm prisma/dev.db-journal

# Restart
npm run dev
```

### Build Fails

```bash
# Clear cache and reinstall
rm -r node_modules .next
npm install
npm run build
```

### Prisma Migration Issues

```bash
# Reset Prisma state
npx prisma migrate reset --force
```

## Features Included

### Customer Features
✅ Home page with hero and featured products
✅ Product shop with grid layout
✅ Add/remove items from cart
✅ Cart persistence in localStorage
✅ Checkout with form validation
✅ Order confirmation
✅ Order number generation

### Admin Features
✅ Secure login authentication
✅ Dashboard with statistics
✅ View all orders
✅ Update order status (5 statuses)
✅ Create products
✅ Edit products
✅ Delete products
✅ Real-time data updates

### Database Features
✅ Product catalog with stock management
✅ Order tracking with line items
✅ Customer information storage
✅ Stock reduction on order
✅ Order history

### Technical Features
✅ Full TypeScript with strict mode
✅ Server-side validation
✅ Client-side validation
✅ Responsive design
✅ Mobile-first approach
✅ Professional UI with Tailwind
✅ SQLite for zero setup
✅ Prisma ORM for type safety

## Production Deployment

### Build for Production

```bash
npm run build
npm start
```

### Deploy to Vercel (Recommended)

1. Push code to GitHub
2. Connect to Vercel: https://vercel.com
3. Vercel automatically builds and deploys
4. Set environment variables in Vercel dashboard

### Deploy to Other Platforms

The app requires:
- Node.js 18+
- npm support
- File system access for SQLite
- 512MB+ disk space

**Not suitable for:**
- AWS Lambda (no persistent file system)
- Netlify Functions (no persistent file system)

**Suitable for:**
- Vercel (recommended)
- DigitalOcean
- Heroku
- Render
- Railway

## Next Steps

1. Add more products via admin panel
2. Test the complete checkout flow
3. Customize branding (colors, text, logo)
4. Add payment gateway (optional)
5. Implement email notifications (optional)
6. Add product images upload (optional)
7. Set up analytics (optional)

## Support

For issues or questions:
1. Check this README
2. Review the troubleshooting section
3. Check the project README at `/README.md`
4. Review API documentation in code comments

## File Locations Reference

| File | Location |
|------|----------|
| Database | `./prisma/dev.db` |
| Environment | `./.env.local` |
| API Routes | `./app/api/` |
| Pages | `./app/` |
| Components | `./components/` |
| Styles | `./styles/globals.css` |
| Config | `./tsconfig.json` |

## Security Notes

1. Change `ADMIN_PASSWORD` in `.env.local`
2. Never commit `.env.local` to git (it's in `.gitignore`)
3. For production, use a real authentication system
4. Store sensitive data in environment variables
5. Use HTTPS in production
6. Regular database backups recommended

---

**Application ready! Start with: `npm run dev`**
