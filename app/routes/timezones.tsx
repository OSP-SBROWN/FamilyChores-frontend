import React, { useState, useMemo } from 'react';
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Input,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Spinner,
  Divider,
  Switch,
  Textarea,
  useDisclosure,
} from '@heroui/react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
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
  CheckCircle,
  XCircle,
} from 'lucide-react';

import { useTimezones, useCreateTimezone, useUpdateTimezone, useDeleteTimezone } from '../hooks/useTimezone';
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
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={`timezone-item ${isDragging ? 'dragging' : ''} border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-r from-white/95 to-white/90 backdrop-blur-lg border border-white/30`}
      isPressable
    >
      <CardHeader className="flex gap-4 pb-3">
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing p-3 hover:bg-family-200/30 rounded-xl transition-colors bg-gradient-to-br from-family-100/20 to-family-200/20"
        >
          <GripVertical className="w-6 h-6 text-family-600" />
        </div>
        <div className="flex flex-col flex-grow">
          <h3 className="text-xl font-serif font-bold text-family-700 mb-1">
            {timezone.name}
          </h3>
          {timezone.description && (
            <p className="text-sm text-family-600/80">{timezone.description}</p>
          )}
        </div>
        <div className="flex items-center gap-3">
          {timezone.isActive ? (
            <div className="flex items-center gap-2 bg-success-100 px-3 py-1 rounded-full">
              <CheckCircle className="w-4 h-4 text-success-600" />
              <span className="text-xs font-medium text-success-700">Active</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 bg-default-100 px-3 py-1 rounded-full">
              <XCircle className="w-4 h-4 text-default-500" />
              <span className="text-xs font-medium text-default-600">Inactive</span>
            </div>
          )}
        </div>
      </CardHeader>
      <CardBody className="pt-0">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-6 text-sm">
            {timezone.startTime && timezone.endTime && (
              <div className="flex items-center gap-2 bg-family-200/30 px-3 py-2 rounded-lg backdrop-blur-sm">
                <Clock className="w-4 h-4 text-family-600" />
                <span className="font-medium text-family-700">{timezone.startTime} - {timezone.endTime}</span>
              </div>
            )}
            <div className="flex items-center gap-2 bg-family-800/20 px-3 py-2 rounded-lg backdrop-blur-sm">
              <span className="text-xs font-medium text-family-800">Order: {timezone.order}</span>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              isIconOnly
              size="sm"
              className="bg-family-200/40 hover:bg-family-200/60 text-family-600 transition-colors backdrop-blur-sm"
              onPress={() => onEdit(timezone)}
            >
              <Edit3 className="w-4 h-4" />
            </Button>
            <Button
              isIconOnly
              size="sm"
              className="bg-danger-200/40 hover:bg-danger-200/60 text-danger-600 transition-colors backdrop-blur-sm"
              onPress={() => onDelete(timezone.id)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}

interface TimezoneFormData {
  name: string;
  description: string;
  startTime: string;
  endTime: string;
  isActive: boolean;
}

