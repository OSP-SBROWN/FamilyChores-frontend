export interface CompactAvailabilityResponse {
  success: boolean;
  people: string[];
  days: string[];
  timezones: string[];
  unavailable: number[][];
}

export interface ExpandedAvailabilityRecord {
  personIndex: number;
  dayIndex: number;
  timezoneIndex: number;
  personName: string;
  dayName: string;
  timezoneName: string;
  isAvailable: boolean;
}

export interface AvailabilityMatrix {
  people: string[];
  days: string[];
  timezones: string[];
  matrix: Map<string, boolean>; // key: "personIndex:dayIndex:timezoneIndex", value: isAvailable
}

export class CompactAvailabilityService {
  private static readonly BASE_URL = 'https://familychores-frontend-production.up.railway.app/api/availability-compact';

  /**
   * Fetch compact availability data (only unavailable combinations)
   * This reduces data transfer by ~98% compared to the full matrix
   */
  static async fetchCompactMatrix(): Promise<CompactAvailabilityResponse> {
    try {
      const response = await fetch(`${this.BASE_URL}/matrix`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch compact availability matrix');
      }

      return data;
    } catch (error) {
      console.error('Error fetching compact availability matrix:', error);
      throw error;
    }
  }

  /**
   * Expand compact data into a full availability matrix
   * Assumes all combinations are available except those in the unavailable array
   */
  static expandCompactMatrix(compactData: CompactAvailabilityResponse): AvailabilityMatrix {
    const { people, days, timezones, unavailable } = compactData;
    const matrix = new Map<string, boolean>();

    // Initialize all combinations as available (true)
    for (let personIndex = 0; personIndex < people.length; personIndex++) {
      for (let dayIndex = 0; dayIndex < days.length; dayIndex++) {
        for (let timezoneIndex = 0; timezones.length > timezoneIndex; timezoneIndex++) {
          const key = `${personIndex}:${dayIndex}:${timezoneIndex}`;
          matrix.set(key, true);
        }
      }
    }

    // Mark unavailable combinations as false
    unavailable.forEach(([personIndex, dayIndex, timezoneIndex]) => {
      const key = `${personIndex}:${dayIndex}:${timezoneIndex}`;
      matrix.set(key, false);
    });

    return {
      people,
      days,
      timezones,
      matrix
    };
  }

  /**
   * Get availability status for a specific combination
   */
  static getAvailability(
    matrix: AvailabilityMatrix,
    personIndex: number,
    dayIndex: number,
    timezoneIndex: number
  ): boolean {
    const key = `${personIndex}:${dayIndex}:${timezoneIndex}`;
    return matrix.matrix.get(key) ?? true; // Default to available if not found
  }

  /**
   * Convert expanded matrix back to compact format for saving
   * This extracts only the unavailable combinations
   */
  static compressMatrix(matrix: AvailabilityMatrix): number[][] {
    const unavailable: number[][] = [];

    for (let personIndex = 0; personIndex < matrix.people.length; personIndex++) {
      for (let dayIndex = 0; dayIndex < matrix.days.length; dayIndex++) {
        for (let timezoneIndex = 0; timezoneIndex < matrix.timezones.length; timezoneIndex++) {
          const isAvailable = this.getAvailability(matrix, personIndex, dayIndex, timezoneIndex);
          if (!isAvailable) {
            unavailable.push([personIndex, dayIndex, timezoneIndex]);
          }
        }
      }
    }

    return unavailable;
  }

  /**
   * Get all availability records in expanded format for compatibility with existing code
   */
  static getAllRecords(matrix: AvailabilityMatrix): ExpandedAvailabilityRecord[] {
    const records: ExpandedAvailabilityRecord[] = [];

    for (let personIndex = 0; personIndex < matrix.people.length; personIndex++) {
      for (let dayIndex = 0; dayIndex < matrix.days.length; dayIndex++) {
        for (let timezoneIndex = 0; timezoneIndex < matrix.timezones.length; timezoneIndex++) {
          const isAvailable = this.getAvailability(matrix, personIndex, dayIndex, timezoneIndex);
          
          records.push({
            personIndex,
            dayIndex,
            timezoneIndex,
            personName: matrix.people[personIndex],
            dayName: matrix.days[dayIndex],
            timezoneName: matrix.timezones[timezoneIndex],
            isAvailable
          });
        }
      }
    }

    return records;
  }
}
