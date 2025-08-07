import React, { useState, useMemo, useEffect } from 'react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Check, X, Loader2, Save } from 'lucide-react';
import { useAvailabilityMatrix, useUpdatePersonAvailability } from '../hooks/useCompactAvailability';
import { CompactAvailabilityService } from '../services/availability-compact';
import type { AvailabilityMatrix } from '../types/availability-compact';

interface PersonAvailabilityMatrixCompactProps {
  personId: string;
  personName: string;
}

interface LocalAvailabilityState {
  [dayTypeId: string]: {
    [timezoneId: string]: boolean;
  };
}

export function PersonAvailabilityMatrixCompact({ personId, personName }: PersonAvailabilityMatrixCompactProps) {
  const [localAvailability, setLocalAvailability] = useState<LocalAvailabilityState>({});
  const [hasChanges, setHasChanges] = useState(false);

  const { data: matrix, compactData, isLoading } = useAvailabilityMatrix();
  const updateMutation = useUpdatePersonAvailability();

  // Filter to only weekdays for cleaner interface
  const weekdayTypes = useMemo(() => {
    if (!compactData?.day_types) return [];
    return compactData.day_types.filter(dayType => 
      ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].includes(dayType.name)
    ).sort((a, b) => {
      const dayOrder = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
      return dayOrder.indexOf(a.name) - dayOrder.indexOf(b.name);
    });
  }, [compactData?.day_types]);

  const timezones = useMemo(() => {
    return compactData?.timezones?.sort((a, b) => a.display_order - b.display_order) || [];
  }, [compactData?.timezones]);

  // Initialize local state from matrix data
  useEffect(() => {
    if (matrix && personId && weekdayTypes.length > 0 && timezones.length > 0) {
      const personMatrix = matrix[personId];
      if (personMatrix) {
        const newState: LocalAvailabilityState = {};
        
        weekdayTypes.forEach(dayType => {
          newState[dayType.id] = {};
          timezones.forEach(timezone => {
            newState[dayType.id][timezone.id] = personMatrix[dayType.id]?.[timezone.id] ?? true;
          });
        });

        setLocalAvailability(newState);
        setHasChanges(false);
      }
    }
  }, [matrix, personId, weekdayTypes, timezones]);

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
      // Extract unavailable slots from local state
      const dayTypeIds = weekdayTypes.map(dt => dt.id);
      const timezoneIds = timezones.map(tz => tz.id);
      
      const unavailableSlots = CompactAvailabilityService.extractUnavailableSlots(
        personId,
        { [personId]: localAvailability },
        dayTypeIds,
        timezoneIds
      );

      await updateMutation.mutateAsync({
        person_id: personId,
        unavailable_slots: unavailableSlots
      });

      setHasChanges(false);
    } catch (error) {
      console.error('Failed to save availability changes:', error);
    }
  };

  const getAvailability = (dayTypeId: string, timezoneId: string): boolean => {
    return localAvailability[dayTypeId]?.[timezoneId] ?? true;
  };

  if (isLoading) {
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

  if (!weekdayTypes.length || !timezones.length) {
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
            Click the badges to toggle availability. Everyone is available by default - only mark when NOT available.
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
                  You have unsaved changes. Only "not available" slots will be stored.
                </p>
                <Button
                  onClick={handleSaveChanges}
                  disabled={updateMutation.isPending}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  {updateMutation.isPending ? (
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

      {/* Debug info (remove in production) */}
      {compactData && (
        <div className="text-xs text-gray-500 p-2 bg-gray-50 rounded">
          Data efficiency: {compactData.unavailable_slots.length} unavailable slots stored 
          (vs {compactData.people.length × weekdayTypes.length × timezones.length} total combinations)
        </div>
      )}
    </div>
  );
}
