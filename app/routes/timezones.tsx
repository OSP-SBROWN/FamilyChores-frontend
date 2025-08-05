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
      className={`timezone-item ${isDragging ? 'dragging' : ''} border-2 hover:border-primary-300 transition-all duration-200`}
      isPressable
    >
      <CardHeader className="flex gap-3 pb-2">
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing p-2 hover:bg-default-100 rounded-md transition-colors"
        >
          <GripVertical className="w-5 h-5 text-default-400" />
        </div>
        <div className="flex flex-col flex-grow">
          <h3 className="text-lg font-serif font-semibold text-foreground">
            {timezone.name}
          </h3>
          {timezone.description && (
            <p className="text-sm text-default-500">{timezone.description}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          {timezone.isActive ? (
            <CheckCircle className="w-5 h-5 text-success" />
          ) : (
            <XCircle className="w-5 h-5 text-default-400" />
          )}
        </div>
      </CardHeader>
      <CardBody className="pt-0">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4 text-sm text-default-600">
            {timezone.startTime && timezone.endTime && (
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{timezone.startTime} - {timezone.endTime}</span>
              </div>
            )}
            <span className="text-xs bg-default-100 px-2 py-1 rounded-full">
              Order: {timezone.order}
            </span>
          </div>
          <div className="flex gap-2">
            <Button
              isIconOnly
              size="sm"
              variant="light"
              color="primary"
              onPress={() => onEdit(timezone)}
            >
              <Edit3 className="w-4 h-4" />
            </Button>
            <Button
              isIconOnly
              size="sm"
              variant="light"
              color="danger"
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
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="lg" color="primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Card className="p-6">
          <CardBody>
            <p className="text-danger">Error loading timezones: {error.message}</p>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-serif font-bold text-foreground mb-2">
            Timezone Management
          </h1>
          <p className="text-default-600">
            Organize your daily time periods for task scheduling
          </p>
        </div>
        <Button
          color="primary"
          size="lg"
          startContent={<Plus className="w-5 h-5" />}
          onPress={() => handleOpenModal()}
          className="font-medium"
        >
          Add Timezone
        </Button>
      </div>

      <Divider className="mb-8" />

      {/* Timezone List */}
      {sortedTimezones.length === 0 ? (
        <Card className="p-12">
          <CardBody className="text-center">
            <Clock className="w-16 h-16 text-default-300 mx-auto mb-4" />
            <h3 className="text-xl font-serif font-semibold text-default-500 mb-2">
              No timezones yet
            </h3>
            <p className="text-default-400 mb-6">
              Create your first timezone to start organizing your daily schedule
            </p>
            <Button
              color="primary"
              variant="flat"
              startContent={<Plus className="w-5 h-5" />}
              onPress={() => handleOpenModal()}
            >
              Create Timezone
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
            <div className="space-y-4">
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
  );
}
