'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Calendar,
  Plus,
  Trash2,
  Clock,
  MapPin,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

interface ScheduleItem {
  id: string;
  date: string;
  title: string;
  time: string;
  location: string;
}

export default function SchedulePage() {
  const [currentDate, setCurrentDate] = useState(new Date(2024, 0, 1));
  const [schedules, setSchedules] = useState<ScheduleItem[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    time: '',
    location: '',
  });

  // Load schedules from localStorage on mount
  useEffect(() => {
    const savedSchedules = localStorage.getItem('schedules');
    if (savedSchedules) {
      try {
        setSchedules(JSON.parse(savedSchedules));
      } catch (e) {
        console.error('Failed to load schedules:', e);
        // Set default schedules if loading fails
        setSchedules([
          {
            id: '1',
            date: '2024-01-15',
            title: 'Mathematics',
            time: '10:00 AM',
            location: 'Room 301',
          },
          {
            id: '2',
            date: '2024-01-15',
            title: 'Physics',
            time: '1:00 PM',
            location: 'Lab B',
          },
        ]);
      }
    } else {
      // Set default schedules on first load
      setSchedules([
        {
          id: '1',
          date: '2024-01-15',
          title: 'Mathematics',
          time: '10:00 AM',
          location: 'Room 301',
        },
        {
          id: '2',
          date: '2024-01-15',
          title: 'Physics',
          time: '1:00 PM',
          location: 'Lab B',
        },
      ]);
    }
  }, []);

  // Save schedules to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('schedules', JSON.stringify(schedules));
  }, [schedules]);

  // Calendar generation
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const formatDateString = (year: number, month: number, day: number) => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const monthName = currentDate.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  const handlePrevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1)
    );
  };

  const handleAddSchedule = () => {
    if (selectedDate && formData.title && formData.time) {
      const newSchedule: ScheduleItem = {
        id: Date.now().toString(),
        date: selectedDate,
        title: formData.title,
        time: formData.time,
        location: formData.location,
      };
      setSchedules([...schedules, newSchedule]);
      setFormData({ title: '', time: '', location: '' });
      setShowForm(false);
    }
  };

  const handleDeleteSchedule = (id: string) => {
    setSchedules(schedules.filter((s) => s.id !== id));
  };

  const selectedDateSchedules = selectedDate
    ? schedules.filter((s) => s.date === selectedDate)
    : [];

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Schedule</h1>
        <p className="text-muted-foreground">
          Manage your classes and events
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <Card className="lg:col-span-2 p-6">
          {/* Month Navigation */}
          <div className="flex items-center justify-between mb-6">
            <Button
              variant="outline"
              size="icon"
              onClick={handlePrevMonth}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h2 className="text-xl font-bold">{monthName}</h2>
            <Button
              variant="outline"
              size="icon"
              onClick={handleNextMonth}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Weekday Headers */}
          <div className="grid grid-cols-7 gap-2 mb-4">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div
                key={day}
                className="text-center font-semibold text-sm text-muted-foreground py-2"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-2">
            {/* Empty cells for days before month starts */}
            {Array.from({ length: firstDay }).map((_, i) => (
              <div key={`empty-${i}`} className="aspect-square" />
            ))}

            {/* Days of the month */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const dateStr = formatDateString(
                currentDate.getFullYear(),
                currentDate.getMonth(),
                day
              );
              const hasSchedules = schedules.some((s) => s.date === dateStr);
              const isSelected = selectedDate === dateStr;

              return (
                <button
                  key={day}
                  onClick={() => {
                    setSelectedDate(dateStr);
                    setShowForm(true);
                  }}
                  className={`aspect-square rounded-lg border-2 flex flex-col items-center justify-center font-semibold transition-all ${
                    isSelected
                      ? 'border-primary bg-primary text-primary-foreground'
                      : hasSchedules
                        ? 'border-accent bg-accent/10'
                        : 'border-border hover:border-primary/50'
                  }`}
                >
                  <span className="text-lg">{day}</span>
                  {hasSchedules && (
                    <span className="text-xs mt-1">
                      {schedules.filter((s) => s.date === dateStr).length}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </Card>

        {/* Schedule Details and Form */}
        <div className="space-y-6">
          {/* Selected Date Header */}
          {selectedDate && (
            <Card className="p-6">
              <h3 className="font-bold text-lg mb-4">
                {new Date(selectedDate + 'T00:00:00').toLocaleDateString(
                  'en-US',
                  { weekday: 'long', month: 'long', day: 'numeric' }
                )}
              </h3>

              {/* Add Schedule Form */}
              {showForm && (
                <div className="space-y-4 mb-6 p-4 bg-secondary rounded-lg">
                  <input
                    type="text"
                    placeholder="Class/Event Title"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-border rounded-lg text-sm"
                  />
                  <input
                    type="time"
                    value={formData.time}
                    onChange={(e) =>
                      setFormData({ ...formData, time: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-border rounded-lg text-sm"
                  />
                  <input
                    type="text"
                    placeholder="Location (optional)"
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-border rounded-lg text-sm"
                  />
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={handleAddSchedule}
                      className="flex-1"
                    >
                      Add
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setShowForm(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}

              {!showForm && (
                <Button
                  size="sm"
                  className="w-full gap-2 mb-4"
                  onClick={() => setShowForm(true)}
                >
                  <Plus className="h-4 w-4" />
                  Add Schedule
                </Button>
              )}

              {/* Scheduled Items for Selected Date */}
              <div className="space-y-3">
                {selectedDateSchedules.length > 0 ? (
                  selectedDateSchedules.map((schedule) => (
                    <div
                      key={schedule.id}
                      className="p-3 bg-secondary rounded-lg border border-border"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">
                            {schedule.title}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                            <Clock className="h-3 w-3 flex-shrink-0" />
                            <span>{schedule.time}</span>
                          </div>
                          {schedule.location && (
                            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                              <MapPin className="h-3 w-3 flex-shrink-0" />
                              <span>{schedule.location}</span>
                            </div>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteSchedule(schedule.id)}
                          className="text-destructive hover:text-destructive flex-shrink-0"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No schedules for this date
                  </p>
                )}
              </div>
            </Card>
          )}

          {!selectedDate && (
            <Card className="p-6">
              <Calendar className="h-8 w-8 mb-3 opacity-50" />
              <p className="text-sm text-muted-foreground">
                Select a date from the calendar to add schedules
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
