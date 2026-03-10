// Event Registration Flow Test Script
// Run with: node test-registration-flow.js

class RegistrationFlowTester {
  constructor() {
    this.baseURL = 'http://localhost:3000';
    this.testResults = [];
    this.mockEventId = 'evt_test_registration_flow';
    this.mockOrgSlug = 'test-registration-org';
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

  async testEventDiscovery() {
    // Test that external sites can discover events
    const response = await fetch(
      `${this.baseURL}/api/events/public?organization_slug=${this.mockOrgSlug}`
    );

    if (!response.ok) {
      throw new Error(`Event discovery failed: ${response.status}`);
    }

    const data = await response.json();
    
    return {
      status: response.status,
      eventsFound: data.data?.events?.length || 0,
      hasTestEvent: data.data?.events?.some(e => e.id === this.mockEventId)
    };
  }

  async testEventDetails() {
    // Test getting detailed event information
    const response = await fetch(
      `${this.baseURL}/api/events/public/${this.mockEventId}?organization_slug=${this.mockOrgSlug}`
    );

    if (!response.ok) {
      throw new Error(`Event details failed: ${response.status}`);
    }

    const event = await response.json();
    
    return {
      status: response.status,
      eventFound: !!event.data,
      hasRequiredFields: event.data ? [
        'id', 'name', 'date', 'location', 'max_participants', 
        'registration_status', 'entry_fee'
      ].every(field => event.data[field] !== undefined) : false
    };
  }

  async testRegistrationValidation() {
    // Test registration form validation
    const validationTests = [
      {
        name: 'Empty submission',
        data: {},
        expectedStatus: 400
      },
      {
        name: 'Missing required fields',
        data: {
          organization_slug: this.mockOrgSlug,
          event_id: this.mockEventId,
          name: 'Test User'
        },
        expectedStatus: 400
      },
      {
        name: 'Invalid email',
        data: {
          organization_slug: this.mockOrgSlug,
          event_id: this.mockEventId,
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
          event_id: this.mockEventId,
          name: 'Test User',
          email: 'test@example.com',
          phone: '09123456789',
          team: 'Test Team'
        },
        expectedStatus: 400
      }
    ];

    const results = {};
    
    for (const test of validationTests) {
      try {
        const response = await fetch(`${this.baseURL}/api/events/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Origin': 'https://test-site.gritdp.com'
          },
          body: JSON.stringify(test.data)
        });

        results[test.name] = {
          expectedStatus: test.expectedStatus,
          actualStatus: response.status,
          passed: response.status === test.expectedStatus
        };
      } catch (error) {
        results[test.name] = { error: error.message };
      }
    }

    return results;
  }

  async testSuccessfulRegistration() {
    // Test a complete successful registration
    const registrationData = {
      organization_slug: this.mockOrgSlug,
      event_id: this.mockEventId,
      name: 'Flow Test User',
      email: 'flowtest@example.com',
      phone: '09123456788',
      team: 'Flow Test Team'
    };

    const response = await fetch(`${this.baseURL}/api/events/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Origin': 'https://test-site.gritdp.com',
        'User-Agent': 'Test Registration Flow'
      },
      body: JSON.stringify(registrationData)
    });

    if (!response.ok) {
      throw new Error(`Registration failed: ${response.status}`);
    }

    const result = await response.json();
    
    return {
      status: response.status,
      registrationCreated: !!result.data,
      hasId: !!result.data?.id,
      statusConfirmed: result.data?.status === 'confirmed',
      sourceTracked: result.data?.source === 'external',
      hasTimestamp: !!result.data?.created_at
    };
  }

  async testDuplicateRegistration() {
    // Test duplicate registration handling
    const duplicateData = {
      organization_slug: this.mockOrgSlug,
      event_id: this.mockEventId,
      name: 'Duplicate Test User',
      email: 'flowtest@example.com', // Same email as previous test
      phone: '09123456789',
      team: 'Duplicate Test Team'
    };

    const response = await fetch(`${this.baseURL}/api/events/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Origin': 'https://test-site.gritdp.com'
      },
      body: JSON.stringify(duplicateData)
    });

    // Should either succeed (if duplicates allowed) or return appropriate error
    return {
      status: response.status,
      handled: response.ok || response.status === 409, // 409 = Conflict
      result: response.ok ? await response.json() : null
    };
  }

  async testSourceTracking() {
    // Test that registration source is properly tracked
    const sourceTestData = {
      organization_slug: this.mockOrgSlug,
      event_id: this.mockEventId,
      name: 'Source Tracking Test',
      email: 'sourcetrack@example.com',
      phone: '09123456790',
      team: 'Source Track Team'
    };

    const response = await fetch(`${this.baseURL}/api/events/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Origin': 'https://sourcetrack.gritdp.com',
        'User-Agent': 'Source Tracking Test Browser',
        'Referer': 'https://sourcetrack.gritdp.com/events'
      },
      body: JSON.stringify(sourceTestData)
    });

    if (!response.ok) {
      throw new Error(`Source tracking test failed: ${response.status}`);
    }

    const result = await response.json();
    
