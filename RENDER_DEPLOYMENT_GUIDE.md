# Deploying Xray-Setu on Render

This guide provides detailed instructions for deploying the Xray-Setu application on Render with all services properly configured.

## Prerequisites

1. A Render account (https://render.com)
2. A GitHub account
3. This repository forked to your GitHub account

## Deployment Architecture

The Xray-Setu application consists of four main services:
1. **PostgreSQL Database** - For data storage
2. **Django Backend** - API and business logic
3. **Next.js Frontend** - User interface
4. **Nginx Reverse Proxy** - Traffic routing

## Step-by-Step Deployment

### 1. Fork the Repository

1. Go to your GitHub repository
2. Click the "Fork" button in the top right corner
3. Choose your account as the destination for the fork

### 2. Create PostgreSQL Database on Render

1. Log in to your Render dashboard
2. Click "New" → "PostgreSQL"
3. Configure with these settings:
   - Name: `xraysetu-db`
   - Region: Choose the one closest to your users
   - Plan: Free or paid based on your needs
4. Click "Create Database"
5. Note the database connection details (you'll need these later)

### 3. Deploy Django Backend Service

1. In your Render dashboard, click "New" → "Web Service"
2. Connect your GitHub account if not already connected
3. Select your forked repository
4. Configure with these settings:
   - Name: `xraysetu-backend`
   - Root Directory: `backend/core`
   - Environment: Docker
   - Dockerfile Path: `./Dockerfile`
   - Plan: Free or paid based on your needs
5. Click "Create Web Service"

### 4. Configure Backend Environment Variables

After the backend service is created, go to its settings and add these environment variables:

| Variable | Description | Example Value |
|----------|-------------|---------------|
| `SECRET_KEY` | Django secret key (generate a secure one) | `your-very-secure-secret-key` |
| `DEBUG` | Debug mode | `False` |
| `DATABASE_URL` | PostgreSQL connection (from your database) | (Auto-populated by Render) |
| `ALLOWED_HOSTS` | Allowed domains | `xraysetu-frontend.onrender.com,xraysetu-backend.onrender.com` |

### 5. Deploy Next.js Frontend Service

1. In your Render dashboard, click "New" → "Web Service"
2. Select the same GitHub repository
3. Configure with these settings:
   - Name: `xraysetu-frontend`
   - Root Directory: `xraysetu`
   - Environment: Docker
   - Dockerfile Path: `./Dockerfile`
   - Plan: Free or paid based on your needs
4. Click "Create Web Service"

### 6. Configure Frontend Environment Variables

After the frontend service is created, go to its settings and add this environment variable:

| Variable | Description | Example Value |
|----------|-------------|---------------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | `https://xraysetu-backend.onrender.com` |

### 7. Deploy Nginx Reverse Proxy

1. In your Render dashboard, click "New" → "Web Service"
2. Select the same GitHub repository
3. Configure with these settings:
   - Name: `xraysetu-nginx`
   - Root Directory: `nginx`
   - Environment: Docker
   - Dockerfile Path: `./Dockerfile`
   - Plan: Free or paid based on your needs
   - Advanced settings → Add custom domain if needed
4. Click "Create Web Service"

### 8. Update Service Dependencies

Since the services depend on each other, you'll need to update some configurations after all services are deployed:

1. Get the actual URLs for your deployed services:
   - Backend: `https://xraysetu-backend.onrender.com`
   - Frontend: `https://xraysetu-frontend.onrender.com`

2. Update the Nginx configuration to point to your actual services:
   - Go to your nginx service settings
   - You may need to modify the nginx.conf to use the actual service names

### 9. Final Configuration

1. In your backend service settings, update `ALLOWED_HOSTS` to include your nginx service URL
2. In your frontend service, ensure `NEXT_PUBLIC_API_URL` points to your backend service
3. Restart all services to apply the changes

## Environment Variables Summary

### Backend Variables
| Variable | Description | Example Value |
|----------|-------------|---------------|
| `SECRET_KEY` | Django secret key | `your-very-secure-secret-key` |
| `DEBUG` | Debug mode | `False` |
| `DATABASE_URL` | PostgreSQL connection | (Auto-populated by Render) |
| `ALLOWED_HOSTS` | Allowed domains | `xraysetu-frontend.onrender.com,xraysetu-backend.onrender.com,xraysetu-nginx.onrender.com` |

### Frontend Variables
| Variable | Description | Example Value |
|----------|-------------|---------------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | `https://xraysetu-backend.onrender.com` |

## Troubleshooting Common Issues

### Database Connection Issues
1. Ensure `DATABASE_URL` is correctly set from your PostgreSQL database
2. Check that your database allows connections from your backend service
3. Verify that the database user has proper permissions

### CORS Errors
1. Ensure `CORS_ALLOWED_ORIGINS` in Django settings includes your frontend URL
2. Check that `CSRF_TRUSTED_ORIGINS` includes your backend URL

### Static Files Not Loading
1. Ensure `whitenoise` is in your requirements.txt
2. Check that `STATIC_ROOT` and `STATICFILES_STORAGE` are properly configured
3. Run `python manage.py collectstatic` during deployment

### Health Check Failures
1. Verify that the `/health/` endpoint is working on the backend
2. Check that the frontend health page is accessible at `/health`
3. Ensure services are responding within the timeout period

### Nginx Configuration Issues
1. Check that the nginx.conf file correctly references your backend and frontend services
2. Ensure all services are running before testing the nginx proxy

## Redeployment

To redeploy after making changes:
1. Push your changes to GitHub
2. Render will automatically detect the changes and start a new build
3. Or manually trigger a deploy from your service dashboard

## Monitoring and Maintenance

1. Regularly check your Render dashboard for service status
2. Monitor logs for any errors or warnings
3. Set up alerts for service downtime
4. Regularly backup your database

## Support

For issues specific to Xray-Setu, please refer to:
- [README.md](README.md)
- [TROUBLESHOOTING.md](TROUBLESHOOTING.md)

For Render-specific issues, please check the [Render documentation](https://render.com/docs) or contact their support team.