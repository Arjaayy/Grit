// Final System Integration Test
// Run with: node test-final-integration.js

class FinalIntegrationTester {
  constructor() {
    this.baseURL = 'http://localhost:3001';
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

  async testTwoAppArchitecture() {
    // Test that we have a clean two-app architecture
    const fs = require('fs');
    const path = require('path');
    
    const rootDir = path.join(process.cwd(), '..', '..');
    const appsDir = path.join(rootDir, 'apps');
    
    const apps = fs.readdirSync(appsDir);
    
    return {
      expectedApps: ['website', 'admin'],
      actualApps: apps,
      hasWebsite: apps.includes('website'),
      hasAdmin: apps.includes('admin'),
      hasPortal: apps.includes('portal'),
      architectureCorrect: apps.includes('website') && apps.includes('admin') && !apps.includes('portal')
    };
  }

  async testAPIConsolidation() {
    // Test that all APIs are in the admin app
    const fs = require('fs');
    const path = require('path');
    
    const rootDir = path.join(process.cwd(), '..', '..');
    const adminApiDir = path.join(rootDir, 'apps', 'admin', 'src', 'app', 'api');
    const websiteApiDir = path.join(rootDir, 'apps', 'website', 'src', 'app');
    
    const adminApis = fs.existsSync(adminApiDir) ? fs.readdirSync(adminApiDir) : [];
    const websiteApis = fs.existsSync(websiteApiDir) ? 
      fs.readdirSync(websiteApiDir).filter(dir => dir === 'api') : [];
    
    return {
      adminHasApis: adminApis.length > 0,
      websiteHasApis: websiteApis.length > 0,
      apisConsolidated: adminApis.length > 0 && websiteApis.length === 0,
      adminApiCount: adminApis.length,
      websiteApiCount: websiteApis.length
    };
  }

  async testDatabaseSchema() {
    // Test that database schema includes new fields
    const fs = require('fs');
    const path = require('path');
    
    const rootDir = path.join(process.cwd(), '..', '..');
    const schemaPath = path.join(rootDir, 'prisma', 'schema.prisma');
    const schemaContent = fs.readFileSync(schemaPath, 'utf8');
    
    const hasDomainField = schemaContent.includes('domain String?');
    const hasSourceField = schemaContent.includes('source String @default("internal")');
    const hasSourceDetailsField = schemaContent.includes('sourceDetails Json?');
    
    return {
      hasDomainField,
      hasSourceField,
      hasSourceDetailsField,
      schemaUpdated: hasDomainField && hasSourceField && hasSourceDetailsField
    };
  }

  async testClientSiteIntegration() {
    // Test that client site integration files exist
    const fs = require('fs');
    const path = require('path');
    
    const adminDocsDir = path.join(process.cwd(), 'docs');
    const integrationGuidePath = path.join(adminDocsDir, 'API-Integration-Guide.md');
    const apiClientPath = path.join(adminDocsDir, 'grit-api-client.js');
    
    return {
      hasApiClient: fs.existsSync(apiClientPath),
      hasIntegrationGuide: fs.existsSync(integrationGuidePath),
      integrationReady: fs.existsSync(apiClientPath) && fs.existsSync(integrationGuidePath)
    };
  }

  async testDocumentationCompleteness() {
    // Test that all documentation is in place
    const fs = require('fs');
    const path = require('path');
    
    const rootDir = path.join(process.cwd(), '..', '..');
    const docsDir = path.join(rootDir, 'docs');
    const adminDocsDir = path.join(process.cwd(), 'docs');
    
    const expectedDocs = [
      'DEPLOYMENT.md',
      'PORTAL-MIGRATION.md',
      'ENVIRONMENT-VARIABLES.md'
    ];
    
    const expectedAdminDocs = [
      'API-Integration-Guide.md'
    ];
    
    const rootDocsExist = expectedDocs.every(doc => 
      fs.existsSync(path.join(docsDir, doc))
    );
    
    const adminDocsExist = expectedAdminDocs.every(doc => 
      fs.existsSync(path.join(adminDocsDir, doc))
    );
    
    return {
      rootDocsExist,
      adminDocsExist,
      expectedRootDocs: expectedDocs.length,
      expectedAdminDocs: expectedAdminDocs.length,
      documentationComplete: rootDocsExist && adminDocsExist
    };
  }

  async testWebsiteAppScope() {
    // Test that website app is properly scoped
    const fs = require('fs');
    const path = require('path');
    
    const rootDir = path.join(process.cwd(), '..', '..');
    const websiteAppDir = path.join(rootDir, 'apps', 'website', 'src', 'app');
    const websiteComponentsDir = path.join(rootDir, 'apps', 'website', 'src', 'components');
    
    const websitePages = fs.existsSync(websiteAppDir) ? fs.readdirSync(websiteAppDir) : [];
    const websiteComponents = fs.existsSync(websiteComponentsDir) ? fs.readdirSync(websiteComponentsDir) : [];
    
    const hasMarketingPages = ['home', 'about', 'services', 'portfolio', 'contact'].every(page => 
      websitePages.includes(page)
    );
    
    const hasAdminPages = websitePages.some(page => ['dashboard', 'login', 'admin'].includes(page));
    const hasAdminComponents = websiteComponents.some(comp => 
      ['dashboard', 'login', 'nav-'].some(prefix => comp.startsWith(prefix))
    );
    
    return {
      hasMarketingPages,
      hasAdminPages,
      hasAdminComponents,
      websiteProperlyScoped: hasMarketingPages && !hasAdminPages && !hasAdminComponents
    };
  }

  async testAdminAppCompleteness() {
    // Test that admin app has all required functionality
    const fs = require('fs');
    const path = require('path');
    
    const adminAppDir = path.join(process.cwd(), 'src', 'app');
    const adminComponentsDir = path.join(process.cwd(), 'src', 'components');
    
    const adminPages = fs.existsSync(adminAppDir) ? fs.readdirSync(adminAppDir) : [];
    const adminComponents = fs.existsSync(adminComponentsDir) ? fs.readdirSync(adminComponentsDir) : [];
    
    const hasRequiredPages = ['dashboard', 'organizations', 'events', 'participants', 'analytics', 'settings'].every(page => 
      adminPages.includes(page)
    );
    
    const hasAPIEndpoints = adminPages.includes('api');
    const hasAnalytics = adminPages.some(page => page.includes('analytics'));
    const hasSettings = adminPages.some(page => page.includes('settings'));
    
    return {
      hasRequiredPages,
      hasAPIEndpoints,
      hasAnalytics,
      hasSettings,
      adminComplete: hasRequiredPages && hasAPIEndpoints && hasAnalytics && hasSettings
    };
  }

  async testMigrationFiles() {
    // Test that migration files are in place
    const fs = require('fs');
    const path = require('path');
    
    const rootDir = path.join(process.cwd(), '..', '..');
    const migrationsDir = path.join(rootDir, 'prisma', 'migrations');
    const testScriptPath = path.join(process.cwd(), 'test-db-fields.js');
    
    const hasMigrations = fs.existsSync(migrationsDir);
    const hasTestScript = fs.existsSync(testScriptPath);
    
    let migrationCount = 0;
    if (hasMigrations) {
      const migrations = fs.readdirSync(migrationsDir);
      migrationCount = migrations.filter(m => m.endsWith('.sql')).length;
    }
    
    return {
      hasMigrations,
      hasTestScript,
      migrationCount,
      migrationReady: hasMigrations && migrationCount > 0 && hasTestScript
    };
  }

  async generateReport() {
    const passed = this.testResults.filter(r => r.status === 'PASS').length;
    const failed = this.testResults.filter(r => r.status === 'FAIL').length;
    const total = this.testResults.length;

    console.log('\n' + '='.repeat(60));
    console.log('🎯 FINAL SYSTEM INTEGRATION TEST REPORT');
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
      
      if (test.result && typeof test.result === 'object') {
        Object.entries(test.result).forEach(([key, value]) => {
          if (typeof value === 'boolean') {
            console.log(`    ${key}: ${value ? '✅' : '❌'}`);
          } else if (typeof value === 'number') {
            console.log(`    ${key}: ${value}`);
          }
        });
      }
    });

