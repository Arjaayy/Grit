// Comprehensive Admin Portal Test Suite
// Run with: node test-admin-functionality.js

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

class AdminPortalTester {
  constructor() {
    this.baseURL = 'http://localhost:3000';
    this.testResults = [];
  }

  async runTest(testName, testFunction) {
    console.log(`\n🧪 Running: ${testName}`);
    try {
      const result = await testFunction();
      this.testResults.push({ name: testName, status: 'PASS', result });
      console.log(`✅ ${testName} - PASSED`);
      return result;
    } catch (error) {
      this.testResults.push({ name: testName, status: 'FAIL', error: error.message });
      console.log(`❌ ${testName} - FAILED: ${error.message}`);
      return null;
    }
  }

  async testDatabaseConnection() {
    try {
      await prisma.$connect();
      return { connected: true };
    } finally {
      await prisma.$disconnect();
    }
  }

  async testAPIEndpoints() {
    const endpoints = [
      '/api/events/register',
      '/api/events/public',
      '/api/participants',
      '/api/organizations'
    ];

    const results = {};
    for (const endpoint of endpoints) {
      try {
        const response = await fetch(`${this.baseURL}${endpoint}`);
        results[endpoint] = {
          status: response.status,
          ok: response.ok
        };
      } catch (error) {
        results[endpoint] = { error: error.message };
      }
    }
    return results;
  }

  async testEventRegistration() {
    const registrationData = {
      organization_slug: 'test-org',
      event_id: 'evt_test_123',
      name: 'Test User',
      email: 'test@example.com',
      phone: '09123456789',
      team: 'Test Team'
    };

    const response = await fetch(`${this.baseURL}/api/events/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Origin': 'https://test-site.gritdp.com'
      },
      body: JSON.stringify(registrationData)
    });

    return {
      status: response.status,
      ok: response.ok,
      data: response.ok ? await response.json() : null
    };
  }

  async testPublicEventListing() {
    const response = await fetch(`${this.baseURL}/api/events/public?organization_slug=test-org`);
    
    return {
      status: response.status,
      ok: response.ok,
      data: response.ok ? await response.json() : null
    };
  }

  async testCORSPolicy() {
    const response = await fetch(`${this.baseURL}/api/events/register`, {
      method: 'OPTIONS',
      headers: {
        'Origin': 'https://test-site.gritdp.com',
        'Access-Control-Request-Method': 'POST',
        'Access-Control-Request-Headers': 'Content-Type'
      }
    });

    const corsHeaders = {
      'Access-Control-Allow-Origin': response.headers.get('Access-Control-Allow-Origin'),
      'Access-Control-Allow-Methods': response.headers.get('Access-Control-Allow-Methods'),
      'Access-Control-Allow-Headers': response.headers.get('Access-Control-Allow-Headers')
    };

    return {
      status: response.status,
      corsHeaders
    };
  }

  async testParticipantManagement() {
    const response = await fetch(`${this.baseURL}/api/participants?organization_slug=test-org&source=external`);
    
    return {
      status: response.status,
      ok: response.ok,
      data: response.ok ? await response.json() : null
    };
  }

  async testOrganizationAPI() {
    const response = await fetch(`${this.baseURL}/api/organizations/test-org`);
    
    return {
      status: response.status,
      ok: response.ok,
      data: response.ok ? await response.json() : null
    };
  }

  async testDatabaseSchema() {
    try {
      await prisma.$connect();
      
      // Test new fields exist
      const orgWithDomain = await prisma.organization.findFirst({
        where: { domain: { not: null } }
      });

      const regWithSource = await prisma.registration.findFirst({
        where: { source: 'external' }
      });

      return {
        organizationsHaveDomain: !!orgWithDomain,
        registrationsHaveSource: !!regWithSource,
        databaseConnected: true
      };
    } finally {
      await prisma.$disconnect();
    }
  }

  async testMiddlewareCORS() {
    // Test that middleware is properly handling CORS
    const endpoints = ['/api/events/register', '/api/events/public', '/api/participants'];
    const results = {};

    for (const endpoint of endpoints) {
      try {
        const response = await fetch(`${this.baseURL}${endpoint}`, {
          headers: {
            'Origin': 'https://unauthorized-domain.com'
          }
        });
        
        results[endpoint] = {
          status: response.status,
          corsHandled: response.headers.has('Access-Control-Allow-Origin')
        };
      } catch (error) {
        results[endpoint] = { error: error.message };
      }
    }

    return results;
  }

  async testAPIValidation() {
    // Test validation on API endpoints
    const testCases = [
      {
        name: 'Missing required fields',
        data: { name: 'Test User' },
        expectedStatus: 400
      },
      {
        name: 'Invalid email format',
        data: {
          organization_slug: 'test-org',
          event_id: 'evt_test_123',
          name: 'Test User',
          email: 'invalid-email',
          phone: '09123456789',
          team: 'Test Team'
        },
        expectedStatus: 400
      },
      {
        name: 'Invalid organization slug',
        data: {
          organization_slug: 'invalid slug with spaces',
          event_id: 'evt_test_123',
          name: 'Test User',
          email: 'test@example.com',
          phone: '09123456789',
          team: 'Test Team'
        },
        expectedStatus: 400
      }
    ];

    const results = {};
    for (const testCase of testCases) {
      try {
        const response = await fetch(`${this.baseURL}/api/events/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(testCase.data)
        });
        
