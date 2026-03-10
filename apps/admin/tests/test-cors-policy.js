// CORS Policy Testing Script
// Run with: node test-cors-policy.js

class CORSTester {
  constructor() {
    this.baseURL = 'http://localhost:3000';
    this.testDomains = [
      'https://gritdp.com',
      'https://admin.gritdp.com',
      'https://tuguegaraoleague.gritdp.com',
      'https://spupathletics.gritdp.com',
      'https://cagayanbasketball.gritdp.com',
      'https://unauthorized-domain.com',
      'http://localhost:3000',
      'http://localhost:3001'
    ];
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

  async testCORSOptions(domain) {
    try {
      const response = await fetch(`${this.baseURL}/api/events/register`, {
        method: 'OPTIONS',
        headers: {
          'Origin': domain,
          'Access-Control-Request-Method': 'POST',
          'Access-Control-Request-Headers': 'Content-Type, Authorization'
        }
      });

      const corsHeaders = {
        'Access-Control-Allow-Origin': response.headers.get('Access-Control-Allow-Origin'),
        'Access-Control-Allow-Methods': response.headers.get('Access-Control-Allow-Methods'),
        'Access-Control-Allow-Headers': response.headers.get('Access-Control-Allow-Headers'),
        'Access-Control-Max-Age': response.headers.get('Access-Control-Max-Age')
      };

      return {
        status: response.status,
        ok: response.ok,
        corsHeaders,
        allowedOrigin: corsHeaders['Access-Control-Allow-Origin'],
        methods: corsHeaders['Access-Control-Allow-Methods'],
        headers: corsHeaders['Access-Control-Allow-Headers']
      };
    } catch (error) {
      return { error: error.message };
    }
  }

  async testCORSPost(domain) {
    try {
      const response = await fetch(`${this.baseURL}/api/events/register`, {
        method: 'POST',
        headers: {
          'Origin': domain,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          organization_slug: 'test-org',
          event_id: 'evt_test_123',
          name: 'Test User',
          email: 'test@example.com',
          phone: '09123456789',
          team: 'Test Team'
        })
      });

      const corsHeaders = {
        'Access-Control-Allow-Origin': response.headers.get('Access-Control-Allow-Origin'),
        'Access-Control-Allow-Credentials': response.headers.get('Access-Control-Allow-Credentials')
      };

      return {
        status: response.status,
        ok: response.ok,
        corsHeaders,
        allowedOrigin: corsHeaders['Access-Control-Allow-Origin'],
        credentials: corsHeaders['Access-Control-Allow-Credentials']
      };
    } catch (error) {
      return { error: error.message };
    }
  }

  async testDomainCORS(domain) {
    console.log(`  Testing domain: ${domain}`);
    
    const optionsResult = await this.testCORSOptions(domain);
    const postResult = await this.testCORSPost(domain);

    return {
      domain,
      options: optionsResult,
      post: postResult,
      corsWorking: optionsResult?.allowedOrigin === domain || optionsResult?.allowedOrigin === '*'
    };
  }

  async testAllDomains() {
    const results = {};
    
    for (const domain of this.testDomains) {
      results[domain] = await this.testDomainCORS(domain);
    }

    return results;
  }

  async testCORSSecurity() {
    // Test CORS security measures
    const securityTests = [
      {
        name: 'Missing Origin Header',
        headers: { 'Content-Type': 'application/json' },
        shouldAllow: false
      },
      {
        name: 'Invalid Origin',
        headers: { 
          'Origin': 'https://malicious-site.com',
          'Content-Type': 'application/json'
        },
        shouldAllow: false
      },
      {
        name: 'Null Origin',
        headers: { 
          'Origin': 'null',
          'Content-Type': 'application/json'
        },
        shouldAllow: false
      },
      {
        name: 'File:// Origin',
        headers: { 
          'Origin': 'file://',
          'Content-Type': 'application/json'
        },
        shouldAllow: false
      }
    ];

    const results = {};
    
    for (const test of securityTests) {
      try {
        const response = await fetch(`${this.baseURL}/api/events/register`, {
          method: 'POST',
          headers: test.headers,
          body: JSON.stringify({
            organization_slug: 'test-org',
            event_id: 'evt_test_123',
            name: 'Test User',
            email: 'test@example.com'
          })
        });

        const corsHeader = response.headers.get('Access-Control-Allow-Origin');
        const isAllowed = corsHeader !== null && corsHeader !== 'undefined';

        results[test.name] = {
          status: response.status,
          corsHeader,
          isAllowed,
          expected: !test.shouldAllow,
          passed: isAllowed === !test.shouldAllow
        };
      } catch (error) {
        results[test.name] = { error: error.message };
      }
    }

    return results;
  }

