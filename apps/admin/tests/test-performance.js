// Performance Testing Script for Combined API/UI Load
// Run with: node test-performance.js

class PerformanceTester {
  constructor() {
    this.baseURL = 'http://localhost:3000';
    this.testResults = [];
    this.metrics = {
      api: [],
      ui: [],
      combined: []
    };
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

  async measureAPILoad(endpoint, method = 'GET', body = null, concurrent = 1) {
    const promises = [];
    const startTime = Date.now();

    for (let i = 0; i < concurrent; i++) {
      const promise = this.singleAPIRequest(endpoint, method, body);
      promises.push(promise);
    }

    const results = await Promise.all(promises);
    const endTime = Date.now();
    const totalTime = endTime - startTime;

    const successCount = results.filter(r => r.success).length;
    const avgResponseTime = results.reduce((sum, r) => sum + r.responseTime, 0) / results.length;

    return {
      endpoint,
      method,
      concurrent,
      totalTime,
      successCount,
      failureCount: concurrent - successCount,
      avgResponseTime,
      successRate: (successCount / concurrent) * 100,
      requestsPerSecond: (concurrent / totalTime) * 1000,
      results
    };
  }

  async singleAPIRequest(endpoint, method = 'GET', body = null) {
    const startTime = Date.now();
    
    try {
      const options = {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Origin': 'https://test-site.gritdp.com'
        }
      };

      if (body && (method === 'POST' || method === 'PUT')) {
        options.body = JSON.stringify(body);
      }

      const response = await fetch(`${this.baseURL}${endpoint}`, options);
      const responseTime = Date.now() - startTime;

      return {
        success: response.ok,
        status: response.status,
        responseTime,
        size: response.headers.get('content-length') || 0
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        responseTime: Date.now() - startTime
      };
    }
  }

