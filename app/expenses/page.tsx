'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  DollarSign,
  Plus,
  Trash2,
  TrendingDown,
  Calendar,
} from 'lucide-react';

interface Expense {
  id: string;
  title: string;
  amount: number;
  category: 'food' | 'transport' | 'books' | 'supplies' | 'entertainment' | 'other';
  date: string;
  description?: string;
}

const categoryColors: Record<string, string> = {
  food: 'bg-orange-50 text-orange-700 dark:bg-orange-950/30',
  transport: 'bg-blue-50 text-blue-700 dark:bg-blue-950/30',
  books: 'bg-purple-50 text-purple-700 dark:bg-purple-950/30',
  supplies: 'bg-green-50 text-green-700 dark:bg-green-950/30',
  entertainment: 'bg-pink-50 text-pink-700 dark:bg-pink-950/30',
  other: 'bg-gray-50 text-gray-700 dark:bg-gray-950/30',
};

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([
    {
      id: '1',
      title: 'Lunch',
      amount: 12.5,
      category: 'food',
      date: '2024-01-15',
    },
    {
      id: '2',
      title: 'Bus Pass',
      amount: 50,
      category: 'transport',
      date: '2024-01-14',
    },
    {
      id: '3',
      title: 'Textbooks',
      amount: 120,
      category: 'books',
      date: '2024-01-10',
    },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Expense['category']>('food');
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: 'food' as Expense['category'],
    date: new Date().toISOString().split('T')[0],
    description: '',
  });

  const handleAddExpense = () => {
    if (formData.title.trim() && formData.amount) {
      const newExpense: Expense = {
        id: Date.now().toString(),
        title: formData.title,
        amount: parseFloat(formData.amount),
        category: formData.category,
        date: formData.date,
        description: formData.description,
      };
      setExpenses([...expenses, newExpense]);
      setFormData({
        title: '',
        amount: '',
        category: 'food',
        date: new Date().toISOString().split('T')[0],
        description: '',
      });
      setShowForm(false);
    }
  };

  const handleDeleteExpense = (id: string) => {
    setExpenses(expenses.filter((e) => e.id !== id));
  };

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const categoryTotals = expenses.reduce(
    (acc, e) => {
      acc[e.category] = (acc[e.category] || 0) + e.amount;
      return acc;
    },
    {} as Record<string, number>
  );

  const sortedExpenses = [...expenses].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Expenses</h1>
        <p className="text-muted-foreground">
          Track your spending and manage your budget
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card className="p-6 border-l-4" style={{ borderLeftColor: 'hsl(var(--primary))' }}>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                Total Spent
              </p>
              <p className="text-4xl font-bold text-primary">
                ${totalExpenses.toFixed(2)}
              </p>
            </div>
            <div
              className="p-3 rounded-lg text-white"
              style={{
                backgroundColor: 'hsl(var(--primary))',
              }}
            >
              <DollarSign className="h-6 w-6" />
            </div>
          </div>
        </Card>

        <Card className="p-6 border-l-4" style={{ borderLeftColor: 'hsl(var(--accent))' }}>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                Number of Expenses
              </p>
              <p className="text-4xl font-bold text-accent">
                {expenses.length}
              </p>
            </div>
            <div
              className="p-3 rounded-lg text-white"
              style={{
                backgroundColor: 'hsl(var(--accent))',
              }}
            >
              <TrendingDown className="h-6 w-6" />
            </div>
          </div>
        </Card>
      </div>

      {/* Add New Expense */}
      <Card className="p-6 mb-8">
        {showForm ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Expense title..."
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="px-4 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />

              <input
                type="number"
                placeholder="Amount ($)"
                value={formData.amount}
                onChange={(e) =>
                  setFormData({ ...formData, amount: e.target.value })
                }
                step="0.01"
                min="0"
                className="px-4 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-2">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      category: e.target.value as Expense['category'],
                    })
                  }
                  className="w-full px-3 py-2 border border-border rounded-lg text-sm"
                >
                  <option value="food">Food</option>
                  <option value="transport">Transport</option>
                  <option value="books">Books</option>
                  <option value="supplies">Supplies</option>
                  <option value="entertainment">Entertainment</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-2">
                  Date
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-border rounded-lg text-sm"
                />
              </div>
            </div>

            <textarea
              placeholder="Description (optional)"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full px-4 py-2 border border-border rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary"
              rows={2}
            />

            <div className="flex gap-2">
              <Button onClick={handleAddExpense} className="flex-1 gap-2">
                <Plus className="h-4 w-4" />
                Add Expense
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowForm(false);
                  setFormData({
                    title: '',
                    amount: '',
                    category: 'food',
                    date: new Date().toISOString().split('T')[0],
                    description: '',
                  });
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
            Add New Expense
          </Button>
        )}
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Category Breakdown */}
        <Card className="p-6">
          <h2 className="font-bold text-lg mb-4">By Category</h2>
          <div className="space-y-3">
            {Object.entries(categoryTotals).map(([category, amount]) => (
              <div key={category} className="flex justify-between items-center">
                <span className="text-sm capitalize text-muted-foreground">
                  {category}
                </span>
                <span className="font-semibold">
                  ${amount.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </Card>

        {/* Expenses List */}
        <div className="lg:col-span-2 space-y-2">
          {sortedExpenses.length > 0 ? (
            sortedExpenses.map((expense) => (
              <Card key={expense.id} className="p-4 border-l-4" style={{ borderLeftColor: 'hsl(var(--primary))' }}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <p className="font-medium">{expense.title}</p>
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${categoryColors[expense.category]}`}>
                        {expense.category}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(expense.date).toLocaleDateString(
                          'en-US',
                          { month: 'short', day: 'numeric', year: 'numeric' }
                        )}
                      </div>
                      {expense.description && (
                        <p className="text-xs">{expense.description}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 flex-shrink-0">
                    <p className="font-bold text-lg">
                      ${expense.amount.toFixed(2)}
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteExpense(expense.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <Card className="p-8 text-center">
              <DollarSign className="h-12 w-12 mx-auto mb-4 opacity-30" />
              <p className="text-muted-foreground">
                No expenses yet. Add one to get started!
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
