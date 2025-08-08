import { Link } from "react-router";
import { Clock, Users, Calendar, Settings, BarChart3, CheckSquare } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";

import AppLayout from "../components/AppLayout";
import ApiHealthIndicator from "../components/ApiHealthIndicator";
import { Card, CardContent, CardHeader } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Separator } from "../components/ui/separator";
import { DailyAssignmentsView } from "../components/assignments/DailyAssignmentsView";
import { PersonService } from "../services/people";
import * as ChoreService from "../services/chore.service";
import * as AssignmentService from "../services/assignment.service";
import { TimezoneService } from "../services/timezones";

import type { Person } from "../types/person";
import type { ChoreAssignment } from "../types/chore";
import type { Timezone } from "../types/timezone";
import type { Chore } from "../types/chore";

export default function Home() {
  const queryClient = useQueryClient();

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

  // Fetch pending assignments
  const { data: pendingAssignments, isLoading: pendingAssignmentsLoading } = useQuery<ChoreAssignment[]>({
    queryKey: ["pendingAssignments"],
    queryFn: async () => {
      try {
        return await AssignmentService.getPendingAssignments();
      } catch (error) {
        console.error("Failed to fetch pending assignments:", error);
        return [];
      }
    },
  });

  // Fetch completed assignments
  const { data: completedAssignments, isLoading: completedAssignmentsLoading } = useQuery<ChoreAssignment[]>({
    queryKey: ["completedAssignments"],
    queryFn: async () => {
      try {
        return await AssignmentService.getCompletedAssignments();
      } catch (error) {
        console.error("Failed to fetch completed assignments:", error);
        return [];
      }
    },
  });

  const isLoading = peopleLoading || 
                   choresLoading || 
                   timezonesLoading || 
                   pendingAssignmentsLoading || 
                   completedAssignmentsLoading;

  // Create maps for assignments view
  const peopleMap: Record<string, { name: string; photo_url?: string }> = {};
  if (peopleData) {
    peopleData.forEach(person => {
      peopleMap[person.id] = { 
        name: person.name,
        photo_url: person.photo_url
      };
    });
  }

  // Create a map of chores for assignments list
  const choresMap: Record<string, { title: string; timezoneId?: string | null }> = {};
  if (choresData) {
    choresData.forEach(chore => {
      choresMap[chore.id] = { 
        title: chore.title,
        timezoneId: chore.timezoneId
      };
    });
  }

  const handleCompleteAssignment = async (assignmentId: string, personId: string) => {
    try {
      await AssignmentService.completeAssignment(assignmentId, personId);
      queryClient.invalidateQueries({ queryKey: ['pendingAssignments'] });
      queryClient.invalidateQueries({ queryKey: ['completedAssignments'] });
    } catch (error) {
      console.error("Error completing assignment:", error);
    }
  };

  const handleAutoAssign = async () => {
    try {
      await AssignmentService.autoAssignChores();
      queryClient.invalidateQueries({ queryKey: ['pendingAssignments'] });
    } catch (error) {
      console.error("Error auto-assigning chores:", error);
    }
  };

  return (
    <AppLayout>
      <div className="relative overflow-hidden">
        {/* Very subtle background shapes */}
        <div className="absolute inset-0 opacity-3">
          <div className="absolute top-10 left-10 w-72 h-72 bg-gradient-to-r from-white/30 to-[#8ECAE6]/20 rounded-full blur-3xl"></div>
          <div className="absolute top-1/3 right-20 w-96 h-96 bg-gradient-to-r from-[#8ECAE6]/20 to-[#219EBC]/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-gradient-to-r from-white/20 to-[#8ECAE6]/20 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4 py-8 max-w-6xl relative z-10">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="relative mb-4">
              <h1 className="text-5xl md:text-6xl font-serif font-bold bg-gradient-to-r from-[#023047] via-[#219EBC] to-[#8ECAE6] bg-clip-text text-transparent mb-2 drop-shadow-sm">
                ChoreNest
              </h1>
              <div className="absolute -top-2 -left-2 w-full h-full bg-gradient-to-r from-[#8ECAE6]/30 to-[#219EBC]/30 blur-lg opacity-50 -z-10 rounded-lg"></div>
            </div>
          </div>
          
          {/* Daily Assignments View */}
          <div className="mb-8">
            <DailyAssignmentsView 
              assignments={pendingAssignments || []}
              completedAssignments={completedAssignments || []}
              choresMap={choresMap}
              peopleMap={peopleMap}
              timezones={timezonesData || []}
              onComplete={handleCompleteAssignment}
              onAutoAssign={handleAutoAssign}
              people={peopleData || []}
              isLoading={isLoading}
            />
          </div>
          
          <Separator className="my-8 bg-gradient-to-r from-transparent via-[#219EBC] to-transparent h-0.5" />

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-white/80 backdrop-blur-sm border border-[#8ECAE6]/30">
              <CardHeader className="flex flex-row items-center gap-4 pb-2">
                <div className="p-3 bg-gradient-to-br from-[#8ECAE6] to-[#219EBC] rounded-xl shadow-lg">
                  <Clock className="w-7 h-7 text-white" />
                </div>
                <div className="flex flex-col">
                  <h3 className="text-xl font-serif font-bold text-[#023047]">Timezone Management</h3>
                  <p className="text-sm text-[#219EBC]/80">Organize time periods</p>
                </div>
              </CardHeader>
              <CardContent className="pt-2">
                <p className="text-[#023047]/90 mb-6 leading-relaxed">
                  Create and manage time periods like "Before Breakfast" or "After School" 
                  with beautiful drag-and-drop reordering.
                </p>
                <Button
                  asChild
                  className="w-full bg-gradient-to-r from-[#8ECAE6] to-[#219EBC] text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                  size="lg"
                >
                  <Link to="/timezones">Manage Timezones</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-white/80 backdrop-blur-sm border border-[#FFB703]/30">
              <CardHeader className="flex flex-row items-center gap-4 pb-2">
                <div className="p-3 bg-gradient-to-br from-[#FFB703] to-[#FB8500] rounded-xl shadow-lg">
                  <Users className="w-7 h-7 text-white" />
                </div>
                <div className="flex flex-col">
                  <h3 className="text-xl font-serif font-bold text-[#023047]">People Management</h3>
                  <p className="text-sm text-[#FB8500]/80">Family members</p>
                </div>
              </CardHeader>
              <CardContent className="pt-2">
                <p className="text-[#023047]/90 mb-6 leading-relaxed">
                  Add and manage family members, set their preferences, and track 
                  their chore completion history.
                </p>
                <Button
                  asChild
                  className="w-full bg-gradient-to-r from-[#FFB703] to-[#FB8500] text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                  size="lg"
                >
                  <Link to="/people">Manage People</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-white/80 backdrop-blur-sm border border-[#219EBC]/30">
              <CardHeader className="flex flex-row items-center gap-4 pb-2">
                <div className="p-3 bg-gradient-to-br from-[#219EBC] to-[#8ECAE6] rounded-xl shadow-lg">
                  <CheckSquare className="w-7 h-7 text-white" />
                </div>
                <div className="flex flex-col">
                  <h3 className="text-xl font-serif font-bold text-[#023047]">Availability Matrix</h3>
                  <p className="text-sm text-[#219EBC]/80">Schedule management</p>
                </div>
              </CardHeader>
              <CardContent className="pt-2">
                <p className="text-[#023047]/90 mb-6 leading-relaxed">
                  Set when people are available across different days and time periods 
                  with an interactive grid interface.
                </p>
                <Button
                  asChild
                  className="w-full bg-gradient-to-r from-[#219EBC] to-[#8ECAE6] text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                  size="lg"
                >
                  <Link to="/availability">Manage Availability</Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* API Status */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <ApiHealthIndicator />
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
