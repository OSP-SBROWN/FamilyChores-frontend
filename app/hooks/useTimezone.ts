import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { TimezoneService } from '../services/timezones';
import type { Timezone, CreateTimezoneDto, UpdateTimezoneDto } from '../types/timezone';

export const TIMEZONE_QUERY_KEY = 'timezones';

export function useTimezones() {
  return useQuery({
    queryKey: [TIMEZONE_QUERY_KEY],
    queryFn: TimezoneService.getAll,
    staleTime: 5 * 60 * 1000, // 5 minutes - timezones don't change often
    gcTime: 30 * 60 * 1000, // 30 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
}

export function useTimezone(id: string) {
  return useQuery({
    queryKey: [TIMEZONE_QUERY_KEY, id],
    queryFn: () => TimezoneService.getById(id),
    enabled: !!id,
  });
}

export function useCreateTimezone() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTimezoneDto) => TimezoneService.create(data),
    onSuccess: () => {
      // More aggressive cache invalidation
      queryClient.invalidateQueries({ queryKey: [TIMEZONE_QUERY_KEY] });
      queryClient.refetchQueries({ queryKey: [TIMEZONE_QUERY_KEY] });
    },
    onError: (error) => {
      console.error('Error creating timezone:', error);
    },
  });
}

export function useUpdateTimezone() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...data }: { id: string } & UpdateTimezoneDto) => TimezoneService.update(id, data),
    onSuccess: () => {
      // More aggressive cache invalidation
      queryClient.invalidateQueries({ queryKey: [TIMEZONE_QUERY_KEY] });
      queryClient.refetchQueries({ queryKey: [TIMEZONE_QUERY_KEY] });
    },
    onError: (error) => {
      console.error('Error updating timezone:', error);
    },
  });
}

export function useDeleteTimezone() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      console.log('Deleting timezone with ID:', id);
      const result = await TimezoneService.delete(id);
      console.log('Delete result:', result);
      return result;
    },
    onSuccess: (_, deletedId) => {
      console.log('Successfully deleted timezone:', deletedId);
      
      // Remove from cache immediately for optimistic update
      queryClient.setQueryData([TIMEZONE_QUERY_KEY], (old: Timezone[] | undefined) => {
        if (!old) return old;
        return old.filter(timezone => timezone.id !== deletedId);
      });
      
      // Also invalidate and refetch to ensure consistency
      queryClient.invalidateQueries({ queryKey: [TIMEZONE_QUERY_KEY] });
      queryClient.refetchQueries({ queryKey: [TIMEZONE_QUERY_KEY] });
    },
    onError: (error) => {
      console.error('Error deleting timezone:', error);
      // Refetch to ensure UI is in sync with server
      queryClient.refetchQueries({ queryKey: [TIMEZONE_QUERY_KEY] });
    },
  });
}

export function useUpdateTimezoneOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (timezones: Pick<Timezone, 'id' | 'display_order'>[]) => 
      TimezoneService.updateOrder(timezones),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TIMEZONE_QUERY_KEY] });
      queryClient.refetchQueries({ queryKey: [TIMEZONE_QUERY_KEY] });
    },
    onError: (error) => {
      console.error('Error updating timezone order:', error);
    },
  });
}
