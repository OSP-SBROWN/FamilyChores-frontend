import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { TimezoneService } from '../services/timezones';
import type { Timezone, CreateTimezoneDto, UpdateTimezoneDto } from '../types/timezone';

export const TIMEZONE_QUERY_KEY = 'timezones';

export function useTimezones() {
  return useQuery({
    queryKey: [TIMEZONE_QUERY_KEY],
    queryFn: TimezoneService.getAll,
    staleTime: 5 * 60 * 1000, // 5 minutes
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
      queryClient.invalidateQueries({ queryKey: [TIMEZONE_QUERY_KEY] });
    },
    onError: (error) => {
      console.error('Error creating timezone:', error);
    },
  });
}

export function useUpdateTimezone() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...data }: UpdateTimezoneDto) => TimezoneService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TIMEZONE_QUERY_KEY] });
    },
    onError: (error) => {
      console.error('Error updating timezone:', error);
    },
  });
}

export function useDeleteTimezone() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => TimezoneService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TIMEZONE_QUERY_KEY] });
    },
    onError: (error) => {
      console.error('Error deleting timezone:', error);
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
    },
    onError: (error) => {
      console.error('Error updating timezone order:', error);
    },
  });
}
