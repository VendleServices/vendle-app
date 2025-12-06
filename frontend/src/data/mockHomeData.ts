// Export interfaces for use in other files
export interface HomeownerProject {
  id: string;
  claimId: string;
  title: string;
  address: string;
  city: string;
  state: string;
  projectType: string;
  contractValue: number;
  status: 'active' | 'completed' | 'pending';
  startDate: string;
  expectedCompletion: string;
  progress: number;
  contractorName: string;
  contractorCompany?: string;
  milestonesCompleted: number;
  totalMilestones: number;
}

export interface Job {
  id: string;
  contractId: string;
  title: string;
  address: string;
  city: string;
  state: string;
  projectType: string;
  contractValue: number;
  status: 'active' | 'completed' | 'on-hold';
  startDate: string;
  expectedCompletion: string;
  progress: number;
  milestonesCompleted: number;
  totalMilestones: number;
  homeownerName: string;
  homeownerPhone?: string;
  description?: string;
  imageUrl?: string;
  files?: Array<{
    id: string;
    name: string;
    url: string;
    type: 'pdf' | 'image' | 'document';
  }>;
}

export const getMockHomeownerProjects = (): HomeownerProject[] => {
  return [
    {
      id: "project-1",
      claimId: "claim-1",
      title: "Water Restoration",
      address: "123 Oak Street",
      city: "Austin",
      state: "TX",
      projectType: "Water Damage",
      contractValue: 18500,
      status: "active",
      startDate: "2025-01-20",
      expectedCompletion: "2025-03-15",
      progress: 45,
      contractorName: "John Smith",
      contractorCompany: "Smith Restoration Co.",
      milestonesCompleted: 1,
      totalMilestones: 3
    },
    {
      id: "project-2",
      claimId: "claim-2",
      title: "Fire Damage Restoration",
      address: "456 Pine Avenue",
      city: "Houston",
      state: "TX",
      projectType: "Fire Damage",
      contractValue: 32000,
      status: "active",
      startDate: "2025-01-15",
      expectedCompletion: "2025-04-10",
      progress: 25,
      contractorName: "Maria Garcia",
      contractorCompany: "Garcia Builders",
      milestonesCompleted: 1,
      totalMilestones: 3
    },
    {
      id: "project-3",
      claimId: "claim-3",
      title: "Storm Damage Repair",
      address: "789 Elm Drive",
      city: "Dallas",
      state: "TX",
      projectType: "Storm Damage",
      contractValue: 12500,
      status: "pending",
      startDate: "2025-02-01",
      expectedCompletion: "2025-03-20",
      progress: 0,
      contractorName: "Robert Williams",
      contractorCompany: "Williams Contracting",
      milestonesCompleted: 0,
      totalMilestones: 3
    }
  ];
};

export const getMockJobs = (): Job[] => {
  return [
    {
      id: "job-1",
      contractId: "contract-1",
      title: "Water Damage Restoration",
      address: "123 Oak Street",
      city: "Austin",
      state: "TX",
      projectType: "Water Damage",
      contractValue: 18500,
      status: "active",
      startDate: "2025-01-20",
      expectedCompletion: "2025-03-15",
      progress: 45,
      milestonesCompleted: 1,
      totalMilestones: 3,
      homeownerName: "John Smith",
      homeownerPhone: "(555) 123-4567",
      description: "Extensive water damage from burst pipe affecting kitchen and basement. Need immediate restoration work including drywall repair, flooring replacement, and mold remediation.",
      imageUrl: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800",
      files: [
        { id: "file-1", name: "Contract_Agreement.pdf", url: "/files/contract.pdf", type: "pdf" },
        { id: "file-2", name: "Insurance_Estimate.pdf", url: "/files/estimate.pdf", type: "pdf" },
        { id: "file-3", name: "Damage_Photos.jpg", url: "/files/photos.jpg", type: "image" },
        { id: "file-4", name: "Design_Plan.pdf", url: "/files/design.pdf", type: "pdf" },
        { id: "file-5", name: "Inspection_Report.pdf", url: "/files/inspection.pdf", type: "pdf" }
      ]
    },
    {
      id: "job-2",
      contractId: "contract-2",
      title: "Fire Damage Restoration",
      address: "456 Pine Avenue",
      city: "Houston",
      state: "TX",
      projectType: "Fire Damage",
      contractValue: 32000,
      status: "active",
      startDate: "2025-01-15",
      expectedCompletion: "2025-04-10",
      progress: 25,
      milestonesCompleted: 1,
      totalMilestones: 3,
      homeownerName: "Maria Garcia",
      homeownerPhone: "(555) 234-5678",
      description: "Fire damage restoration needed for living room and attic area. Includes smoke damage cleanup, structural repairs, and complete interior restoration.",
      imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800",
      files: [
        { id: "file-6", name: "Contract_Agreement.pdf", url: "/files/contract2.pdf", type: "pdf" },
        { id: "file-7", name: "Fire_Report.pdf", url: "/files/fire-report.pdf", type: "pdf" },
        { id: "file-8", name: "Before_Photos.jpg", url: "/files/before.jpg", type: "image" }
      ]
    },
    {
      id: "job-3",
      contractId: "contract-3",
      title: "Storm Damage Repair",
      address: "789 Elm Drive",
      city: "Dallas",
      state: "TX",
      projectType: "Storm Damage",
      contractValue: 12500,
      status: "active",
      startDate: "2025-02-01",
      expectedCompletion: "2025-03-20",
      progress: 10,
      milestonesCompleted: 0,
      totalMilestones: 3,
      homeownerName: "Robert Williams",
      homeownerPhone: "(555) 345-6789",
      description: "Complete roof replacement needed after severe storm damage. Includes removal of old shingles, inspection of roof deck, and installation of new roofing system.",
      imageUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800",
      files: [
        { id: "file-9", name: "Contract_Agreement.pdf", url: "/files/contract3.pdf", type: "pdf" },
        { id: "file-10", name: "Roof_Assessment.pdf", url: "/files/roof-assessment.pdf", type: "pdf" }
      ]
    }
  ];
};

