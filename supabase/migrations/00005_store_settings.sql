-- Create table for store settings
CREATE TABLE store_settings (
  id INTEGER PRIMARY KEY CHECK (id = 1), -- Ensure singleton
  store_name TEXT DEFAULT 'Stock Trading',
  support_email TEXT DEFAULT 'support@stocktrading.com',
  free_shipping_threshold DECIMAL(10,2) DEFAULT 500.00,
  tax_rate DECIMAL(5,2) DEFAULT 0.00,
  maintenance_mode BOOLEAN DEFAULT FALSE,
  announcement_bar_text TEXT,
  announcement_bar_active BOOLEAN DEFAULT TRUE,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  updated_by UUID REFERENCES profiles(id)
);

-- Insert default row
INSERT INTO store_settings (id) VALUES (1) ON CONFLICT DO NOTHING;

-- Enable RLS
ALTER TABLE store_settings ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Anyone can read store settings"
  ON store_settings FOR SELECT
  USING (true);

CREATE POLICY "Admins can update store settings"
  ON store_settings FOR UPDATE
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Grant permissions
GRANT SELECT ON store_settings TO anon, authenticated;
GRANT UPDATE ON store_settings TO authenticated;
