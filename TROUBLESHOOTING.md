# Xray Setu Troubleshooting Guide

This guide provides solutions for common issues you might encounter when setting up, running, or deploying the Xray Setu application.

## Table of Contents
- [Installation Issues](#installation-issues)
- [Runtime Issues](#runtime-issues)
- [Deployment Issues](#deployment-issues)
- [AI Model Issues](#ai-model-issues)
- [Authentication Issues](#authentication-issues)
- [Database Issues](#database-issues)

## Installation Issues

### Python Dependencies Not Installing

**Problem:** Error messages when running `pip install -r requirements.txt`

**Solution:**
1. Ensure you're using Python 3.11 or lower (some packages are not yet compatible with Python 3.13)
2. Update pip: `pip install --upgrade pip`
3. Try installing dependencies one by one to identify problematic packages
4. For TensorFlow issues, ensure your system meets the requirements

### Metadata Generation Failed Error

**Problem:** Deployment fails with "metadata-generation-failed" error

**Solution:**
1. **Update pip first:** The error often occurs with older pip versions. Add a prebuild step to update pip:
   ```bash
   pip install --upgrade pip
   ```

2. **Check Python version compatibility:** Some packages like scikit-learn 1.3.2 are not compatible with Python 3.13. We've updated to Python 3.11.9 and scikit-learn 1.5.1 which are compatible.

3. **Install dependencies in the correct order:** Install numpy and Cython first, then other packages:
   ```bash
   pip install numpy==1.26.4
   pip install Cython
   pip install -r requirements.txt
   ```

4. **Use compatible package versions:** We're using updated versions that work with newer Python:
   - scikit-learn==1.5.1 (instead of 1.3.2)
   - numpy==1.26.4 (instead of 1.26.2)
   - pandas==2.2.2 (instead of 2.1.3)
   - matplotlib==3.9.0 (instead of 3.8.2)

5. **Isolate problematic packages:** Try installing core packages first, then data science packages:
   ```bash
   # Install core Django packages first
   pip install -r requirements-minimal.txt
   # Then install data science packages separately
   pip install tensorflow-cpu==2.20.0 scikit-learn==1.5.1 numpy==1.26.4 pandas==2.2.2 matplotlib==3.9.0
   ```

6. **Check system requirements:** Ensure your deployment environment has sufficient memory and CPU resources for TensorFlow installation.

7. **Use precompiled wheels:** Some packages may fail when trying to compile from source. Using specific versions ensures precompiled wheels are available.

### Node.js Dependencies Not Installing

**Problem:** Error messages when running `npm install`

**Solution:**
1. Ensure you're using Node.js 18 or higher
2. Clear npm cache: `npm cache clean --force`
3. Delete `node_modules` and `package-lock.json` and reinstall:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

### Permission Errors

**Problem:** Permission denied errors during installation

**Solution:**
1. Avoid using `sudo` with npm install
2. Configure npm to use a user-owned directory:
   ```bash
   mkdir ~/.npm-global
   npm config set prefix '~/.npm-global'
   ```
   Add this to your shell profile:
   ```bash
   export PATH=~/.npm-global/bin:$PATH
   ```

## Runtime Issues

### Backend Server Not Starting

**Problem:** Django development server fails to start

**Solution:**
1. Check that all environment variables are set correctly
2. Verify database connectivity
3. Check for missing migrations:
   ```bash
   python manage.py migrate
   ```
4. Check the error logs for specific error messages

### Frontend Server Not Starting

**Problem:** Next.js development server fails to start

**Solution:**
1. Ensure environment variables are set in `.env.local`
2. Check that the backend server is running
3. Verify Node.js version compatibility
4. Check the terminal for specific error messages

### Database Connection Errors

**Problem:** Application cannot connect to the database

**Solution:**
1. Verify `DATABASE_URL` environment variable format
2. Check database server status
3. Ensure database credentials are correct
4. For PostgreSQL, ensure the database exists and the user has proper permissions

## Deployment Issues

### Render Deployment Failures

**Problem:** Deployment fails with build errors or service not starting

**Solution:**
1. Ensure you're deploying services separately (frontend and backend)
2. Verify that `render.yaml` is correctly configured
3. Check that `Procfile` exists in both frontend and backend directories
4. Confirm that `runtime.txt` exists in the backend directory
5. Check build logs for specific error messages

### Environment Variables Not Set

**Problem:** Application behaves unexpectedly after deployment

**Solution:**
1. Check that all required environment variables are set in the Render dashboard
2. Verify that variable names match exactly (case-sensitive)
3. For Render, set variables in the "Environment Variables" section of each service

### SSL/HTTPS Issues

**Problem:** Mixed content warnings or connection failures

**Solution:**
1. Ensure `NEXT_PUBLIC_API_URL` uses HTTPS in production
2. Configure your backend to handle HTTPS requests
3. Check CORS settings in Django
4. Verify that both frontend and backend URLs use HTTPS

### Health Check Failures

**Problem:** Render health checks failing

**Solution:**
1. Verify that the `/health/` endpoint is working on the backend
2. Check that the frontend health page is accessible at `/health`
3. Ensure services are responding within the timeout period

### Database Connection Issues on Render

**Problem:** Application cannot connect to Render PostgreSQL database

**Solution:**
1. Verify that the PostgreSQL database is created and running
2. Check that `DATABASE_URL` environment variable is correctly set from the database
3. Ensure the database user has proper permissions
4. Check that the database connection settings in `settings.py` are correct

### Static Files Not Serving

**Problem:** CSS, JavaScript, or images not loading

**Solution:**
1. Ensure `whitenoise` is in your requirements.txt
2. Verify that `STATIC_ROOT` and `STATICFILES_STORAGE` are properly configured in settings.py
3. Run `python manage.py collectstatic` during deployment
4. Check that the static files middleware is included in `MIDDLEWARE`

### Port Configuration Issues

**Problem:** Services not starting due to port conflicts

**Solution:**
1. Ensure your application uses the `PORT` environment variable provided by Render
2. For backend: `gunicorn core.wsgi:application -b 0.0.0.0:$PORT`
3. For frontend: Next.js automatically uses the `PORT` environment variable

### Railway Deployment Failures

**Problem:** Deployment fails with "Railpack could not determine how to build the app"

**Solution:**
1. Ensure you're deploying services separately (frontend and backend)
2. Verify that `railway.toml` is in the project root
3. Check that `Procfile` exists in both frontend and backend directories
4. Confirm that `runtime.txt` exists in the backend directory

### Environment Variables Not Set (Railway)

**Problem:** Application behaves unexpectedly after deployment

**Solution:**
1. Check that all required environment variables are set in the Railway dashboard
2. Verify that variable names match exactly (case-sensitive)
3. For Railway, set variables in the "Variables" tab of each service

### SSL/HTTPS Issues (Railway)

**Problem:** Mixed content warnings or connection failures

**Solution:**
1. Ensure `NEXT_PUBLIC_API_URL` uses HTTPS in production
2. Configure your backend to handle HTTPS requests
3. Check CORS settings in Django

## AI Model Issues

### Model Not Loading

**Problem:** AI analysis fails with model loading errors

**Solution:**
1. Verify that model files exist in the correct location
2. Check file permissions on model files
3. Ensure sufficient memory is available for model loading
4. Verify TensorFlow/PyTorch installation

### Incorrect Predictions

**Problem:** Model produces unexpected or inaccurate results

**Solution:**
1. Verify that input images are in the correct format
2. Check that image preprocessing matches training preprocessing
3. Ensure the model file is not corrupted
4. Consider retraining the model with updated data

### Memory Issues

**Problem:** Out of memory errors during model inference

**Solution:**
1. Reduce batch size for model predictions
2. Optimize model for inference (quantization, pruning)
3. Increase available memory (if possible)
4. Consider using a more powerful hosting plan

## Authentication Issues

### Login Failures

**Problem:** Unable to log in with valid credentials

**Solution:**
1. **Check environment configuration:** Ensure `NEXT_PUBLIC_API_URL` is properly set in `.env.local`:
   ```
   # For local development
   NEXT_PUBLIC_API_URL=http://localhost:8000
   
   # For demo mode (uses mock data)
   # NEXT_PUBLIC_API_URL=demo
   ```

2. **Verify backend is running:** Make sure the Django backend is running on port 8000:
   ```bash
   cd backend/core
   python manage.py runserver
   ```

3. **Check database migrations:** Ensure all migrations are applied:
   ```bash
   cd backend/core
   python manage.py migrate
   ```

4. **Verify user account exists:** Make sure you're using a valid username and password that exists in the database.

5. **Check browser console:** Look for network errors or CORS issues in the browser's developer tools.

6. **Try demo mode:** If you're having persistent issues, you can use demo mode by setting:
   ```
   NEXT_PUBLIC_API_URL=demo
   ```

### JWT Token Issues

**Problem:** Authentication tokens not working correctly

**Solution:**
1. Verify that `SECRET_KEY` is set correctly
2. Check token expiration settings
3. Ensure frontend and backend clocks are synchronized
4. Clear browser storage and try logging in again

### Registration Failures

**Problem:** Unable to register new users

**Solution:**
1. Check that required fields are filled correctly
2. Verify email format if email validation is enabled
3. Ensure password meets complexity requirements
4. Check backend logs for specific error messages

## Database Issues

### Migration Errors

**Problem:** Django migrations fail to apply

**Solution:**
1. Check for conflicting migrations
2. Verify database connectivity
3. Ensure the database user has proper permissions
4. For complex issues, consider resetting migrations (development only)

### Data Not Persisting

**Problem:** Data appears to save but doesn't persist

**Solution:**
1. Verify that transactions are being committed
2. Check for database connection issues
3. Ensure the database is not in read-only mode
4. Verify that the correct database is being used

### Performance Issues

**Problem:** Database queries are slow

**Solution:**
1. Add database indexes for frequently queried fields
2. Optimize complex queries
3. Consider database connection pooling
4. Analyze query execution plans

## General Debugging Tips

### Enable Debug Logging

Set the following environment variables for more detailed logging:

**Backend (Django):**
```
DEBUG=True
LOG_LEVEL=DEBUG
```

**Frontend (Next.js):**
Add to your `.env.local`:
```
NEXT_PUBLIC_DEBUG=true
```

### Check Browser Developer Tools

1. Open browser developer tools (F12)
2. Check the Console tab for JavaScript errors
3. Check the Network tab for failed API requests
4. Check the Application tab for storage issues

### Review Application Logs

For deployed applications, check the hosting platform's log viewer for:
1. Application startup errors
2. Runtime exceptions
3. Database connection issues
4. Third-party service failures

## Getting Help

If you're unable to resolve an issue:

1. Check the project's GitHub issues for similar problems
2. Create a detailed issue report including:
   - Error messages
   - Steps to reproduce
   - Environment information (OS, Python/Node versions)
   - Screenshots if applicable
3. Contact the development team if you have access to direct support

## Contributing to this Guide

If you've encountered and resolved an issue not covered in this guide, please consider contributing your solution:

1. Fork the repository
2. Update this document with your solution
3. Submit a pull request with a clear description of the problem and solution

```
# Troubleshooting Guide

This document provides solutions to common issues you may encounter while setting up, running, or deploying the Xray-Setu application.

## Table of Contents
- [Docker Issues](#docker-issues)
- [Database Issues](#database-issues)
- [Frontend Issues](#frontend-issues)
- [Backend Issues](#backend-issues)
- [Deployment Issues](#deployment-issues)
- [API Issues](#api-issues)
- [Performance Issues](#performance-issues)

## Docker Issues

### Error: "Cannot connect to the Docker daemon"
**Problem**: Docker daemon is not running
**Solution**: 
1. Start Docker Desktop (Windows/Mac) or Docker service (Linux)
2. On Linux, run: `sudo systemctl start docker`

### Error: "docker-compose: command not found"
**Problem**: Docker Compose is not installed
**Solution**:
1. Install Docker Compose:
   - Windows/Mac: Included with Docker Desktop
   - Linux: Follow official installation guide at https://docs.docker.com/compose/install/

### Error: "Cannot find module '/app/server.js'" (Frontend)
**Problem**: Next.js standalone build not properly copied
**Solution**:
1. Ensure `output: 'standalone'` is in next.config.js
2. Check Dockerfile COPY commands for .next/standalone directory
3. Rebuild with: `docker-compose up -d --build`

### Error: "sh: gunicorn: not found" (Backend)
**Problem**: Gunicorn not installed in Docker container
**Solution**:
1. Add `gunicorn==23.0.0` to backend/core/requirements.txt
2. Rebuild with: `docker-compose up -d --build`

## Database Issues

### Error: "FATAL: password authentication failed for user"
**Problem**: Incorrect database credentials
**Solution**:
1. Check credentials in docker-compose.yml
2. Ensure POSTGRES_USER, POSTGRES_PASSWORD, and POSTGRES_DB match Django settings
3. Reset with: `docker-compose down -v` then `docker-compose up -d`

### Error: "django.db.utils.OperationalError: FATAL: database does not exist"
**Problem**: Database not created
**Solution**:
1. Ensure POSTGRES_DB in docker-compose.yml matches Django DATABASE_URL
2. Restart services: `docker-compose down` then `docker-compose up -d`

## Frontend Issues

### Error: "Failed to load resource: net::ERR_CONNECTION_REFUSED" (API calls)
**Problem**: Frontend cannot connect to backend
**Solution**:
1. Check NEXT_PUBLIC_API_URL in Dockerfile or environment variables
2. Ensure backend service is running: `docker-compose ps`
3. Check nginx configuration for proper proxy settings

### Error: "Module not found" for dependencies
**Problem**: Node modules not installed correctly
**Solution**:
1. Clear node_modules: `rm -rf xraysetu/node_modules`
2. Reinstall: `cd xraysetu && npm install`
3. Rebuild Docker images: `docker-compose up -d --build`

## Backend Issues

### Error: "No module named 'core.settings'"
**Problem**: Django settings module not found
**Solution**:
1. Check DJANGO_SETTINGS_MODULE environment variable
2. Ensure correct path in manage.py and wsgi.py
3. Verify project structure

### Error: "Could not load 'rest_framework' module"
**Problem**: Django REST Framework not installed
**Solution**:
1. Add `djangorestframework==3.16.0` to requirements.txt
2. Rebuild with: `docker-compose up -d --build`

## Deployment Issues

### Error: "Permission denied" when deploying to cloud platforms
**Problem**: Insufficient permissions for deployment
**Solution**:
1. Check IAM roles and permissions for your cloud account
2. Ensure you have admin privileges for container services
3. Verify SSH keys for VM deployments

### Error: "Build failed" on cloud platforms
**Problem**: Missing dependencies or incorrect configuration
**Solution**:
1. Check build logs for specific error messages
2. Ensure all required files are in the repository
3. Verify Dockerfile paths and commands
4. Check environment variable configurations

### Error: "Application not accessible after deployment"
**Problem**: Networking or firewall issues
**Solution**:
1. Check security groups/firewall rules to allow HTTP/HTTPS traffic
2. Verify load balancer configurations
3. Ensure domain DNS settings point to correct IP address
4. Check if services are running: `docker-compose ps`

### Error: "Database connection failed" in production
**Problem**: Incorrect database connection settings
**Solution**:
1. Verify DATABASE_URL environment variable format
2. Check database service status
3. Ensure network connectivity between application and database
4. Confirm database credentials are correct

## API Issues

### Error: "404 Not Found" for API endpoints
**Problem**: Incorrect URL routing or endpoint not implemented
**Solution**:
1. Check Django URL patterns in urls.py files
2. Verify nginx proxy configuration for API routes
3. Ensure backend service is properly routing requests

### Error: "401 Unauthorized" for API requests
**Problem**: Authentication required but not provided
**Solution**:
1. Check if endpoint requires authentication
2. Provide valid authentication token in request headers
3. Verify user credentials and permissions

## Performance Issues

### Slow application startup
**Problem**: Large model files or insufficient resources
**Solution**:
1. Check system resources (CPU, memory, disk)
2. Optimize model loading in Django apps
3. Consider using model caching
4. Scale container resources on cloud platforms

### High memory usage
**Problem**: TensorFlow models consuming excessive memory
**Solution**:
1. Monitor memory usage: `docker stats`
2. Optimize model inference code
3. Consider using model quantization
4. Scale vertically by increasing container memory limits

## Additional Resources

- Docker Documentation: https://docs.docker.com/
- Django Documentation: https://docs.djangoproject.com/
- Next.js Documentation: https://nextjs.org/docs
- Cloud Platform Documentation:
  - AWS: https://aws.amazon.com/documentation/
  - Google Cloud: https://cloud.google.com/docs
  - Azure: https://docs.microsoft.com/en-us/azure/
  - Render: https://render.com/docs
