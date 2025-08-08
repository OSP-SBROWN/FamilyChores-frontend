import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { CheckCircle2, Clock, User, AlertCircle, CheckCircle, Filter } from "lucide-react";
import { Separator } from "../ui/separator";
import { ConfirmationDialog } from "../ui/confirmation-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import type { ChoreAssignment, ChoreAssignmentStatus } from "../../types/chore";
import type { Timezone } from "../../types/timezone";
import type { Person } from "../../types/person";
import { ScrollArea } from "../ui/scroll-area";

interface DailyAssignmentsViewProps {
  assignments: ChoreAssignment[];
  completedAssignments: ChoreAssignment[];
  choresMap: Record<string, { title: string; timezoneId?: string | null }>;
  peopleMap: Record<string, { name: string; photo_url?: string }>;
  timezones: Timezone[];
  onComplete: (assignmentId: string, personId: string) => void;
  onAutoAssign: () => void;
  people: Person[];
  isLoading: boolean;
}

export function DailyAssignmentsView({
  assignments,
  completedAssignments,
  choresMap,
  peopleMap,
  timezones,
  onComplete,
  onAutoAssign,
  people,
  isLoading,
}: DailyAssignmentsViewProps) {
  const [activeTab, setActiveTab] = useState("pending");
  const [selectedPersonFilter, setSelectedPersonFilter] = useState<string | null>(null);
  const [completeConfirmation, setCompleteConfirmation] = useState<{
    isOpen: boolean;
    assignmentId: string | null;
    choreTitle: string;
    personId: string | null;
  }>({
    isOpen: false,
    assignmentId: null,
    choreTitle: "",
    personId: null
  });

  // Group assignments by timezone
  const assignmentsByTimezone = assignments.reduce((acc, assignment) => {
    const timezoneId = choresMap[assignment.choreId]?.timezoneId || "uncategorized";
    if (!acc[timezoneId]) {
      acc[timezoneId] = [];
    }
    
    // Only show assignments for the selected person if filter is active
    if (!selectedPersonFilter || assignment.personId === selectedPersonFilter || 
        (assignment.assignmentType === 'ALL' || assignment.assignmentType === 'ANYONE' || assignment.assignmentType === 'EVERYONE')) {
      acc[timezoneId].push(assignment);
    }
    
    return acc;
  }, {} as Record<string, ChoreAssignment[]>);

  // Filter completed assignments by selected person
  const filteredCompletedAssignments = selectedPersonFilter 
    ? completedAssignments.filter(a => a.personId === selectedPersonFilter || a.completedBy === selectedPersonFilter)
    : completedAssignments;

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

  if (isLoading) {
    return (
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Daily Assignments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-12">
            <div className="animate-pulse flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-slate-200 mb-4"></div>
              <div className="h-4 w-48 bg-slate-200 rounded mb-2"></div>
              <div className="h-3 w-36 bg-slate-200 rounded"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const EmptyState = ({ message }: { message: string }) => (
    <div className="text-center py-10 border border-dashed rounded-lg bg-slate-50">
      <AlertCircle className="mx-auto h-12 w-12 text-slate-400" />
      <h3 className="mt-2 text-xl font-semibold text-slate-900">No assignments found</h3>
      <p className="mt-1 text-slate-500">{message}</p>
    </div>
  );

  return (
    <Card className="shadow-md">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle>Daily Assignments</CardTitle>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onAutoAssign}
              className="flex gap-2 items-center"
            >
              <CheckCircle className="h-4 w-4" /> Auto-Assign
            </Button>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-2 mt-2">
          <div className="flex items-center mr-2">
            <Filter className="h-4 w-4 mr-1" />
            <span className="text-sm text-gray-500">Filter by person:</span>
          </div>
          <Button 
            variant={selectedPersonFilter === null ? "secondary" : "outline"} 
            size="sm" 
            onClick={() => setSelectedPersonFilter(null)} 
            className="text-xs h-8 px-2"
          >
            All
          </Button>
          {people.map(person => (
            <Button 
              key={person.id} 
              variant={selectedPersonFilter === person.id ? "secondary" : "outline"}
              size="sm"
              onClick={() => setSelectedPersonFilter(person.id)}
              className="text-xs h-8 px-2 flex items-center gap-1"
            >
              <Avatar className="h-5 w-5">
                {person.photo_url && <AvatarImage src={person.photo_url} alt={person.name} />}
                <AvatarFallback className="text-[10px]">
                  {person.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              {person.name}
            </Button>
          ))}
        </div>
      </CardHeader>
      
      <CardContent className="pt-4">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>

          <TabsContent value="pending">
            {Object.keys(assignmentsByTimezone).length === 0 ? (
              <EmptyState message="No pending assignments for today." />
            ) : (
              <ScrollArea className="max-h-[60vh]">
                <div className="space-y-6">
                  {/* First show assignments with timezones, ordered by timezone */}
                  {timezones.map(timezone => {
                    const timezoneAssignments = assignmentsByTimezone[timezone.id] || [];
                    if (timezoneAssignments.length === 0) return null;
                    
                    return (
                      <div key={timezone.id} className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Clock className="h-5 w-5 text-blue-500" />
                          <h3 className="text-lg font-semibold text-blue-800">{timezone.name}</h3>
                        </div>
                        <div className="space-y-2 pl-7">
                          {timezoneAssignments.map(assignment => (
                            <div 
                              key={assignment.id} 
                              className="border rounded-lg p-3 hover:shadow-md transition-shadow bg-white"
                            >
                              <div className="flex justify-between items-start gap-2">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2">
                                    <h4 className="font-medium">
                                      {choresMap[assignment.choreId]?.title || "Unknown Chore"}
                                    </h4>
                                    {getStatusBadge(assignment.status)}
                                  </div>
                                  
                                  <div className="flex flex-wrap gap-2 mt-2">
                                    {assignment.assignmentType === 'ALL' || assignment.assignmentType === 'EVERYONE' ? (
                                      // For "ALL" or "EVERYONE" type, show all people with completion buttons for each
                                      people.map(person => (
                                        <div key={person.id} className="flex items-center gap-2 border rounded-md p-1 px-2 bg-gray-50">
                                          <Avatar className="h-6 w-6">
                                            {person.photo_url && <AvatarImage src={person.photo_url} alt={person.name} />}
                                            <AvatarFallback className="text-xs">
                                              {person.name.split(' ').map(n => n[0]).join('')}
                                            </AvatarFallback>
                                          </Avatar>
                                          <span className="text-sm">{person.name}</span>
                                          <Button
                                            size="sm"
                                            variant="ghost"
                                            className="h-6 w-6 p-0 rounded-full hover:bg-green-100"
                                            onClick={() => setCompleteConfirmation({
                                              isOpen: true,
                                              assignmentId: assignment.id,
                                              choreTitle: choresMap[assignment.choreId]?.title || "Unknown Chore",
                                              personId: person.id
                                            })}
                                          >
                                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                                          </Button>
                                        </div>
                                      ))
                                    ) : (
                                      // For other types, show assigned person or "Unassigned"
                                      <div className="flex items-center gap-2">
                                        <User className="h-4 w-4 text-gray-500" />
                                        <span className="text-sm text-gray-600">
                                          {assignment.personId 
                                            ? peopleMap[assignment.personId]?.name || "Unknown Person"
                                            : "Unassigned"}
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                                
                                {/* Only show the complete button for single-person assignments */}
                                {(assignment.assignmentType !== 'ALL' && assignment.assignmentType !== 'EVERYONE') && (
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => setCompleteConfirmation({
                                      isOpen: true,
                                      assignmentId: assignment.id,
                                      choreTitle: choresMap[assignment.choreId]?.title || "Unknown Chore",
                                      personId: assignment.personId
                                    })}
                                    className="h-8 px-2 flex gap-1 text-green-600 hover:text-green-700 hover:bg-green-50"
                                  >
                                    <CheckCircle2 className="h-4 w-4" />
                                    Complete
                                  </Button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                  
                  {/* Then show assignments without timezones */}
                  {assignmentsByTimezone["uncategorized"] && assignmentsByTimezone["uncategorized"].length > 0 && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-semibold text-gray-700">Other Tasks</h3>
                      </div>
                      <div className="space-y-2 pl-7">
                        {assignmentsByTimezone["uncategorized"].map(assignment => (
                          <div 
                            key={assignment.id} 
                            className="border rounded-lg p-3 hover:shadow-md transition-shadow bg-white"
                          >
                            <div className="flex justify-between items-start gap-2">
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <h4 className="font-medium">
                                    {choresMap[assignment.choreId]?.title || "Unknown Chore"}
                                  </h4>
                                  {getStatusBadge(assignment.status)}
                                </div>
                                
                                <div className="flex flex-wrap gap-2 mt-2">
                                  {assignment.assignmentType === 'ALL' || assignment.assignmentType === 'EVERYONE' ? (
                                    // For "ALL" or "EVERYONE" type, show all people with completion buttons for each
                                    people.map(person => (
                                      <div key={person.id} className="flex items-center gap-2 border rounded-md p-1 px-2 bg-gray-50">
                                        <Avatar className="h-6 w-6">
                                          {person.photo_url && <AvatarImage src={person.photo_url} alt={person.name} />}
                                          <AvatarFallback className="text-xs">
                                            {person.name.split(' ').map(n => n[0]).join('')}
                                          </AvatarFallback>
                                        </Avatar>
                                        <span className="text-sm">{person.name}</span>
                                        <Button
                                          size="sm"
                                          variant="ghost"
                                          className="h-6 w-6 p-0 rounded-full hover:bg-green-100"
                                          onClick={() => setCompleteConfirmation({
                                            isOpen: true,
                                            assignmentId: assignment.id,
                                            choreTitle: choresMap[assignment.choreId]?.title || "Unknown Chore",
                                            personId: person.id
                                          })}
                                        >
                                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                                        </Button>
                                      </div>
                                    ))
                                  ) : (
                                    // For other types, show assigned person or "Unassigned"
                                    <div className="flex items-center gap-2">
                                      <User className="h-4 w-4 text-gray-500" />
                                      <span className="text-sm text-gray-600">
                                        {assignment.personId 
                                          ? peopleMap[assignment.personId]?.name || "Unknown Person"
                                          : "Unassigned"}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>
                              
                              {/* Only show the complete button for single-person assignments */}
                              {(assignment.assignmentType !== 'ALL' && assignment.assignmentType !== 'EVERYONE') && (
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => setCompleteConfirmation({
                                    isOpen: true,
                                    assignmentId: assignment.id,
                                    choreTitle: choresMap[assignment.choreId]?.title || "Unknown Chore",
                                    personId: assignment.personId
                                  })}
                                  className="h-8 px-2 flex gap-1 text-green-600 hover:text-green-700 hover:bg-green-50"
                                >
                                  <CheckCircle2 className="h-4 w-4" />
                                  Complete
                                </Button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>
            )}
          </TabsContent>

          <TabsContent value="completed">
            {filteredCompletedAssignments.length === 0 ? (
              <EmptyState message="No completed assignments yet for today." />
            ) : (
              <ScrollArea className="max-h-[60vh]">
                <div className="space-y-2">
                  {filteredCompletedAssignments.map(assignment => (
                    <div 
                      key={assignment.id} 
                      className="border rounded-lg p-3 hover:shadow-md transition-shadow bg-white/80"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium">
                              {choresMap[assignment.choreId]?.title || "Unknown Chore"}
                            </h4>
                            {getStatusBadge(assignment.status)}
                          </div>
                          
                          <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <User className="h-4 w-4" />
                              <span>
                                Completed by: {assignment.completedBy 
                                  ? peopleMap[assignment.completedBy]?.name || "Unknown Person"
                                  : peopleMap[assignment.personId || ""]?.name || "Unknown Person"}
                              </span>
                            </div>
                            
                            {assignment.completedAt && (
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                <span>
                                  {new Date(assignment.completedAt).toLocaleTimeString([], { 
                                    hour: '2-digit', 
                                    minute: '2-digit'
                                  })}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </TabsContent>
        </Tabs>
        
        {/* Complete Confirmation Dialog */}
        <ConfirmationDialog
          isOpen={completeConfirmation.isOpen}
          onClose={() => setCompleteConfirmation(prev => ({ ...prev, isOpen: false }))}
          onConfirm={() => {
            if (completeConfirmation.assignmentId && onComplete) {
              onComplete(
                completeConfirmation.assignmentId, 
                completeConfirmation.personId || ""
              );
              setCompleteConfirmation({ 
                isOpen: false, 
                assignmentId: null, 
                choreTitle: "",
                personId: null
              });
            }
          }}
          title="Mark Chore as Complete"
          description={`Are you sure you want to mark "${completeConfirmation.choreTitle}" as completed?`}
          confirmText="Complete"
          destructive={false}
        />
      </CardContent>
    </Card>
  );
}
