// Shared type definitions for home page components
import { HomeownerProject, Job, PendingNDA, PhaseProject } from "@/data/mockHomeData";

// Re-export types from mockHomeData for convenience
export type { HomeownerProject, Job, PendingNDA, PhaseProject };

// Chat message type
export interface ChatMessage {
  id: string;
  sender: 'contractor' | 'homeowner';
  message: string;
  timestamp: Date;
  attachments?: Array<{
    name: string;
    url: string;
    type: string;
  }>;
}

// Contractor stats type
export interface ContractorStats {
  phase1Value: number;
  phase1Count: number;
  phase2Value: number;
  phase2Count: number;
  activeContracts: number;
  activeValue: number;
}

// User type (from auth context)
export interface User {
  id: string;
  email?: string;
  user_metadata?: {
    userType?: 'contractor' | 'homeowner';
    firstName?: string;
    lastName?: string;
    name?: string;
  };
}

// Tab types
export type ContractorTab = 'pending-ndas' | 'phase-1' | 'phase-2' | 'my-jobs';
export type HomeownerTab = 'pre-launch' | 'phase-1' | 'phase-2' | 'active-rebuild';
export type ScheduleTab = 'upcoming' | 'deadlines' | 'visits' | 'milestones';
