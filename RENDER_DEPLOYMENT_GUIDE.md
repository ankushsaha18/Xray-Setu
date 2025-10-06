# Xray Setu Render Deployment Guide

This guide provides step-by-step instructions for deploying Xray Setu to Render.

## Prerequisites

1. A Render account (https://render.com)
2. A GitHub account
3. This repository forked to your GitHub account

## Deployment Steps

### 1. Fork the Repository

1. Go to the GitHub repository
2. Click the "Fork" button in the top right corner
3. Choose your account as the destination for the fork

### 2. Create PostgreSQL Database on Render

1. Log in to your Render dashboard
2. Click "New" → "PostgreSQL"
3. Choose a name (e.g., "xraysetu-db")
4. Select your preferred region
5. Choose the free tier or a paid tier based on your needs
6. Click "Create Database"

### 3. Deploy Backend Service

1. In your Render dashboard, click "New" → "Web Service"
2. Connect your GitHub account if not already connected
3. Select your forked repository
4. Set the following configuration:
   - Name: `xraysetu-backend`
   - Root Directory: `/backend/core`
   - Environment: `Python 3`
   - Build Command: `./prebuild.sh && pip install -r requirements.txt && python manage.py migrate && python manage.py collectstatic --noinput`
   - Start Command: `gunicorn core.wsgi:application -b 0.0.0.0:$PORT`
5. Click "Create Web Service"

Note: The backend uses Python 3.11.9 to ensure compatibility with all required packages.

### 4. Configure Backend Environment Variables

In your backend service settings, add these environment variables:

1. `SECRET_KEY` - Generate a secure Django secret key
2. `DEBUG` - Set to `False`
3. `DATABASE_URL` - This should be automatically populated from your PostgreSQL database
4. `ALLOWED_HOSTS` - Comma-separated list of your frontend domains (e.g., `xraysetu-frontend.onrender.com`)

### 5. Deploy Frontend Service

1. In your Render dashboard, click "New" → "Static Site" (recommended) or "Web Service"
2. Select the same GitHub repository
3. Set the following configuration:
   - Name: `xraysetu-frontend`
   - Root Directory: `/xraysetu`
   - Build Command: `npm install && npm run build`
   - Publish Directory: `out` (if using Static Site) or leave empty (if using Web Service)
4. If using Web Service, also set:
   - Start Command: `npm start`
5. Click "Create Static Site" or "Create Web Service"

### 6. Configure Frontend Environment Variables

In your frontend service settings, add this environment variable:

1. `NEXT_PUBLIC_API_URL` - Set to your backend service URL (e.g., `https://xraysetu-backend.onrender.com`)

### 7. Update CORS Settings (if needed)

If you encounter CORS issues, you may need to update the backend settings:

1. Go to your backend service in Render
2. Edit the `CORS_ALLOWED_ORIGINS` in `backend/core/core/settings.py` to include your frontend URL
3. Redeploy the backend service

## Environment Variables Summary

### Backend Variables
| Variable | Description | Example Value |
|----------|-------------|---------------|
| `SECRET_KEY` | Django secret key | `your-very-secure-secret-key` |
| `DEBUG` | Debug mode | `False` |
| `DATABASE_URL` | PostgreSQL connection | (Auto-populated by Render) |
| `ALLOWED_HOSTS` | Allowed domains | `xraysetu-frontend.onrender.com` |

### Frontend Variables
| Variable | Description | Example Value |
|----------|-------------|---------------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | `https://xraysetu-backend.onrender.com` |

## Troubleshooting

### Common Issues

1. **Build Failures**: Check the build logs in your Render dashboard for specific error messages.

2. **Database Connection Issues**: 
   - Ensure `DATABASE_URL` is correctly set
   - Check that your database is running
   - Verify that your database allows connections from your backend service

3. **CORS Errors**: 
   - Ensure `CORS_ALLOWED_ORIGINS` includes your frontend URL
   - Check that `CSRF_TRUSTED_ORIGINS` includes your backend URL

4. **Static Files Not Loading**: 
   - Ensure `whitenoise` is in your requirements.txt
   - Check that `STATIC_ROOT` and `STATICFILES_STORAGE` are properly configured

### Redeployment

To redeploy after making changes:

1. Push your changes to GitHub
2. Render will automatically detect the changes and start a new build
3. Or manually trigger a deploy from your service dashboard

## Support

For issues specific to Xray Setu, please refer to:
- [README.md](README.md)
- [DEPLOYMENT.md](DEPLOYMENT.md)
- [TROUBLESHOOTING.md](TROUBLESHOOTING.md)

For Render-specific issues, please check the [Render documentation](https://render.com/docs) or contact their support team.