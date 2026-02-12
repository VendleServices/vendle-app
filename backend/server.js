import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import cookieParser from 'cookie-parser';
import { createClient } from "@supabase/supabase-js";
import jwt from 'jsonwebtoken';
import { createProxyMiddleware } from "http-proxy-middleware";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

console.log('Starting server...');
console.log('REDIS_URL:', process.env.REDIS_URL ? 'Set' : 'Not set');
console.log('SUPABASE_URL:', process.env.SUPABASE_URL ? 'Set' : 'Not set');

const app = express();
const PORT = process.env.PORT || 3001;
const CONTRACTOR_ANALYSIS_URL = 'http://localhost:8001'

// const contractorAnalysisProxy = createProxyMiddleware({
//   target: CONTRACTOR_ANALYSIS_URL,
//   changeOrigin: true,
//   timeout: 60000,
//   pathRewrite: {
//     '^/api/analyze_contractors': '/api/analyze_contractors'
//   },
//   logLevel: 'debug',
//   onProxyReq: (proxyReq, req, res) => {
//     console.log('Proxying request to:', proxyReq.path);
//   },
//   onError: (err, req, res) => {
//     console.error('Contractor analysis proxy error:', err.message);
//     res.status(500).json({
//       error: 'Contractor analysis service unavailable',
//       message: 'Please try again later'
//     });
//   }
// });

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: false, // setting to false cuz we are using jwt tokens instead of cookies
}));
app.use(cookieParser());

app.use(
    '/api/webhooks/stripe',
    express.raw({ type: 'application/json' }),
    (req, res, next) => {
      req.rawBody = req.body;
      req.body = JSON.parse(req.body.toString());
      next();
    }
);

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

import bidsRoutes from './api/bids/route.ts';
import claimRoutes from './api/claim/route.ts';
import signUpRoute from './api/signup/route.ts';
import femaRoutes from './api/fema/route.ts';
import imageRoutes from './api/images/route.ts';
import pdfRoutes from './api/pdfs/route.ts';
import auctionRoutes from './api/auction/route.ts';
import claimParticipantRoutes from './api/claimParticipants/route.ts';
import claimInvitationRoutes from './api/claimInvitations/route.ts';
import projectRoutes from './api/project/route.ts';
import contractorRoutes from './api/contractor/route.ts';
import analyzeContractorRoutes from './api/analyzeContractors/route.ts';
import chatRoutes from './api/chat/route.ts';
import bookingRoutes from './api/booking/route.ts';
import webhookRoutes from './api/webhooks/route.ts';
import paymentRoutes from './api/payments/route.ts';
import { generalApiLimiter, authLimiter, userLimiter } from "./lib/rateLimiters.js";
// API Routes
app.use('/api/signup', authLimiter, signUpRoute);
app.use('/api/bids', verifyToken, generalApiLimiter, bidsRoutes);
app.use('/api/claim', verifyToken, userLimiter, claimRoutes);
app.use('/api/fema', verifyToken, generalApiLimiter, femaRoutes);
app.use('/api/images', verifyToken, generalApiLimiter, imageRoutes);
app.use('/api/pdfs', verifyToken, generalApiLimiter, pdfRoutes);
app.use('/api/auction', verifyToken, userLimiter, auctionRoutes);
app.use('/api/claimParticipants', verifyToken, userLimiter, claimParticipantRoutes);
app.use('/api/claimInvitations', verifyToken, userLimiter, claimInvitationRoutes);
app.use('/api/project', verifyToken, generalApiLimiter, projectRoutes);
app.use("/api/contractor", verifyToken, userLimiter, contractorRoutes);
app.use('/api/analyzeContractors', verifyToken, generalApiLimiter, analyzeContractorRoutes);
app.use('/api/chat', verifyToken, generalApiLimiter, chatRoutes);
app.use('/api/booking', verifyToken, generalApiLimiter, bookingRoutes);
app.use('/api/webhooks', webhookRoutes);
app.use('/api/payments', verifyToken, paymentRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Backend server running on port ${PORT}`);
  console.log(`📊 Health check: /api/health`);
}); 