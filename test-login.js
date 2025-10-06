// Test script to verify login functionality
const testLogin = async () => {
  try {
    console.log('Testing login functionality...');
    
    const response = await fetch('http://localhost:8001/api/auth/login/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: 'testuser',
        password: 'testpass'
      })
    });
    
    console.log('Response status:', response.status);
    
    const data = await response.json();
    console.log('Response data:', data);
    
    if (response.ok) {
      console.log('Login successful!');
      console.log('Access token:', data.access_token);
      console.log('User:', data.user);
    } else {
      console.log('Login failed!');
      console.log('Error:', data);
    }
  } catch (error) {
    console.error('Error during login test:', error);
  }
};

testLogin();