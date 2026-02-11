'use client';

import { Card } from '@/components/ui/card';
import {
  LayoutDashboard,
  Calendar,
  DollarSign,
  CheckSquare,
  ArrowRight,
  TrendingUp,
  Clock,
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Page() {
  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Welcome Section */}
      <div className="mb-10">
        <h1 className="text-4xl font-bold mb-2 text-balance">
          Welcome back, Scholar
        </h1>
        <p className="text-muted-foreground text-lg">
          bading si dylan
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="p-6 border-l-4" style={{ borderLeftColor: 'hsl(var(--primary))' }}>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                Classes Today
              </p>
              <p className="text-3xl font-bold">3</p>
            </div>
            <div
              className="p-3 rounded-lg text-white"
              style={{
                backgroundColor: 'hsl(var(--primary))',
              }}
            >
              <Calendar className="h-5 w-5" />
            </div>
          </div>
        </Card>

        <Card className="p-6 border-l-4" style={{ borderLeftColor: 'hsl(var(--accent))' }}>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                Pending Tasks
              </p>
              <p className="text-3xl font-bold">7</p>
            </div>
            <div
              className="p-3 rounded-lg text-white"
              style={{
                backgroundColor: 'hsl(var(--accent))',
              }}
            >
              <CheckSquare className="h-5 w-5" />
            </div>
          </div>
        </Card>

        <Card className="p-6 border-l-4" style={{ borderLeftColor: 'hsl(var(--primary))' }}>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                This Month Spent
              </p>
              <p className="text-3xl font-bold">$245</p>
            </div>
            <div
              className="p-3 rounded-lg text-white"
              style={{
                backgroundColor: 'hsl(var(--primary))',
              }}
            >
              <DollarSign className="h-5 w-5" />
            </div>
          </div>
        </Card>

        <Card className="p-6 border-l-4" style={{ borderLeftColor: 'hsl(var(--accent))' }}>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                Week Progress
              </p>
              <p className="text-3xl font-bold">65%</p>
            </div>
            <div
              className="p-3 rounded-lg text-white"
              style={{
                backgroundColor: 'hsl(var(--accent))',
              }}
            >
              <TrendingUp className="h-5 w-5" />
            </div>
          </div>
        </Card>
      </div>

      {/* Main Content Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Upcoming Classes */}
        <Card className="lg:col-span-2 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Upcoming Classes</h2>
            <Link href="/schedule">
              <Button variant="ghost" size="sm" className="gap-2">
                View All
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="space-y-4">
            {[
              {
                subject: 'Mathematics',
                time: '10:00 AM - 11:30 AM',
                room: 'Room 301',
              },
              {
                subject: 'Physics',
                time: '1:00 PM - 2:30 PM',
                room: 'Lab B',
              },
              {
                subject: 'English Literature',
                time: '3:00 PM - 4:00 PM',
                room: 'Room 205',
              },
            ].map((cls, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-4 rounded-lg hover:bg-secondary transition-colors border border-border"
              >
                <div>
                  <p className="font-medium">{cls.subject}</p>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {cls.time}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-muted-foreground">
                    {cls.room}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Tasks */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Recent Tasks</h2>
            <Link href="/todos">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="space-y-3">
            {[
              { task: 'Complete Math Assignment', completed: false },
              { task: 'Read Chapter 5 - Physics', completed: true },
              { task: 'Prepare Presentation', completed: false },
              { task: 'Submit Essay', completed: true },
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-secondary transition-colors"
              >
                <input
                  type="checkbox"
                  defaultChecked={item.completed}
                  className="w-4 h-4 rounded border-border cursor-pointer"
                />
                <span
                  className={
                    item.completed
                      ? 'text-sm text-muted-foreground line-through'
                      : 'text-sm font-medium'
                  }
                >
                  {item.task}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 bg-gradient-to-r from-blue-50 to-transparent dark:from-blue-950 dark:to-transparent rounded-lg border border-primary/20 p-8">
        <h2 className="text-2xl font-bold mb-4">Ready to get organized?</h2>
        <p className="text-muted-foreground mb-6">
          Start by adding your classes, expenses, and tasks to keep track of everything.
        </p>
        <div className="flex flex-wrap gap-4">
          <Link href="/schedule">
            <Button className="gap-2" size="lg">
              <Calendar className="h-5 w-5" />
              Add Schedule
            </Button>
          </Link>
          <Link href="/expenses">
            <Button variant="outline" className="gap-2 bg-transparent" size="lg">
              <DollarSign className="h-5 w-5" />
              Track Expenses
            </Button>
          </Link>
          <Link href="/todos">
            <Button variant="outline" className="gap-2 bg-transparent" size="lg">
              <CheckSquare className="h-5 w-5" />
              Create To-Do
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
