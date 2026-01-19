import { useMutation} from "@tanstack/react-query";
import { useApiService } from "@/services/api";
import { toast } from "sonner";

export function useCreateCheckoutSession() {
    const apiService = useApiService();

    return useMutation({
        mutationFn: async (params: { bidId: string, claimId: string }) => {
            const response: any = await apiService.post('/api/payments/create-checkout-session', params);
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