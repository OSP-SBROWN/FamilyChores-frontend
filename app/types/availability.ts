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
