# Deployment Guide: Hostinger

## Prerequisites

- Hostinger account with Node.js hosting plan
- Git installed locally
- GitHub repository (free)

---

## Step 1: Create Database on Hostinger

1. Log in to Hostinger control panel
2. Go to **Databases** section
3. Create new **PostgreSQL** or **MySQL** database
4. Note down:
   - Database name: `ecommerce_db`
   - Username: `root_user`
   - Password: `your_secure_password`
   - Host: `localhost` or provided host
   - Port: `5432` (PostgreSQL) or `3306` (MySQL)

---

## Step 2: Update Database Connection

### Option A: PostgreSQL

Edit `prisma/schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

### Option B: MySQL

Edit `prisma/schema.prisma`:

```prisma
datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}
```

---

## Step 3: Update Environment Variables

Create `.env` with Hostinger database URL:

**PostgreSQL format:**
```
DATABASE_URL="postgresql://root_user:your_secure_password@localhost:5432/ecommerce_db"
ADMIN_PASSWORD="your_strong_password"
NODE_ENV="production"
```

**MySQL format:**
```
DATABASE_URL="mysql://root_user:your_secure_password@localhost:3306/ecommerce_db"
ADMIN_PASSWORD="your_strong_password"
NODE_ENV="production"
```

---

## Step 4: Update package.json

Add build script:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "prisma generate && next build",
    "start": "next start",
    "prisma:migrate": "prisma migrate deploy"
  }
}
```

---

## Step 5: Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/ecommerce.git
git branch -M main
git push -u origin main
```

---

## Step 6: Deploy to Hostinger

### Using Git (Recommended)

1. Go to Hostinger **Git** section
2. Click "**Connect Repository**"
3. Select your GitHub repo
4. Set:
   - **Branch**: main
   - **Build command**: `npm run build`
   - **Start command**: `npm start`
5. Click "**Deploy**"

### Or Manual Upload

1. Build locally:
   ```bash
   npm run build
   ```

2. Upload to Hostinger:
   - Upload `app/`, `components/`, `lib/`, `prisma/`, etc.
   - Upload `.env` (set environment variables in Hostinger panel instead)
   - Upload `node_modules/` or let Hostinger run `npm install`

---

## Step 7: Run Database Migration

In Hostinger terminal/SSH:

```bash
npx prisma migrate deploy
```

This creates all database tables.

---

## Step 8: Verify Deployment

Visit your Hostinger domain:
- **Home**: https://yourdomain.com
- **Shop**: https://yourdomain.com/shop
- **Admin**: https://yourdomain.com/admin/login

---

## Complete Deployment Checklist

- [ ] Create PostgreSQL/MySQL database on Hostinger
- [ ] Update `prisma/schema.prisma` provider
- [ ] Update `DATABASE_URL` environment variable
- [ ] Update `package.json` scripts
- [ ] Push to GitHub
- [ ] Connect GitHub to Hostinger Git
- [ ] Run `npx prisma migrate deploy`
- [ ] Test all features:
  - [ ] Browse products
  - [ ] Add to cart
  - [ ] Checkout
  - [ ] Admin login
  - [ ] Create product
  - [ ] Update order status

---

## Common Issues & Solutions

### **Database Connection Failed**

Check in Hostinger panel:
- Database credentials are correct
- IP whitelist includes Hostinger server
- Database URL format is correct

### **Prisma Migration Fails**

```bash
npx prisma migrate resolve --rolled-back 20260601212801_init
npx prisma migrate deploy
```

### **Build Fails**

Ensure in Hostinger:
- Node.js version is 18+ (check settings)
- Build command is: `npm run build`
- Start command is: `npm start`

### **Environment Variables Not Loaded**

In Hostinger panel:
- Go to **Environment Variables**
- Add each variable from `.env`
- Restart application

---

## Production Optimizations

### Enable HTTPS (Automatic on Hostinger)

Update `next.config.ts`:

```typescript
const nextConfig: NextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  compress: true,
};

export default nextConfig;
```

### Set NODE_ENV

```
NODE_ENV=production
```

### Security

1. Change `ADMIN_PASSWORD` to something strong
2. Use HTTPS only (enabled by default)
3. Consider adding rate limiting
4. Enable CORS if needed

---

## Database Backup

### On Hostinger

1. Go to **Databases**
2. Click database
3. Click "**Backup**"
4. Download SQL file regularly

### Automatic Backups

```bash
# Local backup command
mysqldump -u root_user -p ecommerce_db > backup.sql
```

---

## Monitoring

### Check Logs in Hostinger

1. SSH into your Hostinger account
2. View application logs
3. Monitor database performance

### Useful Commands

```bash
# Check Node process
ps aux | grep node

# View recent logs
tail -f ~/.pm2/logs/app.log

# Check disk usage
df -h
```

---

## Scaling (If Needed)

As traffic grows:

1. **Upgrade Hostinger plan** (VPS or higher)
2. **Add database indexing** (Prisma already has this)
3. **Enable caching** (Redis - optional)
4. **Implement CDN** (Cloudflare - optional)

---

## Rollback Procedure

If something breaks:

```bash
# View migrations
npx prisma migrate status

# Rollback last migration
npx prisma migrate resolve --rolled-back <migration_name>

# Reapply
npx prisma migrate deploy
```

---

## Support

For Hostinger-specific issues:
- Contact Hostinger support
- Check Hostinger documentation
- View application logs

For app-specific issues:
- Check console errors (F12)
- Review Prisma documentation
- Check Next.js documentation

---

## Summary

**Local Development (Current):**
- SQLite database
- File-based storage
- Single user

**Production (Hostinger):**
- PostgreSQL or MySQL
- Managed database
- Multiple concurrent users
- Automatic backups
- Better security
- Scalable

The code doesn't change much - just swap the database provider in Prisma!
