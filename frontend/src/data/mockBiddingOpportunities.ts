export interface BiddingOpportunity {
  id: string;
  title: string;
  projectType: string;
  address: string;
  city: string;
  state: string;
  images: string[];
  insuranceAdjustmentPdf?: {
    name: string;
    url: string;
  };
  ioiPhase?: {
    startDate: string;
    endDate: string;
    submittedDate?: string;
    status?: 'pending' | 'submitted' | 'accepted' | 'rejected';
    initialBid?: number;
  };
  loiPhase?: {
    startDate: string;
    endDate: string;
    submittedDate?: string;
    status?: 'pending' | 'submitted' | 'accepted' | 'rejected';
    contractValue?: number;
  };
  // Additional details for expanded view
  contractValue?: number;
  homeownerName?: string;
  homeownerPhone?: string;
  description?: string;
  files?: Array<{
    id: string;
    name: string;
    url: string;
    type: 'pdf' | 'image' | 'document';
  }>;
}

export const mockSavedOpportunities: BiddingOpportunity[] = [
  {
    id: "opp-1",
    title: "Water Damage Restoration",
    projectType: "Water Damage",
    address: "123 Oak Street",
    city: "Austin",
    state: "TX",
    images: [
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800",
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800"
    ],
    insuranceAdjustmentPdf: {
      name: "Insurance_Adjustment_Report.pdf",
      url: "/files/insurance-adjustment.pdf"
    },
    ioiPhase: {
      startDate: "2025-01-15",
      endDate: "2025-01-25"
    },
    loiPhase: {
      startDate: "2025-01-26",
      endDate: "2025-02-05"
    }
  },
  {
    id: "opp-2",
    title: "Fire Damage Restoration",
    projectType: "Fire Damage",
    address: "456 Pine Avenue",
    city: "Houston",
    state: "TX",
    images: [
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800",
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800"
    ],
    insuranceAdjustmentPdf: {
      name: "Fire_Damage_Assessment.pdf",
      url: "/files/fire-assessment.pdf"
    },
    ioiPhase: {
      startDate: "2025-01-20",
      endDate: "2025-01-30"
    },
    loiPhase: {
      startDate: "2025-01-31",
      endDate: "2025-02-10"
    }
  }
];

export const mockIoiOpportunities: BiddingOpportunity[] = [
  {
    id: "ioi-1",
    title: "Storm Damage Repair",
    projectType: "Storm Damage",
    address: "789 Elm Drive",
    city: "Dallas",
    state: "TX",
    images: [
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800",
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800"
    ],
    insuranceAdjustmentPdf: {
      name: "Storm_Damage_Report.pdf",
      url: "/files/storm-report.pdf"
    },
    ioiPhase: {
      startDate: "2025-01-15",
      endDate: "2025-01-25",
      submittedDate: "2025-01-18",
      status: "submitted",
      initialBid: 15000
    },
    loiPhase: {
      startDate: "2025-01-26",
      endDate: "2025-02-05"
    }
  }
];

export const mockLoiOpportunities: BiddingOpportunity[] = [
  {
    id: "loi-1",
    title: "Roof Replacement Project",
    projectType: "Storm Damage",
    address: "321 Maple Street",
    city: "San Antonio",
    state: "TX",
    images: [
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800"
    ],
    insuranceAdjustmentPdf: {
      name: "Roof_Assessment.pdf",
      url: "/files/roof-assessment.pdf"
    },
    ioiPhase: {
      startDate: "2025-01-10",
      endDate: "2025-01-20",
      submittedDate: "2025-01-12",
      status: "accepted",
      initialBid: 12000
    },
    loiPhase: {
      startDate: "2025-01-21",
      endDate: "2025-01-31",
      submittedDate: "2025-01-23",
      status: "submitted",
      contractValue: 12500
    }
  }
];

