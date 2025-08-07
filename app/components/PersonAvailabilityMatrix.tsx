import React, { useState, useMemo, useEffect } from 'react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Check, X, Loader2, Save, CheckSquare, Square, Calendar, Clock } from 'lucide-react';
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

  // Select all for a specific day (row)
  const handleSelectAllDay = (dayTypeId: string, available: boolean) => {
    if (!timezones) return;
    
    setLocalAvailability(prev => {
      const newState = { ...prev };
      newState[dayTypeId] = { ...prev[dayTypeId] };
      
      timezones.forEach(timezone => {
        newState[dayTypeId][timezone.id] = available;
      });
      
      setHasChanges(true);
      return newState;
    });
  };

  // Select all for a specific timezone (column)
  const handleSelectAllTimezone = (timezoneId: string, available: boolean) => {
    if (!weekdayTypes) return;
    
    setLocalAvailability(prev => {
      const newState = { ...prev };
      
      weekdayTypes.forEach(dayType => {
        if (!newState[dayType.id]) {
          newState[dayType.id] = {};
        } else {
          newState[dayType.id] = { ...prev[dayType.id] };
        }
        newState[dayType.id][timezoneId] = available;
      });
      
      setHasChanges(true);
      return newState;
    });
  };

  // Check if all items in a day are selected
  const isDayAllSelected = (dayTypeId: string): boolean => {
    if (!timezones || !localAvailability[dayTypeId]) return false;
    return timezones.every(timezone => 
      localAvailability[dayTypeId][timezone.id] === true
    );
  };

  // Check if all items in a timezone are selected
  const isTimezoneAllSelected = (timezoneId: string): boolean => {
    if (!weekdayTypes || !localAvailability) return false;
    return weekdayTypes.every(dayType => 
      localAvailability[dayType.id]?.[timezoneId] === true
    );
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
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <div className="h-6 bg-gray-200 rounded animate-pulse mb-2"></div>
            <div className="h-4 bg-gray-150 rounded animate-pulse w-2/3"></div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {/* Header skeleton */}
              <div className="grid grid-cols-8 gap-2">
                <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
                {[...Array(7)].map((_, i) => (
                  <div key={i} className="h-8 bg-gray-150 rounded animate-pulse"></div>
                ))}
              </div>
              
              {/* Row skeletons */}
              {[...Array(7)].map((_, i) => (
                <div key={i} className="grid grid-cols-8 gap-2">
                  <div className="h-7 bg-gray-200 rounded animate-pulse"></div>
                  {[...Array(7)].map((_, j) => (
                    <div key={j} className="h-7 bg-gray-100 rounded animate-pulse"></div>
                  ))}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
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
            Click the badges to toggle availability. Use the buttons below for quick selection.
          </CardDescription>
          
          {/* Bulk Action Buttons */}
          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (!weekdayTypes || !timezones) return;
                setLocalAvailability(prev => {
                  const newState: AvailabilityState = {};
                  weekdayTypes.forEach(dayType => {
                    newState[dayType.id] = {};
                    timezones.forEach(timezone => {
                      newState[dayType.id][timezone.id] = true;
                    });
                  });
                  setHasChanges(true);
                  return newState;
                });
              }}
              className="flex items-center gap-1 hover:bg-green-50 hover:text-green-700 hover:border-green-300"
            >
              <CheckSquare className="h-3 w-3" />
              Select All
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (!weekdayTypes || !timezones) return;
                setLocalAvailability(prev => {
                  const newState: AvailabilityState = {};
                  weekdayTypes.forEach(dayType => {
                    newState[dayType.id] = {};
                    timezones.forEach(timezone => {
                      newState[dayType.id][timezone.id] = false;
                    });
                  });
                  setHasChanges(true);
                  return newState;
                });
              }}
              className="flex items-center gap-1 hover:bg-red-50 hover:text-red-700 hover:border-red-300"
            >
              <Square className="h-3 w-3" />
              Clear All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <div className="min-w-full">
              {/* Header Row */}
              <div 
                className="grid gap-2 mb-3"
                style={{
                  gridTemplateColumns: `minmax(120px, 1fr) repeat(${timezones.length}, minmax(80px, 1fr))`
                }}
              >
                <div className="text-sm font-medium text-[#023047] py-2 flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Day / Time
                </div>
                {timezones.map(timezone => {
                  const isAllSelected = isTimezoneAllSelected(timezone.id);
                  return (
                    <div
                      key={timezone.id}
                      className="text-xs font-medium text-[#023047] p-2 text-center bg-[#8ECAE6]/10 rounded space-y-1"
                    >
                      <div className="truncate" title={timezone.name}>
                        {timezone.name}
                      </div>
                      <div className="flex justify-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          className={`h-6 w-6 p-0 hover:bg-[#8ECAE6]/20 ${
                            isAllSelected ? 'text-green-600' : 'text-gray-400'
                          }`}
                          onClick={() => handleSelectAllTimezone(timezone.id, !isAllSelected)}
                          title={`${isAllSelected ? 'Deselect' : 'Select'} all ${timezone.name}`}
                        >
                          {isAllSelected ? (
                            <CheckSquare className="h-3 w-3" />
                          ) : (
                            <Square className="h-3 w-3" />
                          )}
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Data Rows */}
              {weekdayTypes.map(dayType => {
                const isDayAll = isDayAllSelected(dayType.id);
                return (
                  <div
                    key={dayType.id}
                    className="grid gap-2 mb-2 items-center"
                    style={{
                      gridTemplateColumns: `minmax(120px, 1fr) repeat(${timezones.length}, minmax(80px, 1fr))`
                    }}
                  >
                    <div className="text-sm font-medium text-[#023047] py-2 px-3 bg-[#8ECAE6]/10 rounded flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3 w-3" />
                        {dayType.display_name}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className={`h-5 w-5 p-0 hover:bg-[#8ECAE6]/20 ${
                          isDayAll ? 'text-green-600' : 'text-gray-400'
                        }`}
                        onClick={() => handleSelectAllDay(dayType.id, !isDayAll)}
                        title={`${isDayAll ? 'Deselect' : 'Select'} all ${dayType.display_name}`}
                      >
                        {isDayAll ? (
                          <CheckSquare className="h-3 w-3" />
                        ) : (
                          <Square className="h-3 w-3" />
                        )}
                      </Button>
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
                );
              })}
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
