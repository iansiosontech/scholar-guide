'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  CheckSquare,
  Plus,
  Trash2,
  Filter,
  Check,
} from 'lucide-react';

interface Task {
  id: string;
  title: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
}

export default function TodosPage() {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Complete Math Assignment',
      completed: false,
      priority: 'high',
      dueDate: '2024-01-20',
    },
    {
      id: '2',
      title: 'Read Chapter 5 - Physics',
      completed: true,
      priority: 'medium',
      dueDate: '2024-01-18',
    },
    {
      id: '3',
      title: 'Prepare Presentation',
      completed: false,
      priority: 'high',
      dueDate: '2024-01-22',
    },
    {
      id: '4',
      title: 'Submit Essay',
      completed: true,
      priority: 'high',
      dueDate: '2024-01-15',
    },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'completed'>('all');
  const [formData, setFormData] = useState({
    title: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    dueDate: '',
  });

  const handleAddTask = () => {
    if (formData.title.trim()) {
      const newTask: Task = {
        id: Date.now().toString(),
        title: formData.title,
        completed: false,
        priority: formData.priority,
        dueDate: formData.dueDate,
      };
      setTasks([...tasks, newTask]);
      setFormData({ title: '', priority: 'medium', dueDate: '' });
      setShowForm(false);
    }
  };

  const handleToggleTask = (id: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const handleDeleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-500 bg-red-50 dark:bg-red-950/30';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-950/30';
      case 'low':
        return 'text-green-600 bg-green-50 dark:bg-green-950/30';
      default:
        return '';
    }
  };

  const filteredTasks = tasks.filter((task) => {
    if (filterStatus === 'active') return !task.completed;
    if (filterStatus === 'completed') return task.completed;
    return true;
  });

  const completedCount = tasks.filter((t) => t.completed).length;
  const totalCount = tasks.length;

  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">To-Do Lists</h1>
        <p className="text-muted-foreground">
          Keep track of your tasks and stay productive
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card className="p-6 border-l-4" style={{ borderLeftColor: 'hsl(var(--primary))' }}>
          <p className="text-sm font-medium text-muted-foreground mb-1">
            Total Tasks
          </p>
          <p className="text-3xl font-bold">{totalCount}</p>
        </Card>

        <Card className="p-6 border-l-4" style={{ borderLeftColor: 'hsl(var(--accent))' }}>
          <p className="text-sm font-medium text-muted-foreground mb-1">
            Completed
          </p>
          <p className="text-3xl font-bold">{completedCount}</p>
        </Card>

        <Card className="p-6 border-l-4" style={{ borderLeftColor: 'hsl(var(--primary))' }}>
          <p className="text-sm font-medium text-muted-foreground mb-1">
            Remaining
          </p>
          <p className="text-3xl font-bold">{totalCount - completedCount}</p>
        </Card>
      </div>

      {/* Add New Task */}
      <Card className="p-6 mb-8">
        {showForm ? (
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Enter task title..."
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleAddTask();
              }}
              autoFocus
              className="w-full px-4 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-2">
                  Priority
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      priority: e.target.value as 'low' | 'medium' | 'high',
                    })
                  }
                  className="w-full px-3 py-2 border border-border rounded-lg text-sm"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-2">
                  Due Date
                </label>
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) =>
                    setFormData({ ...formData, dueDate: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-border rounded-lg text-sm"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleAddTask} className="flex-1 gap-2">
                <Plus className="h-4 w-4" />
                Add Task
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowForm(false);
                  setFormData({ title: '', priority: 'medium', dueDate: '' });
                }}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <Button
            onClick={() => setShowForm(true)}
            className="w-full gap-2"
            size="lg"
          >
            <Plus className="h-5 w-5" />
            Add New Task
          </Button>
        )}
      </Card>

      {/* Filter Buttons */}
      <div className="flex gap-2 mb-6">
        <Button
          variant={filterStatus === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilterStatus('all')}
        >
          All
        </Button>
        <Button
          variant={filterStatus === 'active' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilterStatus('active')}
        >
          Active
        </Button>
        <Button
          variant={filterStatus === 'completed' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilterStatus('completed')}
        >
          Completed
        </Button>
      </div>

      {/* Tasks List */}
      <div className="space-y-2">
        {filteredTasks.length > 0 ? (
          filteredTasks.map((task) => (
            <Card
              key={task.id}
              className={`p-4 border-l-4 transition-all ${
                task.completed
                  ? 'opacity-60 bg-muted'
                  : 'hover:shadow-md'
              }`}
              style={{
                borderLeftColor: task.completed
                  ? 'hsl(var(--muted-foreground))'
                  : 'hsl(var(--primary))',
              }}
            >
              <div className="flex items-start gap-4">
                <button
                  onClick={() => handleToggleTask(task.id)}
                  className="mt-1 flex-shrink-0"
                >
                  <div
                    className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-all ${
                      task.completed
                        ? 'border-primary bg-primary'
                        : 'border-border hover:border-primary'
                    }`}
                  >
                    {task.completed && (
                      <Check className="h-4 w-4 text-primary-foreground" />
                    )}
                  </div>
                </button>

                <div className="flex-1 min-w-0">
                  <p
                    className={`text-base ${
                      task.completed
                        ? 'line-through text-muted-foreground'
                        : 'font-medium'
                    }`}
                  >
                    {task.title}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 mt-2">
                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full ${getPriorityColor(task.priority)}`}
                    >
                      {task.priority.charAt(0).toUpperCase() +
                        task.priority.slice(1)}
                    </span>

                    {task.dueDate && (
                      <span className="text-xs text-muted-foreground">
                        Due: {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                    )}
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteTask(task.id)}
                  className="text-destructive hover:text-destructive flex-shrink-0"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))
        ) : (
          <Card className="p-8 text-center">
            <CheckSquare className="h-12 w-12 mx-auto mb-4 opacity-30" />
            <p className="text-muted-foreground">
              {filterStatus === 'completed'
                ? 'No completed tasks yet'
                : 'No tasks to show'}
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}
