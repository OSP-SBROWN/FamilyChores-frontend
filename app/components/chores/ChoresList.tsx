import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Trash2, Edit, Calendar, Clock, Users, AlertCircle, SquareCheck } from "lucide-react";
import type { Chore, ChoreAssignmentType, ChoreFrequency, ChoreStatus } from "../../types/chore";

interface ChoresListProps {
  chores: Chore[];
  onEdit?: (chore: Chore) => void;
  onDelete?: (id: string) => void;
}

export default function ChoresList({ chores, onEdit, onDelete }: ChoresListProps) {
  const getAssignmentTypeBadge = (type: ChoreAssignmentType) => {
    switch (type) {
      case 'SINGLE':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Single</Badge>;
      case 'ANY':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Any One</Badge>;
      case 'ALL':
        return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">All</Badge>;
      case 'ANYONE':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Anyone</Badge>;
      case 'EVERYONE':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Everyone</Badge>;
      default:
        return null;
    }
  };

  const getFrequencyBadge = (frequency: ChoreFrequency) => {
    switch (frequency) {
      case 'ONCE':
        return <Badge variant="outline" className="bg-slate-50 text-slate-700 border-slate-200">Once</Badge>;
      case 'DAILY':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Daily</Badge>;
      case 'WEEKLY':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Weekly</Badge>;
      case 'BIWEEKLY':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Biweekly</Badge>;
      case 'MONTHLY':
        return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">Monthly</Badge>;
      case 'CUSTOM':
        return <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">Custom</Badge>;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: ChoreStatus) => {
    switch (status) {
      case 'ACTIVE':
        return <Badge className="bg-emerald-500">Active</Badge>;
      case 'INACTIVE':
        return <Badge variant="outline" className="text-slate-500 border-slate-300">Inactive</Badge>;
      case 'COMPLETED':
        return <Badge className="bg-blue-500">Completed</Badge>;
      case 'DELETED':
        return <Badge variant="destructive">Deleted</Badge>;
      default:
        return null;
    }
  };

  if (!chores || chores.length === 0) {
    return (
      <div className="text-center py-10 border border-dashed rounded-lg bg-slate-50">
        <AlertCircle className="mx-auto h-12 w-12 text-slate-400" />
        <h3 className="mt-2 text-xl font-semibold text-slate-900">No chores yet</h3>
        <p className="mt-1 text-slate-500">Get started by adding a new chore.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {chores.map((chore) => (
        <div 
          key={chore.id} 
          className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-white"
        >
          <div className="flex justify-between items-start mb-3">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold">{chore.title}</h3>
                {chore.isRewardBased && (
                  <Badge className="bg-amber-500">
                    💰 Reward: ${chore.rewardAmount?.toFixed(2) || "0.00"}
                  </Badge>
                )}
                {getStatusBadge(chore.status)}
              </div>
              {chore.description && (
                <p className="text-gray-600 text-sm mt-1">{chore.description}</p>
              )}
            </div>
            <div className="flex gap-2">
              {onEdit && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onEdit(chore)}
                  className="h-8 px-2"
                >
                  <Edit className="h-4 w-4" />
                </Button>
              )}
              {onDelete && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onDelete(chore.id)}
                  className="h-8 px-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <Calendar className="h-4 w-4" />
              <span>Frequency:</span>
              {getFrequencyBadge(chore.frequency)}
            </div>
            
            <div className="flex items-center gap-2 text-gray-600">
              <Users className="h-4 w-4" />
              <span>Assignment:</span>
              {getAssignmentTypeBadge(chore.assignmentType)}
            </div>
            
            <div className="flex items-center gap-2 text-gray-600">
              <Clock className="h-4 w-4" />
              <span>{chore.isTimeSensitive ? (
                <>Time: <span className="font-medium text-blue-600">{chore.timezoneName || "Unknown"}</span></>
              ) : (
                <span className="text-gray-500">Not time sensitive</span>
              )}</span>
            </div>
            
            <div className="flex items-center gap-2 text-gray-600">
              <SquareCheck className="h-4 w-4" />
              <span>Created: {new Date(chore.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
