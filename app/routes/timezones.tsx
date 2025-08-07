import React, { useState, useMemo, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Separator } from '../components/ui/separator';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  Plus,
  Clock,
  Edit3,
  Trash2,
  GripVertical,
  Loader2,
  X,
} from 'lucide-react';

import { useTimezones, useCreateTimezone, useUpdateTimezone, useDeleteTimezone, useUpdateTimezoneOrder } from '../hooks/useTimezone';
import type { Timezone, CreateTimezoneDto, UpdateTimezoneDto } from '../types/timezone';
import AppLayout from '../components/AppLayout';

interface SortableTimezoneCardProps {
  timezone: Timezone;
  onEdit: (timezone: Timezone) => void;
  onDelete: (id: string) => void;
}

function SortableTimezoneCard({ timezone, onEdit, onDelete }: SortableTimezoneCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: timezone.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: isDragging ? 'none' : transition,
    opacity: isDragging ? 0.8 : 1,
    zIndex: isDragging ? 1000 : 'auto',
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={`timezone-item ${isDragging ? 'dragging' : ''} border-0 shadow-xl transition-all duration-150 bg-gradient-to-r from-white/95 to-white/90 backdrop-blur-lg border border-white/30 ${isDragging ? 'shadow-2xl scale-105' : 'hover:shadow-2xl hover:-translate-y-1'}`}
    >
      <CardHeader className="flex flex-row items-start gap-4 pb-3">
        <div
          {...attributes}
          {...listeners}
          className="touch-manipulation cursor-grab active:cursor-grabbing p-4 hover:bg-[#8ECAE6]/30 rounded-xl transition-colors bg-gradient-to-br from-[#8ECAE6]/20 to-[#219EBC]/20 select-none min-w-[48px] min-h-[48px] flex items-center justify-center"
          style={{ touchAction: 'none' }}
        >
          <GripVertical className="w-6 h-6 text-[#219EBC] pointer-events-none" />
        </div>
        <div className="flex flex-col flex-grow">
          <CardTitle className="text-xl font-serif font-bold text-[#023047] mb-1">
            {timezone.name}
          </CardTitle>
          {timezone.description && (
            <p className="text-sm text-[#219EBC]/80">{timezone.description}</p>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2 bg-[#023047]/20 px-3 py-2 rounded-lg backdrop-blur-sm">
              <span className="text-xs font-medium text-[#023047]">Order: {timezone.display_order}</span>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              className="bg-[#8ECAE6]/40 hover:bg-[#8ECAE6]/60 text-[#219EBC] border-[#8ECAE6] transition-colors backdrop-blur-sm"
              onClick={() => onEdit(timezone)}
            >
              <Edit3 className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="bg-red-200/40 hover:bg-red-200/60 text-red-600 border-red-200 transition-colors backdrop-blur-sm"
              onClick={() => onDelete(timezone.id)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface TimezoneFormData {
  name: string;
  description: string;
}

export default function TimezonesPage() {
  const { data: timezones, isLoading, error } = useTimezones();
  const createMutation = useCreateTimezone();
  const updateMutation = useUpdateTimezone();
  const deleteMutation = useDeleteTimezone();
  const updateOrderMutation = useUpdateTimezoneOrder();

  const [editingTimezone, setEditingTimezone] = useState<Timezone | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<TimezoneFormData>({
    name: '',
    description: '',
  });

  // Add custom styles for smoother touch interactions
  React.useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .timezone-item.dragging * {
        pointer-events: none;
      }
      .timezone-item {
        -webkit-transform: translateZ(0);
        transform: translateZ(0);
        -webkit-backface-visibility: hidden;
        backface-visibility: hidden;
      }
      @media (pointer: coarse) {
        .timezone-item {
          transform: none !important;
          transition: none !important;
        }
        .timezone-item:hover {
          transform: none !important;
        }
        .timezone-item.dragging {
          transform: scale(1.02) !important;
          box-shadow: 0 20px 40px rgba(0,0,0,0.15) !important;
        }
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const sortedTimezones = useMemo(() => {
    if (!timezones) return [];
    return [...timezones].sort((a, b) => a.display_order - b.display_order);
  }, [timezones]);

  const handleDragEnd = async (event: any) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = sortedTimezones.findIndex((item) => item.id === active.id);
      const newIndex = sortedTimezones.findIndex((item) => item.id === over.id);

      const newTimezones = arrayMove(sortedTimezones, oldIndex, newIndex);
      
      // Update display_order values
      const updatedTimezones = newTimezones.map((timezone, index) => ({
        id: timezone.id,
        display_order: index + 1,
      }));

      try {
        await updateOrderMutation.mutateAsync(updatedTimezones);
        console.log('Successfully updated timezone order');
      } catch (error) {
        console.error('Failed to update timezone order:', error);
      }
    }
  };

  const handleOpenModal = (timezone?: Timezone) => {
    if (timezone) {
      setEditingTimezone(timezone);
      setFormData({
        name: timezone.name,
        description: timezone.description || '',
      });
    } else {
      setEditingTimezone(null);
      setFormData({
        name: '',
        description: '',
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditingTimezone(null);
    setFormData({
      name: '',
      description: '',
    });
    setIsModalOpen(false);
  };

  const handleSubmit = async () => {
    try {
      const data = {
        name: formData.name,
        description: formData.description || undefined,
      };

      if (editingTimezone) {
        await updateMutation.mutateAsync({
          id: editingTimezone.id,
          ...data,
        });
      } else {
        await createMutation.mutateAsync(data);
      }

      handleCloseModal();
    } catch (error) {
      console.error('Error saving timezone:', error);
    }
  };

  const handleDelete = async (id: string) => {
    const timezone = timezones?.find(t => t.id === id);
    const timezoneName = timezone?.name || 'this timezone';
    
    if (confirm(`Are you sure you want to delete "${timezoneName}"? This action cannot be undone.`)) {
      try {
        console.log('Attempting to delete timezone:', id, timezoneName);
        await deleteMutation.mutateAsync(id);
        console.log('Successfully triggered delete mutation for:', id);
      } catch (error) {
        console.error('Error deleting timezone:', error);
        alert('Failed to delete timezone. Please try again.');
      }
    }
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div className="min-h-screen flex justify-center items-center">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-[#219EBC] mx-auto mb-4" />
            <p className="text-[#023047] font-medium">Loading timezones...</p>
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
              <p className="text-red-600 font-medium text-lg">Error loading timezones</p>
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
        {/* Very subtle background shapes */}
        <div className="absolute inset-0 opacity-3">
          <div className="absolute top-20 right-10 w-64 h-64 bg-gradient-to-r from-white/20 to-[#8ECAE6]/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-10 w-80 h-80 bg-gradient-to-r from-[#8ECAE6]/20 to-[#219EBC]/20 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4 py-8 max-w-4xl relative z-10">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="relative mb-6">
              <h1 className="text-5xl md:text-6xl font-serif font-bold bg-gradient-to-r from-[#023047] via-[#219EBC] to-[#8ECAE6] bg-clip-text text-transparent mb-4 drop-shadow-sm">
                Timezone Management
              </h1>
              <div className="absolute -top-1 -left-1 w-full h-full bg-gradient-to-r from-[#8ECAE6]/30 to-[#219EBC]/30 blur-lg opacity-30 -z-10 rounded-lg"></div>
            </div>
            <p className="text-xl text-[#023047] mb-6 max-w-2xl mx-auto">
              Organize your daily time periods for task scheduling with beautiful drag-and-drop functionality
            </p>
            <Button
              className="bg-gradient-to-r from-[#8ECAE6] to-[#219EBC] text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              size="lg"
              onClick={() => handleOpenModal()}
            >
              <Plus className="w-6 h-6 mr-2" />
              Add New Timezone
            </Button>
          </div>

          <Separator className="mb-12 bg-gradient-to-r from-transparent via-[#219EBC] to-transparent h-0.5" />

          {/* Timezone List */}
          {sortedTimezones.length === 0 ? (
            <Card className="p-16 border-0 shadow-2xl bg-gradient-to-br from-white/95 to-white/90 backdrop-blur-lg border border-white/30">
              <CardContent className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-[#219EBC]/20 to-[#023047]/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-[#8ECAE6]/30">
                  <Clock className="w-10 h-10 text-[#219EBC]" />
                </div>
                <CardTitle className="text-2xl font-serif font-bold text-[#023047] mb-3">
                  No timezones yet
                </CardTitle>
                <p className="text-[#219EBC]/80 mb-8 max-w-md mx-auto">
                  Create your first timezone to start organizing your daily schedule with beautiful time periods
                </p>
                <Button
                  className="bg-gradient-to-r from-[#219EBC] to-[#023047] text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                  size="lg"
                  onClick={() => handleOpenModal()}
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Create First Timezone
                </Button>
              </CardContent>
            </Card>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={sortedTimezones.map((tz) => tz.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-6" style={{ touchAction: 'pan-y' }}>
                  {sortedTimezones.map((timezone) => (
                    <SortableTimezoneCard
                      key={timezone.id}
                      timezone={timezone}
                      onEdit={handleOpenModal}
                      onDelete={handleDelete}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
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
                <Card className="w-full max-w-2xl bg-white shadow-2xl">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle className="text-2xl font-serif font-bold">
                        {editingTimezone ? 'Edit Timezone' : 'Create New Timezone'}
                      </CardTitle>
                      <p className="text-sm text-gray-500 mt-1">
                        Define time periods for organizing your daily tasks
                      </p>
                    </div>
                    <Button variant="ghost" size="sm" onClick={handleCloseModal}>
                      <X className="w-4 h-4" />
                    </Button>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name *</Label>
                      <Input
                        id="name"
                        placeholder="e.g., Before Breakfast, After School"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, name: e.target.value }))
                        }
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <textarea
                        id="description"
                        className="w-full min-h-[80px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#219EBC] focus:border-transparent resize-none"
                        placeholder="Optional description for this time period"
                        value={formData.description}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, description: e.target.value }))
                        }
                      />
                    </div>

                    <div className="flex gap-3 pt-4">
                      <Button variant="outline" onClick={handleCloseModal} className="flex-1">
                        Cancel
                      </Button>
                      <Button
                        onClick={handleSubmit}
                        disabled={!formData.name.trim() || createMutation.isPending || updateMutation.isPending}
                        className="flex-1 bg-gradient-to-r from-[#8ECAE6] to-[#219EBC] text-white"
                      >
                        {(createMutation.isPending || updateMutation.isPending) && (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        )}
                        {editingTimezone ? 'Update' : 'Create'} Timezone
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
