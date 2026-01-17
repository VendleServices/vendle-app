'use client';

import { useState } from 'react';
import { Plus, Trash2, Clock, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  useGetAvailability,
  useCreateAvailability,
  useDeleteAvailability,
  type Availability,
} from '@/hooks/useBooking';

// 1 = Monday, 2 = Tuesday, ..., 7 = Sunday
const DAYS_OF_WEEK = [
  { value: 1, label: 'Monday' },
  { value: 2, label: 'Tuesday' },
  { value: 3, label: 'Wednesday' },
  { value: 4, label: 'Thursday' },
  { value: 5, label: 'Friday' },
  { value: 6, label: 'Saturday' },
  { value: 7, label: 'Sunday' },
];

const getDayLabel = (dayOfWeek: number): string => {
  return DAYS_OF_WEEK.find(d => d.value === dayOfWeek)?.label || 'Unknown';
};

const TIME_SLOTS = [
  '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
  '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
  '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
  '17:00', '17:30', '18:00', '18:30', '19:00', '19:30',
  '20:00',
];

interface AvailabilityManagerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AvailabilityManager({ isOpen, onClose }: AvailabilityManagerProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAvailability, setNewAvailability] = useState<{
    dayOfWeek: number | null;
    startTime: string;
    endTime: string;
  }>({
    dayOfWeek: null,
    startTime: '',
    endTime: '',
  });

  const { data: availability, isLoading } = useGetAvailability();
  const createAvailabilityMutation = useCreateAvailability();
  const deleteAvailabilityMutation = useDeleteAvailability();

  const handleAddAvailability = () => {
    if (newAvailability.dayOfWeek === null || !newAvailability.startTime || !newAvailability.endTime) {
      return;
    }
    createAvailabilityMutation.mutate({
      dayOfWeek: newAvailability.dayOfWeek,
      startTime: newAvailability.startTime,
      endTime: newAvailability.endTime,
    }, {
      onSuccess: () => {
        setShowAddForm(false);
        setNewAvailability({ dayOfWeek: null, startTime: '', endTime: '' });
      },
    });
  };

  const handleDeleteAvailability = (id: string) => {
    deleteAvailabilityMutation.mutate(id);
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  // Group availability by day (using number keys)
  const availabilityByDay = availability?.reduce((acc, slot) => {
    const key = slot.dayOfWeek;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(slot);
    return acc;
  }, {} as Record<number, Availability[]>) || {};

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-vendle-blue" />
            Manage Your Availability
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Set your available times for site visits. Contractors will see these times when scheduling.
          </p>

          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-vendle-blue" />
            </div>
          ) : (
            <>
              {/* Existing Availability */}
              {Object.keys(availabilityByDay).length > 0 ? (
                <div className="space-y-3">
                  {DAYS_OF_WEEK.map((day) => {
                    const slots = availabilityByDay[day.value];
                    if (!slots || slots.length === 0) return null;

                    return (
                      <Card key={day.value} className="border-gray-200">
                        <CardHeader className="py-2 px-4">
                          <CardTitle className="text-sm font-semibold text-gray-700">
                            {day.label}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="py-2 px-4 space-y-2">
                          {slots.map((slot) => (
                            <div
                              key={slot.id}
                              className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2"
                            >
                              <div className="flex items-center gap-2 text-sm">
                                <Clock className="h-4 w-4 text-gray-500" />
                                <span>
                                  {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                                </span>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteAvailability(slot.id)}
                                disabled={deleteAvailabilityMutation.isPending}
                                className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">No availability set yet</p>
                  <p className="text-xs text-gray-400">Add your available times below</p>
                </div>
              )}

              {/* Add New Availability */}
              {showAddForm ? (
                <Card className="border-vendle-blue/30 bg-vendle-blue/5">
                  <CardContent className="pt-4 space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Day of Week</label>
                      <Select
                        value={newAvailability.dayOfWeek?.toString() || ''}
                        onValueChange={(value) =>
                          setNewAvailability((prev) => ({ ...prev, dayOfWeek: parseInt(value, 10) }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select day" />
                        </SelectTrigger>
                        <SelectContent>
                          {DAYS_OF_WEEK.map((day) => (
                            <SelectItem key={day.value} value={day.value.toString()}>
                              {day.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Start Time</label>
                        <Select
                          value={newAvailability.startTime}
                          onValueChange={(value) =>
                            setNewAvailability((prev) => ({ ...prev, startTime: value }))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Start" />
                          </SelectTrigger>
                          <SelectContent>
                            {TIME_SLOTS.map((time) => (
                              <SelectItem key={time} value={time}>
                                {formatTime(time)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">End Time</label>
                        <Select
                          value={newAvailability.endTime}
                          onValueChange={(value) =>
                            setNewAvailability((prev) => ({ ...prev, endTime: value }))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="End" />
                          </SelectTrigger>
                          <SelectContent>
                            {TIME_SLOTS.filter(
                              (time) => !newAvailability.startTime || time > newAvailability.startTime
                            ).map((time) => (
                              <SelectItem key={time} value={time}>
                                {formatTime(time)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => {
                          setShowAddForm(false);
                          setNewAvailability({ dayOfWeek: null, startTime: '', endTime: '' });
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        className="flex-1 bg-vendle-blue hover:bg-vendle-blue/90"
                        onClick={handleAddAvailability}
                        disabled={
                          createAvailabilityMutation.isPending ||
                          newAvailability.dayOfWeek === null ||
                          !newAvailability.startTime ||
                          !newAvailability.endTime
                        }
                      >
                        {createAvailabilityMutation.isPending ? 'Adding...' : 'Add'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Button
                  variant="outline"
                  className="w-full border-dashed border-vendle-blue text-vendle-blue hover:bg-vendle-blue/5"
                  onClick={() => setShowAddForm(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Availability
                </Button>
              )}
            </>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}