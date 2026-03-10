// Simple API test script
// Run with: node test-api.js

const BASE_URL = 'http://localhost:3000/api';

async function testAPI() {
  console.log('🧪 Testing API endpoints...\n');

  // Test 1: Event Registration
  console.log('1. Testing event registration...');
  try {
    const response = await fetch(`${BASE_URL}/events/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        organization_slug: 'tuguegaraoleague',
        event_id: 'evt_test_123',
        name: 'Test User',
        email: 'test@example.com',
        phone: '09123456789',
        team: 'Test Team'
      })
    });

    const result = await response.json();
    console.log('✅ Registration API:', response.status, result);
  } catch (error) {
    console.log('❌ Registration API failed:', error.message);
  }

  // Test 2: CORS Preflight
  console.log('\n2. Testing CORS preflight...');
  try {
    const response = await fetch(`${BASE_URL}/events/register`, {
      method: 'OPTIONS',
      headers: {
        'Origin': 'https://tuguegaraoleague.gritdp.com',
        'Access-Control-Request-Method': 'POST',
        'Access-Control-Request-Headers': 'Content-Type',
      }
    });

    console.log('✅ CORS preflight:', response.status);
    console.log('CORS headers:', {
      'Access-Control-Allow-Origin': response.headers.get('Access-Control-Allow-Origin'),
      'Access-Control-Allow-Methods': response.headers.get('Access-Control-Allow-Methods'),
    });
  } catch (error) {
    console.log('❌ CORS preflight failed:', error.message);
  }

  console.log('\n🎉 API testing complete!');
}

// Run tests if called directly
if (require.main === module) {
  testAPI();
}

module.exports = { testAPI };
