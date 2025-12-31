export interface Auction {
  id: string;
  title: string;
  additionalNotes: string;
  totalJobValue: number;
  bids: any;
  endDate: string;
  status: string;
  number: number; // 1 for Phase 1, 2 for Phase 2
  property_address?: string;
  project_type?: string;
  design_plan?: string;
  reconstructionType?: string;
  aiSummary?: string;
  phase1Bids?: any;
  expandedBidInfo?: any;
  participants?: any;
  claimId?: any;
}

export interface Bid {
  contractor_id: string;
  contractor_name: string;
  bid_amount: number;
  bid_description?: string;
  phone_number?: string;
  email?: string;
  company_name?: string;
  company_website?: string;
  license_number?: string;
  years_experience?: number;
}

export interface BidData {
  amount: number;
  budgetTotal: number;
  subContractorExpenses: number;
  overhead: number;
  laborCosts: number;
  profit: number;
  allowance: number;
}

export interface Phase1Bid {
  bid_amount: number;
  budgetTotal: number;
  laborCosts: number;
  subContractorExpenses: number;
  overhead: number;
  profit: number;
  allowance: number;
}

export interface AuctionHeaderProps {
  auction: Auction;
  bidsCount: number;
  lowestBid?: number;
  isPhase1: boolean;
  isPhase2: boolean;
  onBack: () => void;
}

export interface AIRecommendationDialogProps {
  open: boolean;
  onClose: () => void;
  recommendation: string;
  isLoading: boolean;
  bidCount: number;
}

export interface BiddersToolbarProps {
  bidCount: number;
  selectedCount: number;
  isPhase1: boolean;
  onAskAI: () => void;
  onCreatePhase2: () => void;
  isAskingAI: boolean;
  isCreatingPhase2: boolean;
}

export interface ContractorViewProps {
  auction: Auction;
  isPhase1: boolean;
  isPhase2: boolean;
  // Phase 1 props
  bidData: BidData;
  uploadedFile: File | null;
  onBidDataChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmitBid: (e: React.FormEvent) => void;
  isSubmitting: boolean;
  fileInputRef: React.RefObject<HTMLInputElement>;
  // Phase 2 props
  contractorPhase1Bid: any;
  adjustingBid: boolean;
  adjustedBidData: BidData;
  phase1Bids: Phase1BidRanking[];
  onConfirmBid: () => void;
  onAdjustBid: () => void;
  onSubmitAdjustedBid: () => void;
  onWithdraw: () => void;
  onCancelAdjust: () => void;
  setAdjustedBidData: (data: BidData) => void;
  disableConfirmBid: boolean;
  disableAdjustBid: boolean;
  disableWithdrawBid: boolean;
  disableSubmit: boolean;
}

export interface ProjectOverviewCardProps {
  auction: Auction;
}

export interface BidSubmissionFormProps {
  bidData: BidData;
  uploadedFile: File | null;
  onBidDataChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
  fileInputRef: React.RefObject<HTMLInputElement>;
  onFileClick: () => void;
  onFileRemove: () => void;
  disableSubmit: boolean;
}

export interface Phase2BidActionsProps {
  contractorPhase1Bid: any;
  adjustingBid: boolean;
  adjustedBidData: BidData;
  onConfirmBid: () => void;
  onAdjustBid: () => void;
  onSubmitAdjustedBid: () => void;
  onWithdraw: () => void;
  onCancelAdjust: () => void;
  setAdjustedBidData: (data: BidData) => void;
  disableConfirmBid: boolean;
  disableAdjustBid: boolean;
  disableWithdrawBid: boolean;
}

export interface HomeownerViewProps {
  auction: Auction;
  bids: Bid[];
  bidsLoading: boolean;
  isPhase1: boolean;
  selectedForPhase2: Set<string>;
  onTogglePhase2Selection: (contractorId: string) => void;
  onAcceptBid: (contractorId: string, bidAmount: number) => void;
  onAskAI: () => void;
  onCreatePhase2: () => void;
  isAskingAI: boolean;
  isCreatingPhase2: boolean;
}

export interface AuctionDetailsCardProps {
  auction: Auction;
}

export interface BidsListProps {
  bids: Bid[];
  isLoading: boolean;
  isPhase1: boolean;
  selectedForPhase2: Set<string>;
  onTogglePhase2Selection: (contractorId: string) => void;
  onAcceptBid: (contractorId: string, bidAmount: number) => void;
}

export interface ContractorBidCardProps {
  bid: Bid;
  index: number;
  isPhase1: boolean;
  isSelected: boolean;
  onToggleSelection: () => void;
  onAccept: () => void;
}

export interface Phase1BidRanking {
  amount: number;
  user: {
    email: string;
  };
}

export interface Phase1BidsRankingProps {
  phase1Bids: Phase1BidRanking[];
}
