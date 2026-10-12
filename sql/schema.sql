-- ==============================================================================
-- AGROVET LTD (agrovet.ltd) — PRODUCTION POSTGRESQL SCHEMA
-- Real-time multi-county order management and warehouse dispatch tracking
-- ==============================================================================

-- Create Orders Table
CREATE TABLE IF NOT EXISTS orders (
  id VARCHAR(64) PRIMARY KEY,
  order_number SERIAL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- Customer Details
  customer_name VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  email VARCHAR(255),
  
  -- Geographic / Dispatch Location (All 47 Kenyan Counties)
  county VARCHAR(100) NOT NULL,
  town VARCHAR(255) NOT NULL,
  address_landmark TEXT,
  
  -- Financial Breakdown (in KSh)
  subtotal NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
  delivery_fee NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
  total NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
  
  -- Payment & M-Pesa Settlement
  payment_method VARCHAR(100) NOT NULL DEFAULT 'M-Pesa STK',
  payment_status VARCHAR(50) NOT NULL DEFAULT 'Pending', -- 'Pending', 'Processing', 'Paid', 'Dispatched', 'Delivered', 'Cancelled'
  mpesa_code VARCHAR(100) DEFAULT 'N/A',
  
  -- Itemized Order Cart JSON
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  item_count INTEGER NOT NULL DEFAULT 0,
  
  -- Dispatch & Agronomist Notes
  notes TEXT,
  order_source VARCHAR(50) NOT NULL DEFAULT 'web',
  
  -- Safaricom Daraja STK Push Tracking
  checkout_request_id VARCHAR(100),
  merchant_request_id VARCHAR(100)
);

-- Real-Time Query Performance Indexes
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_county ON orders(county);
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON orders(payment_status);
CREATE INDEX IF NOT EXISTS idx_orders_phone ON orders(phone);
CREATE INDEX IF NOT EXISTS idx_orders_mpesa_code ON orders(mpesa_code);
CREATE INDEX IF NOT EXISTS idx_orders_checkout_request_id ON orders(checkout_request_id);

-- Auto-update updated_at timestamp trigger
CREATE OR REPLACE FUNCTION update_orders_timestamp()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_update_orders_timestamp ON orders;
CREATE TRIGGER trg_update_orders_timestamp
BEFORE UPDATE ON orders
FOR EACH ROW
EXECUTE FUNCTION update_orders_timestamp();
