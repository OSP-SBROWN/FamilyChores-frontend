import { useState } from "react";
import AppLayout from "../components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

// Import chores components
import ChoresList from "../components/chores/ChoresList";
import ChoreForm from "../components/chores/ChoreForm";
import AssignmentsList from "../components/chores/AssignmentsList";
import { PersonService } from "../services/people";
import { TimezoneService } from "../services/timezones";
import * as ChoreService from "../services/chore.service";

// Import types
import type { Chore, ChoreAssignment, ChoreCreateDto } from "../types/chore";
import { ChoreAssignmentStatus } from "../types/chore";
import type { Person } from "../types/person";
import type { Timezone } from "../types/timezone";

export default function Chores() {
  const [activeTab, setActiveTab] = useState("manage");
  const [isCreating, setIsCreating] = useState(false);
  const queryClient = useQueryClient();
  
  // Fetch chores data
  const { data: choresData, isLoading: choresLoading } = useQuery<Chore[]>({
    queryKey: ["chores"],
    queryFn: async () => {
      try {
        return await ChoreService.getChores();
      } catch (error) {
        console.error("Failed to fetch chores:", error);
        return [];
      }
    },
  });

  // Fetch people data
  const { data: peopleData, isLoading: peopleLoading } = useQuery<Person[]>({
    queryKey: ["people"],
    queryFn: async () => {
      try {
        return await PersonService.getAllPeople();
      } catch (error) {
        console.error("Failed to fetch people:", error);
        return [];
      }
    },
  });
  
  // Fetch timezones data
  const { data: timezonesData, isLoading: timezonesLoading } = useQuery<Timezone[]>({
    queryKey: ["timezones"],
    queryFn: async () => {
      try {
        return await TimezoneService.getAll();
      } catch (error) {
        console.error("Failed to fetch timezones:", error);
        return [];
      }
    },
  });
  
  // Fetch assignments data
  const { data: assignmentsData, isLoading: assignmentsLoading } = useQuery<ChoreAssignment[]>({
    queryKey: ["choreAssignments"],
    queryFn: async () => {
      try {
        return await ChoreService.getChoreAssignments();
      } catch (error) {
        console.error("Failed to fetch assignments:", error);
        return [];
      }
    },
  });
  
  const isLoading = choresLoading || peopleLoading || timezonesLoading || assignmentsLoading;
  
  // Create maps for the assignments list
  const peopleMap: Record<string, { name: string }> = {};
  if (peopleData) {
    peopleData.forEach(person => {
      peopleMap[person.id] = { name: person.name };
    });
  }

  // Create a map of chores for assignments list
  const choresMap: Record<string, { title: string }> = {};
  if (choresData) {
    choresData.forEach(chore => {
      choresMap[chore.id] = { title: chore.title };
    });
  }
  
  // Handler functions
  const handleCreateChore = async (data: ChoreCreateDto) => {
    try {
      setIsCreating(true);
      console.log("Creating chore with data:", data);
      
      // Ensure all required fields are present and formatted correctly
      const choreData: ChoreCreateDto = {
        ...data,
        // Ensure assignmentType and frequency are properly set as enum values
        assignmentType: data.assignmentType,
        frequency: data.frequency,
        // Make sure we have a valid timezoneId or undefined (not null or empty string)
        timezoneId: data.isTimeSensitive && data.timezoneId ? data.timezoneId : undefined,
        // Ensure capablePersonIds is an array
        capablePersonIds: data.capablePersonIds || []
      };
      
      const response = await ChoreService.createChore(choreData);
      console.log("Chore created successfully:", response);
      
      // Refresh the chores list
      queryClient.invalidateQueries({ queryKey: ['chores'] });
      
      // Add success notification if you have a notification system
      // toast.success("Chore created successfully");
      
      // Reset the form by forcing a re-render (you could implement a form reset function)
      setActiveTab("manage");
      
      return response; // Return the response for the form component to know it succeeded
    } catch (error) {
      console.error("Error creating chore:", error);
      // Add error notification if you have a notification system
      // toast.error("Failed to create chore");
      throw error; // Re-throw to let the form component know it failed
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteChore = async (id: string) => {
    try {
      await ChoreService.deleteChore(id);
      queryClient.invalidateQueries({ queryKey: ['chores'] });
    } catch (error) {
      console.error("Error deleting chore:", error);
    }
  };

  const handleCompleteAssignment = async (assignmentId: string) => {
    try {
      await ChoreService.updateChoreAssignment({
        id: assignmentId,
        status: ChoreAssignmentStatus.COMPLETED,
        completedAt: new Date().toISOString()
      });
      queryClient.invalidateQueries({ queryKey: ['choreAssignments'] });
    } catch (error) {
      console.error("Error completing assignment:", error);
    }
  };

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-[#023047]">Chore Management</h1>
        
        <Tabs 
          defaultValue="manage" 
          className="w-full" 
          value={activeTab} 
          onValueChange={setActiveTab}
        >
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="manage">Manage Chores</TabsTrigger>
            <TabsTrigger value="assignments">Assignments</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>
          
          <TabsContent value="manage" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card className="shadow-md">
                  <CardHeader>
                    <CardTitle>Chore List</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isLoading ? (
                      <div className="flex justify-center py-8">
                        <Loader2 className="animate-spin h-8 w-8 text-[#219EBC]" />
                      </div>
                    ) : (
                      <ChoresList 
                        chores={choresData || []} 
                        onEdit={(chore: Chore) => {
                          console.log("Edit chore:", chore);
                          // We'll implement this later
                        }}
                        onDelete={handleDeleteChore}
                      />
                    )}
                  </CardContent>
                </Card>
              </div>
              
              <div>
                <Card className="shadow-md">
                  <CardHeader>
                    <CardTitle>Add New Chore</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isLoading ? (
                      <div className="flex justify-center py-8">
                        <Loader2 className="animate-spin h-8 w-8 text-[#219EBC]" />
                      </div>
                    ) : (
                      <ChoreForm 
                        people={peopleData || []} 
                        timezones={timezonesData || []}
                        onSubmit={handleCreateChore}
                        isSubmitting={isCreating}
                      />
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="assignments">
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle>Chore Assignments</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="animate-spin h-8 w-8 text-[#219EBC]" />
                  </div>
                ) : (
                  <AssignmentsList 
                    assignments={assignmentsData || []} 
                    peopleMap={peopleMap} 
                    choresMap={choresMap}
                    onComplete={handleCompleteAssignment}
                  />
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="history">
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle>Chore Completion History</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center text-gray-500 py-8">
                  Chore history functionality coming soon!
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
