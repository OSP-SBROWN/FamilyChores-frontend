import { api } from './api';
import type { Chore, ChoreAssignment, ChoreCreateDto, ChoreUpdateDto, ChoreWithAssignments, ChoreAssignmentCreateDto, ChoreAssignmentUpdateDto } from '../types/chore';
import type { ApiResponse } from '../types/api';

export async function getChores(): Promise<Chore[]> {
  try {
    const response = await api.get<ApiResponse<Chore[]>>('/chores');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching chores:', error);
    throw error;
  }
}

export async function getChore(id: string): Promise<ChoreWithAssignments> {
  try {
    const response = await api.get<ApiResponse<ChoreWithAssignments>>(`/chores/${id}`);
    return response.data.data;
  } catch (error) {
    console.error(`Error fetching chore with id ${id}:`, error);
    throw error;
  }
}

export async function createChore(chore: ChoreCreateDto): Promise<Chore> {
  try {
    const response = await api.post<ApiResponse<Chore>>('/chores', chore);
    return response.data.data;
  } catch (error) {
    console.error('Error creating chore:', error);
    throw error;
  }
}

export async function updateChore(chore: ChoreUpdateDto): Promise<Chore> {
  try {
    const response = await api.put<ApiResponse<Chore>>(`/chores/${chore.id}`, chore);
    return response.data.data;
  } catch (error) {
    console.error(`Error updating chore with id ${chore.id}:`, error);
    throw error;
  }
}

export async function deleteChore(id: string): Promise<void> {
  try {
    await api.delete(`/chores/${id}`);
  } catch (error) {
    console.error(`Error deleting chore with id ${id}:`, error);
    throw error;
  }
}

// Assignment related functions
export async function getChoreAssignments(): Promise<ChoreAssignment[]> {
  try {
    const response = await api.get<ApiResponse<ChoreAssignment[]>>('/chores/assignments');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching chore assignments:', error);
    throw error;
  }
}

export async function createChoreAssignment(assignment: ChoreAssignmentCreateDto): Promise<ChoreAssignment> {
  try {
    const response = await api.post<ApiResponse<ChoreAssignment>>('/chores/assignments', assignment);
    return response.data.data;
  } catch (error) {
    console.error('Error creating chore assignment:', error);
    throw error;
  }
}

export async function updateChoreAssignment(assignment: ChoreAssignmentUpdateDto): Promise<ChoreAssignment> {
  try {
    const response = await api.put<ApiResponse<ChoreAssignment>>(`/chores/assignments/${assignment.id}`, assignment);
    return response.data.data;
  } catch (error) {
    console.error(`Error updating chore assignment with id ${assignment.id}:`, error);
    throw error;
  }
}

export async function deleteChoreAssignment(id: string): Promise<void> {
  try {
    await api.delete(`/chores/assignments/${id}`);
  } catch (error) {
    console.error(`Error deleting chore assignment with id ${id}:`, error);
    throw error;
  }
}

// Get chores with their capable persons
export async function getChoresWithCapablePersons(): Promise<Chore[]> {
  try {
    const response = await api.get<ApiResponse<Chore[]>>('/chores/with-capable-persons');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching chores with capable persons:', error);
    throw error;
  }
}
