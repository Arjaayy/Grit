// Test script for new database fields
// Run with: node test-db-fields.js

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testNewFields() {
  console.log('🧪 Testing new database fields...\n');

  try {
    // Test 1: Create organization with domain
    console.log('1. Creating organization with domain...');
    const org = await prisma.organization.create({
      data: {
        name: 'Test Organization',
        slug: 'test-org',
        email: 'test@testorg.com',
        sportCategory: 'basketball',
        domain: 'testorg.gritdp.com',
        phone: '+1234567890',
        description: 'Test organization for field validation'
      }
    });
    console.log('✅ Organization created:', { id: org.id, domain: org.domain });

    // Test 2: Create registration with source tracking
    console.log('\n2. Creating registration with source tracking...');
    const registration = await prisma.registration.create({
      data: {
        eventId: 'test-event-123',
        organizationId: org.id,
        participantId: 'test-participant-123',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '+1234567890',
        source: 'external',
        sourceDetails: {
          domain: 'testorg.gritdp.com',
          user_agent: 'Mozilla/5.0 (Test Browser)',
          ip_address: '192.168.1.100',
          referrer: 'https://testorg.gritdp.com/events'
        }
      }
    });
    console.log('✅ Registration created:', { 
      id: registration.id, 
      source: registration.source,
      sourceDetails: registration.sourceDetails 
    });

    // Test 3: Query organizations by domain
    console.log('\n3. Querying organizations by domain...');
    const orgByDomain = await prisma.organization.findFirst({
      where: { domain: 'testorg.gritdp.com' },
      select: { id: true, name: true, domain: true }
    });
    console.log('✅ Organization found by domain:', orgByDomain);

    // Test 4: Query registrations by source
    console.log('\n4. Querying registrations by source...');
    const regsBySource = await prisma.registration.findMany({
      where: { source: 'external' },
      select: { id: true, email: true, source: true, createdAt: true }
    });
    console.log(`✅ Found ${regsBySource.length} external registrations`);

    // Test 5: Get registration statistics by source
    console.log('\n5. Registration statistics by source...');
    const sourceStats = await prisma.registration.groupBy({
      by: ['source'],
      _count: { id: true }
    });
    console.log('✅ Source statistics:', sourceStats);

    // Cleanup test data
    console.log('\n6. Cleaning up test data...');
    await prisma.registration.delete({
      where: { id: registration.id }
    });
    await prisma.organization.delete({
      where: { id: org.id }
    });
    console.log('✅ Test data cleaned up');

    console.log('\n🎉 All database field tests passed!');

  } catch (error) {
    console.error('❌ Database test failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run tests if called directly
if (require.main === module) {
  testNewFields().catch(console.error);
}

module.exports = { testNewFields };
