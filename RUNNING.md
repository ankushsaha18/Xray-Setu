# Running the Xray Setu Application

## Prerequisites
- Python 3.8 or higher
- Node.js 14 or higher
- npm or yarn

## Setup Instructions

### 1. Backend Setup (Django)

1. Navigate to the backend directory:
   ```bash
   cd backend/core
   ```

2. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Apply database migrations:
   ```bash
   python manage.py migrate
   ```

4. Start the Django development server:
   ```bash
   python manage.py runserver
   ```

   The backend will be available at http://localhost:8000

### 2. Frontend Setup (Next.js)

1. Navigate to the frontend directory:
   ```bash
   cd xraysetu
   ```

2. Install Node.js dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

   The frontend will be available at http://localhost:3000 (or the next available port if 3000 is in use)

## Environment Variables

### Backend (.env)
The backend uses the following environment variables:
- `DEBUG`: Set to `True` for development
- `SECRET_KEY`: Django secret key
- `DATABASE_URL`: Database connection URL (empty for SQLite)

### Frontend (.env.local)
The frontend uses the following environment variables:
- `NEXT_PUBLIC_API_URL`: URL of the backend API (defaults to http://localhost:8000)

## Troubleshooting
Refer to [TROUBLESHOOTING.md](TROUBLESHOOTING.md) for common issues and solutions.