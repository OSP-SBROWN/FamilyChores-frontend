import { api } from './api';
import type { Chore, ChoreAssignment, ChoreCreateDto, ChoreUpdateDto, ChoreWithAssignments, ChoreAssignmentCreateDto, ChoreAssignmentUpdateDto } from '../types/chore';
import { ChoreStatus } from '../types/chore';
import type { ApiResponse } from '../types/timezone';

export async function getChores(): Promise<Chore[]> {
  try {
    // Temporary: return an empty array until backend implements the endpoint
    console.log('Fetching chores from API');
    // For now, returning an empty array as the endpoint doesn't exist yet
    return [];
    
    // When the API endpoint is ready, uncomment the following:
    // const response = await api.get<ApiResponse<Chore[]>>('/chores');
    // return response.data.data;
  } catch (error) {
    console.error('Error fetching chores:', error);
    // Return empty array instead of throwing to avoid breaking the UI
    return [];
  }
}

export async function getChore(id: string): Promise<ChoreWithAssignments> {
  try {
    // Temporary mock implementation
    console.log(`Fetching chore with id ${id} (mock)`);
    
    // Mock a chore with assignments
    const mockChore: ChoreWithAssignments = {
      id,
      title: "Mock Chore",
      description: "This is a mock chore until the API endpoint is implemented",
      isTimeSensitive: false,
      assignmentType: "SINGLE" as any,
      status: ChoreStatus.ACTIVE,
      frequency: "ONCE" as any,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isRewardBased: false,
      assignments: []
    };
    
    return mockChore;
    
    // When the API endpoint is ready, uncomment the following:
    // const response = await api.get<ApiResponse<ChoreWithAssignments>>(`/chores/${id}`);
    // return response.data.data;
  } catch (error) {
    console.error(`Error fetching chore with id ${id}:`, error);
    throw error;
  }
}

export async function createChore(chore: ChoreCreateDto): Promise<Chore> {
  try {
    // Temporary: mock a successful response until backend implements the endpoint
    console.log('Creating chore (mock):', chore);
    
    // Generate mock response
    const mockResponse: Chore = {
      id: `mock-${Date.now()}`,
      title: chore.title,
      description: chore.description,
      timezoneId: chore.timezoneId,
      isTimeSensitive: chore.isTimeSensitive,
      assignmentType: chore.assignmentType,
      status: 'ACTIVE' as ChoreStatus,
      frequency: chore.frequency,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isRewardBased: chore.isRewardBased,
      rewardAmount: chore.rewardAmount,
    };
    
    // Add a slight delay to simulate network request
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return mockResponse;
    
    // When the API endpoint is ready, uncomment the following:
    // const response = await api.post<ApiResponse<Chore>>('/chores', chore);
    // return response.data.data;
  } catch (error) {
    console.error('Error creating chore:', error);
    throw error;
  }
}

export async function updateChore(chore: ChoreUpdateDto): Promise<Chore> {
  try {
    // Temporary mock implementation
    console.log(`Updating chore with id ${chore.id} (mock):`, chore);
    
    // Mock updated chore
    const mockUpdatedChore: Chore = {
      id: chore.id,
      title: chore.title || "Updated Chore",
      description: chore.description,
      timezoneId: chore.timezoneId,
      isTimeSensitive: chore.isTimeSensitive ?? false,
      assignmentType: chore.assignmentType || "SINGLE" as any,
      status: chore.status || ChoreStatus.ACTIVE,
      frequency: chore.frequency || "ONCE" as any,
      createdAt: new Date(Date.now() - 86400000).toISOString(), // yesterday
      updatedAt: new Date().toISOString(),
      isRewardBased: chore.isRewardBased ?? false,
      rewardAmount: chore.rewardAmount
    };
    
    // Add a slight delay to simulate network request
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return mockUpdatedChore;
    
    // When the API endpoint is ready, uncomment the following:
    // const response = await api.put<ApiResponse<Chore>>(`/chores/${chore.id}`, chore);
    // return response.data.data;
  } catch (error) {
    console.error(`Error updating chore with id ${chore.id}:`, error);
    throw error;
  }
}

