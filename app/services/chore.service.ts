import { api } from './api';
import type { Chore, ChoreAssignment, ChoreCreateDto, ChoreUpdateDto, ChoreWithAssignments, ChoreAssignmentCreateDto, ChoreAssignmentUpdateDto } from '../types/chore';
import { ChoreStatus } from '../types/chore';
import type { ApiResponse } from '../types/timezone';

// In-memory store for mock data (until the API is implemented)
const mockChoresStore: Chore[] = [
  // Morning Tasks
  {
    id: 'morning-1',
    title: 'Kids Showers',
    description: 'As necessary',
    isTimeSensitive: true,
    assignmentType: 'ALL' as any,
    status: ChoreStatus.ACTIVE,
    frequency: 'DAILY' as any,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isRewardBased: false,
    category: 'Morning Tasks'
  },
  {
    id: 'morning-2',
    title: 'Get dressed',
    description: '',
    isTimeSensitive: true,
    assignmentType: 'EVERYONE' as any,
    status: ChoreStatus.ACTIVE,
    frequency: 'DAILY' as any,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isRewardBased: false,
    category: 'Morning Tasks'
  },
  {
    id: 'morning-3',
    title: 'Unload Dishwasher',
    description: '',
    isTimeSensitive: false,
    assignmentType: 'SINGLE' as any,
    status: ChoreStatus.ACTIVE,
    frequency: 'DAILY' as any,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isRewardBased: false,
    category: 'Morning Tasks'
  },
  {
    id: 'morning-4',
    title: 'Prepare breakfast',
    description: '',
    isTimeSensitive: true,
    assignmentType: 'SINGLE' as any,
    status: ChoreStatus.ACTIVE,
    frequency: 'DAILY' as any,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isRewardBased: false,
    category: 'Morning Tasks'
  },
  {
    id: 'morning-5',
    title: 'Clear and set table for breakfast',
    description: '',
    isTimeSensitive: true,
    assignmentType: 'SINGLE' as any,
    status: ChoreStatus.ACTIVE,
    frequency: 'DAILY' as any,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isRewardBased: false,
    category: 'Morning Tasks'
  },
  {
    id: 'morning-6',
    title: 'Florence dressed',
    description: '',
    isTimeSensitive: true,
    assignmentType: 'SINGLE' as any,
    status: ChoreStatus.ACTIVE,
    frequency: 'DAILY' as any,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isRewardBased: false,
    category: 'Morning Tasks'
  },
  {
    id: 'morning-7',
    title: 'Clear Table (not water cups)',
    description: '',
    isTimeSensitive: false,
    assignmentType: 'SINGLE' as any,
    status: ChoreStatus.ACTIVE,
    frequency: 'DAILY' as any,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isRewardBased: false,
    category: 'Morning Tasks'
  },
  {
    id: 'morning-8',
    title: 'Wipe Table, Highchair and Mat',
    description: '',
    isTimeSensitive: false,
    assignmentType: 'SINGLE' as any,
    status: ChoreStatus.ACTIVE,
    frequency: 'DAILY' as any,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isRewardBased: false,
    category: 'Morning Tasks'
  },
  {
    id: 'morning-9',
    title: 'Sweep Floor/Vacuum',
    description: '',
    isTimeSensitive: false,
    assignmentType: 'SINGLE' as any,
    status: ChoreStatus.ACTIVE,
    frequency: 'DAILY' as any,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isRewardBased: false,
    category: 'Morning Tasks'
  },
  
  // Lunch Tasks
  {
    id: 'lunch-1',
    title: 'Prepare lunch',
    description: '',
    isTimeSensitive: true,
    assignmentType: 'SINGLE' as any,
    status: ChoreStatus.ACTIVE,
    frequency: 'DAILY' as any,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isRewardBased: false,
    category: 'Lunch Tasks'
  },
  {
    id: 'lunch-2',
    title: 'Clear and set table for lunch',
    description: '',
    isTimeSensitive: true,
    assignmentType: 'SINGLE' as any,
    status: ChoreStatus.ACTIVE,
    frequency: 'DAILY' as any,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isRewardBased: false,
    category: 'Lunch Tasks'
  },
  {
    id: 'lunch-3',
    title: 'Clear Table (not water cups)',
    description: '',
    isTimeSensitive: false,
    assignmentType: 'SINGLE' as any,
    status: ChoreStatus.ACTIVE,
    frequency: 'DAILY' as any,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isRewardBased: false,
    category: 'Lunch Tasks'
  },
  {
    id: 'lunch-4',
    title: 'Wipe Table, Highchair and Mat',
    description: '',
    isTimeSensitive: false,
    assignmentType: 'SINGLE' as any,
    status: ChoreStatus.ACTIVE,
    frequency: 'DAILY' as any,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isRewardBased: false,
    category: 'Lunch Tasks'
  },
  
  // Afternoon tasks
  {
    id: 'afternoon-1',
    title: 'Prepare Afternoon snack',
    description: '',
    isTimeSensitive: true,
    assignmentType: 'SINGLE' as any,
    status: ChoreStatus.ACTIVE,
    frequency: 'DAILY' as any,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isRewardBased: false,
    category: 'Afternoon Tasks'
  },
  {
    id: 'afternoon-2',
    title: 'Bring laundry in, fold and put away',
    description: '',
    isTimeSensitive: false,
    assignmentType: 'SINGLE' as any,
    status: ChoreStatus.ACTIVE,
    frequency: 'DAILY' as any,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isRewardBased: false,
    category: 'Afternoon Tasks'
  },
  {
    id: 'afternoon-3',
    title: 'Unload dishwasher',
    description: '',
    isTimeSensitive: false,
    assignmentType: 'SINGLE' as any,
    status: ChoreStatus.ACTIVE,
    frequency: 'DAILY' as any,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isRewardBased: false,
    category: 'Afternoon Tasks'
  },
  {
    id: 'afternoon-4',
    title: 'Prepare dinner',
    description: '',
    isTimeSensitive: true,
    assignmentType: 'SINGLE' as any,
    status: ChoreStatus.ACTIVE,
    frequency: 'DAILY' as any,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isRewardBased: false,
    category: 'Afternoon Tasks'
  },
  
  // After Dinner
  {
    id: 'evening-1',
    title: 'Clear and set table for dinner',
    description: '',
    isTimeSensitive: true,
    assignmentType: 'SINGLE' as any,
    status: ChoreStatus.ACTIVE,
    frequency: 'DAILY' as any,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isRewardBased: false,
    category: 'After Dinner'
  },
  {
    id: 'evening-2',
    title: 'Clear Table Inc Water Cups',
    description: '',
    isTimeSensitive: false,
    assignmentType: 'SINGLE' as any,
    status: ChoreStatus.ACTIVE,
    frequency: 'DAILY' as any,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isRewardBased: false,
    category: 'After Dinner'
  },
  {
    id: 'evening-3',
    title: 'Bath Florence',
    description: '',
    isTimeSensitive: true,
    assignmentType: 'SINGLE' as any,
    status: ChoreStatus.ACTIVE,
    frequency: 'DAILY' as any,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isRewardBased: false,
    category: 'After Dinner'
  },
  {
    id: 'evening-4',
    title: 'Tidy living room',
    description: '',
    isTimeSensitive: false,
    assignmentType: 'EVERYONE' as any,
    status: ChoreStatus.ACTIVE,
    frequency: 'DAILY' as any,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isRewardBased: false,
    category: 'After Dinner'
  },
  {
    id: 'evening-5',
    title: 'Kids Teeth & Face wash',
    description: '',
    isTimeSensitive: true,
    assignmentType: 'ALL' as any,
    status: ChoreStatus.ACTIVE,
    frequency: 'DAILY' as any,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isRewardBased: false,
    category: 'After Dinner'
  },
  
  // Miscellaneous Tasks
  {
    id: 'misc-1',
    title: 'Hang up towels in bathroom',
    description: '',
    isTimeSensitive: false,
    assignmentType: 'ANYONE' as any,
    status: ChoreStatus.ACTIVE,
    frequency: 'DAILY' as any,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isRewardBased: false,
    category: 'Miscellaneous Tasks'
  },
  {
    id: 'misc-2',
    title: 'Rinse shower',
    description: '',
    isTimeSensitive: false,
    assignmentType: 'ANYONE' as any,
    status: ChoreStatus.ACTIVE,
    frequency: 'DAILY' as any,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isRewardBased: false,
    category: 'Miscellaneous Tasks'
  },
  {
    id: 'misc-3',
    title: 'Vaccuum downstairs (upstairs as needed)',
    description: '',
    isTimeSensitive: false,
    assignmentType: 'SINGLE' as any,
    status: ChoreStatus.ACTIVE,
    frequency: 'WEEKLY' as any,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isRewardBased: false,
    category: 'Miscellaneous Tasks'
  },
  {
    id: 'misc-4',
    title: 'Tidy and sweep yard',
    description: '',
    isTimeSensitive: false,
    assignmentType: 'SINGLE' as any,
    status: ChoreStatus.ACTIVE,
    frequency: 'WEEKLY' as any,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isRewardBased: false,
    category: 'Miscellaneous Tasks'
  }
];

