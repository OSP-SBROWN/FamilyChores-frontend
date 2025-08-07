import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AvailabilityService } from '../services/availability';
import type { DayType, AvailabilityRecord } from '../types/availability';

// Query keys
export const availabilityKeys = {
  all: ['availability'] as const,
  dayTypes: () => [...availabilityKeys.all, 'day-types'] as const,
  matrix: () => [...availabilityKeys.all, 'matrix'] as const,
  person: (personId: string) => [...availabilityKeys.all, 'person', personId] as const,
};

// Day Types hooks
export function useDayTypes() {
  return useQuery({
    queryKey: availabilityKeys.dayTypes(),
    queryFn: AvailabilityService.getDayTypes,
    staleTime: 30 * 60 * 1000, // 30 minutes - day types don't change often
    gcTime: 60 * 60 * 1000, // 1 hour
    refetchOnWindowFocus: false, // Don't refetch on window focus
    refetchOnMount: false, // Don't refetch on mount if data exists
  });
}

// Availability Matrix hooks
export function useAvailabilityMatrix() {
  return useQuery({
    queryKey: availabilityKeys.matrix(),
    queryFn: AvailabilityService.getAvailabilityMatrix,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
}

export function usePersonAvailability(personId: string) {
  return useQuery({
    queryKey: availabilityKeys.person(personId),
    queryFn: () => AvailabilityService.getPersonAvailability(personId),
    enabled: !!personId,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
}

// Availability mutation hooks
export function useUpdateAvailability() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      personId,
      dayTypeId,
      timezoneId,
      isAvailable
    }: {
      personId: string;
      dayTypeId: string;
      timezoneId: string;
      isAvailable: boolean;
    }) => AvailabilityService.updateAvailability(personId, dayTypeId, timezoneId, isAvailable),
    
    onSuccess: (_, variables) => {
      // Invalidate and refetch availability queries
      queryClient.invalidateQueries({ queryKey: availabilityKeys.all });
      
      // Optionally update specific queries optimistically
      queryClient.setQueryData(
        availabilityKeys.person(variables.personId),
        (old: AvailabilityRecord[] | undefined) => {
          if (!old) return old;
          
          return old.map(record => {
            if (record.day_type_id === variables.dayTypeId && 
                record.timezone_id === variables.timezoneId) {
              return { ...record, is_available: variables.isAvailable };
            }
            return record;
          });
        }
      );
      
      // Update matrix query
      queryClient.setQueryData(
        availabilityKeys.matrix(),
        (old: AvailabilityRecord[] | undefined) => {
          if (!old) return old;
          
          return old.map(record => {
            if (record.person_id === variables.personId &&
                record.day_type_id === variables.dayTypeId && 
                record.timezone_id === variables.timezoneId) {
              return { ...record, is_available: variables.isAvailable };
            }
            return record;
          });
        }
      );
    },
    
    onError: (error) => {
      console.error('Failed to update availability:', error);
      // Invalidate queries to refresh from server
      queryClient.invalidateQueries({ queryKey: availabilityKeys.all });
    }
  });
}

export function useBulkUpdateAvailability() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      personId,
      availabilities
    }: {
      personId: string;
      availabilities: Array<{
        day_type_id: string;
        timezone_id: string;
        is_available: boolean;
      }>;
    }) => AvailabilityService.bulkUpdateAvailability(personId, availabilities),
    
    onSuccess: () => {
      // Invalidate all availability queries
      queryClient.invalidateQueries({ queryKey: availabilityKeys.all });
    },
    
    onError: (error) => {
      console.error('Failed to bulk update availability:', error);
      // Invalidate queries to refresh from server
      queryClient.invalidateQueries({ queryKey: availabilityKeys.all });
    }
  });
}
