import type { AvailabilityCompactResponse, AvailabilityUpdate, AvailabilityMatrix } from '../types/availability-compact';

const API_BASE = 'https://familychores-frontend-production.up.railway.app/api';

export class CompactAvailabilityService {
  
  // Get all availability data in compact format (only unavailable slots)
  static async getCompactData(): Promise<AvailabilityCompactResponse> {
    const response = await fetch(`${API_BASE}/availability/compact`);
    if (!response.ok) {
      throw new Error(`Failed to fetch compact availability: ${response.statusText}`);
    }
    const result = await response.json();
    if (!result.success) {
      throw new Error(result.error || 'Failed to fetch compact availability');
    }
    return result.data;
  }

  // Convert compact data to matrix format (default available, mark unavailable)
  static buildAvailabilityMatrix(compactData: AvailabilityCompactResponse): AvailabilityMatrix {
    const matrix: AvailabilityMatrix = {};

    // Initialize all people/day/timezone combinations as available (true)
    compactData.people.forEach(person => {
      matrix[person.id] = {};
      compactData.day_types.forEach(dayType => {
        matrix[person.id][dayType.id] = {};
        compactData.timezones.forEach(timezone => {
          matrix[person.id][dayType.id][timezone.id] = true; // Default: available
        });
      });
    });

    // Mark unavailable slots as false
    compactData.unavailable_slots.forEach(slot => {
      if (matrix[slot.person_id] && 
          matrix[slot.person_id][slot.day_type_id] && 
          matrix[slot.person_id][slot.day_type_id][slot.timezone_id] !== undefined) {
        matrix[slot.person_id][slot.day_type_id][slot.timezone_id] = false;
      }
    });

    return matrix;
  }

  // Extract unavailable slots from matrix for API update
  static extractUnavailableSlots(
    personId: string, 
    matrix: AvailabilityMatrix,
    dayTypes: string[],
    timezones: string[]
  ): { day_type_id: string; timezone_id: string; }[] {
    const unavailableSlots = [];

    for (const dayTypeId of dayTypes) {
      for (const timezoneId of timezones) {
        if (matrix[personId]?.[dayTypeId]?.[timezoneId] === false) {
          unavailableSlots.push({
            day_type_id: dayTypeId,
            timezone_id: timezoneId
          });
        }
      }
    }

    return unavailableSlots;
  }

  // Update person's availability (send only unavailable slots)
  static async updatePersonAvailability(update: AvailabilityUpdate): Promise<void> {
    const response = await fetch(`${API_BASE}/availability/compact`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(update)
    });
    
    if (!response.ok) {
      throw new Error(`Failed to update availability: ${response.statusText}`);
    }
    
    const result = await response.json();
    if (!result.success) {
      throw new Error(result.error || 'Failed to update availability');
    }
  }
}
