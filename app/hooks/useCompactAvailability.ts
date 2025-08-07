import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CompactAvailabilityService } from '../services/availability-compact';
import type { AvailabilityCompactResponse, AvailabilityMatrix, AvailabilityUpdate } from '../types/availability-compact';

// Query keys for compact availability
export const compactAvailabilityKeys = {
  all: ['availability-compact'] as const,
  data: () => [...compactAvailabilityKeys.all, 'data'] as const,
};

// Hook to load all availability data in compact format
export function useCompactAvailability() {
  return useQuery({
    queryKey: compactAvailabilityKeys.data(),
    queryFn: CompactAvailabilityService.getCompactData,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
}

// Hook to get availability matrix (computed from compact data)
export function useAvailabilityMatrix() {
  const { data: compactData, ...rest } = useCompactAvailability();
  
  const matrix = compactData 
    ? CompactAvailabilityService.buildAvailabilityMatrix(compactData)
    : undefined;

  return {
    data: matrix,
    compactData,
    ...rest
  };
}

// Hook to update person availability (sends only unavailable slots)
export function useUpdatePersonAvailability() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (update: AvailabilityUpdate) => 
      CompactAvailabilityService.updatePersonAvailability(update),
    
    onSuccess: (_, variables) => {
      // Optimistically update the cache
      queryClient.setQueryData(
        compactAvailabilityKeys.data(),
        (old: AvailabilityCompactResponse | undefined) => {
          if (!old) return old;

          // Remove old unavailable slots for this person
          const filteredSlots = old.unavailable_slots.filter(
            slot => slot.person_id !== variables.person_id
          );

          // Add new unavailable slots
          const newSlots = variables.unavailable_slots.map(slot => ({
            person_id: variables.person_id,
            day_type_id: slot.day_type_id,
            timezone_id: slot.timezone_id
          }));

          return {
            ...old,
            unavailable_slots: [...filteredSlots, ...newSlots]
          };
        }
      );
    },
    
    onError: (error) => {
      console.error('Failed to update availability:', error);
      // Invalidate on error to refetch fresh data
      queryClient.invalidateQueries({ queryKey: compactAvailabilityKeys.all });
    }
  });
}

// Preload availability data (call this when entering people page)
export function usePreloadAvailability() {
  const queryClient = useQueryClient();

  return () => {
    queryClient.prefetchQuery({
      queryKey: compactAvailabilityKeys.data(),
      queryFn: CompactAvailabilityService.getCompactData,
      staleTime: 5 * 60 * 1000,
    });
  };
}
