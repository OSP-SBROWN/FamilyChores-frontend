import React, { useState, useEffect } from 'react';
import { format, parseISO } from 'date-fns';
import { ScheduleBuilder } from '../components/ScheduleBuilder';
import scheduleService from '../services/schedule.service';
import type { ChoreSchedule, ScheduleOccurrence } from '../types/schedule';
// Import the ScheduleType as a value
import { ScheduleType } from '../types/schedule';
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "../components/ui/alert";
import { Separator } from "../components/ui/separator";

interface SchedulePageProps {
  choreId: string;
  choreName: string;
}

export const SchedulePage: React.FC<SchedulePageProps> = ({ choreId, choreName }) => {
  const [schedule, setSchedule] = useState<ChoreSchedule | null>(null);
  const [occurrences, setOccurrences] = useState<ScheduleOccurrence[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    loadScheduleData();
  }, [choreId]);

  const loadScheduleData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Load the chore's schedule
      const scheduleData = await scheduleService.getChoreSchedule(choreId);
      setSchedule(scheduleData);
      
      // Load next occurrences
      const occurrencesData = await scheduleService.generateOccurrences(choreId, 10);
      setOccurrences(occurrencesData.map(date => ({ 
        date: typeof date === 'string' ? parseISO(date) : date,
        choreId 
      })));
    } catch (err) {
      console.error('Error loading schedule:', err);
      setError('Failed to load schedule data');
      
      // If schedule doesn't exist yet, set to null instead of showing error
      if ((err as any)?.response?.status === 404) {
        setSchedule(null);
        setError(null);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSchedule = async (scheduleData: Partial<ChoreSchedule>) => {
    try {
      setLoading(true);
      setError(null);
      
      let updatedSchedule;
      if (schedule?.id) {
        // Update existing schedule
        updatedSchedule = await scheduleService.updateChoreSchedule(choreId, scheduleData);
      } else {
        // Create new schedule
        updatedSchedule = await scheduleService.updateChoreSchedule(choreId, {
          ...scheduleData,
          choreId
        });
      }
      
      setSchedule(updatedSchedule);
      setEditing(false);
      
      // Refresh occurrences
      const occurrencesData = await scheduleService.generateOccurrences(choreId, 10);
      setOccurrences(occurrencesData.map(date => ({ 
        date: typeof date === 'string' ? parseISO(date) : date,
        choreId 
      })));
    } catch (err) {
      console.error('Error saving schedule:', err);
      setError('Failed to save schedule data');
    } finally {
      setLoading(false);
    }
  };

  const getScheduleDescription = (scheduleData: ChoreSchedule): string => {
    const { scheduleType } = scheduleData;
    
    switch (scheduleType) {
      case ScheduleType.ONCE:
        return `One time on ${format(new Date(scheduleData.startDate!), 'MMMM d, yyyy')}`;
        
      case ScheduleType.DAILY:
        return `Every ${scheduleData.recurrenceInterval === 1 ? 'day' : `${scheduleData.recurrenceInterval} days`}${
          scheduleData.endDate ? ` until ${format(new Date(scheduleData.endDate), 'MMMM d, yyyy')}` : ''
        }`;
        
      case ScheduleType.WEEKLY:
        const daysOfWeek = scheduleData.daysOfWeek || [];
        const dayNames = daysOfWeek.map(day => 
          ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][day]
        );
        const daysText = dayNames.join(', ');
        
        return `Every ${scheduleData.recurrenceInterval === 1 ? 'week' : `${scheduleData.recurrenceInterval} weeks`} on ${daysText}${
          scheduleData.endDate ? ` until ${format(new Date(scheduleData.endDate), 'MMMM d, yyyy')}` : ''
        }`;
        
      case ScheduleType.MONTHLY:
        // This would need more detailed logic to handle all monthly recurrence types
        return `Monthly schedule`;
        
      case ScheduleType.CUSTOM:
        return scheduleData.description || 'Custom schedule';
        
      default:
        return 'Schedule not configured';
    }
  };

  if (loading && !schedule) {
    return <div className="text-lg">Loading schedule...</div>;
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription className="flex justify-between items-center">
          {error}
          <Button variant="outline" size="sm" onClick={loadScheduleData} className="ml-2">
            Retry
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  if (editing || !schedule) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold mb-4">
          {schedule ? 'Edit Schedule' : 'Create Schedule'} for {choreName}
        </h2>
        
        <ScheduleBuilder
          choreId={choreId}
          initialSchedule={schedule || { choreId, scheduleType: ScheduleType.WEEKLY }}
          onSave={handleSaveSchedule}
          onCancel={() => setEditing(false)}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Card className="w-full">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Schedule for {choreName}</CardTitle>
            <Button variant="outline" onClick={() => setEditing(true)}>
              Edit Schedule
            </Button>
          </div>
          <CardDescription>
            {getScheduleDescription(schedule)}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="text-sm text-muted-foreground">
            Starting from {format(new Date(schedule.startDate!), 'MMMM d, yyyy')}
          </div>
          
          {schedule.endDate && (
            <div className="text-sm text-muted-foreground">
              Until {format(new Date(schedule.endDate), 'MMMM d, yyyy')}
            </div>
          )}
          
          <Separator className="my-4" />
          
          <h3 className="text-lg font-semibold">Next Occurrences</h3>
          
          {occurrences.length > 0 ? (
            <div className="space-y-2">
              {occurrences.map((occurrence, index) => (
                <Card key={index} className="mb-2">
                  <CardContent className="p-3">
                    {format(new Date(occurrence.date), 'EEEE, MMMM d, yyyy')}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-sm text-muted-foreground">
              No upcoming occurrences found.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SchedulePage;
