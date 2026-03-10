-- Migration: Add domain and source fields
-- Description: Add domain field to organizations table and source tracking to registrations table
-- Note: This migration is for fresh database setup

-- The domain and source fields are already included in the schema
-- No ALTER TABLE statements needed for fresh deployment
-- Fields will be created automatically when running prisma migrate dev

-- Indexes that will be created for performance:
-- CREATE INDEX "organizations_domain_idx" ON "organizations"("domain");
-- CREATE INDEX "registrations_source_idx" ON "registrations"("source");

-- Migration complete - schema includes:
-- organizations.domain (TEXT, optional)
-- registrations.source (TEXT, default 'internal') 
-- registrations.sourceDetails (JSONB, optional)