    return {
      status: response.status,
      sourceCorrect: result.data?.source === 'external',
      hasSourceDetails: !!result.data?.sourceDetails,
      domainTracked: result.data?.sourceDetails?.domain === 'sourcetrack.gritdp.com',
      hasUserAgent: !!result.data?.sourceDetails?.user_agent,
      hasReferer: !!result.data?.sourceDetails?.referrer
    };
  }

  async testRegistrationRetrieval() {
    // Test that registrations can be retrieved with source information
    const response = await fetch(
      `${this.baseURL}/api/participants?organization_slug=${this.mockOrgSlug}&source=external`
    );

    if (!response.ok) {
      throw new Error(`Registration retrieval failed: ${response.status}`);
    }

    const data = await response.json();
    
    return {
      status: response.status,
      participantsFound: data.data?.participants?.length || 0,
      hasSourceInfo: data.data?.participants?.every(p => p.source) || false,
      hasStats: !!data.data?.stats
    };
  }

  async testCrossOriginFlow() {
    // Test the complete flow from different origins
    const origins = [
      'https://tuguegaraoleague.gritdp.com',
      'https://spupathletics.gritdp.com',
      'https://cagayanbasketball.gritdp.com'
    ];

    const results = {};
    
    for (let i = 0; i < origins.length; i++) {
      const origin = origins[i];
      const registrationData = {
        organization_slug: this.mockOrgSlug,
        event_id: this.mockEventId,
        name: `Cross Origin Test ${i + 1}`,
        email: `crosstest${i + 1}@example.com`,
        phone: `091234567${i + 1}0`,
        team: `Cross Origin Team ${i + 1}`
      };

      try {
        const response = await fetch(`${this.baseURL}/api/events/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Origin': origin
          },
          body: JSON.stringify(registrationData)
        });

        results[origin] = {
          status: response.status,
          success: response.ok,
          corsHandled: response.headers.has('Access-Control-Allow-Origin')
        };
      } catch (error) {
        results[origin] = { error: error.message };
      }
    }

    return results;
  }

  async testErrorHandling() {
    // Test error handling in registration flow
    const errorTests = [
      {
        name: 'Non-existent event',
        data: {
          organization_slug: this.mockOrgSlug,
          event_id: 'evt_nonexistent',
          name: 'Test User',
          email: 'test@example.com',
          phone: '09123456789',
          team: 'Test Team'
        }
      },
      {
        name: 'Non-existent organization',
        data: {
          organization_slug: 'nonexistent-org',
          event_id: this.mockEventId,
          name: 'Test User',
          email: 'test@example.com',
          phone: '09123456789',
          team: 'Test Team'
        }
      },
      {
        name: 'Malformed JSON',
        malformed: true
      }
    ];

    const results = {};
    
    for (const test of errorTests) {
      try {
        let response;
        
        if (test.malformed) {
          response = await fetch(`${this.baseURL}/api/events/register`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Origin': 'https://test-site.gritdp.com'
            },
            body: 'invalid json{'
          });
        } else {
          response = await fetch(`${this.baseURL}/api/events/register`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Origin': 'https://test-site.gritdp.com'
            },
            body: JSON.stringify(test.data)
          });
        }

        const isError = !response.ok;
        const hasErrorMessage = isError ? 
          (await response.json()).error : 
          false;

        results[test.name] = {
          status: response.status,
          errorHandled: isError,
          hasErrorMessage
        };
      } catch (error) {
        results[test.name] = { error: error.message };
      }
    }

    return results;
  }

  async generateReport() {
    const passed = this.testResults.filter(r => r.status === 'PASS').length;
    const failed = this.testResults.filter(r => r.status === 'FAIL').length;
    const total = this.testResults.length;

    console.log('\n' + '='.repeat(60));
    console.log('📋 EVENT REGISTRATION FLOW TEST REPORT');
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
    console.log('🚀 Starting Event Registration Flow Test Suite...\n');

    // Discovery and details tests
    await this.runTest('Event Discovery', () => this.testEventDiscovery());
    await this.runTest('Event Details Retrieval', () => this.testEventDetails());

    // Validation tests
    await this.runTest('Registration Validation', () => this.testRegistrationValidation());

    // Registration flow tests
    await this.runTest('Successful Registration', () => this.testSuccessfulRegistration());
    await this.runTest('Duplicate Registration Handling', () => this.testDuplicateRegistration());
    await this.runTest('Source Tracking', () => this.testSourceTracking());

    // Data retrieval tests
    await this.runTest('Registration Retrieval', () => this.testRegistrationRetrieval());

    // Cross-origin tests
    await this.runTest('Cross-Origin Registration Flow', () => this.testCrossOriginFlow());

    // Error handling tests
    await this.runTest('Error Handling', () => this.testErrorHandling());

    // Generate final report
    return this.generateReport();
  }
}

// Run tests if called directly
if (require.main === module) {
  const tester = new RegistrationFlowTester();
  tester.runAllTests()
    .then(report => {
      console.log('\n🎉 Registration flow test suite completed!');
      process.exit(report.failed > 0 ? 1 : 0);
    })
    .catch(error => {
      console.error('💥 Registration flow test suite failed:', error);
      process.exit(1);
    });
}

module.exports = RegistrationFlowTester;
