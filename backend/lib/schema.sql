-- Create users table
CREATE TABLE IF NOT EXISTS users (
    user_id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    user_type VARCHAR(20) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create contractors table
CREATE TABLE IF NOT EXISTS contractors (
    contractor_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
    company_name VARCHAR(255),
    rating DECIMAL(3,2) DEFAULT 0,
    review_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id)
);

-- Create auctions table with enhanced restoration workflow fields
CREATE TABLE IF NOT EXISTS auctions (
    auction_id SERIAL PRIMARY KEY,
    claim_id VARCHAR(255),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    starting_bid DECIMAL(10,2) NOT NULL,
    current_bid DECIMAL(10,2),
    bid_count INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'open',
    auction_end_date TIMESTAMP WITH TIME ZONE NOT NULL,
    
    -- Insurance and Financial Details
    total_job_value DECIMAL(10,2),
    overhead_and_profit DECIMAL(10,2),
    cost_basis VARCHAR(10), -- 'RCV' or 'ACV'
    materials DECIMAL(10,2),
    sales_taxes DECIMAL(10,2),
    depreciation DECIMAL(10,2),
    
    -- Restoration Details
    reconstruction_type VARCHAR(255),
    needs_3rd_party_adjuster BOOLEAN DEFAULT FALSE,
    has_deductible_funds BOOLEAN DEFAULT FALSE,
    funding_source VARCHAR(50), -- 'FEMA', 'Insurance', 'SBA'
    
    -- Legacy fields for backward compatibility
    scope_of_work JSONB,
    photos JSONB,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create bids table
CREATE TABLE IF NOT EXISTS bids (
    bid_id SERIAL PRIMARY KEY,
    auction_id INTEGER REFERENCES auctions(auction_id) ON DELETE CASCADE,
    contractor_id INTEGER,
    amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'active',
    contractor_name VARCHAR(255),
    bidder_rating DECIMAL(3,2),
    bidder_reviews INTEGER,
    bidder_email VARCHAR(255),
    bidder_phone VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_auctions_claim_id ON auctions(claim_id);
CREATE INDEX IF NOT EXISTS idx_auctions_status ON auctions(status);
CREATE INDEX IF NOT EXISTS idx_auctions_end_date ON auctions(auction_end_date);
CREATE INDEX IF NOT EXISTS idx_bids_auction_id ON bids(auction_id);
CREATE INDEX IF NOT EXISTS idx_bids_contractor_id ON bids(contractor_id); 