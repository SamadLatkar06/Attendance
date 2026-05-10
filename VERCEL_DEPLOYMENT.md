# Vercel Deployment Guide

## Prerequisites

- GitHub account with your code pushed
- Vercel account

## Step 1: Connect GitHub Repository

1. Go to https://vercel.com
2. Click "New Project"
3. Import your GitHub repository
4. Select the repository

## Step 2: Configure Project

1. **Framework Preset**: Select "Vite"
2. **Root Directory**: Keep default `/`
3. **Build Command**: `npm run build`
4. **Output Directory**: `dist`

## Step 3: Add Environment Variables

In Vercel dashboard, go to Settings → Environment Variables and add:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_COLLEGE_LATITUDE=your_college_latitude
VITE_COLLEGE_LONGITUDE=your_college_longitude
VITE_ATTENDANCE_RADIUS_METERS=100
VITE_MINIMUM_ATTENDANCE_MINUTES=45
```

## Step 4: Deploy

Click "Deploy"

Your app will be live at `https://your-project-name.vercel.app`

## Step 5: Custom Domain (Optional)

1. Go to Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed
4. Wait for verification

## Step 6: Enable HTTPS

Vercel automatically provides SSL/TLS certificate. HTTPS is enabled by default.

## Continuous Deployment

Every push to main branch automatically triggers a deployment.

### Disable Auto-Deploy

If needed, go to Settings → Git and configure.

## Monitoring

Vercel provides:
- Build logs
- Deploy logs
- Real-time analytics
- Error tracking

## Environment-Specific Variables

You can set different variables for:
- Production
- Preview (pull requests)
- Development

## Rollback

Go to Deployments tab and click "Promote" on any previous deployment.

## Analytics

Enable Analytics in project settings to track:
- Page views
- Performance metrics
- Web vitals

## Functions (Optional)

Create API routes in `api/` directory for serverless functions.

## Troubleshooting

### Build fails
1. Check build logs in Vercel dashboard
2. Verify environment variables are set
3. Ensure all dependencies are in package.json

### App doesn't load
1. Check browser console for errors
2. Verify Supabase credentials
3. Check CORS settings in Supabase

### Location not working
1. Ensure HTTPS is enabled (Vercel default)
2. Check browser location permissions
3. Test in different browser

## Cost

- Vercel free tier includes:
  - Unlimited deployments
  - 100 GB bandwidth/month
  - Git integration
  - Analytics

- Paid plans start at $20/month

## Support

For issues, visit: https://vercel.com/support
