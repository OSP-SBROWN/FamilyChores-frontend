import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { CheckCircle2, Clock, User, AlertCircle } from "lucide-react";
import { useState } from "react";
import type { ChoreAssignment, ChoreAssignmentStatus } from "../../types/chore";
import { ConfirmationDialog } from "../ui/confirmation-dialog";

interface AssignmentsListProps {
  assignments: ChoreAssignment[];
  peopleMap: Record<string, { name: string; }>;
  choresMap: Record<string, { title: string; }>;
  onComplete?: (assignmentId: string) => void;
}

export default function AssignmentsList({ assignments, peopleMap, choresMap, onComplete }: AssignmentsListProps) {
  const [completeConfirmation, setCompleteConfirmation] = useState<{
    isOpen: boolean;
    assignmentId: string | null;
    choreTitle: string;
  }>({
    isOpen: false,
    assignmentId: null,
    choreTitle: ""
  });
  const getStatusBadge = (status: ChoreAssignmentStatus) => {
    switch (status) {
      case 'PENDING':
        return <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">Pending</Badge>;
      case 'COMPLETED':
        return <Badge className="bg-green-500">Completed</Badge>;
      case 'OVERDUE':
        return <Badge variant="destructive">Overdue</Badge>;
      case 'SKIPPED':
        return <Badge variant="outline" className="bg-gray-100 text-gray-500">Skipped</Badge>;
      default:
        return null;
    }
  };

  if (!assignments || assignments.length === 0) {
    return (
      <div className="text-center py-10 border border-dashed rounded-lg bg-slate-50">
        <AlertCircle className="mx-auto h-12 w-12 text-slate-400" />
        <h3 className="mt-2 text-xl font-semibold text-slate-900">No assignments yet</h3>
        <p className="mt-1 text-slate-500">Assignments will appear here when chores are assigned.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {assignments.map((assignment) => (
        <div 
          key={assignment.id} 
          className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-white"
        >
          <div className="flex justify-between items-start mb-3">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold">
                  {choresMap[assignment.choreId]?.title || "Unknown Chore"}
                </h3>
                {getStatusBadge(assignment.status)}
              </div>
              
              <div className="text-gray-600 text-sm mt-1 flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>
                  {assignment.personId 
                    ? peopleMap[assignment.personId]?.name || "Unknown Person"
                    : "Unassigned"}
                </span>
              </div>
            </div>
            
            {assignment.status === 'PENDING' && onComplete && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setCompleteConfirmation({
                  isOpen: true,
                  assignmentId: assignment.id,
                  choreTitle: choresMap[assignment.choreId]?.title || "Unknown Chore"
                })}
                className="h-8 px-3 flex gap-2 text-green-600 hover:text-green-700 hover:bg-green-50"
              >
                <CheckCircle2 className="h-4 w-4" />
                Complete
              </Button>
            )}
          </div>
          
          <div className="grid grid-cols-2 gap-3 text-sm">
            {assignment.dueDate && (
              <div className="flex items-center gap-2 text-gray-600">
                <Clock className="h-4 w-4" />
                <span>Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>
              </div>
            )}
            
            {assignment.completedAt && (
              <div className="flex items-center gap-2 text-gray-600">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <span>Completed: {new Date(assignment.completedAt).toLocaleDateString()}</span>
              </div>
            )}
          </div>
        </div>
      ))}
      
      {/* Complete Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={completeConfirmation.isOpen}
        onClose={() => setCompleteConfirmation(prev => ({ ...prev, isOpen: false }))}
        onConfirm={() => {
          if (completeConfirmation.assignmentId && onComplete) {
            onComplete(completeConfirmation.assignmentId);
            setCompleteConfirmation({ isOpen: false, assignmentId: null, choreTitle: "" });
          }
        }}
        title="Mark Chore as Complete"
        description={`Are you sure you want to mark "${completeConfirmation.choreTitle}" as completed?`}
        confirmText="Complete"
        destructive={false}
      />
    </div>
  );
}