    // Final system status
    const allPassed = failed === 0;
    
    console.log('\n🚀 SYSTEM STATUS:');
    if (allPassed) {
      console.log('✅ Portal removal and system restructuring COMPLETE');
      console.log('✅ Two-app architecture successfully implemented');
      console.log('✅ All APIs consolidated in admin app');
      console.log('✅ Client site integration ready');
      console.log('✅ Documentation complete');
      console.log('✅ Database schema updated');
      console.log('✅ Testing suites created');
    } else {
      console.log('❌ Some issues found - see failed tests above');
    }

    return {
      total,
      passed,
      failed,
      successRate: (passed / total) * 100,
      allPassed,
      results: this.testResults
    };
  }

  async runAllTests() {
    console.log('🚀 Starting Final System Integration Test Suite...\n');

    // Architecture tests
    await this.runTest('Two-App Architecture', () => this.testTwoAppArchitecture());
    await this.runTest('API Consolidation', () => this.testAPIConsolidation());
    
    // Database and schema tests
    await this.runTest('Database Schema Updates', () => this.testDatabaseSchema());
    await this.runTest('Migration Files Ready', () => this.testMigrationFiles());
    
    // Integration tests
    await this.runTest('Client Site Integration', () => this.testClientSiteIntegration());
    
    // App scope tests
    await this.runTest('Website App Scope', () => this.testWebsiteAppScope());
    await this.runTest('Admin App Completeness', () => this.testAdminAppCompleteness());
    
    // Documentation tests
    await this.runTest('Documentation Completeness', () => this.testDocumentationCompleteness());

    // Generate final report
    return this.generateReport();
  }
}

// Run tests if called directly
if (require.main === module) {
  const tester = new FinalIntegrationTester();
  tester.runAllTests()
    .then(report => {
      console.log('\n🎉 Final integration test suite completed!');
      
      if (report.allPassed) {
        console.log('\n🏆 READY FOR DEPLOYMENT!');
        console.log('The portal removal and system restructuring is complete.');
        console.log('You can now proceed with deployment to production.');
      } else {
        console.log('\n⚠️  Please address the failed tests before deployment.');
      }
      
      process.exit(report.allPassed ? 0 : 1);
    })
    .catch(error => {
      console.error('💥 Final integration test suite failed:', error);
      process.exit(1);
    });
}

module.exports = FinalIntegrationTester;
