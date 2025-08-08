import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Switch } from "../ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { ChoreAssignmentType, ChoreFrequency } from "../../types/chore";
import { CheckSquare, Calendar, Plus } from "lucide-react";
import type { Person } from "../../types/person";
import type { Timezone } from "../../types/timezone";
import type { Chore, ChoreCreateDto } from "../../types/chore";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

interface ChoreFormModalProps {
  people: Person[];
  timezones: Timezone[];
  onSubmit: (data: ChoreCreateDto) => void;
  isSubmitting?: boolean;
  chore?: Chore; // For editing an existing chore
  buttonText?: string; // Custom text for the trigger button
  buttonVariant?: "default" | "outline" | "secondary" | "destructive" | "link" | "ghost";
}

export default function ChoreFormModal({
  people,
  timezones,
  onSubmit,
  isSubmitting = false,
  chore,
  buttonText = "Add New Chore",
  buttonVariant = "default"
}: ChoreFormModalProps) {
  // State for the dialog
  const [open, setOpen] = useState(false);
  
  // Form state
  const [title, setTitle] = useState(chore?.title || "");
  const [description, setDescription] = useState(chore?.description || "");
  const [isTimeSensitive, setIsTimeSensitive] = useState(chore?.isTimeSensitive || false);
  const [timezoneId, setTimezoneId] = useState<string | undefined>(chore?.timezoneId || undefined);
  const [assignmentType, setAssignmentType] = useState<ChoreAssignmentType>(chore?.assignmentType || ChoreAssignmentType.SINGLE);
  const [frequency, setFrequency] = useState<ChoreFrequency>(chore?.frequency || ChoreFrequency.ONCE);
  const [selectedPeople, setSelectedPeople] = useState<string[]>([]); // This would need to be populated from chore.capablePersonIds if we had that data
  const [isRewardBased, setIsRewardBased] = useState(chore?.isRewardBased || false);
  const [rewardAmount, setRewardAmount] = useState<number | undefined>(chore?.rewardAmount);
  const [category, setCategory] = useState<string | undefined>(chore?.category);
  const [localIsSubmitting, setLocalIsSubmitting] = useState(false);

  // Reset form function
  const resetForm = () => {
    if (chore) {
      // If editing, reset to chore values
      setTitle(chore.title);
      setDescription(chore.description || "");
      setIsTimeSensitive(chore.isTimeSensitive);
      setTimezoneId(chore.timezoneId || undefined);
      setAssignmentType(chore.assignmentType);
      setFrequency(chore.frequency);
      setSelectedPeople([]); // Would need chore.capablePersonIds
      setIsRewardBased(chore.isRewardBased);
      setRewardAmount(chore.rewardAmount);
      setCategory(chore.category);
    } else {
      // If adding new, reset to defaults
      setTitle("");
      setDescription("");
      setIsTimeSensitive(false);
      setTimezoneId(undefined);
      setAssignmentType(ChoreAssignmentType.SINGLE);
      setFrequency(ChoreFrequency.ONCE);
      setSelectedPeople([]);
      setIsRewardBased(false);
      setRewardAmount(undefined);
      setCategory(undefined);
    }
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
        rewardAmount: isRewardBased ? rewardAmount : undefined,
        category
      };
      
      console.log("Submitting chore data:", choreData);
      
      await onSubmit(choreData);
      
      // Reset the form on successful submission
      resetForm();
      
      // Close the dialog
      setOpen(false);
      
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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={buttonVariant} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          {buttonText}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{chore ? "Edit Chore" : "Add New Chore"}</DialogTitle>
          <DialogDescription>
            {chore 
              ? "Make changes to the chore details below." 
              : "Fill out the form below to create a new chore."}
          </DialogDescription>
        </DialogHeader>

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

          <div className="space-y-2">
            <Label htmlFor="category">Category (Optional)</Label>
            <Input
              id="category"
              value={category || ""}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="e.g. Morning Tasks, Kitchen Duties"
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
                value={timezoneId || ""} 
                onValueChange={(value: string) => setTimezoneId(value)}
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
              onValueChange={(value: string) => setFrequency(value as ChoreFrequency)}
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
              onValueChange={(value: string) => setAssignmentType(value as ChoreAssignmentType)}
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

          <DialogFooter className="mt-6">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting || localIsSubmitting || !title}
            >
              {isSubmitting || localIsSubmitting ? "Saving..." : chore ? "Update Chore" : "Create Chore"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