export interface PendingNDA {
  id: string;
  projectTitle: string;
  address: string;
  homeownerName: string;
  requestedDate: string;
  status: string;
}

export interface PhaseProject {
  id: string;
  title: string;
  address: string;
  city: string;
  state: string;
  contractValue: number;
  phase1StartDate?: string;
  phase1EndDate?: string;
  phase2StartDate?: string;
  phase2EndDate?: string;
  status: string;
  projectType: string;
  homeownerName: string;
  homeownerPhone?: string;
  description?: string;
  adjustmentPdf?: {
    name: string;
    url: string;
  };
  imageUrls?: string[];
  files?: Array<{
    id: string;
    name: string;
    url: string;
    type: 'pdf' | 'image' | 'document';
  }>;
  // Phase 2 specific
  competingBids?: Array<{
    contractorName: string;
    contractorId: string;
    bidAmount: number;
    isCurrentContractor: boolean;
  }>;
}

export const getMockPendingNDAs = (): PendingNDA[] => {
  return [
    {
      id: 'nda-1',
      projectTitle: 'Water Damage Restoration',
      address: '123 Main St, San Francisco, CA',
      homeownerName: 'John Doe',
      requestedDate: '2024-01-15',
      status: 'pending'
    },
    {
      id: 'nda-2',
      projectTitle: 'Fire Damage Repair',
      address: '456 Oak Ave, Los Angeles, CA',
      homeownerName: 'Jane Smith',
      requestedDate: '2024-01-16',
      status: 'pending'
    }
  ];
};

export const getMockPhase1Projects = (): PhaseProject[] => {
  return [
    {
      id: 'phase1-1',
      title: 'Kitchen Remodel',
      address: '789 Pine St',
      city: 'San Diego',
      state: 'CA',
      contractValue: 45000,
      phase1StartDate: '2024-01-20',
      phase1EndDate: '2024-02-15',
      status: 'active',
      projectType: 'Kitchen Remodel',
      homeownerName: 'Sarah Johnson',
      homeownerPhone: '(555) 987-6543',
      description: 'Complete kitchen renovation including new cabinets, countertops, and appliances.',
      adjustmentPdf: {
        name: 'Insurance_Adjustment_Report.pdf',
        url: '/files/adjustment-phase1.pdf'
      },
      imageUrls: [
        'https://images.unsplash.com/photo-1556912172-45b7abe8b7e4?w=800',
        'https://images.unsplash.com/photo-1556912173-67134e8692a3?w=800'
      ],
      files: [
        { id: 'file-phase1-1', name: 'Project_Plan.pdf', url: '/files/project-plan.pdf', type: 'pdf' },
        { id: 'file-phase1-2', name: 'Material_List.pdf', url: '/files/material-list.pdf', type: 'pdf' }
      ]
    }
  ];
};

export const getMockPhase2Projects = (): PhaseProject[] => {
  return [
    {
      id: 'phase2-1',
      title: 'Bathroom Renovation',
      address: '321 Elm St',
      city: 'San Jose',
      state: 'CA',
      contractValue: 35000,
      phase2StartDate: '2024-02-08',
      phase2EndDate: '2024-02-22',
      status: 'active',
      projectType: 'Bathroom Renovation',
      homeownerName: 'Michael Chen',
      homeownerPhone: '(555) 876-5432',
      description: 'Full bathroom renovation with modern fixtures and tile work.',
      adjustmentPdf: {
        name: 'Insurance_Adjustment_Report.pdf',
        url: '/files/adjustment-phase2.pdf'
      },
      imageUrls: [
        'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800',
        'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800'
      ],
      files: [
        { id: 'file-phase2-1', name: 'Bid_Comparison.pdf', url: '/files/bid-comparison.pdf', type: 'pdf' },
        { id: 'file-phase2-2', name: 'Contract_Terms.pdf', url: '/files/contract-terms.pdf', type: 'pdf' }
      ],
      competingBids: [
        { contractorName: 'ABC Contractors', contractorId: 'contractor-1', bidAmount: 32000, isCurrentContractor: false },
        { contractorName: 'XYZ Builders', contractorId: 'contractor-2', bidAmount: 35000, isCurrentContractor: true },
        { contractorName: 'Premier Renovations', contractorId: 'contractor-3', bidAmount: 38000, isCurrentContractor: false },
        { contractorName: 'Elite Construction', contractorId: 'contractor-4', bidAmount: 34000, isCurrentContractor: false },
        { contractorName: 'Quality Builders', contractorId: 'contractor-5', bidAmount: 36000, isCurrentContractor: false }
      ]
    }
  ];
};

