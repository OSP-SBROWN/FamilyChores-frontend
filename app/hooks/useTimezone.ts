import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { timezoneService } from '../services/timezone.service';
import type { Timezone, CreateTimezoneDto, UpdateTimezoneDto } from '../types/timezone';

export const TIMEZONE_QUERY_KEY = 'timezones';

export function useTimezones() {
  return useQuery({
    queryKey: [TIMEZONE_QUERY_KEY],
    queryFn: timezoneService.getAll,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useTimezone(id: string) {
  return useQuery({
    queryKey: [TIMEZONE_QUERY_KEY, id],
    queryFn: () => timezoneService.getById(id),
    enabled: !!id,
  });
}

export function useCreateTimezone() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTimezoneDto) => timezoneService.create(data),
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
    mutationFn: ({ id, ...data }: UpdateTimezoneDto) => timezoneService.update(id, data),
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
    mutationFn: (id: string) => timezoneService.delete(id),
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
    mutationFn: (timezones: Pick<Timezone, 'id' | 'order'>[]) => 
      timezoneService.updateOrder(timezones),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TIMEZONE_QUERY_KEY] });
    },
    onError: (error) => {
      console.error('Error updating timezone order:', error);
    },
  });
}
