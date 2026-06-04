CREATE TABLE IF NOT EXISTS contributor_submissions (
  id TEXT PRIMARY KEY,
  created_at INTEGER NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  discipline TEXT NOT NULL,
  contribution_type TEXT NOT NULL,
  message TEXT,
  source TEXT,
  consent INTEGER NOT NULL DEFAULT 1
);

CREATE INDEX IF NOT EXISTS idx_contributor_created ON contributor_submissions(created_at);
CREATE INDEX IF NOT EXISTS idx_contributor_email ON contributor_submissions(email);
