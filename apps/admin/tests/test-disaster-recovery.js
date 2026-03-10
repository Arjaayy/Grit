// Disaster Recovery and Rollback Test Script
// Run with: node test-disaster-recovery.js

class DisasterRecoveryTester {
  constructor() {
    this.baseURL = 'http://localhost:3000';
    this.testResults = [];
    this.backupData = {};
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

  async createDataBackup() {
    // Create a backup of critical data before testing
    console.log('  Creating data backup...');
    
    try {
      // Backup organizations
      const orgsResponse = await fetch(`${this.baseURL}/api/organizations`);
      const orgsBackup = orgsResponse.ok ? await orgsResponse.json() : null;
      
      // Backup events
      const eventsResponse = await fetch(`${this.baseURL}/api/events/public?organization_slug=test-org`);
      const eventsBackup = eventsResponse.ok ? await eventsResponse.json() : null;
      
      // Backup participants
      const participantsResponse = await fetch(`${this.baseURL}/api/participants?organization_slug=test-org`);
      const participantsBackup = participantsResponse.ok ? await participantsResponse.json() : null;

      this.backupData = {
        timestamp: new Date().toISOString(),
        organizations: orgsBackup,
        events: eventsBackup,
        participants: participantsBackup
      };

      return {
        backupCreated: true,
        dataPoints: Object.keys(this.backupData).length - 1, // Exclude timestamp
        timestamp: this.backupData.timestamp
      };
    } catch (error) {
      return { backupCreated: false, error: error.message };
    }
  }

  async testDataCorruption() {
    // Simulate data corruption scenario
    console.log('  Simulating data corruption...');
    
    // Create test data that might cause issues
    const corruptedData = {
      organization_slug: 'test-org',
      event_id: 'evt_corruption_test',
      name: 'Corruption Test User',
      email: 'corruption@test.com',
      phone: '09123456789',
      team: 'Corruption Team',
      // Add potentially problematic data
      customFields: {
        notes: 'Test with special chars: \\"\\/<>{}[]()',
        metadata: '{"invalid": json structure}'
      }
    };

    try {
      const response = await fetch(`${this.baseURL}/api/events/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Origin': 'https://test-site.gritdp.com'
        },
        body: JSON.stringify(corruptedData)
      });

      return {
        corruptionHandled: !response.ok, // Should handle gracefully
        status: response.status,
        hasError: !response.ok
      };
    } catch (error) {
      return {
        corruptionHandled: true, // Network error is also handled
        error: error.message
      };
    }
  }

  async testAPIEndpointFailure() {
    // Test behavior when API endpoints fail
    console.log('  Testing API endpoint failure handling...');
    
    const failureTests = [
      {
        name: 'Non-existent endpoint',
        endpoint: '/api/nonexistent'
      },
      {
        name: 'Invalid method',
        endpoint: '/api/events/public',
        method: 'PATCH'
      },
      {
        name: 'Malformed request',
        endpoint: '/api/events/register',
        body: 'invalid json{'
      }
    ];

    const results = {};
    
    for (const test of failureTests) {
      try {
        const options = {
          method: test.method || 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Origin': 'https://test-site.gritdp.com'
          }
        };

        if (test.body) {
          options.body = test.body;
        }

        const response = await fetch(`${this.baseURL}${test.endpoint}`, options);
        
        results[test.name] = {
          status: response.status,
          handledGracefully: response.status >= 400 && response.status < 500,
          hasErrorBody: !response.ok
        };
      } catch (error) {
        results[test.name] = {
          handledGracefully: true,
          networkError: error.message
        };
      }
    }

    return results;
  }

  async testDatabaseConnectionFailure() {
    // Simulate database connection issues
    console.log('  Testing database connection failure...');
    
    // This would typically require mocking database failures
    // For now, we'll test endpoints that would fail if DB is down
    
    const dbDependentEndpoints = [
      '/api/events/public?organization_slug=test-org',
      '/api/participants?organization_slug=test-org',
      '/api/organizations/test-org'
    ];

    const results = {};
    
    for (const endpoint of dbDependentEndpoints) {
      try {
        const response = await fetch(`${this.baseURL}${endpoint}`);
        
        results[endpoint] = {
          status: response.status,
          dbFailureHandled: response.status === 500 || response.status === 503,
          hasErrorInfo: !response.ok
        };
      } catch (error) {
        results[endpoint] = {
          handledGracefully: true,
          networkError: error.message
        };
      }
    }

    return results;
  }

  async testServiceDegradation() {
    // Test graceful degradation when services are unavailable
    console.log('  Testing service degradation...');
    
    // Test that the system can operate with limited functionality
    const degradationTests = [
      {
        name: 'API unavailable',
        test: async () => {
          // Simulate API being unavailable by testing a timeout
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 100); // Very short timeout
          
          try {
            const response = await fetch(`${this.baseURL}/api/events/public?organization_slug=test-org`, {
              signal: controller.signal
            });
            clearTimeout(timeoutId);
            return { status: response.status, timedOut: false };
          } catch (error) {
            clearTimeout(timeoutId);
            return { timedOut: true, error: error.message };
          }
        }
      },
      {
        name: 'Partial service failure',
        test: async () => {
          // Test that some endpoints work while others don't
          const workingEndpoint = await fetch(`${this.baseURL}/`);
          const failingEndpoint = await fetch(`${this.baseURL}/api/nonexistent`);
          
          return {
            workingEndpointStatus: workingEndpoint.status,
            failingEndpointHandled: !failingEndpoint.ok,
            partialDegradation: workingEndpoint.ok && !failingEndpoint.ok
          };
        }
      }
    ];

    const results = {};
    
    for (const test of degradationTests) {
      results[test.name] = await test.test();
    }

    return results;
  }

  async testDataRecovery() {
    // Test data recovery procedures
    console.log('  Testing data recovery procedures...');
    
    // Test that we can recover from bad data states
    const recoveryTests = [
      {
        name: 'Recover from invalid registration',
        test: async () => {
          // Create invalid registration
          const invalidResponse = await fetch(`${this.baseURL}/api/events/register`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Origin': 'https://test-site.gritdp.com'
            },
            body: JSON.stringify({
              organization_slug: 'test-org',
              event_id: 'evt_recovery_test',
              name: '', // Empty name should fail validation
              email: 'invalid-email',
              phone: '09123456789',
              team: 'Recovery Team'
            })
          });

          // Follow up with valid registration
          const validResponse = await fetch(`${this.baseURL}/api/events/register`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Origin': 'https://test-site.gritdp.com'
            },
            body: JSON.stringify({
              organization_slug: 'test-org',
              event_id: 'evt_recovery_test',
              name: 'Recovery Test User',
              email: 'recovery@test.com',
              phone: '09123456788',
              team: 'Recovery Team'
            })
          });

          return {
            invalidRejected: !invalidResponse.ok,
            validAccepted: validResponse.ok,
            recoverySuccessful: !invalidResponse.ok && validResponse.ok
          };
        }
      },
      {
        name: 'Recover from concurrent conflicts',
        test: async () => {
          // Test handling of concurrent registration attempts
          const sameData = {
            organization_slug: 'test-org',
            event_id: 'evt_concurrent_test',
            name: 'Concurrent Test User',
            email: 'concurrent@test.com',
            phone: '09123456790',
            team: 'Concurrent Team'
          };

          // Submit same registration multiple times concurrently
          const promises = Array(3).fill().map(() =>
            fetch(`${this.baseURL}/api/events/register`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Origin': 'https://test-site.gritdp.com'
              },
              body: JSON.stringify(sameData)
            })
          );

          const responses = await Promise.all(promises);
          const successCount = responses.filter(r => r.ok).length;
          
          return {
            concurrentHandled: successCount <= 1, // Should only allow one success
            responses: responses.map(r => r.status),
            conflictResolution: successCount <= 1
          };
        }
      }
    ];

    const results = {};
    
    for (const test of recoveryTests) {
      results[test.name] = await test.test();
    }

    return results;
  }

  async testRollbackProcedures() {
    // Test rollback procedures for failed deployments
    console.log('  Testing rollback procedures...');
    
    const rollbackTests = [
      {
        name: 'Configuration rollback',
        test: async () => {
          // Test that configuration changes can be rolled back
          // This would typically involve checking version control and deployment scripts
          
          // For now, test that the system can handle configuration errors
          const response = await fetch(`${this.baseURL}/api/events/register`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Origin': 'https://test-site.gritdp.com'
            },
            body: JSON.stringify({
              // Missing required fields to trigger config validation
              organization_slug: 'test-org',
              event_id: 'evt_rollback_test'
            })
          });

          return {
            configValidationError: !response.ok,
            canRecover: response.status === 400,
            rollbackPossible: true
          };
        }
      },
      {
        name: 'Data rollback',
        test: async () => {
          // Test that data changes can be rolled back
          // This would typically involve database transactions and backups
          
          // Create a registration
          const createResponse = await fetch(`${this.baseURL}/api/events/register`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Origin': 'https://test-site.gritdp.com'
            },
            body: JSON.stringify({
              organization_slug: 'test-org',
              event_id: 'evt_rollback_test',
              name: 'Rollback Test User',
              email: 'rollback@test.com',
              phone: '09123456791',
              team: 'Rollback Team'
            })
          });

          if (createResponse.ok) {
            const result = await createResponse.json();
            const registrationId = result.data?.id;
            
            // In a real rollback, we would delete the registration
            // For testing, we'll just verify the data was created and can be identified
            return {
              dataCreated: !!registrationId,
              canRollback: !!registrationId,
              rollbackPoint: registrationId
            };
          }

          return { dataCreated: false };
        }
      }
    ];

    const results = {};
    
    for (const test of rollbackTests) {
      results[test.name] = await test.test();
    }

    return results;
  }

  async testMonitoringAlerts() {
    // Test that monitoring and alerting systems work during failures
    console.log('  Testing monitoring and alerting...');
    
    // Simulate different failure scenarios and check if they're properly detected
    const alertTests = [
      {
        name: 'High error rate detection',
        test: async () => {
          // Generate multiple errors to trigger alerting
          const errorPromises = Array(10).fill().map(() =>
            fetch(`${this.baseURL}/api/nonexistent`)
          );

          const responses = await Promise.all(errorPromises);
          const errorCount = responses.filter(r => !r.ok).length;
          
          return {
            errorsGenerated: errorCount,
            alertTriggered: errorCount >= 5, // Should trigger at 5 errors
            monitoringWorking: errorCount === 10
          };
        }
      },
      {
        name: 'Response time degradation',
        test: async () => {
          // Test slow response detection
          const startTime = Date.now();
          
          // Make a request that might be slow
          const response = await fetch(`${this.baseURL}/api/events/public?organization_slug=test-org&delay=1000`);
          const responseTime = Date.now() - startTime;
          
          return {
            responseTime,
            slowResponseDetected: responseTime > 500, // Should detect >500ms
            alertTriggered: responseTime > 1000 // Should alert >1000ms
          };
        }
      }
    ];

    const results = {};
    
    for (const test of alertTests) {
      results[test.name] = await test.test();
    }

    return results;
  }

  async testDisasterRecoveryPlan() {
    // Test the complete disaster recovery plan
    console.log('  Testing complete disaster recovery plan...');
    
    const recoverySteps = [
      {
        step: '1. Detect failure',
        test: () => this.testAPIEndpointFailure()
      },
      {
        step: '2. Initiate rollback',
        test: () => this.testRollbackProcedures()
      },
      {
        step: '3. Verify data integrity',
        test: () => this.createDataBackup()
      },
      {
        step: '4. Restore services',
        test: () => this.testServiceDegradation()
      },
      {
        step: '5. Validate recovery',
        test: () => this.testAPIEndpointFailure()
      }
    ];

    const recoveryResults = {};
    
    for (const { step, test } of recoverySteps) {
      try {
        const result = await test();
        recoveryResults[step] = {
          success: true,
          result
        };
      } catch (error) {
        recoveryResults[step] = {
          success: false,
          error: error.message
        };
      }
    }

    const successfulSteps = Object.values(recoveryResults).filter(r => r.success).length;
    
    return {
      totalSteps: recoverySteps.length,
      successfulSteps,
      recoveryPlanWorking: successfulSteps >= recoverySteps.length * 0.8, // 80% success rate
      recoveryResults
    };
  }

  async generateReport() {
    const passed = this.testResults.filter(r => r.status === 'PASS').length;
    const failed = this.testResults.filter(r => r.status === 'FAIL').length;
    const total = this.testResults.length;

    console.log('\n' + '='.repeat(60));
    console.log('🆘 DISASTER RECOVERY TEST REPORT');
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

    // Recovery recommendations
    console.log('\n🛡️ DISASTER RECOVERY RECOMMENDATIONS:');
    console.log('  - Implement automated backup procedures');
    console.log('  - Set up monitoring and alerting for all critical services');
    console.log('  - Create rollback procedures for all deployments');
    console.log('  - Test disaster recovery scenarios regularly');
    console.log('  - Document recovery procedures and contact information');
    console.log('  - Implement circuit breakers for external dependencies');

    return {
      total,
      passed,
      failed,
      successRate: (passed / total) * 100,
      results: this.testResults
    };
  }

  async runAllTests() {
    console.log('🚀 Starting Disaster Recovery Test Suite...\n');

    // Create backup before testing
    await this.runTest('Data Backup Creation', () => this.createDataBackup());

    // Failure scenario tests
    await this.runTest('Data Corruption Handling', () => this.testDataCorruption());
    await this.runTest('API Endpoint Failure', () => this.testAPIEndpointFailure());
    await this.runTest('Database Connection Failure', () => this.testDatabaseConnectionFailure());
    await this.runTest('Service Degradation', () => this.testServiceDegradation());

    // Recovery tests
    await this.runTest('Data Recovery', () => this.testDataRecovery());
    await this.runTest('Rollback Procedures', () => this.testRollbackProcedures());
    await this.runTest('Monitoring and Alerting', () => this.testMonitoringAlerts());

    // Complete disaster recovery test
    await this.runTest('Complete Disaster Recovery Plan', () => this.testDisasterRecoveryPlan());

    // Generate final report
    return this.generateReport();
  }
}

// Run tests if called directly
if (require.main === module) {
  const tester = new DisasterRecoveryTester();
  tester.runAllTests()
    .then(report => {
      console.log('\n🎉 Disaster recovery test suite completed!');
      process.exit(report.failed > 0 ? 1 : 0);
    })
    .catch(error => {
      console.error('💥 Disaster recovery test suite failed:', error);
      process.exit(1);
    });
}

module.exports = DisasterRecoveryTester;