export async function getChores(): Promise<Chore[]> {
  try {
    // Temporary: return mock data from our in-memory store until backend implements the endpoint
    console.log('Fetching chores from API');
    
    // Return a copy of the mockChoresStore to avoid direct manipulation
    return [...mockChoresStore];
    
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
    
    // Add the new chore to our mock store
    mockChoresStore.push(mockResponse);
    console.log('Updated mock chores store:', mockChoresStore);
    
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
    
    // Remove the chore from our mock store
    const index = mockChoresStore.findIndex(chore => chore.id === id);
    if (index !== -1) {
      mockChoresStore.splice(index, 1);
      console.log('Chore removed from mock store');
    }
    
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

// Import chores from Chores.md file
export async function importChoresFromMD(): Promise<Chore[]> {
  try {
    console.log('Importing chores from Chores.md');
    
    // The chore categories and their tasks from Chores.md
    const choreCategories = {
      'Morning Tasks': [
        'Kids Showers (as necessary)',
        'Get dressed',
        'Unload Dishwasher',
        'Prepare breakfast',
        'Clear and set table for breakfast',
        'Florence dressed',
        'Clear Table (not water cups)',
        'Wipe Table, Highchair and Mat',
        'Sweep Floor/Vacuum',
        'Scrape plates',
        'Dishes into Dishwasher & Turn on Dishwasher',
        'Handwash remaining items',
        'Put away ingredients and leftovers from meal',
        'Clean Kitchen surfaces, stove and sink',
        'Dry clothes in dryer',
        'Hang other clothes to dry'
      ],
      'Lunch Tasks': [
        'Prepare lunch',
        'Clear and set table for lunch',
        'Clear Table (not water cups)',
        'Wipe Table, Highchair and Mat',
        'Sweep Floor/Vacuum',
        'Scrape plates',
        'Dishes into Dishwasher & Turn on Dishwasher',
        'Handwash remaining items',
        'Put away ingredients and leftovers from meal',
        'Clean Kitchen surfaces, stove and sink'
      ],
      'Afternoon Tasks': [
        'Prepare Afternoon snack',
        'Clear and set table for snack',
        'Clear Table (not water cups)',
        'Wipe Table, Highchair and Mat',
        'Sweep Floor/Vacuum',
        'Scrape plates',
        'Dishes into Dishwasher',
        'Bring laundry in, fold and put away',
        'Unload dishwasher',
        'Prepare dinner'
      ],
      'After Dinner': [
        'Clear and set table for dinner',
        'Clear Table Inc Water Cups',
        'Wipe Table, Highchair and Mat',
        'Sweep Floor/Vacuum',
        'Scrape plates',
        'Dishes into Dishwasher & Turn on Dishwasher',
        'Handwash remaining items',
        'Put away ingredients and leftovers from meal',
        'Clean Kitchen surfaces, stove and sink',
        'Bath Florence',
        'Tidy living room',
        'Dress for Bed',
        'Kids Teeth & Face wash',
        'Kids Showers (as necessary)',
        'Kids clothes on landing',
        'Empty bins (as needed)',
        'Sort dirty laundry',
        'Iron clothes (as needed)',
        'Put laundry on to wash',
        'Set porridge for next day',
        'Make sandwiches for Lunch',
        'Check Meal Plan for Dinner time'
      ],
      'Miscellaneous Tasks': [
        'Hang up towels in bathroom',
        'Rinse shower',
        'Vaccuum downstairs (upstairs as needed)',
        'Tidy and sweep yard'
      ]
    };
    
    // Clear the existing mock chores store
    mockChoresStore.length = 0;
    
    // Create chores from the categories
    Object.entries(choreCategories).forEach(([category, tasks]) => {
      tasks.forEach(task => {
        const now = new Date();
        const id = `mock-${category.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        
        // Default values
        let isTimeSensitive = false;
        let frequency = 'DAILY' as any;
        
        // Set time sensitivity based on the task
        if (task.toLowerCase().includes('breakfast') || 
            task.toLowerCase().includes('lunch') || 
            task.toLowerCase().includes('dinner') || 
            task.toLowerCase().includes('snack') || 
            task.toLowerCase().includes('bath') ||
            task.toLowerCase().includes('dressed') ||
            task.toLowerCase().includes('teeth')) {
          isTimeSensitive = true;
        }
        
        // Set frequency based on the task
        if (task.toLowerCase().includes('as needed') || 
            task.toLowerCase().includes('as necessary') || 
            task.toLowerCase().includes('vacuum downstairs') || 
            task.toLowerCase().includes('tidy and sweep yard')) {
          frequency = 'WEEKLY' as any;
        }
        
        const chore: Chore = {
          id,
          title: task,
          description: '',
          isTimeSensitive,
          assignmentType: 'ANY' as any,  // Default to ANY
          status: ChoreStatus.ACTIVE,
          frequency,     
          createdAt: now.toISOString(),
          updatedAt: now.toISOString(),
          isRewardBased: false,
          category
        };
        
        mockChoresStore.push(chore);
      });
    });
    
    console.log(`Imported ${mockChoresStore.length} chores from Chores.md`);
    return [...mockChoresStore];
  } catch (error) {
    console.error('Error importing chores from Chores.md:', error);
    throw error;
  }
}
