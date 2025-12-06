import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import cookieParser from 'cookie-parser';
import { createClient } from "@supabase/supabase-js";
import jwt from 'jsonwebtoken';
import { createProxyMiddleware } from "http-proxy-middleware";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const CONTRACTOR_ANALYSIS_URL = 'http://localhost:8001'

const contractorAnalysisProxy = createProxyMiddleware({
  target: CONTRACTOR_ANALYSIS_URL,
  changeOrigin: true,
  timeout: 60000,
  pathRewrite: {
    '^/api/analyze_contractors': '/api/analyze_contractors'
  },
  logLevel: 'debug',
  onProxyReq: (proxyReq, req, res) => {
    console.log('Proxying request to:', proxyReq.path);
  },
  onError: (err, req, res) => {
    console.error('Contractor analysis proxy error:', err.message);
    res.status(500).json({
      error: 'Contractor analysis service unavailable',
      message: 'Please try again later'
    });
  }
});

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: false, // setting to false cuz we are using jwt tokens instead of cookies
}));
app.use(cookieParser());
app.use(express.json());

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
);

const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1]; // get bearer token
    if (!token) {
      return res.status(401).json({ error: "no token provided" });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.SUPABASE_JWT_SECRET)
    } catch (error) {
      return res.status(401).json({ error: "invalid token" });
    }

    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(403).json({ error: "Invalid or expired token" });
    }

    req.user = {
      ...user,
      id: user.id,
      email: user.email,
      role: decoded.role,
      aud: decoded.aud,
      exp: decoded.exp,
      iat: decoded.iat,
    };

    next();
  } catch (error) {
    return res.status(403).json({ error: "invalid token" });
  }
}

import auctionsRoutes from './api/auctions/route.ts';
import bidsRoutes from './api/bids/route.ts';
import claimRoutes from './api/claim/route.ts';
import signUpRoute from './api/signup/route.ts';
import onboardingRoutes from './api/onboarding/route.ts';
import femaRoutes from './api/fema/route.ts';
import setupDbRoutes from './api/setup-db/route.ts';
import imageRoutes from './api/images/route.ts';
import pdfRoutes from './api/pdfs/route.ts';
import ndaRoutes from './api/nda/route.ts';

// API Routes
app.use('/api/signup', signUpRoute);
app.use('/api/auctions', verifyToken, auctionsRoutes);
app.use('/api/bids', verifyToken, bidsRoutes);
app.use('/api/claim', verifyToken, claimRoutes);
app.use('/api/onboarding', onboardingRoutes);
app.use('/api/fema', verifyToken, femaRoutes);
app.use('/api/images', verifyToken, imageRoutes);
app.use('/api/pdfs', verifyToken, pdfRoutes);
app.use('/api/nda', verifyToken, ndaRoutes);
app.use('/api/setup-db', setupDbRoutes);
app.use('/api/analyze_contractors', verifyToken, contractorAnalysisProxy);

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
}); 