        results[testCase.name] = {
          expectedStatus: testCase.expectedStatus,
          actualStatus: response.status,
          passed: response.status === testCase.expectedStatus
        };
      } catch (error) {
        results[testCase.name] = { error: error.message };
      }
    }

    return results;
  }

  async testSourceTracking() {
    // Test that registrations are properly tracking source
    const registrationData = {
      organization_slug: 'test-org',
      event_id: 'evt_test_source',
      name: 'Source Test User',
      email: 'sourcetest@example.com',
      phone: '09123456788',
      team: 'Source Test Team'
    };

    const response = await fetch(`${this.baseURL}/api/events/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Origin': 'https://test-site.gritdp.com',
        'User-Agent': 'Test Browser'
      },
      body: JSON.stringify(registrationData)
    });

    if (response.ok) {
      const result = await response.json();
      return {
        registrationCreated: !!result.data,
        sourceTracked: result.data.source === 'external',
        hasSourceDetails: !!result.data.sourceDetails
      };
    }

    return { error: 'Registration failed' };
  }

  async generateReport() {
    const passed = this.testResults.filter(r => r.status === 'PASS').length;
    const failed = this.testResults.filter(r => r.status === 'FAIL').length;
    const total = this.testResults.length;

    console.log('\n' + '='.repeat(60));
    console.log('📊 ADMIN PORTAL TEST REPORT');
    console.log('='.repeat(60));
    console.log(`Total Tests: ${total}`);
    console.log(`Passed: ${passed} ✅`);
    console.log(`Failed: ${failed} ❌`);
    console.log(`Success Rate: ${((passed / total) * 100).toFixed(1)}%`);
    console.log('='.repeat(60));

    if (failed > 0) {
      console.log('\n❌ FAILED TESTS:');
      this.testResults
        .filter(r => r.status === 'FAIL')
        .forEach(test => {
          console.log(`  - ${test.name}: ${test.error}`);
        });
    }

    console.log('\n📋 DETAILED RESULTS:');
    this.testResults.forEach(test => {
      const icon = test.status === 'PASS' ? '✅' : '❌';
      console.log(`  ${icon} ${test.name}`);
    });

    return {
      total,
      passed,
      failed,
      successRate: (passed / total) * 100,
      results: this.testResults
    };
  }

  async runAllTests() {
    console.log('🚀 Starting Admin Portal Test Suite...\n');

    // Core functionality tests
    await this.runTest('Database Connection', () => this.testDatabaseConnection());
    await this.runTest('API Endpoints Availability', () => this.testAPIEndpoints());
    await this.runTest('Database Schema Validation', () => this.testDatabaseSchema());

    // API functionality tests
    await this.runTest('Event Registration API', () => this.testEventRegistration());
    await this.runTest('Public Event Listing', () => this.testPublicEventListing());
    await this.runTest('Participant Management', () => this.testParticipantManagement());
    await this.runTest('Organization API', () => this.testOrganizationAPI());

    // Security and validation tests
    await this.runTest('CORS Policy Implementation', () => this.testCORSPolicy());
    await this.runTest('Middleware CORS Handling', () => this.testMiddlewareCORS());
    await this.runTest('API Input Validation', () => this.testAPIValidation());

    // Feature-specific tests
    await this.runTest('Registration Source Tracking', () => this.testSourceTracking());

    // Generate final report
    return this.generateReport();
  }
}

// Run tests if called directly
if (require.main === module) {
  const tester = new AdminPortalTester();
  tester.runAllTests()
    .then(report => {
      console.log('\n🎉 Test suite completed!');
      process.exit(report.failed > 0 ? 1 : 0);
    })
    .catch(error => {
      console.error('💥 Test suite failed:', error);
      process.exit(1);
    });
}

module.exports = AdminPortalTester;
