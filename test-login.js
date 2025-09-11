async function testLogin() {
  try {
    console.log('Testing login with testuser/testpass');
    
    const response = await fetch('http://localhost:8000/auth/login/', {
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
    console.log('Response headers:', [...response.headers.entries()]);
    
    const data = await response.json();
    console.log('Response data:', data);
    
    if (response.ok) {
      console.log('Login successful!');
      console.log('Access token:', data.access_token ? 'Present' : 'Missing');
      console.log('Refresh token:', data.refresh_token ? 'Present' : 'Missing');
    } else {
      console.log('Login failed:', data.error || 'Unknown error');
    }
  } catch (error) {
    console.error('Error during login test:', error.message);
  }
}

testLogin();