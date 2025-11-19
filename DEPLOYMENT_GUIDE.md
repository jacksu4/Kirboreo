# 🚀 Kirboreo AI - Deployment Guide

**Complete guide for deploying the Kirboreo AI platform to production.**

---

## 📋 Pre-Deployment Checklist

Run the automated check script:
```bash
./scripts/pre-deploy-check.sh
```

Or manually verify:
- [ ] Node.js 18+ installed
- [ ] All environment variables configured
- [ ] `npm run build` succeeds
- [ ] `npm run lint` passes with no errors
- [ ] No sensitive files committed to git
- [ ] All changes committed to main branch

---

## 🌐 Option 1: Deploy to Vercel (Recommended)

### Step 1: Prepare Repository

```bash
# Ensure all changes are committed
git add .
git commit -m "Production ready: v1.0.0"
git push origin main
```

### Step 2: Connect to Vercel

1. Visit [vercel.com](https://vercel.com)
2. Click "Add New..." → "Project"
3. Import your GitHub repository
4. Select "Kirboreo" repository

### Step 3: Configure Project

**Framework Preset**: Next.js (auto-detected)

**Build Settings**:
- Build Command: `npm run build`
- Output Directory: `.next`
- Install Command: `npm ci`

### Step 4: Environment Variables

Add these in Vercel Dashboard → Settings → Environment Variables:

```env
# OpenAI
OPENAI_API_KEY=sk-...

# Pinecone
PINECONE_API_KEY=pcsk_...
PINECONE_INDEX_NAME=knowledge

# Sanity CMS
NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=sk...
```

**Important**: Add to all environments (Production, Preview, Development)

### Step 5: Deploy

Click "Deploy" and wait ~2 minutes.

**Your site will be live at**: `https://kirboreo.vercel.app`

### Step 6: Custom Domain (Optional)

1. Purchase domain (e.g., `kirboreo.com`)
2. In Vercel Dashboard → Settings → Domains
3. Add your domain
4. Update DNS records:

```
Type: A
Name: @
Value: 76.76.21.21

Type: CNAME  
Name: www
Value: cname.vercel-dns.com
```

5. Wait for DNS propagation (~10 minutes)
6. SSL automatically configured

---

## 🐳 Option 2: Deploy with Docker

### Build Docker Image

```bash
docker build -t kirboreo-ai .
```

### Run Locally

```bash
docker run -p 3000:3000 \
  -e OPENAI_API_KEY=sk-... \
  -e PINECONE_API_KEY=pcsk_... \
  -e PINECONE_INDEX_NAME=knowledge \
  -e NEXT_PUBLIC_SANITY_PROJECT_ID=... \
  -e NEXT_PUBLIC_SANITY_DATASET=production \
  -e SANITY_API_TOKEN=sk... \
  kirboreo-ai
```

Or use `.env.local`:

```bash
docker run -p 3000:3000 --env-file .env.local kirboreo-ai
```

### Deploy to Cloud

**Docker Hub**:
```bash
docker tag kirboreo-ai your-username/kirboreo-ai:1.0.0
docker push your-username/kirboreo-ai:1.0.0
```

**AWS ECS / GCP Cloud Run / Azure Container Instances**:
Follow platform-specific documentation for container deployment.

---

## ☁️ Option 3: Deploy to AWS (Hong Kong)

### Using AWS Amplify

1. Connect GitHub repository
2. Configure build settings (auto-detected for Next.js)
3. Add environment variables
4. Deploy

### Using AWS EC2 (Manual)

```bash
# On EC2 instance (Ubuntu)
sudo apt update
sudo apt install nodejs npm nginx -y

# Clone repository
git clone https://github.com/YOUR_USERNAME/Kirboreo.git
cd Kirboreo

# Install dependencies
npm ci

# Configure environment
cp .env.example .env.local
nano .env.local  # Add your API keys

# Build
npm run build

# Run with PM2
npm install -g pm2
pm2 start npm --name "kirboreo" -- start
pm2 save
pm2 startup

# Configure Nginx reverse proxy
sudo nano /etc/nginx/sites-available/kirboreo
```

**Nginx Configuration**:
```nginx
server {
    listen 80;
    server_name kirboreo.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/kirboreo /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

---

## 🔧 Post-Deployment Configuration

### 1. Verify Deployment

Visit your deployed URL and test:
- [ ] Homepage loads
- [ ] Navigation works
- [ ] `/chat` - AI chat functional
- [ ] `/analysis/AAPL` - Stock data displays
- [ ] `/research` - Articles load from Sanity
- [ ] `/about` - About page renders

### 2. Configure Monitoring

**Vercel Analytics** (automatically enabled):
- Visit Vercel Dashboard → Analytics
- View performance metrics

**Custom Monitoring** (optional):
- Add Google Analytics
- Set up Sentry for error tracking
- Configure Uptime Robot

### 3. Set Up Alerts

Create alerts for:
- API errors (>5% error rate)
- High response times (>3s)
- Deployment failures

### 4. Performance Optimization

**Vercel Edge Functions**:
Already configured in `vercel.json`:
- Hong Kong (hkg1)
- Singapore (sin1)  
- Seoul (icn1)

**Caching**:
```typescript
// Already implemented in pages
export const revalidate = 60; // Revalidate every 60 seconds
```

---

## 🔐 Security Checklist

- [ ] All API keys in environment variables
- [ ] `.env.local` in `.gitignore`
- [ ] HTTPS enabled (automatic on Vercel)
- [ ] Security headers configured (see `vercel.json`)
- [ ] CORS properly configured
- [ ] Rate limiting enabled (Vercel default)
- [ ] Input validation on all API routes

---

## 📊 Monitoring & Maintenance

### Daily
- Check Vercel dashboard for errors
- Monitor API usage (OpenAI, Pinecone)

### Weekly
- Review deployment logs
- Check performance metrics
- Update research content (Sanity CMS)

### Monthly
- Update dependencies: `npm update`
- Review and rotate API keys
- Backup environment variables
- Check for security updates

### Commands

```bash
# Check for outdated packages
npm outdated

# Update dependencies
npm update

# Security audit
npm audit

# Fix vulnerabilities
npm audit fix
```

---

## 🚨 Troubleshooting

### Build Fails

**Error**: `Module not found`
```bash
# Solution: Clean install
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Environment Variables Not Working

**Error**: `OPENAI_API_KEY is not defined`

**Solution**:
1. Verify variables in Vercel Dashboard
2. Redeploy after adding variables
3. Check variable names (case-sensitive)

### Chat API Timeout

**Error**: `Function execution timeout`

**Solution**:
- Increase timeout in `vercel.json` (already set to 60s)
- Optimize Pinecone query
- Check OpenAI API status

### Stock Data Not Loading

**Error**: Yahoo Finance API error

**Solution**:
- Verify ticker symbol is valid
- Check Yahoo Finance API status
- Implement retry logic (already present)

---

## 📈 Scaling

### When to Scale

- **Traffic**: >10,000 requests/day
- **Database**: Pinecone approaching limits
- **API Costs**: Optimize OpenAI usage

### Scaling Options

**Vercel Pro** ($20/month):
- 1TB bandwidth
- Advanced analytics
- Password protection
- Custom deployment branches

**Optimize AI Costs**:
```typescript
// Use GPT-3.5-turbo for simple queries
const model = complexQuery ? 'gpt-4o' : 'gpt-3.5-turbo';
```

**Caching Layer**:
```typescript
// Implement Redis for frequently accessed data
import { Redis } from '@upstash/redis';
```

---

## 🔄 Continuous Deployment

### Automatic Deployment

With Vercel GitHub integration:
- Push to `main` → Auto-deploy to production
- Push to feature branch → Auto-create preview
- Open PR → Auto-create preview URL

### Manual Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

---

## 📝 Rollback

If deployment fails:

```bash
# Via Vercel CLI
vercel rollback

# Via Dashboard
# 1. Go to Deployments
# 2. Find previous working deployment
# 3. Click "..." → "Promote to Production"
```

---

## ✅ Production Checklist

Before going live:
- [ ] All features tested
- [ ] Error boundaries implemented
- [ ] Loading states added
- [ ] 404/500 pages styled
- [ ] Meta tags for SEO
- [ ] Favicon and PWA icons
- [ ] Analytics configured
- [ ] Monitoring set up
- [ ] Backup plan in place
- [ ] Team notified

---

## 📞 Support

**Issues**: Open GitHub Issue  
**Email**: contact@kirboreo.com  
**Documentation**: See README.md

---

## 🎉 You're Ready!

Your Kirboreo AI platform is now production-ready.

**Deployment Command**:
```bash
vercel --prod
```

**Live in**: ~2 minutes

Good luck! 🚀

---

*Last Updated: 2024-11-19*

