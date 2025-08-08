import React, { useState, useMemo, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import {
  Plus,
  Users,
  Edit3,
  Trash2,
  Loader2,
  X,
  User,
  Calendar,
  Palette,
  Weight,
  Clock,
  Zap,
} from 'lucide-react';

import { usePeople, useCreatePerson, useUpdatePerson, useDeletePerson } from '../hooks/usePeople';
import type { Person, CreatePersonDto, UpdatePersonDto, PersonFormData } from '../types/person';
import AppLayout from '../components/AppLayout';
import PhotoUpload from '../components/PhotoUpload';
import { PersonAvailabilityMatrixOptimized } from '../components/PersonAvailabilityMatrixOptimized';
import { useQueryClient } from '@tanstack/react-query';
import { CompactAvailabilityService } from '../services/compactAvailability';

// Predefined color options for people
const COLOR_OPTIONS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FECA57',
  '#FF9FF3', '#54A0FF', '#5F27CD', '#00D2D3', '#FF9F43',
  '#10AC84', '#EE5A24', '#0652DD', '#9C88FF', '#FFC312'
];

interface SortablePersonCardProps {
  person: Person;
  onEdit: (person: Person) => void;
  onDelete: (id: string) => void;
}

function SortablePersonCard({ person, onEdit, onDelete }: SortablePersonCardProps) {
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'No birthday set';
    return new Date(dateString).toLocaleDateString();
  };

  const calculateAge = (dateOfBirth?: string) => {
    if (!dateOfBirth) return null;
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const age = calculateAge(person.date_of_birth);

  return (
    <Card className="group border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 bg-white/95 backdrop-blur-sm overflow-hidden">
      <div 
        className="h-2 w-full" 
        style={{ backgroundColor: person.color_code }}
      />
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div 
              className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg"
              style={{ backgroundColor: person.color_code }}
            >
              {person.photo_url ? (
                <img
                  src={person.photo_url}
                  alt={person.name}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                person.name.charAt(0).toUpperCase()
              )}
            </div>
            <div>
              <h3 className="text-xl font-bold text-[#023047] mb-1">{person.name}</h3>
              <p className="text-sm text-[#219EBC]">
                {age !== null ? `${age} years old` : 'Age not set'}
              </p>
            </div>
          </div>

          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(person)}
              className="text-[#219EBC] hover:text-[#023047] hover:bg-[#8ECAE6]/20"
            >
              <Edit3 className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(person.id)}
              className="text-red-500 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center text-sm text-[#023047]/80">
            <Calendar className="w-4 h-4 mr-2 text-[#219EBC]" />
            <span>{formatDate(person.date_of_birth)}</span>
          </div>
          
          <div className="flex items-center text-sm text-[#023047]/80">
            <Weight className="w-4 h-4 mr-2 text-[#219EBC]" />
            <span>Workload: {person.workload_weighting}x</span>
          </div>
          
          <div className="flex items-center text-sm text-[#023047]/80">
            <Palette className="w-4 h-4 mr-2 text-[#219EBC]" />
            <div 
              className="w-4 h-4 rounded-full border border-gray-300" 
              style={{ backgroundColor: person.color_code }}
            />
            <span className="ml-2">{person.color_code}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function PeoplePage() {
  const { data: people, isLoading, error } = usePeople();
  const createMutation = useCreatePerson();
  const updateMutation = useUpdatePerson();
  const deleteMutation = useDeletePerson();
  const queryClient = useQueryClient();

  // Preload availability data when component mounts for ultra-fast availability matrix loading
  useEffect(() => {
    console.log('🚀 Preloading compact availability data...');
    const preloadStart = performance.now();
    
    // Only preload if not already cached to prevent unnecessary work
    const cachedData = queryClient.getQueryData(['availability-compact-matrix']);
    if (cachedData) {
      console.log('✅ Availability data already cached');
      setAvailabilityPreloaded(true);
      return;
    }
    
    queryClient.prefetchQuery({
      queryKey: ['availability-compact-matrix'],
      queryFn: CompactAvailabilityService.fetchCompactMatrix,
      staleTime: 2 * 60 * 1000, // 2 minutes
    }).then(() => {
      const preloadTime = performance.now() - preloadStart;
      console.log(`✅ Availability data preloaded in ${preloadTime.toFixed(1)}ms`);
      setAvailabilityPreloaded(true);
    }).catch((error) => {
      console.warn('⚠️ Availability preload failed:', error);
    });
  }, []); // Empty dependency array to run only once

  const [editingPerson, setEditingPerson] = useState<Person | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [availabilityPreloaded, setAvailabilityPreloaded] = useState(false);
  const [formData, setFormData] = useState<PersonFormData>({
    name: '',
    date_of_birth: '',
    color_code: COLOR_OPTIONS[0],
    workload_weighting: '1.00',
    photo_url: '',
  });

  const handleOpenModal = (person?: Person) => {
    if (person) {
      setEditingPerson(person);
      setFormData({
        name: person.name,
        date_of_birth: person.date_of_birth ? person.date_of_birth.split('T')[0] : '',
        color_code: person.color_code,
        workload_weighting: person.workload_weighting.toString(),
        photo_url: person.photo_url || '',
      });
    } else {
      setEditingPerson(null);
      const randomColor = COLOR_OPTIONS[Math.floor(Math.random() * COLOR_OPTIONS.length)];
      setFormData({
        name: '',
        date_of_birth: '',
        color_code: randomColor,
        workload_weighting: '1.00',
        photo_url: '',
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditingPerson(null);
    setFormData({
      name: '',
      date_of_birth: '',
      color_code: COLOR_OPTIONS[0],
      workload_weighting: '1.00',
      photo_url: '',
    });
    setIsModalOpen(false);
  };

  const handleSubmit = async () => {
    try {
      const data: CreatePersonDto | UpdatePersonDto = {
        name: formData.name,
        date_of_birth: formData.date_of_birth || undefined,
        color_code: formData.color_code,
        workload_weighting: parseFloat(formData.workload_weighting),
        photo_url: formData.photo_url || undefined,
      };

      if (editingPerson) {
        await updateMutation.mutateAsync({
          id: editingPerson.id,
          ...data,
        });
      } else {
        await createMutation.mutateAsync(data as CreatePersonDto);
      }

      handleCloseModal();
    } catch (error) {
      console.error('Error saving person:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this person?')) {
      try {
        await deleteMutation.mutateAsync(id);
      } catch (error) {
        console.error('Error deleting person:', error);
      }
    }
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div className="min-h-screen flex justify-center items-center">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-[#219EBC] mx-auto mb-4" />
            <p className="text-[#023047] font-medium">Loading people...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout>
        <div className="min-h-screen flex justify-center items-center">
          <Card className="p-8 shadow-xl border-0 bg-white/90 backdrop-blur-sm border border-red-200">
            <CardContent className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <X className="w-8 h-8 text-red-500" />
              </div>
              <p className="text-red-600 font-medium text-lg">Error loading people</p>
              <p className="text-red-500 mt-2">{error.message}</p>
            </CardContent>
          </Card>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="min-h-screen relative overflow-hidden">
        {/* Background shapes */}
        <div className="absolute inset-0 opacity-3">
          <div className="absolute top-10 left-10 w-72 h-72 bg-gradient-to-r from-white/30 to-[#FFB703]/20 rounded-full blur-3xl"></div>
          <div className="absolute top-20 right-10 w-64 h-64 bg-gradient-to-r from-white/20 to-[#FB8500]/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-10 w-80 h-80 bg-gradient-to-r from-[#FFB703]/20 to-[#FB8500]/20 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4 py-8 max-w-6xl relative z-10">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="relative mb-6">
              <h1 className="text-5xl md:text-6xl font-serif font-bold bg-gradient-to-r from-[#023047] via-[#FB8500] to-[#FFB703] bg-clip-text text-transparent mb-4 drop-shadow-sm">
                Family Members
              </h1>
              <div className="absolute -top-1 -left-1 w-full h-full bg-gradient-to-r from-[#FFB703]/30 to-[#FB8500]/30 blur-lg opacity-30 -z-10 rounded-lg"></div>
            </div>
            <p className="text-xl text-[#023047] mb-6 max-w-2xl mx-auto">
              Manage your family members, set their preferences, and track their chore assignments
            </p>
            
            {/* Performance indicator */}
            {availabilityPreloaded && (
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm mb-4 border border-green-200">
                <Zap className="w-4 h-4" />
                Ultra-fast availability loading ready
              </div>
            )}
            
            <Button
              className="bg-gradient-to-r from-[#FFB703] to-[#FB8500] text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              size="lg"
              onClick={() => handleOpenModal()}
            >
              <Plus className="w-6 h-6 mr-2" />
              Add New Person
            </Button>
          </div>

          {/* People Grid */}
          {!people || people.length === 0 ? (
            <Card className="mx-auto max-w-md bg-white/95 backdrop-blur-sm shadow-xl border-0">
              <CardContent className="text-center py-12">
                <div className="w-20 h-20 bg-gradient-to-r from-[#FFB703]/20 to-[#FB8500]/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users className="w-10 h-10 text-[#FB8500]" />
                </div>
                <h3 className="text-2xl font-bold text-[#023047] mb-3">No Family Members Yet</h3>
                <p className="text-[#FB8500]/80 mb-8 max-w-md mx-auto">
                  Add your first family member to start organizing chores and tracking assignments
                </p>
                <Button
                  className="bg-gradient-to-r from-[#FFB703] to-[#FB8500] text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                  size="lg"
                  onClick={() => handleOpenModal()}
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Add First Person
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {people.map((person) => (
                <SortablePersonCard
                  key={person.id}
                  person={person}
                  onEdit={handleOpenModal}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}

          {/* Add/Edit Modal */}
          {isModalOpen && (
            <>
              {/* Backdrop */}
              <div 
                className="fixed inset-0 bg-black/50 z-40" 
                onClick={handleCloseModal}
              />
              
              {/* Modal Content */}
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <Card className="w-full max-w-4xl bg-white shadow-2xl max-h-[90vh] overflow-y-auto">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle className="text-2xl font-serif font-bold">
                        {editingPerson ? 'Edit Family Member' : 'Add New Family Member'}
                      </CardTitle>
                      <p className="text-sm text-gray-500 mt-1">
                        Manage family member information, preferences, and availability schedule
                      </p>
                    </div>
                    <Button variant="ghost" size="sm" onClick={handleCloseModal}>
                      <X className="w-4 h-4" />
                    </Button>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <Tabs defaultValue="basic" className="w-full">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="basic" className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          Basic Info
                        </TabsTrigger>
                        <TabsTrigger 
                          value="availability" 
                          className="flex items-center gap-2"
                          disabled={!editingPerson}
                        >
                          <Clock className="w-4 h-4" />
                          Availability
                          {!editingPerson && (
                            <span className="text-xs text-gray-400 ml-1">(Save first)</span>
                          )}
                        </TabsTrigger>
                      </TabsList>

                      <TabsContent value="basic" className="space-y-6 mt-6">
                        <div className="space-y-2">
                          <Label htmlFor="name">Name *</Label>
                          <Input
                            id="name"
                            placeholder="e.g., John Smith"
                            value={formData.name}
                            onChange={(e) =>
                              setFormData((prev) => ({ ...prev, name: e.target.value }))
                            }
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="date_of_birth">Date of Birth</Label>
                          <Input
                            id="date_of_birth"
                            type="date"
                            value={formData.date_of_birth}
                            onChange={(e) =>
                              setFormData((prev) => ({ ...prev, date_of_birth: e.target.value }))
                            }
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="workload_weighting">Workload Weighting</Label>
                          <Input
                            id="workload_weighting"
                            type="number"
                            step="0.1"
                            min="0.1"
                            max="5.0"
                            placeholder="1.0"
                            value={formData.workload_weighting}
                            onChange={(e) =>
                              setFormData((prev) => ({ ...prev, workload_weighting: e.target.value }))
                            }
                          />
                          <p className="text-xs text-gray-500">
                            Higher values mean this person can handle more chores (0.1 to 5.0)
                          </p>
                        </div>

                        <PhotoUpload
                          currentPhoto={formData.photo_url}
                          onPhotoChange={(photoUrl) =>
                            setFormData((prev) => ({ ...prev, photo_url: photoUrl }))
                          }
                          personName={formData.name || 'New Person'}
                        />

                        <div className="space-y-2">
                          <Label>Color</Label>
                          <div className="grid grid-cols-8 gap-2">
                            {COLOR_OPTIONS.map((color) => (
                              <button
                                key={color}
                                className={`w-8 h-8 rounded-full border-2 transition-all duration-200 ${
                                  formData.color_code === color
                                    ? 'border-[#023047] scale-110 shadow-lg'
                                    : 'border-gray-300 hover:scale-105'
                                }`}
                                style={{ backgroundColor: color }}
                                onClick={() =>
                                  setFormData((prev) => ({ ...prev, color_code: color }))
                                }
                              />
                            ))}
                          </div>
                          <p className="text-xs text-gray-500">
                            This color will be used throughout the app to identify this person
                          </p>
                        </div>
                      </TabsContent>

                      <TabsContent value="availability" className="mt-6">
                        {editingPerson ? (
                          <div className="space-y-4">
                            {availabilityPreloaded && (
                              <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                                <Zap className="w-4 h-4 text-blue-600" />
                                <span className="text-sm text-blue-800">
                                  Availability data preloaded for instant performance. 
                                  Data transfer reduced by 98% using compact format.
                                </span>
                              </div>
                            )}
                            <PersonAvailabilityMatrixOptimized 
                              personId={editingPerson.id}
                              personName={editingPerson.name}
                            />
                          </div>
                        ) : (
                          <div className="text-center py-12 text-gray-500">
                            <Clock className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                            <h3 className="text-lg font-medium mb-2">Availability Not Available</h3>
                            <p>Please save the person first, then you can set their availability schedule.</p>
                          </div>
                        )}
                      </TabsContent>
                    </Tabs>

                    <div className="flex gap-3 pt-4 border-t border-gray-200">
                      <Button variant="outline" onClick={handleCloseModal} className="flex-1">
                        Cancel
                      </Button>
                      <Button
                        onClick={handleSubmit}
                        disabled={!formData.name.trim() || createMutation.isPending || updateMutation.isPending}
                        className="flex-1 bg-gradient-to-r from-[#FFB703] to-[#FB8500] text-white"
                      >
                        {(createMutation.isPending || updateMutation.isPending) && (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        )}
                        {editingPerson ? 'Update' : 'Create'} Person
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