  async testCORSHeaders() {
    // Test that all required CORS headers are present
    const response = await fetch(`${this.baseURL}/api/events/register`, {
      method: 'OPTIONS',
      headers: {
        'Origin': 'https://gritdp.com',
        'Access-Control-Request-Method': 'POST'
      }
    });

    const requiredHeaders = [
      'Access-Control-Allow-Origin',
      'Access-Control-Allow-Methods',
      'Access-Control-Allow-Headers'
    ];

    const headerCheck = {};
    for (const header of requiredHeaders) {
      headerCheck[header] = {
        present: response.headers.has(header),
        value: response.headers.get(header)
      };
    }

    return {
      status: response.status,
      allHeadersPresent: requiredHeaders.every(h => response.headers.has(h)),
      headerCheck
    };
  }

  async testCORSMethods() {
    // Test that CORS allows the correct methods
    const response = await fetch(`${this.baseURL}/api/events/register`, {
      method: 'OPTIONS',
      headers: {
        'Origin': 'https://gritdp.com',
        'Access-Control-Request-Method': 'POST'
      }
    });

    const allowedMethods = response.headers.get('Access-Control-Allow-Methods');
    const expectedMethods = ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'];
    
    const methodsArray = allowedMethods ? allowedMethods.split(',').map(m => m.trim()) : [];
    const hasRequiredMethods = expectedMethods.every(method => methodsArray.includes(method));

    return {
      status: response.status,
      allowedMethods,
      methodsArray,
      hasRequiredMethods,
      expectedMethods
    };
  }

  async testPreflightCaching() {
    // Test CORS preflight caching
    const response = await fetch(`${this.baseURL}/api/events/register`, {
      method: 'OPTIONS',
      headers: {
        'Origin': 'https://gritdp.com',
        'Access-Control-Request-Method': 'POST'
      }
    });

    const maxAge = response.headers.get('Access-Control-Max-Age');
    const hasCache = maxAge && !isNaN(parseInt(maxAge));

    return {
      status: response.status,
      maxAge,
      hasCache,
      cacheDuration: hasCache ? parseInt(maxAge) : null
    };
  }

  async generateReport() {
    const passed = this.testResults.filter(r => r.status === 'PASS').length;
    const failed = this.testResults.filter(r => r.status === 'FAIL').length;
    const total = this.testResults.length;

    console.log('\n' + '='.repeat(60));
    console.log('🌐 CORS POLICY TEST REPORT');
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
    console.log('🚀 Starting CORS Policy Test Suite...\n');

    // Domain-specific tests
    await this.runTest('CORS Policy for All Domains', () => this.testAllDomains());
    
    // Security tests
    await this.runTest('CORS Security Measures', () => this.testCORSSecurity());
    
    // Header tests
    await this.runTest('CORS Headers Presence', () => this.testCORSHeaders());
    await this.runTest('CORS Methods Allowed', () => this.testCORSMethods());
    await this.runTest('CORS Preflight Caching', () => this.testPreflightCaching());

    // Generate final report
    return this.generateReport();
  }
}

// Run tests if called directly
if (require.main === module) {
  const tester = new CORSTester();
  tester.runAllTests()
    .then(report => {
      console.log('\n🎉 CORS test suite completed!');
      
      // Additional domain analysis
      console.log('\n📊 DOMAIN ANALYSIS:');
      const domainTest = report.results.find(r => r.name === 'CORS Policy for All Domains');
      if (domainTest && domainTest.result) {
        Object.entries(domainTest.result).forEach(([domain, result]) => {
          const status = result.corsWorking ? '✅' : '❌';
          console.log(`  ${status} ${domain}`);
        });
      }
      
      process.exit(report.failed > 0 ? 1 : 0);
    })
    .catch(error => {
      console.error('💥 CORS test suite failed:', error);
      process.exit(1);
    });
}

module.exports = CORSTester;