export default function TimezonesPage() {
  const { data: timezones, isLoading, error } = useTimezones();
  const createMutation = useCreateTimezone();
  const updateMutation = useUpdateTimezone();
  const deleteMutation = useDeleteTimezone();

  const [editingTimezone, setEditingTimezone] = useState<Timezone | null>(null);
  const [formData, setFormData] = useState<TimezoneFormData>({
    name: '',
    description: '',
    startTime: '',
    endTime: '',
    isActive: true,
  });

  const { isOpen, onOpen, onClose } = useDisclosure();

  const user = {
    name: "John Doe",
    email: "john@example.com",
    avatar: undefined
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const sortedTimezones = useMemo(() => {
    if (!timezones) return [];
    return [...timezones].sort((a, b) => a.order - b.order);
  }, [timezones]);

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = sortedTimezones.findIndex((item) => item.id === active.id);
      const newIndex = sortedTimezones.findIndex((item) => item.id === over.id);

      const newTimezones = arrayMove(sortedTimezones, oldIndex, newIndex);
      
      // Update order values
      const updatedTimezones = newTimezones.map((timezone, index) => ({
        id: timezone.id,
        order: index + 1,
      }));

      // Here you would call an API to update the order
      console.log('Updated timezone order:', updatedTimezones);
    }
  };

  const handleOpenModal = (timezone?: Timezone) => {
    if (timezone) {
      setEditingTimezone(timezone);
      setFormData({
        name: timezone.name,
        description: timezone.description || '',
        startTime: timezone.startTime || '',
        endTime: timezone.endTime || '',
        isActive: timezone.isActive,
      });
    } else {
      setEditingTimezone(null);
      setFormData({
        name: '',
        description: '',
        startTime: '',
        endTime: '',
        isActive: true,
      });
    }
    onOpen();
  };

  const handleCloseModal = () => {
    setEditingTimezone(null);
    setFormData({
      name: '',
      description: '',
      startTime: '',
      endTime: '',
      isActive: true,
    });
    onClose();
  };

  const handleSubmit = async () => {
    try {
      const data = {
        name: formData.name,
        description: formData.description || undefined,
        startTime: formData.startTime || undefined,
        endTime: formData.endTime || undefined,
        isActive: formData.isActive,
      };

      if (editingTimezone) {
        await updateMutation.mutateAsync({
          id: editingTimezone.id,
          ...data,
        });
      } else {
        await createMutation.mutateAsync({
          ...data,
          order: (sortedTimezones.length + 1),
        });
      }

      handleCloseModal();
    } catch (error) {
      console.error('Error saving timezone:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this timezone?')) {
      try {
        await deleteMutation.mutateAsync(id);
      } catch (error) {
        console.error('Error deleting timezone:', error);
      }
    }
  };

  if (isLoading) {
    return (
      <AppLayout user={user}>
        <div className="min-h-screen flex justify-center items-center">
          <div className="text-center">
            <Spinner size="lg" className="text-primary-600" />
            <p className="mt-4 text-primary-700 font-medium">Loading timezones...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout user={user}>
        <div className="min-h-screen flex justify-center items-center">
          <Card className="p-8 shadow-xl border-0 bg-white/90 backdrop-blur-sm border border-danger-200">
            <CardBody className="text-center">
              <div className="w-16 h-16 bg-danger-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <XCircle className="w-8 h-8 text-danger-500" />
              </div>
              <p className="text-danger-600 font-medium text-lg">Error loading timezones</p>
              <p className="text-danger-500 mt-2">{error.message}</p>
            </CardBody>
          </Card>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout user={user}>
      <div className="min-h-screen relative overflow-hidden">
      {/* Very subtle background shapes */}
      <div className="absolute inset-0 opacity-3">
        <div className="absolute top-20 right-10 w-64 h-64 bg-gradient-to-r from-white/20 to-primary-200/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-10 w-80 h-80 bg-gradient-to-r from-primary-100/20 to-primary-200/20 rounded-full blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-4 py-8 max-w-4xl relative z-10">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="relative mb-6">
          <h1 className="text-5xl md:text-6xl font-serif font-bold bg-gradient-to-r from-primary-700 via-primary-600 to-secondary-600 bg-clip-text text-transparent mb-4 drop-shadow-sm">
            Timezone Management
          </h1>
          <div className="absolute -top-1 -left-1 w-full h-full bg-gradient-to-r from-primary-100/30 to-secondary-100/30 blur-lg opacity-30 -z-10 rounded-lg"></div>
        </div>
        <p className="text-xl text-primary-700 mb-6 max-w-2xl mx-auto">
          Organize your daily time periods for task scheduling with beautiful drag-and-drop functionality
        </p>
        <Button
          className="bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          size="lg"
          startContent={<Plus className="w-6 h-6" />}
          onPress={() => handleOpenModal()}
        >
          Add New Timezone
        </Button>
      </div>

      <Divider className="mb-12 bg-gradient-to-r from-transparent via-primary-300 to-transparent h-0.5" />

      {/* Timezone List */}
      {sortedTimezones.length === 0 ? (
        <Card className="p-16 border-0 shadow-2xl bg-gradient-to-br from-white/95 to-white/90 backdrop-blur-lg border border-white/30">
          <CardBody className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-family-600/20 to-family-700/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-family-300/30">
              <Clock className="w-10 h-10 text-family-600" />
            </div>
            <h3 className="text-2xl font-serif font-bold text-family-700 mb-3">
              No timezones yet
            </h3>
            <p className="text-family-600/80 mb-8 max-w-md mx-auto">
              Create your first timezone to start organizing your daily schedule with beautiful time periods
            </p>
            <Button
              className="bg-gradient-to-r from-family-600 to-family-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              size="lg"
              startContent={<Plus className="w-5 h-5" />}
              onPress={() => handleOpenModal()}
            >
              Create First Timezone
            </Button>
          </CardBody>
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
            <div className="space-y-6">
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
      <Modal
        isOpen={isOpen}
        onOpenChange={handleCloseModal}
        size="2xl"
        scrollBehavior="inside"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <h2 className="text-2xl font-serif font-bold">
                  {editingTimezone ? 'Edit Timezone' : 'Create New Timezone'}
                </h2>
                <p className="text-sm text-default-500 font-normal">
                  Define time periods for organizing your daily tasks
                </p>
              </ModalHeader>
              <ModalBody>
                <div className="space-y-6">
                  <Input
                    label="Name"
                    placeholder="e.g., Before Breakfast, After School"
                    value={formData.name}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, name: value }))
                    }
                    isRequired
                    variant="bordered"
                    size="lg"
                  />

                  <Textarea
                    label="Description"
                    placeholder="Optional description for this time period"
                    value={formData.description}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, description: value }))
                    }
                    variant="bordered"
                    minRows={2}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Start Time"
                      placeholder="e.g., 07:00"
                      value={formData.startTime}
                      onValueChange={(value) =>
                        setFormData((prev) => ({ ...prev, startTime: value }))
                      }
                      variant="bordered"
                      type="time"
                    />

                    <Input
                      label="End Time"
                      placeholder="e.g., 08:00"
                      value={formData.endTime}
                      onValueChange={(value) =>
                        setFormData((prev) => ({ ...prev, endTime: value }))
                      }
                      variant="bordered"
                      type="time"
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-default-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-foreground">Active Status</h4>
                      <p className="text-sm text-default-500">
                        Enable this timezone for task scheduling
                      </p>
                    </div>
                    <Switch
                      isSelected={formData.isActive}
                      onValueChange={(checked) =>
                        setFormData((prev) => ({ ...prev, isActive: checked }))
                      }
                      color="primary"
                      size="lg"
                    />
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button
                  color="primary"
                  onPress={handleSubmit}
                  isLoading={createMutation.isPending || updateMutation.isPending}
                  disabled={!formData.name.trim()}
                >
                  {editingTimezone ? 'Update' : 'Create'} Timezone
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      
      </div>
    </div>
    </AppLayout>
  );
}
