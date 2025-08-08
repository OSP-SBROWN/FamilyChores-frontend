import { api } from './api';
import * as ChoreService from './chore.service';
import type { 
  ChoreAssignment, 
  ChoreAssignmentCreateDto,
  ChoreAssignmentUpdateDto,
  Chore,
  ChoreAssignmentStatus
} from '../types/chore';
import type { ApiResponse } from '../types/timezone';
import type { Person } from '../types/person';

// Mock data store for assignments
let mockAssignments: ChoreAssignment[] = [];
const completedAssignments: ChoreAssignment[] = [];

// Function to generate assignments for the day
export async function generateDailyAssignments(): Promise<ChoreAssignment[]> {
  try {
    console.log('Generating daily assignments');
    
    // Clear the mock assignments
    mockAssignments = [];
    
    // Get all chores and people
    const chores = await ChoreService.getChores();
    const response = await api.get<ApiResponse<Person[]>>('/people');
    const people = response.data.success ? response.data.data : [];
    
    // For each chore, create an assignment based on the assignment type
    chores.forEach(chore => {
      if (chore.frequency === 'DAILY') {
        if (chore.assignmentType === 'SINGLE' || chore.assignmentType === 'ANY') {
          // Assign to a single person (random for mock)
          if (people.length > 0) {
            const randomPerson = people[Math.floor(Math.random() * people.length)];
            mockAssignments.push({
              id: `assignment-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`,
              choreId: chore.id,
              personId: randomPerson.id,
              assignmentType: chore.assignmentType,
              status: 'PENDING' as ChoreAssignmentStatus,
              dueDate: new Date().toISOString()
            });
          }
        } 
        else if (chore.assignmentType === 'ALL' || chore.assignmentType === 'EVERYONE') {
          // Create a single assignment that will show checkboxes for each person
          mockAssignments.push({
            id: `assignment-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`,
            choreId: chore.id,
            personId: null, // No specific person assigned
            assignmentType: chore.assignmentType,
            status: 'PENDING' as ChoreAssignmentStatus,
            dueDate: new Date().toISOString()
          });
        }
        else if (chore.assignmentType === 'ANYONE') {
          // Create an assignment that any person can complete
          mockAssignments.push({
            id: `assignment-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`,
            choreId: chore.id,
            personId: null, // No specific person assigned
            assignmentType: chore.assignmentType,
            status: 'PENDING' as ChoreAssignmentStatus,
            dueDate: new Date().toISOString()
          });
        }
      }
    });
    
    console.log(`Generated ${mockAssignments.length} daily assignments`);
    return [...mockAssignments];
    
    // When the API endpoint is ready, uncomment the following:
    // const response = await api.post<ApiResponse<ChoreAssignment[]>>('/chores/assignments/generate-daily');
    // return response.data.data;
  } catch (error) {
    console.error('Error generating daily assignments:', error);
    return [];
  }
}

// Function to get pending assignments
export async function getPendingAssignments(): Promise<ChoreAssignment[]> {
  try {
    console.log('Fetching pending assignments');
    
    // If mockAssignments is empty, generate daily assignments
    if (mockAssignments.length === 0) {
      await generateDailyAssignments();
    }
    
    // Return assignments with status PENDING
    return mockAssignments.filter(a => a.status === 'PENDING');
    
    // When the API endpoint is ready, uncomment the following:
    // const response = await api.get<ApiResponse<ChoreAssignment[]>>('/chores/assignments/pending');
    // return response.data.data;
  } catch (error) {
    console.error('Error fetching pending assignments:', error);
    return [];
  }
}

// Function to get completed assignments
export async function getCompletedAssignments(): Promise<ChoreAssignment[]> {
  try {
    console.log('Fetching completed assignments');
    
    // Return assignments with status COMPLETED
    return [...completedAssignments];
    
    // When the API endpoint is ready, uncomment the following:
    // const response = await api.get<ApiResponse<ChoreAssignment[]>>('/chores/assignments/completed');
    // return response.data.data;
  } catch (error) {
    console.error('Error fetching completed assignments:', error);
    return [];
  }
}

// Function to complete an assignment
export async function completeAssignment(assignmentId: string, completedBy: string): Promise<ChoreAssignment> {
  try {
    console.log(`Completing assignment ${assignmentId} by ${completedBy}`);
    
    // Find the assignment
    const assignmentIndex = mockAssignments.findIndex(a => a.id === assignmentId);
    
    if (assignmentIndex === -1) {
      throw new Error(`Assignment with id ${assignmentId} not found`);
    }
    
    // Update the assignment
    const updatedAssignment: ChoreAssignment = {
      ...mockAssignments[assignmentIndex],
      status: 'COMPLETED' as ChoreAssignmentStatus,
      completedAt: new Date().toISOString(),
      completedBy
    };
    
    // Remove from mockAssignments and add to completedAssignments
    mockAssignments.splice(assignmentIndex, 1);
    completedAssignments.push(updatedAssignment);
    
    console.log(`Assignment ${assignmentId} completed successfully`);
    return updatedAssignment;
    
    // When the API endpoint is ready, uncomment the following:
    // const response = await api.put<ApiResponse<ChoreAssignment>>(
    //   `/chores/assignments/${assignmentId}/complete`,
    //   { completedBy }
    // );
    // return response.data.data;
  } catch (error) {
    console.error(`Error completing assignment ${assignmentId}:`, error);
    throw error;
  }
}

// Function to assign a chore to a person
export async function assignChore(choreId: string, personId: string): Promise<ChoreAssignment> {
  try {
    console.log(`Assigning chore ${choreId} to person ${personId}`);
    
    // Create a new assignment
    const newAssignment: ChoreAssignment = {
      id: `assignment-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`,
      choreId,
      personId,
      assignmentType: 'SINGLE' as any,
      status: 'PENDING' as ChoreAssignmentStatus,
      dueDate: new Date().toISOString()
    };
    
    // Add to mockAssignments
    mockAssignments.push(newAssignment);
    
    console.log(`Chore ${choreId} assigned to person ${personId} successfully`);
    return newAssignment;
    
    // When the API endpoint is ready, uncomment the following:
    // const response = await api.post<ApiResponse<ChoreAssignment>>('/chores/assignments', {
    //   choreId,
    //   personId,
    //   assignmentType: 'SINGLE',
    //   dueDate: new Date().toISOString()
    // });
    // return response.data.data;
  } catch (error) {
    console.error(`Error assigning chore ${choreId} to person ${personId}:`, error);
    throw error;
  }
}

// Function to auto-assign chores based on capabilities and workload
export async function autoAssignChores(): Promise<ChoreAssignment[]> {
  try {
    console.log('Auto-assigning chores');
    
    // For mock purposes, we'll just generate new daily assignments
    mockAssignments = [];
    await generateDailyAssignments();
    
    console.log(`Auto-assigned ${mockAssignments.length} chores`);
    return [...mockAssignments];
    
    // When the API endpoint is ready, uncomment the following:
    // const response = await api.post<ApiResponse<ChoreAssignment[]>>('/chores/assignments/auto-assign');
    // return response.data.data;
  } catch (error) {
    console.error('Error auto-assigning chores:', error);
    throw error;
  }
}
