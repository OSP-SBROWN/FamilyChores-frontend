import React, { useState } from 'react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Loader2, Check, X, User } from 'lucide-react';
import { useDayTypes, useAvailabilityMatrix, useUpdateAvailability } from '../hooks/useAvailability';
import { useTimezones } from '../hooks/useTimezone';
import { usePeople } from '../hooks/usePeople';
import type { AvailabilityRecord, AvailabilityMatrix } from '../types/availability';

interface AvailabilityMatrixProps {
  selectedPersonId?: string;
}

export function AvailabilityMatrixComponent({ selectedPersonId }: AvailabilityMatrixProps) {
  const [selectedPerson, setSelectedPerson] = useState<string>(selectedPersonId || '');
  
  const { data: dayTypes, isLoading: dayTypesLoading } = useDayTypes();
  const { data: timezones, isLoading: timezonesLoading } = useTimezones();
  const { data: people, isLoading: peopleLoading } = usePeople();
  const { data: availabilityRecords, isLoading: matrixLoading } = useAvailabilityMatrix();
  const updateAvailabilityMutation = useUpdateAvailability();

  // Filter to only show weekdays for cleaner interface
  const weekdayTypes = dayTypes?.filter(dayType => 
    ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].includes(dayType.name.toLowerCase())
  ).sort((a, b) => {
    const dayOrder = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    return dayOrder.indexOf(a.name.toLowerCase()) - dayOrder.indexOf(b.name.toLowerCase());
  });

  // Convert availability records to a matrix structure
  const availabilityMatrix: AvailabilityMatrix = React.useMemo(() => {
    const matrix: AvailabilityMatrix = {};
    
    availabilityRecords?.forEach(record => {
      if (!matrix[record.person_id]) {
        matrix[record.person_id] = {};
      }
      if (!matrix[record.person_id][record.day_type_id]) {
        matrix[record.person_id][record.day_type_id] = {};
      }
      matrix[record.person_id][record.day_type_id][record.timezone_id] = record.is_available;
    });
    
    return matrix;
  }, [availabilityRecords]);

  const handleAvailabilityToggle = async (
    personId: string,
    dayTypeId: string,
    timezoneId: string,
    currentAvailability: boolean
  ) => {
    try {
      await updateAvailabilityMutation.mutateAsync({
        personId,
        dayTypeId,
        timezoneId,
        isAvailable: !currentAvailability
      });
    } catch (error) {
      console.error('Failed to toggle availability:', error);
    }
  };

  const getAvailabilityStatus = (personId: string, dayTypeId: string, timezoneId: string): boolean => {
    return availabilityMatrix[personId]?.[dayTypeId]?.[timezoneId] ?? false;
  };

  if (dayTypesLoading || timezonesLoading || peopleLoading || matrixLoading) {
    return (
      <Card className="w-full">
        <CardContent className="flex items-center justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-[#219EBC]" />
          <span className="ml-2 text-[#023047]">Loading availability matrix...</span>
        </CardContent>
      </Card>
    );
  }

  if (!weekdayTypes?.length || !timezones?.length) {
    return (
      <Card className="w-full">
        <CardContent className="p-8">
          <p className="text-center text-gray-500">No day types or timezones available to display matrix.</p>
        </CardContent>
      </Card>
    );
  }

  const displayPeople = selectedPerson 
    ? people?.filter(p => p.id === selectedPerson) || []
    : people || [];

  return (
    <div className="space-y-6">
      {/* Person Selector */}
      {!selectedPersonId && people && people.length > 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-[#023047] flex items-center gap-2">
              <User className="h-5 w-5" />
              Select Person
            </CardTitle>
            <CardDescription>
              Choose a person to edit their availability, or view all people
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Badge
                variant={selectedPerson === '' ? 'default' : 'outline'}
                className={`cursor-pointer ${
                  selectedPerson === ''
                    ? 'bg-[#219EBC] hover:bg-[#1a7d99]'
                    : 'hover:bg-[#8ECAE6]/20'
                }`}
                onClick={() => setSelectedPerson('')}
              >
                All People
              </Badge>
              {people.map(person => (
                <Badge
                  key={person.id}
                  variant={selectedPerson === person.id ? 'default' : 'outline'}
                  className={`cursor-pointer ${
                    selectedPerson === person.id
                      ? 'bg-[#219EBC] hover:bg-[#1a7d99]'
                      : 'hover:bg-[#8ECAE6]/20'
                  }`}
                  onClick={() => setSelectedPerson(person.id)}
                >
                  {person.name}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Availability Matrix */}
      <Card>
        <CardHeader>
          <CardTitle className="text-[#023047]">
            Availability Matrix
          </CardTitle>
          <CardDescription>
            Click the badges to toggle availability. Green = Available, Red = Unavailable
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {displayPeople.map(person => (
              <div key={person.id} className="space-y-4">
                <h3 className="text-lg font-semibold text-[#023047] border-b border-[#8ECAE6] pb-2">
                  {person.name}
                </h3>
                
                <div className="overflow-x-auto">
                  <div className="min-w-full">
                    {/* Header Row */}
                    <div className="grid grid-cols-[120px_repeat(var(--timezone-count),1fr)] gap-2 mb-3 min-w-max"
                         style={{ '--timezone-count': timezones.length } as React.CSSProperties}>
                      <div className="text-sm font-medium text-[#023047] py-2">
                        Day / Time
                      </div>
                      {timezones.map(timezone => (
                        <div
                          key={timezone.id}
                          className="text-xs font-medium text-[#023047] p-2 text-center bg-[#8ECAE6]/10 rounded"
                        >
                          <div className="truncate" title={timezone.display_name}>
                            {timezone.display_name}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Data Rows */}
                    {weekdayTypes.map(dayType => (
                      <div
                        key={dayType.id}
                        className="grid grid-cols-[120px_repeat(var(--timezone-count),1fr)] gap-2 mb-2 items-center min-w-max"
                        style={{ '--timezone-count': timezones.length } as React.CSSProperties}
                      >
                        <div className="text-sm font-medium text-[#023047] py-2 px-3 bg-[#8ECAE6]/10 rounded">
                          {dayType.display_name}
                        </div>
                        
                        {timezones.map(timezone => {
                          const isAvailable = getAvailabilityStatus(person.id, dayType.id, timezone.id);
                          const isUpdating = updateAvailabilityMutation.isPending;
                          
                          return (
                            <div key={timezone.id} className="flex justify-center">
                              <Badge
                                variant="outline"
                                className={`cursor-pointer transition-all duration-200 w-full justify-center min-h-[32px] ${
                                  isAvailable
                                    ? 'bg-green-100 border-green-500 text-green-800 hover:bg-green-200'
                                    : 'bg-red-100 border-red-500 text-red-800 hover:bg-red-200'
                                } ${isUpdating ? 'opacity-50' : ''}`}
                                onClick={() => handleAvailabilityToggle(person.id, dayType.id, timezone.id, isAvailable)}
                                disabled={isUpdating}
                              >
                                {isUpdating ? (
                                  <Loader2 className="h-3 w-3 animate-spin" />
                                ) : isAvailable ? (
                                  <Check className="h-3 w-3" />
                                ) : (
                                  <X className="h-3 w-3" />
                                )}
                              </Badge>
                            </div>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
            
            {displayPeople.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No people available to display availability matrix.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
