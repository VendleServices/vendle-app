import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useApiService } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

// Types
export interface Availability {
  id: string;
  homeownerId: string;
  dayOfWeek: number; // 1 = Monday, 2 = Tuesday, ..., 7 = Sunday
  startTime: string;
  endTime: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Meeting {
  id: string;
  bookingToken: string;
  calendlyEventUri?: string;
  calendlyInviteeUri?: string;
  startTime?: string;
  endTime?: string;
  status?: string;
  createdAt?: string;
}

export interface StartBookingParams {
  contractorId: string;
  homeownerId: string;
}

export interface CreateAvailabilityParams {
  dayOfWeek: number; // 1 = Monday, 2 = Tuesday, ..., 7 = Sunday
  startTime: string;
  endTime: string;
}

export interface UpdateAvailabilityParams {
  id: string;
  dayOfWeek?: number;
  startTime?: string;
  endTime?: string;
}

// Hook to start a booking and get Calendly URL
export function useStartBooking() {
  const apiService = useApiService();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: StartBookingParams) => {
      console.log('Starting booking with params:', params);
      const response: any = await apiService.post('/api/booking/start', params);
      console.log('Booking response:', response);
      return response;
    },
    onSuccess: (data) => {
      console.log('Booking success, data:', data);
      // Open Calendly URL in new tab
      if (data?.calendlyUrl) {
        window.open(data.calendlyUrl, '_blank');
      } else {
        console.error('No calendlyUrl in response:', data);
        toast.error('Error', {
          description: 'Could not get scheduling link. Please try again.',
        });
      }
      queryClient.invalidateQueries({ queryKey: ['getMeetings'] });
    },
    onError: (error: any) => {
      console.error('Booking error:', error);
      const errorMessage = error?.message || 'Failed to start booking. Please try again.';

      // Check for specific error messages
      if (errorMessage.includes('No availability found')) {
        toast.error('Homeowner Has No Availability', {
          description: 'The homeowner has not set their availability yet. Please try again later.',
        });
      } else {
        toast.error('Error Starting Booking', {
          description: errorMessage,
        });
      }
    },
  });
}

// Hook to get meeting by booking token
export function useGetMeeting(bookingToken: string | null) {
  const apiService = useApiService();
  const { user } = useAuth();

  return useQuery({
    queryKey: ['getMeeting', bookingToken],
    queryFn: async () => {
      if (!bookingToken) return null;
      const response: any = await apiService.get(`/api/booking/meetings/${bookingToken}`);
      return response?.meeting as Meeting;
    },
    enabled: !!user?.id && !!bookingToken,
  });
}

// Hook to get current user's availability (for homeowners)
export function useGetAvailability() {
  const apiService = useApiService();
  const { user } = useAuth();

  return useQuery({
    queryKey: ['getAvailability'],
    queryFn: async () => {
      const response: any = await apiService.get('/api/booking/availability');
      return (response?.availability || []) as Availability[];
    },
    enabled: !!user?.id,
  });
}

// Hook to get a specific homeowner's availability (for contractors viewing a claim)
export function useGetHomeownerAvailability(homeownerId: string | null) {
  const apiService = useApiService();
  const { user } = useAuth();

  return useQuery({
    queryKey: ['getHomeownerAvailability', homeownerId],
    queryFn: async () => {
      if (!homeownerId) return [];
      const response: any = await apiService.get(`/api/booking/availability/${homeownerId}`);
      return (response?.availability || []) as Availability[];
    },
    enabled: !!user?.id && !!homeownerId,
  });
}

// Hook to create availability
export function useCreateAvailability() {
  const apiService = useApiService();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: CreateAvailabilityParams) => {
      const response: any = await apiService.post('/api/booking/availability', params);
      return response?.homeownerAvailability;
    },
    onSuccess: () => {
      toast.success('Availability Added', {
        description: 'Your availability has been saved.',
      });
      queryClient.invalidateQueries({ queryKey: ['getAvailability'] });
    },
    onError: (error: any) => {
      toast.error('Error Adding Availability', {
        description: error?.message || 'Failed to add availability. Please try again.',
      });
    },
  });
}

// Hook to update availability
export function useUpdateAvailability() {
  const apiService = useApiService();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...params }: UpdateAvailabilityParams) => {
      const response: any = await apiService.put(`/api/booking/availability/${id}`, params);
      return response?.updatedAvailability;
    },
    onSuccess: () => {
      toast.success('Availability Updated', {
        description: 'Your availability has been updated.',
      });
      queryClient.invalidateQueries({ queryKey: ['getAvailability'] });
    },
    onError: (error: any) => {
      toast.error('Error Updating Availability', {
        description: error?.message || 'Failed to update availability. Please try again.',
      });
    },
  });
}

// Hook to delete availability
export function useDeleteAvailability() {
  const apiService = useApiService();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await apiService.delete(`/api/booking/availability/${id}`);
      return id;
    },
    onSuccess: () => {
      toast.success('Availability Removed', {
        description: 'Your availability has been removed.',
      });
      queryClient.invalidateQueries({ queryKey: ['getAvailability'] });
    },
    onError: (error: any) => {
      toast.error('Error Removing Availability', {
        description: error?.message || 'Failed to remove availability. Please try again.',
      });
    },
  });
}