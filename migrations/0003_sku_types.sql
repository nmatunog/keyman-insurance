-- Two SKU types: membership (recurring) and course (one-time cohort)
ALTER TABLE subscriptions ADD COLUMN sku_type TEXT NOT NULL DEFAULT 'membership';
ALTER TABLE subscriptions ADD COLUMN course_id TEXT;

CREATE INDEX IF NOT EXISTS idx_subscriptions_sku ON subscriptions(sku_type, tier);
