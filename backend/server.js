import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Import API routes - only the ones that exist
import auctionsRoutes from './api/auctions/route.ts';
import bidsRoutes from './api/bids/route.ts';
import claimRoutes from './api/claim/route.ts';
import onboardingRoutes from './api/onboarding/route.ts';
import projectsRoutes from './api/projects/available/route.ts';
import startClaimRoutes from './api/start-claim/fema/route.ts';
import addContractorRoutes from './api/add-contractor/route.ts';
import setupDbRoutes from './api/setup-db/route.ts';

// API Routes
app.use('/api/auctions', auctionsRoutes);
app.use('/api/bids', bidsRoutes);
app.use('/api/claim', claimRoutes);
app.use('/api/onboarding', onboardingRoutes);
app.use('/api/projects', projectsRoutes);
app.use('/api/start-claim', startClaimRoutes);
app.use('/api/add-contractor', addContractorRoutes);
app.use('/api/setup-db', setupDbRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
}); 