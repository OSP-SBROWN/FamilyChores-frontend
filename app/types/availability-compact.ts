// Optimized availability types - only store unavailable combinations
export interface UnavailableSlot {
  person_id: string;
  day_type_id: string;
  timezone_id: string;
}

// Compact response from API
export interface AvailabilityCompactResponse {
  people: Array<{ id: string; name: string; }>;
  day_types: Array<{ id: string; name: string; display_name: string; }>;
  timezones: Array<{ id: string; name: string; display_order: number; }>;
  unavailable_slots: UnavailableSlot[];
}

// Local state for the availability matrix
export interface AvailabilityMatrix {
  [personId: string]: {
    [dayTypeId: string]: {
      [timezoneId: string]: boolean; // true = available, false = not available
    };
  };
}

// For updates - only send changed unavailable slots
export interface AvailabilityUpdate {
  person_id: string;
  unavailable_slots: Array<{
    day_type_id: string;
    timezone_id: string;
  }>;
}
