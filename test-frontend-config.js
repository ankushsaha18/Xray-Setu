// Test if the frontend thinks it's in demo mode
const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
console.log('NEXT_PUBLIC_API_URL:', apiUrl);

// Check if the URL includes 'demo' (case insensitive)
const isDemo = apiUrl.toLowerCase().includes('demo');
console.log('Is demo mode:', isDemo);

if (isDemo) {
  console.log('Frontend is in demo mode, which means it will not connect to the backend');
} else {
  console.log('Frontend is in live mode, should connect to the backend');
}