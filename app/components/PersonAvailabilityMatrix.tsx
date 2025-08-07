import React, { useState, useMemo, useEffect } from 'react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Check, X, Loader2, Save } from 'lucide-react';
import { useDayTypes, usePersonAvailability, useBulkUpdateAvailability } from '../hooks/useAvailability';
import { useTimezones } from '../hooks/useTimezone';
import type { AvailabilityRecord } from '../types/availability';

interface PersonAvailabilityMatrixProps {
  personId: string;
  personName: string;
}

interface AvailabilityState {
  [dayTypeId: string]: {
    [timezoneId: string]: boolean;
  };
}

export function PersonAvailabilityMatrix({ personId, personName }: PersonAvailabilityMatrixProps) {
  const [localAvailability, setLocalAvailability] = useState<AvailabilityState>({});
  const [hasChanges, setHasChanges] = useState(false);

  const { data: dayTypes, isLoading: dayTypesLoading } = useDayTypes();
  const { data: timezones, isLoading: timezonesLoading } = useTimezones();
  const { data: availabilityData, isLoading: availabilityLoading } = usePersonAvailability(personId);
  const bulkUpdateMutation = useBulkUpdateAvailability();

  // Filter to only weekdays for cleaner interface
  const weekdayTypes = useMemo(() => {
    if (!dayTypes) return [];
    return dayTypes.filter(dayType => 
      ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].includes(dayType.name)
    ).sort((a, b) => {
      const dayOrder = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
      return dayOrder.indexOf(a.name) - dayOrder.indexOf(b.name);
    });
  }, [dayTypes]);

  // Initialize local state from API data
  useEffect(() => {
    if (availabilityData && weekdayTypes.length > 0 && timezones) {
      const newState: AvailabilityState = {};
      
      // Initialize all combinations to false first
      weekdayTypes.forEach(dayType => {
        newState[dayType.id] = {};
        timezones.forEach(timezone => {
          newState[dayType.id][timezone.id] = false;
        });
      });

      // Set actual availability from data
      availabilityData.forEach((record: AvailabilityRecord) => {
        if (newState[record.day_type_id] && newState[record.day_type_id][record.timezone_id] !== undefined) {
          newState[record.day_type_id][record.timezone_id] = record.is_available;
        }
      });

      setLocalAvailability(newState);
      setHasChanges(false);
    }
  }, [availabilityData, weekdayTypes, timezones]);

  const handleToggleAvailability = (dayTypeId: string, timezoneId: string) => {
    setLocalAvailability(prev => {
      const newState = {
        ...prev,
        [dayTypeId]: {
          ...prev[dayTypeId],
          [timezoneId]: !prev[dayTypeId]?.[timezoneId]
        }
      };
      setHasChanges(true);
      return newState;
    });
  };

  const handleSaveChanges = async () => {
    try {
      // Convert local state to API format
      const availabilities = [];
      
      for (const dayTypeId of Object.keys(localAvailability)) {
        for (const timezoneId of Object.keys(localAvailability[dayTypeId])) {
          availabilities.push({
            day_type_id: dayTypeId,
            timezone_id: timezoneId,
            is_available: localAvailability[dayTypeId][timezoneId]
          });
        }
      }

      await bulkUpdateMutation.mutateAsync({
        personId,
        availabilities
      });

      setHasChanges(false);
    } catch (error) {
      console.error('Failed to save availability changes:', error);
    }
  };

  const getAvailability = (dayTypeId: string, timezoneId: string): boolean => {
    return localAvailability[dayTypeId]?.[timezoneId] ?? false;
  };

  if (dayTypesLoading || timezonesLoading || availabilityLoading) {
    return (
      <div className="flex items-center justify-center h-48">
        <Loader2 className="h-8 w-8 animate-spin text-[#219EBC]" />
        <span className="ml-2 text-[#023047]">Loading availability data...</span>
      </div>
    );
  }

  if (!weekdayTypes?.length || !timezones?.length) {
    return (
      <div className="text-center py-8 text-gray-500">
        No day types or timezones available to display matrix.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Availability Schedule for {personName}</CardTitle>
          <CardDescription>
            Click the badges to toggle availability. Changes are saved locally until you click Save.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <div className="min-w-full">
              {/* Header Row */}
              <div 
                className="grid gap-2 mb-3"
                style={{
                  gridTemplateColumns: `minmax(100px, 1fr) repeat(${timezones.length}, minmax(80px, 1fr))`
                }}
              >
                <div className="text-sm font-medium text-[#023047] py-2">
                  Day / Time
                </div>
                {timezones.map(timezone => (
                  <div
                    key={timezone.id}
                    className="text-xs font-medium text-[#023047] p-2 text-center bg-[#8ECAE6]/10 rounded"
                  >
                    <div className="truncate" title={timezone.name}>
                      {timezone.name}
                    </div>
                  </div>
                ))}
              </div>

              {/* Data Rows */}
              {weekdayTypes.map(dayType => (
                <div
                  key={dayType.id}
                  className="grid gap-2 mb-2 items-center"
                  style={{
                    gridTemplateColumns: `minmax(100px, 1fr) repeat(${timezones.length}, minmax(80px, 1fr))`
                  }}
                >
                  <div className="text-sm font-medium text-[#023047] py-2 px-3 bg-[#8ECAE6]/10 rounded">
                    {dayType.display_name}
                  </div>
                  
                  {timezones.map(timezone => {
                    const isAvailable = getAvailability(dayType.id, timezone.id);
                    
                    return (
                      <div key={timezone.id} className="flex justify-center">
                        <Badge
                          variant="outline"
                          className={`cursor-pointer transition-all duration-200 w-full justify-center min-h-[28px] text-xs ${
                            isAvailable
                              ? 'bg-green-100 border-green-500 text-green-800 hover:bg-green-200'
                              : 'bg-red-100 border-red-500 text-red-800 hover:bg-red-200'
                          }`}
                          onClick={() => handleToggleAvailability(dayType.id, timezone.id)}
                        >
                          <div className="flex items-center gap-1">
                            {isAvailable ? (
                              <Check className="h-3 w-3" />
                            ) : (
                              <X className="h-3 w-3" />
                            )}
                          </div>
                        </Badge>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          {/* Save Button */}
          {hasChanges && (
            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <p className="text-sm text-orange-600 font-medium">
                  You have unsaved changes to the availability schedule.
                </p>
                <Button
                  onClick={handleSaveChanges}
                  disabled={bulkUpdateMutation.isPending}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  {bulkUpdateMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
