import React, { useState, useEffect } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { format, addDays } from 'date-fns';
import { Plus, Trash, Pencil, Calendar, AlertTriangle } from 'lucide-react';

// Shadcn UI components
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';

import { cn } from '../../lib/utils';

// Import enum values directly
import { ScheduleType, MonthlyRecurrenceType } from '../types/schedule';
// Import types using import type
import type { 
  ChoreSchedule,
  ScheduleOccurrence
} from '../types/schedule';
import scheduleService from '../services/schedule.service';

interface ScheduleBuilderProps {
  choreId: string;
  initialSchedule?: Partial<ChoreSchedule>;
  onSave: (schedule: Partial<ChoreSchedule>) => void;
  onCancel: () => void;
}

export const ScheduleBuilder: React.FC<ScheduleBuilderProps> = ({
  choreId,
  initialSchedule,
  onSave,
  onCancel
}) => {
  const [schedule, setSchedule] = useState<Partial<ChoreSchedule>>(initialSchedule || {
    choreId,
    scheduleType: ScheduleType.WEEKLY,
    startDate: new Date(),
    recurrenceInterval: 1,
    daysOfWeek: [1] // Monday by default
  });
  
  const [preview, setPreview] = useState<ScheduleOccurrence[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Generate preview of occurrences when schedule changes
  useEffect(() => {
    if (schedule.scheduleType === ScheduleType.ONCE) {
      if (schedule.startDate) {
        setPreview([{ date: schedule.startDate, choreId }]);
      }
      return;
    }
    
    const generatePreview = async () => {
      try {
        if (!schedule.choreId || !schedule.scheduleType) return;
        
        // For new schedules that haven't been saved yet, we'll simulate some occurrences
        if (!schedule.id) {
          const simulatedOccurrences = simulateOccurrences(schedule, 5);
          setPreview(simulatedOccurrences);
          return;
        }
        
        const occurrences = await scheduleService.generateOccurrences(choreId, 5);
        setPreview(occurrences.map(date => ({ date, choreId })));
        setError(null);
      } catch (err) {
        console.error('Error generating preview:', err);
        setError('Could not generate schedule preview');
        setPreview([]);
      }
    };
    
    generatePreview();
  }, [schedule, choreId]);

  // Simulate occurrences for UI preview before saving
  const simulateOccurrences = (scheduleData: Partial<ChoreSchedule>, count: number): ScheduleOccurrence[] => {
    const occurrences: ScheduleOccurrence[] = [];
    const startDate = scheduleData.startDate || new Date();
    
    if (scheduleData.scheduleType === ScheduleType.ONCE) {
      occurrences.push({ date: startDate, choreId });
      return occurrences;
    }
    
    if (scheduleData.scheduleType === ScheduleType.DAILY) {
      const interval = scheduleData.recurrenceInterval || 1;
      for (let i = 0; i < count; i++) {
        occurrences.push({
          date: addDays(startDate, i * interval),
          choreId
        });
      }
      return occurrences;
    }
    
    if (scheduleData.scheduleType === ScheduleType.WEEKLY && scheduleData.daysOfWeek?.length) {
      let currentDate = new Date(startDate);
      const interval = scheduleData.recurrenceInterval || 1;
      
      // Find first occurrence starting from start date
      while (occurrences.length < count) {
        const dayOfWeek = currentDate.getDay();
        if (scheduleData.daysOfWeek.includes(dayOfWeek)) {
          occurrences.push({
            date: new Date(currentDate),
            choreId
          });
        }
        
        currentDate = addDays(currentDate, 1);
        
        // Skip ahead for multi-week intervals
        if (occurrences.length > 0 && 
            currentDate.getDay() === 0 && 
            interval > 1 && 
            occurrences.length % scheduleData.daysOfWeek.length === 0) {
          currentDate = addDays(currentDate, (interval - 1) * 7);
        }
      }
      return occurrences;
    }
    
    // Add simplified monthly simulation
    if (scheduleData.scheduleType === ScheduleType.MONTHLY) {
      // Simplified for preview - would need more complex logic in actual implementation
      return [
        { date: startDate, choreId },
        { date: addDays(startDate, 30), choreId },
        { date: addDays(startDate, 60), choreId },
        { date: addDays(startDate, 90), choreId },
        { date: addDays(startDate, 120), choreId }
      ];
    }
    
    return [];
  };

  const handleChange = (field: keyof ChoreSchedule, value: any) => {
    setSchedule(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(schedule);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{schedule.id ? 'Edit Schedule' : 'Create Schedule'}</CardTitle>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="scheduleType">Schedule Type</Label>
            <Select
              value={schedule.scheduleType}
              onValueChange={(value) => handleChange('scheduleType', value)}
            >
              <SelectTrigger id="scheduleType">
                <SelectValue placeholder="Select schedule type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ScheduleType.ONCE}>One Time</SelectItem>
                <SelectItem value={ScheduleType.DAILY}>Daily</SelectItem>
                <SelectItem value={ScheduleType.WEEKLY}>Weekly</SelectItem>
                <SelectItem value={ScheduleType.MONTHLY}>Monthly</SelectItem>
                <SelectItem value={ScheduleType.CUSTOM}>Custom</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="startDate">Start Date</Label>
            <Input 
              id="startDate"
              type="date"
              value={schedule.startDate ? format(new Date(schedule.startDate), 'yyyy-MM-dd') : ''}
              onChange={(e) => handleChange('startDate', e.target.value ? new Date(e.target.value) : null)}
            />
          </div>
          
          {schedule.scheduleType !== ScheduleType.ONCE && (
            <div className="space-y-2">
              <Label htmlFor="endDate">End Date (Optional)</Label>
              <Input 
                id="endDate"
                type="date"
                value={schedule.endDate ? format(new Date(schedule.endDate), 'yyyy-MM-dd') : ''}
                onChange={(e) => handleChange('endDate', e.target.value ? new Date(e.target.value) : null)}
              />
              <p className="text-sm text-muted-foreground">Leave blank for no end date</p>
            </div>
          )}
          
          {schedule.scheduleType !== ScheduleType.ONCE && (
            <div className="space-y-2">
              <Label htmlFor="recurrenceInterval">
                {schedule.scheduleType === ScheduleType.DAILY 
                  ? 'Every X days' 
                  : schedule.scheduleType === ScheduleType.WEEKLY 
                    ? 'Every X weeks' 
                    : 'Every X months'}
              </Label>
              <Input
                id="recurrenceInterval"
                type="number"
                min="1"
                value={schedule.recurrenceInterval || 1}
                onChange={(e) => handleChange('recurrenceInterval', parseInt(e.target.value))}
              />
            </div>
          )}
          
          {schedule.scheduleType === ScheduleType.WEEKLY && (
            <div className="space-y-2">
              <Label>Days of Week</Label>
              <div className="flex flex-wrap gap-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => {
                  const selectedDays = schedule.daysOfWeek || [];
                  const isSelected = selectedDays.includes(index);
                  
                  return (
                    <Badge
                      key={index}
                      variant={isSelected ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => {
                        const newDays = selectedDays.includes(index)
                          ? selectedDays.filter(d => d !== index)
                          : [...selectedDays, index].sort((a, b) => a - b);
                        handleChange('daysOfWeek', newDays.length ? newDays : []);
                      }}
                    >
                      {day}
                    </Badge>
                  );
                })}
              </div>
            </div>
          )}
          
          {schedule.scheduleType === ScheduleType.MONTHLY && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="monthlyRecurrenceType">Monthly Recurrence Type</Label>
                <Select
                  value={schedule.monthlyRecurrenceType || MonthlyRecurrenceType.DAY_OF_MONTH}
                  onValueChange={(value) => handleChange('monthlyRecurrenceType', value)}
                >
                  <SelectTrigger id="monthlyRecurrenceType">
                    <SelectValue placeholder="Select monthly recurrence type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={MonthlyRecurrenceType.DAY_OF_MONTH}>Day of month (e.g., 15th)</SelectItem>
                    <SelectItem value={MonthlyRecurrenceType.DAY_OF_WEEK}>Day of week (e.g., 3rd Tuesday)</SelectItem>
                    <SelectItem value={MonthlyRecurrenceType.LAST_OF_MONTH}>Last day of month</SelectItem>
                    <SelectItem value={MonthlyRecurrenceType.LAST_WEEKDAY}>Last weekday of month</SelectItem>
                    <SelectItem value={MonthlyRecurrenceType.FIRST_OF_MONTH}>First day of month</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {schedule.monthlyRecurrenceType === MonthlyRecurrenceType.DAY_OF_MONTH && (
                <div className="space-y-2">
                  <Label htmlFor="dayOfMonth">Day of Month</Label>
                  <Input
                    id="dayOfMonth"
                    type="number"
                    min="1"
                    max="31"
                    value={schedule.dayOfMonth || 1}
                    onChange={(e) => handleChange('dayOfMonth', parseInt(e.target.value))}
                  />
                  <p className="text-sm text-muted-foreground">Day of the month (1-31)</p>
                </div>
              )}
              
              {schedule.monthlyRecurrenceType === MonthlyRecurrenceType.DAY_OF_WEEK && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="weekOfMonth">Week of Month</Label>
                    <Select
                      value={schedule.weekOfMonth?.toString() || "1"}
                      onValueChange={(value) => handleChange('weekOfMonth', parseInt(value))}
                    >
                      <SelectTrigger id="weekOfMonth">
                        <SelectValue placeholder="Select week of month" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">First</SelectItem>
                        <SelectItem value="2">Second</SelectItem>
                        <SelectItem value="3">Third</SelectItem>
                        <SelectItem value="4">Fourth</SelectItem>
                        <SelectItem value="-1">Last</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="dayOfWeek">Day of Week</Label>
                    <Select
                      value={schedule.dayOfWeek?.toString() || "1"}
                      onValueChange={(value) => handleChange('dayOfWeek', parseInt(value))}
                    >
                      <SelectTrigger id="dayOfWeek">
                        <SelectValue placeholder="Select day of week" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">Sunday</SelectItem>
                        <SelectItem value="1">Monday</SelectItem>
                        <SelectItem value="2">Tuesday</SelectItem>
                        <SelectItem value="3">Wednesday</SelectItem>
                        <SelectItem value="4">Thursday</SelectItem>
                        <SelectItem value="5">Friday</SelectItem>
                        <SelectItem value="6">Saturday</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}
            </div>
          )}
          
          {schedule.scheduleType === ScheduleType.CUSTOM && (
            <div className="space-y-2">
              <Label htmlFor="description">Custom Schedule Description</Label>
              <Textarea
                id="description"
                value={schedule.description || ''}
                onChange={(e) => handleChange('description', e.target.value)}
                rows={3}
                placeholder="Describe the custom schedule pattern"
              />
            </div>
          )}
          
          <Separator className="my-4" />
          
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Preview (Next 5 Occurrences)</h3>
            
            {error && (
              <div className="flex items-center p-3 text-sm bg-destructive/15 text-destructive rounded-md">
                <AlertTriangle className="h-4 w-4 mr-2" />
                {error}
              </div>
            )}
            
            {preview.length > 0 ? (
              <div className="flex flex-wrap gap-2 mt-2">
                {preview.map((occurrence, index) => (
                  <Badge key={index} variant="secondary">
                    {format(new Date(occurrence.date), 'EEE, MMM d, yyyy')}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No occurrences to preview.
              </p>
            )}
          </div>
        </form>
      </CardContent>
      
      <CardFooter className="flex justify-end gap-2">
        <Button 
          variant="outline" 
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button 
          type="submit"
          onClick={handleSubmit}
          disabled={!schedule.scheduleType || 
            (schedule.scheduleType === ScheduleType.WEEKLY && (!schedule.daysOfWeek || schedule.daysOfWeek.length === 0))}
        >
          Save Schedule
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ScheduleBuilder;