  async testAPIPerformance() {
    const endpoints = [
      { path: '/api/events/public?organization_slug=test-org', method: 'GET' },
      { path: '/api/events/register', method: 'POST', body: {
        organization_slug: 'test-org',
        event_id: 'evt_test_123',
        name: 'Performance Test',
        email: 'perf@test.com',
        phone: '09123456789',
        team: 'Perf Team'
      }},
      { path: '/api/participants?organization_slug=test-org', method: 'GET' },
      { path: '/api/organizations/test-org', method: 'GET' }
    ];

    const results = {};
    
    for (const endpoint of endpoints) {
      console.log(`  Testing ${endpoint.method} ${endpoint.path}...`);
      
      // Test with different concurrency levels
      const concurrencyLevels = [1, 5, 10, 20];
      
      for (const concurrent of concurrencyLevels) {
        const result = await this.measureAPILoad(
          endpoint.path, 
          endpoint.method, 
          endpoint.body, 
          concurrent
        );
        
        const key = `${endpoint.method}_${endpoint.path.replace(/[^a-zA-Z0-9]/g, '_')}_${concurrent}`;
        results[key] = result;
        
        // Brief pause between tests
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }

    return results;
  }

  async testUIPerformance() {
    // Simulate UI page loads
    const pages = [
      '/',
      '/dashboard',
      '/organizations',
      '/events',
      '/analytics/cross-site',
      '/analytics/api-monitoring',
      '/settings/api-keys'
    ];

    const results = {};
    
    for (const page of pages) {
      console.log(`  Testing page load: ${page}...`);
      
      // Test page load performance
      const startTime = Date.now();
      
      try {
        const response = await fetch(`${this.baseURL}${page}`);
        const loadTime = Date.now() - startTime;
        
        results[page] = {
          success: response.ok,
          status: response.status,
          loadTime,
          size: response.headers.get('content-length') || 0
        };
      } catch (error) {
        results[page] = {
          success: false,
          error: error.message,
          loadTime: Date.now() - startTime
        };
      }
      
      // Brief pause between page loads
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    return results;
  }

  async testCombinedLoad() {
    // Test simultaneous API and UI load
    const apiEndpoints = [
      '/api/events/public?organization_slug=test-org',
      '/api/participants?organization_slug=test-org',
      '/api/organizations/test-org'
    ];

    const uiPages = ['/', '/dashboard', '/organizations', '/events'];

    const concurrentRequests = 15; // Mix of API and UI requests
    const promises = [];
    const startTime = Date.now();

    // Mix API and UI requests
    for (let i = 0; i < concurrentRequests; i++) {
      if (i % 3 === 0 && uiPages.length > 0) {
        // UI request
        const page = uiPages[i % uiPages.length];
        promises.push(
          fetch(`${this.baseURL}${page}`)
            .then(r => ({ type: 'ui', url: page, status: r.status, success: r.ok }))
            .catch(e => ({ type: 'ui', url: page, error: e.message }))
        );
      } else {
        // API request
        const endpoint = apiEndpoints[i % apiEndpoints.length];
        promises.push(
          fetch(`${this.baseURL}${endpoint}`)
            .then(r => ({ type: 'api', url: endpoint, status: r.status, success: r.ok }))
            .catch(e => ({ type: 'api', url: endpoint, error: e.message }))
        );
      }
    }

    const results = await Promise.all(promises);
    const endTime = Date.now();
    const totalTime = endTime - startTime;

    const successCount = results.filter(r => r.success).length;
    const apiResults = results.filter(r => r.type === 'api');
    const uiResults = results.filter(r => r.type === 'ui');

    return {
      totalTime,
      totalRequests: concurrentRequests,
      successCount,
      failureCount: concurrentRequests - successCount,
      successRate: (successCount / concurrentRequests) * 100,
      requestsPerSecond: (concurrentRequests / totalTime) * 1000,
      apiResults: apiResults.length,
      uiResults: uiResults.length,
      apiSuccessRate: (apiResults.filter(r => r.success).length / apiResults.length) * 100,
      uiSuccessRate: (uiResults.filter(r => r.success).length / uiResults.length) * 100,
      results
    };
  }

  async testMemoryUsage() {
    // Test memory usage under load
    const initialMemory = process.memoryUsage();
    
    // Create memory pressure with multiple requests
    const promises = [];
    for (let i = 0; i < 50; i++) {
      promises.push(
        fetch(`${this.baseURL}/api/events/public?organization_slug=test-org`)
      );
    }

    await Promise.all(promises);
    
    // Force garbage collection if available
    if (global.gc) {
      global.gc();
    }
    
    const finalMemory = process.memoryUsage();
    
    return {
      initialMemory,
      finalMemory,
      memoryIncrease: {
        rss: finalMemory.rss - initialMemory.rss,
        heapUsed: finalMemory.heapUsed - initialMemory.heapUsed,
        heapTotal: finalMemory.heapTotal - initialMemory.heapTotal
      }
    };
  }

  async testDatabasePerformance() {
    // Test database performance under load
    const dbTests = [
      {
        name: 'Concurrent Registrations',
        test: () => this.measureAPILoad('/api/events/register', 'POST', {
          organization_slug: 'test-org',
          event_id: 'evt_perf_test',
          name: 'Perf Test User',
          email: `perftest${Date.now()}@example.com`,
          phone: '09123456789',
          team: 'Perf Team'
        }, 10)
      },
      {
        name: 'Concurrent Event Queries',
        test: () => this.measureAPILoad('/api/events/public?organization_slug=test-org', 'GET', null, 15)
      },
      {
        name: 'Concurrent Participant Queries',
        test: () => this.measureAPILoad('/api/participants?organization_slug=test-org&source=external', 'GET', null, 12)
      }
    ];

    const results = {};
    
    for (const dbTest of dbTests) {
      console.log(`  Testing ${dbTest.name}...`);
      results[dbTest.name] = await dbTest.test();
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    return results;
  }

  async testStressLoad() {
    // Stress test with high concurrent load
    const stressLevels = [25, 50, 100];
    const results = {};

    for (const level of stressLevels) {
      console.log(`  Stress testing with ${level} concurrent requests...`);
      
      const promises = [];
      const startTime = Date.now();

      for (let i = 0; i < level; i++) {
        const endpoint = i % 2 === 0 
          ? '/api/events/public?organization_slug=test-org'
          : '/api/participants?organization_slug=test-org';
        
        promises.push(fetch(`${this.baseURL}${endpoint}`));
      }

      const responses = await Promise.all(promises);
      const endTime = Date.now();
      const totalTime = endTime - startTime;

      const successCount = responses.filter(r => r.ok).length;
      
      results[`stress_${level}`] = {
        concurrentRequests: level,
        totalTime,
        successCount,
        failureCount: level - successCount,
        successRate: (successCount / level) * 100,
        requestsPerSecond: (level / totalTime) * 1000
      };

      // Recovery time between stress tests
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    return results;
  }

  async generateReport() {
    const passed = this.testResults.filter(r => r.status === 'PASS').length;
    const failed = this.testResults.filter(r => r.status === 'FAIL').length;
    const total = this.testResults.length;

    console.log('\n' + '='.repeat(60));
    console.log('⚡ PERFORMANCE TEST REPORT');
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

    // Performance summary
    console.log('\n📊 PERFORMANCE SUMMARY:');
    this.testResults.forEach(test => {
      const icon = test.status === 'PASS' ? '✅' : '❌';
      console.log(`  ${icon} ${test.name}`);
      
      if (test.result && typeof test.result === 'object') {
        if (test.result.requestsPerSecond) {
          console.log(`    📈 ${test.result.requestsPerSecond.toFixed(2)} req/sec`);
        }
        if (test.result.successRate) {
          console.log(`    ✅ ${test.result.successRate.toFixed(1)}% success rate`);
        }
        if (test.result.avgResponseTime) {
          console.log(`    ⏱️ ${test.result.avgResponseTime.toFixed(2)}ms avg response`);
        }
      }
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
    console.log('🚀 Starting Performance Test Suite...\n');

    // API performance tests
    await this.runTest('API Performance', () => this.testAPIPerformance());
    
    // UI performance tests
    await this.runTest('UI Performance', () => this.testUIPerformance());
    
    // Combined load tests
    await this.runTest('Combined Load Test', () => this.testCombinedLoad());
    
    // Database performance tests
    await this.runTest('Database Performance', () => this.testDatabasePerformance());
    
    // Stress tests
    await this.runTest('Stress Load Test', () => this.testStressLoad());
    
    // Memory usage test
    await this.runTest('Memory Usage', () => this.testMemoryUsage());

    // Generate final report
    return this.generateReport();
  }
}

// Run tests if called directly
if (require.main === module) {
  const tester = new PerformanceTester();
  tester.runAllTests()
    .then(report => {
      console.log('\n🎉 Performance test suite completed!');
      
      // Performance recommendations
      console.log('\n💡 PERFORMANCE RECOMMENDATIONS:');
      console.log('  - Monitor API response times under load');
      console.log('  - Implement caching for frequently accessed endpoints');
      console.log('  - Consider rate limiting for external clients');
      console.log('  - Optimize database queries for concurrent access');
      console.log('  - Monitor memory usage during peak loads');
      
      process.exit(report.failed > 0 ? 1 : 0);
    })
    .catch(error => {
      console.error('💥 Performance test suite failed:', error);
      process.exit(1);
    });
}

module.exports = PerformanceTester;
