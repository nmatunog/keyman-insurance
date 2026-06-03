-- Allow professional/elite membership and academy IDs on subscriptions
PRAGMA foreign_keys=OFF;

CREATE TABLE users_new (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE COLLATE NOCASE,
  password_hash TEXT NOT NULL,
  name TEXT,
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('admin', 'member', 'mentee')),
  tier TEXT NOT NULL DEFAULT 'preview' CHECK (tier IN ('preview', 'professional', 'elite', 'basic', 'advanced', 'master')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'suspended')),
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);
INSERT INTO users_new SELECT * FROM users;
DROP TABLE users;
ALTER TABLE users_new RENAME TO users;

CREATE TABLE subscriptions_new (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  tier TEXT NOT NULL,
  billing_period TEXT NOT NULL CHECK (billing_period IN ('monthly', 'annual')),
  amount_php INTEGER NOT NULL,
  currency TEXT NOT NULL DEFAULT 'PHP',
  payment_provider TEXT NOT NULL CHECK (payment_provider IN ('stripe', 'paymongo', 'manual')),
  payment_ref TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'failed', 'cancelled', 'refunded')),
  starts_at INTEGER,
  ends_at INTEGER,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  is_founding INTEGER NOT NULL DEFAULT 0,
  sku_type TEXT NOT NULL DEFAULT 'membership',
  course_id TEXT
);
INSERT INTO subscriptions_new SELECT * FROM subscriptions;
DROP TABLE subscriptions;
ALTER TABLE subscriptions_new RENAME TO subscriptions;

CREATE INDEX IF NOT EXISTS idx_subscriptions_user ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_sku ON subscriptions(sku_type, tier);

UPDATE users SET tier = 'professional' WHERE tier IN ('basic', 'advanced');
UPDATE users SET tier = 'elite' WHERE tier = 'master';

PRAGMA foreign_keys=ON;
