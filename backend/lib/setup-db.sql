-- Create auctions table
CREATE TABLE IF NOT EXISTS auctions (
    auction_id SERIAL PRIMARY KEY,
    claim_id INTEGER NOT NULL REFERENCES claims(claim_id),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    starting_bid DECIMAL(10,2) NOT NULL,
    current_bid DECIMAL(10,2) DEFAULT 0,
    bid_count INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'open' CHECK (status IN ('open', 'closed', 'awarded')),
    auction_end_date TIMESTAMP NOT NULL,
    scope_debris_removal BOOLEAN DEFAULT false,
    scope_toxic_material_cleanup BOOLEAN DEFAULT false,
    scope_hazard_mitigation BOOLEAN DEFAULT false,
    photos TEXT[], -- Array to store photo file paths
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    winning_contractor_id INTEGER REFERENCES users(user_id),
    winning_bid_amount DECIMAL(10,2)
);

-- Create bids table to track all bids
CREATE TABLE IF NOT EXISTS bids (
    bid_id SERIAL PRIMARY KEY,
    auction_id INTEGER NOT NULL REFERENCES auctions(auction_id),
    contractor_id INTEGER NOT NULL REFERENCES users(user_id),
    amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'withdrawn', 'awarded')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index on auction_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_auctions_claim_id ON auctions(claim_id);
CREATE INDEX IF NOT EXISTS idx_auctions_status ON auctions(status);
CREATE INDEX IF NOT EXISTS idx_bids_auction_id ON bids(auction_id);
CREATE INDEX IF NOT EXISTS idx_bids_contractor_id ON bids(contractor_id);

-- Add trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_auctions_updated_at
    BEFORE UPDATE ON auctions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bids_updated_at
    BEFORE UPDATE ON bids
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 

-- Migration script to add restoration workflow fields to auctions table
-- Run this to update existing database

-- Add new columns to auctions table
ALTER TABLE auctions ADD COLUMN IF NOT EXISTS claim_id VARCHAR(255);
ALTER TABLE auctions ADD COLUMN IF NOT EXISTS total_job_value DECIMAL(10,2);
ALTER TABLE auctions ADD COLUMN IF NOT EXISTS overhead_and_profit DECIMAL(10,2);
ALTER TABLE auctions ADD COLUMN IF NOT EXISTS cost_basis VARCHAR(10);
ALTER TABLE auctions ADD COLUMN IF NOT EXISTS materials DECIMAL(10,2);
ALTER TABLE auctions ADD COLUMN IF NOT EXISTS sales_taxes DECIMAL(10,2);
ALTER TABLE auctions ADD COLUMN IF NOT EXISTS depreciation DECIMAL(10,2);
ALTER TABLE auctions ADD COLUMN IF NOT EXISTS reconstruction_type VARCHAR(255);
ALTER TABLE auctions ADD COLUMN IF NOT EXISTS needs_3rd_party_adjuster BOOLEAN DEFAULT FALSE;
ALTER TABLE auctions ADD COLUMN IF NOT EXISTS has_deductible_funds BOOLEAN DEFAULT FALSE;
ALTER TABLE auctions ADD COLUMN IF NOT EXISTS funding_source VARCHAR(50);
ALTER TABLE auctions ADD COLUMN IF NOT EXISTS scope_of_work JSONB;
ALTER TABLE auctions ADD COLUMN IF NOT EXISTS photos JSONB;

-- Rename end_date to auction_end_date if it exists
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'auctions' AND column_name = 'end_date') THEN
        ALTER TABLE auctions RENAME COLUMN end_date TO auction_end_date;
    END IF;
END $$;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_auctions_claim_id ON auctions(claim_id);
CREATE INDEX IF NOT EXISTS idx_auctions_status ON auctions(status);
CREATE INDEX IF NOT EXISTS idx_auctions_end_date ON auctions(auction_end_date);
CREATE INDEX IF NOT EXISTS idx_bids_auction_id ON bids(auction_id);
CREATE INDEX IF NOT EXISTS idx_bids_contractor_id ON bids(contractor_id);

-- Update any existing records to have default values
UPDATE auctions SET 
    needs_3rd_party_adjuster = FALSE,
    has_deductible_funds = FALSE
WHERE needs_3rd_party_adjuster IS NULL OR has_deductible_funds IS NULL; 