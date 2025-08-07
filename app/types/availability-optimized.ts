// Optimized availability types for better performance
export interface DayType {
  id: string;
  name: string;
  display_name: string;
}

export interface AvailabilityRecord {
  person_id: string;
  day_type_id: string;
  timezone_id: string;
  is_available: boolean;
  person_name?: string;
  day_name?: string;
  day_display_name?: string;
  timezone_name?: string;
  timezone_display_name?: string;
  timezone_order?: number;
}

export interface AvailabilityMatrix {
  [personId: string]: {
    [dayTypeId: string]: {
      [timezoneId: string]: boolean;
    };
  };
}

// New optimized format for bulk data transfer
export interface AvailabilityGridData {
  people: Array<{ id: string; name: string }>;
  dayTypes: Array<{ id: string; name: string; display_name: string }>;
  timezones: Array<{ id: string; name: string; display_order: number }>;
  // Compact grid: [personIndex][dayTypeIndex][timezoneIndex] = boolean
  grid: boolean[][][];
}

// Helper functions for converting between formats
export class AvailabilityGridUtils {
  static toMatrix(gridData: AvailabilityGridData): AvailabilityMatrix {
    const matrix: AvailabilityMatrix = {};
    
    gridData.people.forEach((person, personIndex) => {
      matrix[person.id] = {};
      
      gridData.dayTypes.forEach((dayType, dayIndex) => {
        matrix[person.id][dayType.id] = {};
        
        gridData.timezones.forEach((timezone, timezoneIndex) => {
          const isAvailable = gridData.grid[personIndex]?.[dayIndex]?.[timezoneIndex] ?? false;
          matrix[person.id][dayType.id][timezone.id] = isAvailable;
        });
      });
    });
    
    return matrix;
  }

  static fromRecords(
    people: Array<{ id: string; name: string }>,
    dayTypes: Array<{ id: string; name: string; display_name: string }>,
    timezones: Array<{ id: string; name: string; display_order: number }>,
    records: AvailabilityRecord[]
  ): AvailabilityGridData {
    // Create lookup maps for indices
    const personIndexMap = new Map(people.map((p, i) => [p.id, i]));
    const dayTypeIndexMap = new Map(dayTypes.map((d, i) => [d.id, i]));
    const timezoneIndexMap = new Map(timezones.map((t, i) => [t.id, i]));

    // Initialize 3D grid with false
    const grid: boolean[][][] = people.map(() =>
      dayTypes.map(() =>
        timezones.map(() => false)
      )
    );

    // Populate grid from records
    records.forEach(record => {
      const personIndex = personIndexMap.get(record.person_id);
      const dayIndex = dayTypeIndexMap.get(record.day_type_id);
      const timezoneIndex = timezoneIndexMap.get(record.timezone_id);

      if (personIndex !== undefined && dayIndex !== undefined && timezoneIndex !== undefined) {
        grid[personIndex][dayIndex][timezoneIndex] = record.is_available;
      }
    });

    return {
      people,
      dayTypes,
      timezones,
      grid
    };
  }
}
