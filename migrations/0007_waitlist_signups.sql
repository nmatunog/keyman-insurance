CREATE TABLE IF NOT EXISTS waitlist_signups (
  id TEXT PRIMARY KEY,
  created_at INTEGER NOT NULL,
  email TEXT NOT NULL,
  list_type TEXT NOT NULL,
  source TEXT,
  consent INTEGER NOT NULL DEFAULT 1
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_waitlist_email_type ON waitlist_signups(email, list_type);
CREATE INDEX IF NOT EXISTS idx_waitlist_created ON waitlist_signups(created_at);
CREATE INDEX IF NOT EXISTS idx_waitlist_type ON waitlist_signups(list_type);
