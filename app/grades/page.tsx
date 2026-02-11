'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Plus,
  Trash2,
  TrendingUp,
  BookOpen,
  Target,
} from 'lucide-react';

interface Course {
  id: string;
  name: string;
  grade: number;
  creditHours: number;
  gradePoint: number;
}

export default function GradesPage() {
  const [courses, setCourses] = useState<Course[]>([
    {
      id: '1',
      name: 'Mathematics',
      grade: 92,
      creditHours: 4,
      gradePoint: 4.0,
    },
    {
      id: '2',
      name: 'Physics',
      grade: 85,
      creditHours: 3,
      gradePoint: 3.7,
    },
    {
      id: '3',
      name: 'English Literature',
      grade: 88,
      creditHours: 3,
      gradePoint: 3.9,
    },
  ]);

  const [newCourse, setNewCourse] = useState({
    name: '',
    grade: '',
    creditHours: '',
  });

  // Calculate grade point from percentage
  const getGradePoint = (grade: number): number => {
    if (grade >= 90) return 4.0;
    if (grade >= 80) return 3.7;
    if (grade >= 70) return 3.3;
    if (grade >= 60) return 3.0;
    return 0.0;
  };

  // Calculate overall GPA
  const calculateGPA = (): number => {
    if (courses.length === 0) return 0;
    const totalPoints = courses.reduce((sum, c) => sum + c.gradePoint * c.creditHours, 0);
    const totalCredits = courses.reduce((sum, c) => sum + c.creditHours, 0);
    return totalCredits > 0 ? totalPoints / totalCredits : 0;
  };

  // Get letter grade
  const getLetterGrade = (grade: number): string => {
    if (grade >= 90) return 'A';
    if (grade >= 80) return 'B';
    if (grade >= 70) return 'C';
    if (grade >= 60) return 'D';
    return 'F';
  };

  // Add new course
  const handleAddCourse = () => {
    if (!newCourse.name || !newCourse.grade || !newCourse.creditHours) return;

    const grade = parseInt(newCourse.grade);
    const creditHours = parseInt(newCourse.creditHours);
    const gradePoint = getGradePoint(grade);

    const course: Course = {
      id: Date.now().toString(),
      name: newCourse.name,
      grade,
      creditHours,
      gradePoint,
    };

    setCourses([...courses, course]);
    setNewCourse({ name: '', grade: '', creditHours: '' });
  };

  // Delete course
  const handleDeleteCourse = (id: string) => {
    setCourses(courses.filter((c) => c.id !== id));
  };

  const gpa = calculateGPA();

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-bold mb-2 text-balance">
          Grade Tracker
        </h1>
        <p className="text-muted-foreground text-lg">
          Track your courses and calculate your GPA
        </p>
      </div>

      {/* GPA Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card className="p-6 border-l-4" style={{ borderLeftColor: 'hsl(var(--primary))' }}>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                Overall GPA
              </p>
              <p className="text-4xl font-bold">{gpa.toFixed(2)}</p>
            </div>
            <div
              className="p-3 rounded-lg text-white"
              style={{ backgroundColor: 'hsl(var(--primary))' }}
            >
              <TrendingUp className="h-5 w-5" />
            </div>
          </div>
        </Card>

        <Card className="p-6 border-l-4" style={{ borderLeftColor: 'hsl(var(--accent))' }}>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                Courses Taken
              </p>
              <p className="text-4xl font-bold">{courses.length}</p>
            </div>
            <div
              className="p-3 rounded-lg text-white"
              style={{ backgroundColor: 'hsl(var(--accent))' }}
            >
              <BookOpen className="h-5 w-5" />
            </div>
          </div>
        </Card>

        <Card className="p-6 border-l-4" style={{ borderLeftColor: 'hsl(var(--primary))' }}>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                Average Grade
              </p>
              <p className="text-4xl font-bold">
                {courses.length > 0
                  ? (courses.reduce((sum, c) => sum + c.grade, 0) / courses.length).toFixed(1)
                  : 0}
                %
              </p>
            </div>
            <div
              className="p-3 rounded-lg text-white"
              style={{ backgroundColor: 'hsl(var(--primary))' }}
            >
              <Target className="h-5 w-5" />
            </div>
          </div>
        </Card>
      </div>

      {/* Add Course Form */}
      <Card className="p-6 mb-8">
        <h2 className="text-xl font-bold mb-6">Add New Course</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Course Name"
            value={newCourse.name}
            onChange={(e) =>
              setNewCourse({ ...newCourse, name: e.target.value })
            }
            className="p-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <input
            type="number"
            placeholder="Grade (%)"
            value={newCourse.grade}
            onChange={(e) =>
              setNewCourse({ ...newCourse, grade: e.target.value })
            }
            min="0"
            max="100"
            className="p-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <input
            type="number"
            placeholder="Credit Hours"
            value={newCourse.creditHours}
            onChange={(e) =>
              setNewCourse({ ...newCourse, creditHours: e.target.value })
            }
            min="1"
            className="p-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <Button
            onClick={handleAddCourse}
            className="gap-2 w-full md:w-auto"
          >
            <Plus className="h-4 w-4" />
            Add Course
          </Button>
        </div>
      </Card>

      {/* Courses List */}
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-6">Your Courses</h2>

        {courses.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
            <p className="text-muted-foreground">
              No courses added yet. Add your first course above!
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-semibold">
                    Course Name
                  </th>
                  <th className="text-center py-3 px-4 font-semibold">
                    Grade
                  </th>
                  <th className="text-center py-3 px-4 font-semibold">
                    Letter
                  </th>
                  <th className="text-center py-3 px-4 font-semibold">
                    Points
                  </th>
                  <th className="text-center py-3 px-4 font-semibold">
                    Credit Hours
                  </th>
                  <th className="text-center py-3 px-4 font-semibold">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {courses.map((course) => (
                  <tr
                    key={course.id}
                    className="border-b border-border hover:bg-secondary transition-colors"
                  >
                    <td className="py-4 px-4 font-medium">{course.name}</td>
                    <td className="py-4 px-4 text-center font-semibold">
                      {course.grade}%
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span
                        className="px-3 py-1 rounded-full text-sm font-bold text-white"
                        style={{
                          backgroundColor:
                            course.grade >= 90
                              ? 'hsl(var(--primary))'
                              : course.grade >= 80
                                ? 'hsl(var(--accent))'
                                : 'hsl(var(--muted))',
                        }}
                      >
                        {getLetterGrade(course.grade)}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      {course.gradePoint.toFixed(2)}
                    </td>
                    <td className="py-4 px-4 text-center">
                      {course.creditHours}
                    </td>
                    <td className="py-4 px-4 text-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteCourse(course.id)}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* GPA Scale Reference */}
      <Card className="p-6 mt-8 bg-gradient-to-r from-blue-50 to-transparent dark:from-blue-950 dark:to-transparent">
        <h3 className="font-bold mb-4">GPA Scale Reference</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">A</p>
            <p className="font-bold">90-100%</p>
            <p className="text-sm">4.0</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">B</p>
            <p className="font-bold">80-89%</p>
            <p className="text-sm">3.7</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">C</p>
            <p className="font-bold">70-79%</p>
            <p className="text-sm">3.3</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">D</p>
            <p className="font-bold">60-69%</p>
            <p className="text-sm">3.0</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">F</p>
            <p className="font-bold">Below 60%</p>
            <p className="text-sm">0.0</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
