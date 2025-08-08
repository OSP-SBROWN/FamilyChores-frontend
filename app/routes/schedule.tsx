import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Card, CardContent, Grid, Divider, Alert } from '@mui/material';
import { format, parseISO } from 'date-fns';
import { ScheduleBuilder } from '../components/ScheduleBuilder';
import scheduleService from '../services/schedule.service';
import type { ChoreSchedule, ScheduleType, ScheduleOccurrence } from '../types/schedule';

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
    return <Typography>Loading schedule...</Typography>;
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 3 }}>
        {error}
        <Button variant="outlined" size="small" onClick={loadScheduleData} sx={{ ml: 2 }}>
          Retry
        </Button>
      </Alert>
    );
  }

  if (editing || !schedule) {
    return (
      <Box>
        <Typography variant="h5" gutterBottom>
          {schedule ? 'Edit Schedule' : 'Create Schedule'} for {choreName}
        </Typography>
        
        <ScheduleBuilder
          choreId={choreId}
          initialSchedule={schedule || { choreId, scheduleType: ScheduleType.WEEKLY }}
          onSave={handleSaveSchedule}
          onCancel={() => setEditing(false)}
        />
      </Box>
    );
  }

  return (
    <Box>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h5">Schedule for {choreName}</Typography>
                <Button variant="outlined" onClick={() => setEditing(true)}>
                  Edit Schedule
                </Button>
              </Box>
              
              <Typography variant="subtitle1" gutterBottom>
                {getScheduleDescription(schedule)}
              </Typography>
              
              <Typography variant="body2" color="textSecondary">
                Starting from {format(new Date(schedule.startDate!), 'MMMM d, yyyy')}
              </Typography>
              
              {schedule.endDate && (
                <Typography variant="body2" color="textSecondary">
                  Until {format(new Date(schedule.endDate), 'MMMM d, yyyy')}
                </Typography>
              )}
              
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="subtitle1" gutterBottom>
                Next Occurrences
              </Typography>
              
              {occurrences.length > 0 ? (
                <Box>
                  {occurrences.map((occurrence, index) => (
                    <Card key={index} variant="outlined" sx={{ mb: 1, p: 2 }}>
                      <Typography>
                        {format(new Date(occurrence.date), 'EEEE, MMMM d, yyyy')}
                      </Typography>
                    </Card>
                  ))}
                </Box>
              ) : (
                <Typography variant="body2" color="textSecondary">
                  No upcoming occurrences found.
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SchedulePage;
