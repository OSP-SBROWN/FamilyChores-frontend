import type { DayType, AvailabilityRecord } from '../types/availability';

const API_BASE = 'https://familychores-frontend-production.up.railway.app/api';

export class AvailabilityService {
  
  static async getDayTypes(): Promise<DayType[]> {
    const response = await fetch(`${API_BASE}/day-types`);
    if (!response.ok) {
      throw new Error(`Failed to fetch day types: ${response.statusText}`);
    }
    const result = await response.json();
    if (!result.success) {
      throw new Error(result.error || 'Failed to fetch day types');
    }
    return result.data;
  }

  static async getAvailabilityMatrix(): Promise<AvailabilityRecord[]> {
    const response = await fetch(`${API_BASE}/availability/matrix`);
    if (!response.ok) {
      throw new Error(`Failed to fetch availability matrix: ${response.statusText}`);
    }
    const result = await response.json();
    if (!result.success) {
      throw new Error(result.error || 'Failed to fetch availability matrix');
    }
    return result.data;
  }

  static async getPersonAvailability(personId: string): Promise<AvailabilityRecord[]> {
    const response = await fetch(`${API_BASE}/availability/person/${personId}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch person availability: ${response.statusText}`);
    }
    const result = await response.json();
    if (!result.success) {
      throw new Error(result.error || 'Failed to fetch person availability');
    }
    return result.data;
  }

  static async updateAvailability(
    personId: string,
    dayTypeId: string,
    timezoneId: string,
    isAvailable: boolean
  ): Promise<AvailabilityRecord> {
    const response = await fetch(`${API_BASE}/availability`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        person_id: personId,
        day_type_id: dayTypeId,
        timezone_id: timezoneId,
        is_available: isAvailable
      })
    });
    
    if (!response.ok) {
      throw new Error(`Failed to update availability: ${response.statusText}`);
    }
    
    const result = await response.json();
    if (!result.success) {
      throw new Error(result.error || 'Failed to update availability');
    }
    
    return result.data;
  }

  static async bulkUpdateAvailability(
    personId: string,
    availabilities: Array<{
      day_type_id: string;
      timezone_id: string;
      is_available: boolean;
    }>
  ): Promise<void> {
    const response = await fetch(`${API_BASE}/availability/bulk`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        person_id: personId,
        availabilities
      })
    });
    
    if (!response.ok) {
      throw new Error(`Failed to bulk update availability: ${response.statusText}`);
    }
    
    const result = await response.json();
    if (!result.success) {
      throw new Error(result.error || 'Failed to bulk update availability');
    }
  }
}
