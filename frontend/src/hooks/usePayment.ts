import { useMutation, useQuery } from "@tanstack/react-query";
import { useApiService } from "@/services/api";
import { toast } from "sonner";

export type MilestoneStage = "DOWN_PAYMENT" | "STAGE_1" | "STAGE_2" | "FINAL_STAGE" | "RETAINAGE";

interface CreateCheckoutParams {
    bidId: string;
    claimId: string;
    milestoneStage?: MilestoneStage;
}

interface PaymentBreakdown {
    baseAmount: number;
    serviceFee: number;
    allInTotal: number;
    breakdown: {
        stage: string;
        label: string;
        percentage: number;
        amount: number;
        order: number;
    }[];
    currentStage: MilestoneStage;
    paidStages: MilestoneStage[];
}

export function useCreateCheckoutSession() {
    const apiService = useApiService();

    return useMutation({
        mutationFn: async (params: CreateCheckoutParams) => {
            const response: any = await apiService.post('/api/payments/create-checkout-session', {
                ...params,
                milestoneStage: params.milestoneStage || "DOWN_PAYMENT"
            });
            return response;
        },
        onSuccess: (data: any) => {
            if (data?.checkoutUrl) {
                window.location.href = data.checkoutUrl;
            } else {
                toast.error('Could not create checkout session. Please try again.');
            }
        },
        onError: () => {
            toast.error("Failed to start checkout");
        }
    });
}

export function usePaymentBreakdown(bidId: string | null) {
    const apiService = useApiService();

    return useQuery({
        queryKey: ['paymentBreakdown', bidId],
        queryFn: async () => {
            if (!bidId) return null;
            const response: any = await apiService.get(`/api/payments/breakdown/${bidId}`);
            return response as PaymentBreakdown;
        },
        enabled: !!bidId
    });
}

export function useProjectMilestones(projectId: string | null) {
    const apiService = useApiService();

    return useQuery({
        queryKey: ['projectMilestones', projectId],
        queryFn: async () => {
            if (!projectId) return null;
            const response: any = await apiService.get(`/api/payments/milestones/${projectId}`);
            return response;
        },
        enabled: !!projectId
    });
}