export async function deleteChore(id: string): Promise<void> {
  try {
    // Temporary mock implementation
    console.log(`Deleting chore with id ${id} (mock)`);
    
    // Add a slight delay to simulate network request
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // When the API endpoint is ready, uncomment the following:
    // await api.delete(`/chores/${id}`);
  } catch (error) {
    console.error(`Error deleting chore with id ${id}:`, error);
    throw error;
  }
}

// Assignment related functions
export async function getChoreAssignments(): Promise<ChoreAssignment[]> {
  try {
    // Temporary: return an empty array until backend implements the endpoint
    console.log('Fetching chore assignments from API');
    // For now, returning an empty array as the endpoint doesn't exist yet
    return [];
    
    // When the API endpoint is ready, uncomment the following:
    // const response = await api.get<ApiResponse<ChoreAssignment[]>>('/chores/assignments');
    // return response.data.data;
  } catch (error) {
    console.error('Error fetching chore assignments:', error);
    // Return empty array instead of throwing
    return [];
  }
}

export async function createChoreAssignment(assignment: ChoreAssignmentCreateDto): Promise<ChoreAssignment> {
  try {
    // Temporary mock implementation
    console.log('Creating chore assignment (mock):', assignment);
    
    // Generate mock response
    const mockAssignment: ChoreAssignment = {
      id: `mock-assignment-${Date.now()}`,
      choreId: assignment.choreId,
      personId: assignment.personId,
      assignmentType: assignment.assignmentType,
      status: 'PENDING' as any,
      dueDate: assignment.dueDate
    };
    
    // Add a slight delay to simulate network request
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return mockAssignment;
    
    // When the API endpoint is ready, uncomment the following:
    // const response = await api.post<ApiResponse<ChoreAssignment>>('/chores/assignments', assignment);
    // return response.data.data;
  } catch (error) {
    console.error('Error creating chore assignment:', error);
    throw error;
  }
}

export async function updateChoreAssignment(assignment: ChoreAssignmentUpdateDto): Promise<ChoreAssignment> {
  try {
    // Temporary mock implementation
    console.log(`Updating chore assignment with id ${assignment.id} (mock):`, assignment);
    
    // Generate mock response
    const mockUpdatedAssignment: ChoreAssignment = {
      id: assignment.id,
      choreId: 'mock-chore-id',
      personId: 'mock-person-id',
      assignmentType: 'SINGLE' as any,
      status: assignment.status || 'PENDING' as any,
      completedAt: assignment.completedAt,
      completedBy: assignment.completedBy
    };
    
    // Add a slight delay to simulate network request
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return mockUpdatedAssignment;
    
    // When the API endpoint is ready, uncomment the following:
    // const response = await api.put<ApiResponse<ChoreAssignment>>(`/chores/assignments/${assignment.id}`, assignment);
    // return response.data.data;
  } catch (error) {
    console.error(`Error updating chore assignment with id ${assignment.id}:`, error);
    throw error;
  }
}

export async function deleteChoreAssignment(id: string): Promise<void> {
  try {
    // Temporary mock implementation
    console.log(`Deleting chore assignment with id ${id} (mock)`);
    
    // Add a slight delay to simulate network request
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // When the API endpoint is ready, uncomment the following:
    // await api.delete(`/chores/assignments/${id}`);
  } catch (error) {
    console.error(`Error deleting chore assignment with id ${id}:`, error);
    throw error;
  }
}

// Get chores with their capable persons
export async function getChoresWithCapablePersons(): Promise<Chore[]> {
  try {
    // Temporary mock implementation
    console.log('Fetching chores with capable persons (mock)');
    
    // Return mock data
    const mockChores: Chore[] = [
      {
        id: 'mock-chore-1',
        title: 'Mock Chore 1',
        description: 'This is a mock chore with capable persons',
        isTimeSensitive: false,
        assignmentType: 'SINGLE' as any,
        status: ChoreStatus.ACTIVE,
        frequency: 'ONCE' as any,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isRewardBased: false
      }
    ];
    
    return mockChores;
    
    // When the API endpoint is ready, uncomment the following:
    // const response = await api.get<ApiResponse<Chore[]>>('/chores/with-capable-persons');
    // return response.data.data;
  } catch (error) {
    console.error('Error fetching chores with capable persons:', error);
    throw error;
  }
}
