# WhatTo WebApp - Vercel Deployment Guide

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **Git Repository**: Your code should be in a Git repository (GitHub, GitLab, or Bitbucket)

## Deployment Methods

### Method 1: Deploy via Vercel CLI

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy from project root**:
   ```bash
   vercel
   ```

4. **Follow the prompts**:
   - Set up and deploy: `Y`
   - Which scope: Choose your account
   - Link to existing project: `N` (for first deployment)
   - Project name: `whatto-webapp` (or your preferred name)
   - Directory: `./` (current directory)

### Method 2: Deploy via Vercel Dashboard

1. **Connect Repository**:
   - Go to [vercel.com/new](https://vercel.com/new)
   - Import your Git repository
   - Select the repository containing your WhatTo WebApp

2. **Configure Project**:
   - **Project Name**: `whatto-webapp`
   - **Framework Preset**: `Other`
   - **Root Directory**: `./` (leave as default)
   - **Build Command**: Leave empty (static site)
   - **Output Directory**: Leave empty
   - **Install Command**: Leave empty

3. **Deploy**:
   - Click "Deploy"
   - Vercel will automatically build and deploy your app

## Configuration Files Included

- **`vercel.json`**: Configures routing and static file serving
- **`package.json`**: Project metadata and scripts
- **`.vercelignore`**: Excludes unnecessary files from deployment

## Custom Domain (Optional)

1. **Add Domain in Vercel Dashboard**:
   - Go to your project settings
   - Click "Domains"
   - Add your custom domain

2. **Update DNS**:
   - Point your domain to Vercel's nameservers
   - Or add CNAME record pointing to your Vercel deployment URL

## Environment Variables

This app doesn't require any environment variables as it's a client-side static application that uses localStorage for data persistence.

## Deployment URL

After deployment, your app will be available at:
- **Production**: `https://your-project-name.vercel.app`
- **Custom Domain**: `https://your-domain.com` (if configured)

## Features Available After Deployment

✅ **Full Note-Taking Functionality**
✅ **Multi-Page Support** (3 pages)
✅ **Dark/Light Theme Toggle**
✅ **Markdown Export/Import**
✅ **Rich Text Formatting**
✅ **Search Functionality**
✅ **Drag & Drop File Import**
✅ **Local Storage Persistence**
✅ **Responsive Design**

## Troubleshooting

### Common Issues:

1. **404 Errors**: Check that `vercel.json` is in the root directory
2. **Asset Loading Issues**: Verify all file paths are relative and case-sensitive
3. **Routing Issues**: Ensure the routing configuration in `vercel.json` is correct

### Performance Optimization:

- Static assets are cached for 1 year
- HTML files are set to revalidate on each request
- Gzip compression is enabled by default

## Development vs Production

- **Development**: Run `npm run dev` for local development
- **Production**: Automatic deployment via Vercel on git push

## Support

If you encounter any issues during deployment, check:
1. Vercel deployment logs
2. Browser console for any errors
3. Network tab for failed resource loading 