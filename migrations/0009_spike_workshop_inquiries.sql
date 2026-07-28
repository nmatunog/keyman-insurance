CREATE TABLE IF NOT EXISTS spike_workshop_inquiries (
  id TEXT PRIMARY KEY,
  created_at INTEGER NOT NULL,
  full_name TEXT NOT NULL,
  designation TEXT NOT NULL,
  agency_name TEXT NOT NULL,
  mobile TEXT NOT NULL,
  email TEXT NOT NULL COLLATE NOCASE,
  city TEXT,
  est_rookies INTEGER,
  est_mentors INTEGER,
  impl_timeline TEXT,
  notes TEXT,
  source TEXT NOT NULL DEFAULT 'spike_mentor_workshop',
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'scheduled', 'closed'))
);

CREATE INDEX IF NOT EXISTS idx_spike_workshop_created ON spike_workshop_inquiries(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_spike_workshop_email ON spike_workshop_inquiries(email);
CREATE INDEX IF NOT EXISTS idx_spike_workshop_status ON spike_workshop_inquiries(status);
