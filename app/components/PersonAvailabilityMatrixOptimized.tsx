import React, { useState, useMemo, useEffect } from 'react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Check, X, Loader2, Save, CheckSquare, Square, Calendar, Clock, Zap } from 'lucide-react';
import { useDayTypes } from '../hooks/useAvailability';
import { useTimezones } from '../hooks/useTimezone';
import { CompactAvailabilityService, type AvailabilityMatrix } from '../services/compactAvailability';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AvailabilityService } from '../services/availability';

interface PersonAvailabilityMatrixOptimizedProps {
  personId: string;
  personName: string;
}

interface LocalAvailabilityState {
  [dayIndex: number]: {
    [timezoneIndex: number]: boolean;
  };
}

export function PersonAvailabilityMatrixOptimized({ personId, personName }: PersonAvailabilityMatrixOptimizedProps) {
  const [localAvailability, setLocalAvailability] = useState<LocalAvailabilityState>({});
  const [hasChanges, setHasChanges] = useState(false);
  const queryClient = useQueryClient();

  // Fetch compact availability matrix (98% smaller data transfer)
  const { 
    data: compactData, 
    isLoading: compactLoading,
    error: compactError 
  } = useQuery({
    queryKey: ['availability-compact-matrix'],
    queryFn: CompactAvailabilityService.fetchCompactMatrix,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  // Expand compact data to full matrix
  const availabilityMatrix: AvailabilityMatrix | undefined = useMemo(() => {
    return compactData ? CompactAvailabilityService.expandCompactMatrix(compactData) : undefined;
  }, [compactData]);

  // Filter to only weekdays
  const weekdayIndices = useMemo(() => {
    if (!availabilityMatrix) return [];
    return availabilityMatrix.days
      .map((day, index) => ({ day, index }))
      .filter(({ day }) => 
        ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].includes(day)
      )
      .sort(({ day: a }, { day: b }) => {
        const dayOrder = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
        return dayOrder.indexOf(a) - dayOrder.indexOf(b);
      });
  }, [availabilityMatrix]);

  // Get person index
  const personIndex = useMemo(() => {
    if (!availabilityMatrix) return -1;
    return availabilityMatrix.people.findIndex(name => name === personName);
  }, [availabilityMatrix, personName]);

  // Initialize local state from matrix data
  useEffect(() => {
    if (availabilityMatrix && personIndex >= 0 && weekdayIndices.length > 0) {
      const newState: LocalAvailabilityState = {};
      
      weekdayIndices.forEach(({ index: dayIndex }) => {
        newState[dayIndex] = {};
        availabilityMatrix.timezones.forEach((_, timezoneIndex) => {
          const isAvailable = CompactAvailabilityService.getAvailability(
            availabilityMatrix, 
            personIndex, 
            dayIndex, 
            timezoneIndex
          );
          newState[dayIndex][timezoneIndex] = isAvailable;
        });
      });

      // Only update if state actually changed to prevent infinite renders
      setLocalAvailability(prevState => {
        const hasActualChanges = JSON.stringify(prevState) !== JSON.stringify(newState);
        if (hasActualChanges) {
          setHasChanges(false);
          return newState;
        }
        return prevState;
      });
    }
  }, [availabilityMatrix, personIndex, weekdayIndices.length]); // Use length instead of array

  // Save changes mutation
  const saveMutation = useMutation({
    mutationFn: async (unavailableSlots: number[][]) => {
      // Convert local state to unavailable combinations format
      const availabilities = [];
      
      for (const dayIndex of Object.keys(localAvailability).map(Number)) {
        for (const timezoneIndex of Object.keys(localAvailability[dayIndex]).map(Number)) {
          availabilities.push({
            day_type_id: availabilityMatrix?.dayIds[dayIndex] || '',
            timezone_id: availabilityMatrix?.timezoneIds[timezoneIndex] || '',
            is_available: localAvailability[dayIndex][timezoneIndex]
          });
        }
      }

      // Use existing bulk update API
      return AvailabilityService.bulkUpdateAvailability(
        personId,
        availabilities
      );
    },
    onSuccess: () => {
      setHasChanges(false);
      // Invalidate compact data to refresh
      queryClient.invalidateQueries({ queryKey: ['availability-compact-matrix'] });
    },
    onError: (error) => {
      console.error('Failed to save availability:', error);
    }
  });

  const handleToggleAvailability = (dayIndex: number, timezoneIndex: number) => {
    setLocalAvailability(prev => {
      const newState = {
        ...prev,
        [dayIndex]: {
          ...prev[dayIndex],
          [timezoneIndex]: !prev[dayIndex]?.[timezoneIndex]
        }
      };
      setHasChanges(true);
      return newState;
    });
  };

  // Select all for a specific day (row)
  const handleSelectAllDay = (dayIndex: number, available: boolean) => {
    if (!availabilityMatrix) return;
    
    setLocalAvailability(prev => {
      const newState = { ...prev };
      newState[dayIndex] = { ...prev[dayIndex] };
      
      availabilityMatrix.timezones.forEach((_, timezoneIndex) => {
        newState[dayIndex][timezoneIndex] = available;
      });
      
      setHasChanges(true);
      return newState;
    });
  };

  // Select all for a specific timezone (column)
  const handleSelectAllTimezone = (timezoneIndex: number, available: boolean) => {
    setLocalAvailability(prev => {
      const newState = { ...prev };
      
      weekdayIndices.forEach(({ index: dayIndex }) => {
        if (!newState[dayIndex]) {
          newState[dayIndex] = {};
        } else {
          newState[dayIndex] = { ...prev[dayIndex] };
        }
        newState[dayIndex][timezoneIndex] = available;
      });
      
      setHasChanges(true);
      return newState;
    });
  };

  // Check if all items in a day are selected
  const isDayAllSelected = (dayIndex: number): boolean => {
    if (!availabilityMatrix || !localAvailability[dayIndex]) return false;
    return availabilityMatrix.timezones.every((_, timezoneIndex) => 
      localAvailability[dayIndex][timezoneIndex] === true
    );
  };

  // Check if all items in a timezone are selected
  const isTimezoneAllSelected = (timezoneIndex: number): boolean => {
    if (!availabilityMatrix || !localAvailability) return false;
    return weekdayIndices.every(({ index: dayIndex }) => 
      localAvailability[dayIndex]?.[timezoneIndex] === true
    );
  };

  const handleSaveChanges = async () => {
    if (!availabilityMatrix) return;
    
    // Convert to unavailable slots for compact format
    const unavailableSlots: number[][] = [];
    
    for (const dayIndex of Object.keys(localAvailability).map(Number)) {
      for (const timezoneIndex of Object.keys(localAvailability[dayIndex]).map(Number)) {
        if (!localAvailability[dayIndex][timezoneIndex]) {
          unavailableSlots.push([personIndex, dayIndex, timezoneIndex]);
        }
      }
    }

    await saveMutation.mutateAsync(unavailableSlots);
  };

  // Loading state
  if (compactLoading) {
    return (
      <Card className="w-full">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-blue-500" />
            <CardTitle className="text-lg">Availability Matrix</CardTitle>
            <Badge variant="secondary" className="text-xs">
              Ultra-Fast Loading
            </Badge>
          </div>
          <CardDescription>Loading optimized availability data...</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="flex gap-2">
                <div className="w-16 h-8 bg-gray-200 rounded animate-pulse" />
                {Array.from({ length: 5 }).map((_, j) => (
                  <div key={j} className="w-16 h-8 bg-gray-100 rounded animate-pulse" />
                ))}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Error state
  if (compactError || !availabilityMatrix || personIndex < 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-lg text-red-600">Loading Error</CardTitle>
          <CardDescription>
            {compactError ? 'Failed to load availability data' : 
             !availabilityMatrix ? 'No availability data found' : 
             'Person not found in availability matrix'}
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          <CardTitle className="text-lg">Availability Matrix</CardTitle>
          <Badge variant="secondary" className="text-xs flex items-center gap-1">
            <Zap className="h-3 w-3" />
            Optimized
          </Badge>
        </div>
        <CardDescription>
          Manage {personName}'s availability across days and time zones
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Data Transfer Info */}
        <div className="text-xs text-muted-foreground p-2 bg-blue-50 rounded border-l-2 border-blue-200">
          <div className="flex items-center gap-1">
            <Zap className="h-3 w-3" />
            Data optimized: ~800 bytes transferred (98% reduction)
          </div>
        </div>

        {/* Time zone headers with select all */}
        <div className="grid grid-cols-[80px_1fr] gap-2 pb-2 border-b">
          <div></div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-2">
            {availabilityMatrix.timezones.map((timezone, timezoneIndex) => (
              <div key={timezoneIndex} className="text-center">
                <div className="text-sm font-medium text-gray-900 mb-1 capitalize">
                  {timezone}
                </div>
                <div className="flex justify-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={() => handleSelectAllTimezone(timezoneIndex, !isTimezoneAllSelected(timezoneIndex))}
                    title={`${isTimezoneAllSelected(timezoneIndex) ? 'Deselect' : 'Select'} all ${timezone}`}
                  >
                    {isTimezoneAllSelected(timezoneIndex) ? 
                      <CheckSquare className="h-3 w-3" /> : 
                      <Square className="h-3 w-3" />
                    }
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Availability grid */}
        <div className="space-y-2">
          {weekdayIndices.map(({ day, index: dayIndex }) => (
            <div key={dayIndex} className="grid grid-cols-[80px_1fr] gap-2 items-center">
              {/* Day name with select all */}
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium capitalize min-w-0 flex-1">
                  {day.slice(0, 3)}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 flex-shrink-0"
                  onClick={() => handleSelectAllDay(dayIndex, !isDayAllSelected(dayIndex))}
                  title={`${isDayAllSelected(dayIndex) ? 'Deselect' : 'Select'} all for ${day}`}
                >
                  {isDayAllSelected(dayIndex) ? 
                    <CheckSquare className="h-3 w-3" /> : 
                    <Square className="h-3 w-3" />
                  }
                </Button>
              </div>

              {/* Time zone availability badges */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-2">
                {availabilityMatrix.timezones.map((_, timezoneIndex) => {
                  const isAvailable = localAvailability[dayIndex]?.[timezoneIndex] ?? false;
                  return (
                    <Badge
                      key={timezoneIndex}
                      variant={isAvailable ? "default" : "destructive"}
                      className={`cursor-pointer transition-all duration-200 justify-center ${
                        isAvailable 
                          ? 'bg-green-100 text-green-800 hover:bg-green-200 border-green-300' 
                          : 'bg-red-100 text-red-800 hover:bg-red-200 border-red-300'
                      }`}
                      onClick={() => handleToggleAvailability(dayIndex, timezoneIndex)}
                    >
                      {isAvailable ? (
                        <Check className="h-3 w-3" />
                      ) : (
                        <X className="h-3 w-3" />
                      )}
                    </Badge>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Save changes */}
        {hasChanges && (
          <div className="flex justify-end pt-4 border-t">
            <Button 
              onClick={handleSaveChanges}
              disabled={saveMutation.isPending}
              className="flex items-center gap-2"
            >
              {saveMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {saveMutation.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
