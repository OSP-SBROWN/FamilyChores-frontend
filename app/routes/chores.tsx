import { useState } from "react";
import AppLayout from "../components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

// Import chores components
import ChoresList from "../components/chores/ChoresList";
import ChoreForm from "../components/chores/ChoreForm";
import AssignmentsList from "../components/chores/AssignmentsList";

export default function Chores() {
  const [activeTab, setActiveTab] = useState("manage");
  
  // We'll implement these queries later
  const { data: choresData, isLoading: choresLoading } = useQuery({
    queryKey: ["chores"],
    queryFn: async () => {
      // Placeholder for API call
      return [];
    },
  });

  const { data: peopleData, isLoading: peopleLoading } = useQuery({
    queryKey: ["people"],
    queryFn: async () => {
      // Placeholder for API call
      return [];
    },
  });
  
  const { data: timezonesData, isLoading: timezonesLoading } = useQuery({
    queryKey: ["timezones"],
    queryFn: async () => {
      // Placeholder for API call
      return [];
    },
  });
  
  const isLoading = choresLoading || peopleLoading || timezonesLoading;

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
                        onEdit={(chore) => {
                          console.log("Edit chore:", chore);
                          // We'll implement this later
                        }}
                        onDelete={(id) => {
                          console.log("Delete chore:", id);
                          // We'll implement this later
                        }}
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
                        onSubmit={(data) => {
                          console.log("Create chore:", data);
                          // We'll implement this later
                        }}
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
                    assignments={[]} 
                    peopleMap={{}} 
                    choresMap={{}}
                    onComplete={(id) => {
                      console.log("Complete assignment:", id);
                      // We'll implement this later
                    }}
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
