import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PersonService } from '../services/people';
import type { Person, CreatePersonDto, UpdatePersonDto } from '../types/person';

const PERSON_QUERY_KEY = 'people';

export function usePeople() {
  return useQuery({
    queryKey: [PERSON_QUERY_KEY],
    queryFn: PersonService.getAllPeople,
    staleTime: 5 * 60 * 1000, // 5 minutes - people don't change often
    gcTime: 30 * 60 * 1000, // 30 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
}

export function useCreatePerson() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (personData: CreatePersonDto) => 
      PersonService.createPerson(personData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PERSON_QUERY_KEY] });
      queryClient.refetchQueries({ queryKey: [PERSON_QUERY_KEY] });
    },
    onError: (error) => {
      console.error('Error creating person:', error);
    },
  });
}

export function useUpdatePerson() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (personData: UpdatePersonDto) => 
      PersonService.updatePerson(personData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PERSON_QUERY_KEY] });
      queryClient.refetchQueries({ queryKey: [PERSON_QUERY_KEY] });
    },
    onError: (error) => {
      console.error('Error updating person:', error);
    },
  });
}

export function useDeletePerson() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => PersonService.deletePerson(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PERSON_QUERY_KEY] });
      queryClient.refetchQueries({ queryKey: [PERSON_QUERY_KEY] });
    },
    onError: (error) => {
      console.error('Error deleting person:', error);
    },
  });
}
