import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Switch } from "../ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { ChoreAssignmentType, ChoreFrequency } from "../../types/chore";
import { CheckSquare, Calendar } from "lucide-react";
import type { Person } from "../../types/person";
import type { Timezone } from "../../types/timezone";
import type { ChoreCreateDto } from "../../types/chore";

interface ChoreFormProps {
  people: Person[];
  timezones: Timezone[];
  onSubmit: (data: ChoreCreateDto) => void;
  isSubmitting?: boolean;
}

export default function ChoreForm({ people, timezones, onSubmit, isSubmitting = false }: ChoreFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isTimeSensitive, setIsTimeSensitive] = useState(false);
  const [timezoneId, setTimezoneId] = useState<string | undefined>(undefined);
  const [assignmentType, setAssignmentType] = useState<ChoreAssignmentType>(ChoreAssignmentType.SINGLE);
  const [frequency, setFrequency] = useState<ChoreFrequency>(ChoreFrequency.ONCE);
  const [selectedPeople, setSelectedPeople] = useState<string[]>([]);
  const [isRewardBased, setIsRewardBased] = useState(false);
  const [rewardAmount, setRewardAmount] = useState<number | undefined>(undefined);
  const [localIsSubmitting, setLocalIsSubmitting] = useState(false);

  // Reset form function
  const resetForm = () => {
    setTitle("");
    setDescription("");
    setIsTimeSensitive(false);
    setTimezoneId(undefined);
    setAssignmentType(ChoreAssignmentType.SINGLE);
    setFrequency(ChoreFrequency.ONCE);
    setSelectedPeople([]);
    setIsRewardBased(false);
    setRewardAmount(undefined);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prevent double submission
    if (localIsSubmitting || isSubmitting) return;
    
    try {
      setLocalIsSubmitting(true);
      
      const choreData: ChoreCreateDto = {
        title,
        description: description || undefined,
        isTimeSensitive,
        timezoneId: isTimeSensitive ? timezoneId : undefined,
        assignmentType,
        frequency,
        capablePersonIds: selectedPeople,
        isRewardBased,
        rewardAmount: isRewardBased ? rewardAmount : undefined
      };
      
      console.log("Submitting chore data:", choreData);
      
      await onSubmit(choreData);
      
      // Reset the form on successful submission
      resetForm();
      console.log("Form reset after submission");
    } catch (error) {
      console.error("Error in form submission:", error);
    } finally {
      setLocalIsSubmitting(false);
    }
  };

  // Helper function to toggle person selection
  const togglePersonSelection = (personId: string) => {
    if (selectedPeople.includes(personId)) {
      setSelectedPeople(selectedPeople.filter(id => id !== personId));
    } else {
      setSelectedPeople([...selectedPeople, personId]);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Chore title"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description (Optional)</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Add details about this chore"
          rows={3}
        />
      </div>

      <div className="flex items-center justify-between">
        <Label htmlFor="isTimeSensitive" className="cursor-pointer">Time Sensitive</Label>
        <Switch
          id="isTimeSensitive"
          checked={isTimeSensitive}
          onCheckedChange={setIsTimeSensitive}
        />
      </div>

      {isTimeSensitive && (
        <div className="space-y-2">
          <Label htmlFor="timezone">Timezone/Time Period</Label>
          <Select 
            value={timezoneId} 
            onValueChange={(value) => setTimezoneId(value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a time period" />
            </SelectTrigger>
            <SelectContent>
              {timezones.map((timezone) => (
                <SelectItem key={timezone.id} value={timezone.id}>
                  {timezone.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="frequency">Frequency</Label>
        <Select 
          value={frequency} 
          onValueChange={(value) => setFrequency(value as ChoreFrequency)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select frequency" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ChoreFrequency.ONCE}>Once</SelectItem>
            <SelectItem value={ChoreFrequency.DAILY}>Daily</SelectItem>
            <SelectItem value={ChoreFrequency.WEEKLY}>Weekly</SelectItem>
            <SelectItem value={ChoreFrequency.BIWEEKLY}>Biweekly</SelectItem>
            <SelectItem value={ChoreFrequency.MONTHLY}>Monthly</SelectItem>
            <SelectItem value={ChoreFrequency.CUSTOM}>Custom</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="assignmentType">Assignment Type</Label>
        <Select 
          value={assignmentType} 
          onValueChange={(value) => setAssignmentType(value as ChoreAssignmentType)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select assignment type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ChoreAssignmentType.SINGLE}>Single Person</SelectItem>
            <SelectItem value={ChoreAssignmentType.ANY}>Any One Person</SelectItem>
            <SelectItem value={ChoreAssignmentType.ALL}>All Selected People</SelectItem>
            <SelectItem value={ChoreAssignmentType.ANYONE}>Anyone in Household</SelectItem>
            <SelectItem value={ChoreAssignmentType.EVERYONE}>Everyone in Household</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Who is capable of doing this chore?</Label>
        <div className="grid grid-cols-2 gap-2">
          {people.map((person) => (
            <Button
              key={person.id}
              type="button"
              variant={selectedPeople.includes(person.id) ? "default" : "outline"}
              className="justify-start"
              onClick={() => togglePersonSelection(person.id)}
            >
              <CheckSquare className={`mr-2 h-4 w-4 ${selectedPeople.includes(person.id) ? "opacity-100" : "opacity-0"}`} />
              {person.name}
            </Button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <Label htmlFor="isRewardBased" className="cursor-pointer">Reward Based</Label>
        <Switch
          id="isRewardBased"
          checked={isRewardBased}
          onCheckedChange={setIsRewardBased}
        />
      </div>

      {isRewardBased && (
        <div className="space-y-2">
          <Label htmlFor="rewardAmount">Reward Amount ($)</Label>
          <Input
            id="rewardAmount"
            type="number"
            min="0.01"
            step="0.01"
            value={rewardAmount || ""}
            onChange={(e) => setRewardAmount(e.target.value ? parseFloat(e.target.value) : undefined)}
            placeholder="0.00"
          />
        </div>
      )}

      <Button 
        type="submit" 
        className="w-full mt-6"
        disabled={isSubmitting || localIsSubmitting || !title}
      >
        {isSubmitting || localIsSubmitting ? "Saving..." : "Create Chore"}
      </Button>
    </form>
  );
}
