CREATE TABLE IF NOT EXISTS assessments (
  id TEXT PRIMARY KEY,
  created_at INTEGER NOT NULL,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  mobile TEXT,
  agency TEXT,
  years_in_service TEXT,
  keyman_cases TEXT,
  confidence_level TEXT,
  challenge_areas TEXT,
  business_owner_network TEXT,
  discussed_last_12_months TEXT,
  markets TEXT,
  advanced_topics TEXT,
  masterclass_interest TEXT,
  preferred_format TEXT,
  resource_permission INTEGER NOT NULL DEFAULT 0,
  conversation_commitment TEXT,
  lead_score INTEGER NOT NULL,
  lead_tier TEXT NOT NULL,
  source TEXT NOT NULL DEFAULT 'keyman_readiness'
);

CREATE INDEX IF NOT EXISTS idx_assessments_email ON assessments(email);
CREATE INDEX IF NOT EXISTS idx_assessments_tier ON assessments(lead_tier);
CREATE INDEX IF NOT EXISTS idx_assessments_created ON assessments(created_at);
