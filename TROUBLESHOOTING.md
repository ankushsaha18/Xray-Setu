# Xray Setu App Troubleshooting Guide

## Common Issues and Solutions

### 1. "Load failed" Error

This error typically occurs due to one of the following reasons:

#### a) Backend Server Not Running
- Ensure the Django backend server is running on port 8000
- Start it with: `cd backend/core && python manage.py runserver`

#### b) Frontend Server Not Running
- Ensure the Next.js frontend server is running on port 3000
- Start it with: `cd xraysetu && npm run dev`

#### c) CORS Issues
- Check that CORS is properly configured in `backend/core/core/settings.py`
- Ensure `http://localhost:3000` is in the `CORS_ALLOWED_ORIGINS` list

#### d) Port Conflicts
- If port 3000 is occupied, Next.js will use another port
- Update CORS settings to include the actual port being used

### 2. Login Issues

#### a) Invalid Credentials
- Ensure you're using the correct username and password
- Reset the password if needed:
  ```bash
  cd backend/core
  python manage.py shell -c "from auth_service.models import CustomUser; u = CustomUser.objects.get(username='testuser'); u.set_password('testpass123'); u.save()"
  ```

#### b) Demo Mode Enabled
- Check that `NEXT_PUBLIC_API_URL` in `.env.local` does not contain "demo"
- Current setting should be: `NEXT_PUBLIC_API_URL=http://localhost:8000`

### 3. Diagnostic Pages

The application includes several diagnostic pages to help troubleshoot issues:

- `/diagnostic` - General application diagnostics
- `/test-config` - Configuration testing
- `/test-api` - API connection testing
- `/test-login` - Direct login testing

## Step-by-Step Verification Process

### 1. Check Backend Server
```bash
# Terminal 1
cd backend/core
python manage.py runserver
# Should show: Starting development server at http://127.0.0.1:8000/
```

### 2. Check Frontend Server
```bash
# Terminal 2
cd xraysetu
npm run dev
# Should show: Local: http://localhost:3000
```

### 3. Test API Connection
```bash
# Test backend directly
curl -I http://localhost:8000/auth/login/
# Should return: HTTP/1.1 405 Method Not Allowed (this is expected)

# Test login
curl -X POST http://localhost:8000/auth/login/ -H "Content-Type: application/json" -d '{"username": "testuser", "password": "testpass123"}'
# Should return JWT tokens
```

### 4. Check Environment Configuration
```bash
# Check frontend environment
cat xraysetu/.env.local
# Should contain: NEXT_PUBLIC_API_URL=http://localhost:8000

# Check if demo mode is disabled
grep -i demo xraysetu/.env.local
# Should return no results or results showing demo is NOT in the URL
```

## Common Solutions

### Restart Both Servers
```bash
# Kill existing processes
pkill -f "manage.py runserver"
pkill -f "next dev"

# Start backend
cd backend/core
python manage.py runserver

# Start frontend (in new terminal)
cd xraysetu
npm run dev
```

### Reset Test User Password
```bash
cd backend/core
python manage.py shell -c "from auth_service.models import CustomUser; u = CustomUser.objects.get(username='testuser'); u.set_password('testpass123'); u.save()"
```

### Clear Browser Cache
- Hard refresh the page (Ctrl+F5 or Cmd+Shift+R)
- Clear browser cache and cookies for localhost
- Try in an incognito/private browsing window

## Ports Configuration

Current working configuration:
- Backend: http://localhost:8000
- Frontend: http://localhost:3000

If ports change due to conflicts:
1. Note the new frontend port (Next.js will show it in the console)
2. Update CORS settings in `backend/core/core/settings.py`:
   ```python
   CORS_ALLOWED_ORIGINS = [
       "http://localhost:3000",  # Default port
       "http://localhost:3001",  # If 3000 is occupied
       "http://localhost:3002",  # If 3000 and 3001 are occupied
       "http://localhost:3003",  # If 3000, 3001, and 3002 are occupied
   ]
   ```
3. Restart the backend server

## Need More Help?

1. Check the browser's developer console (F12) for JavaScript errors
2. Check the browser's network tab for failed API requests
3. Check the backend server console for error messages
4. Check the frontend server console for error messages
5. Visit the diagnostic pages at http://localhost:3000/diagnostic