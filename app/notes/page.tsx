'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, Plus, Trash2 } from 'lucide-react';

interface Note {
  id: string;
  content: string;
  color: string;
  x: number;
  y: number;
  created: number;
}

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  const colors = [
    'bg-yellow-100 border-yellow-300',
    'bg-pink-100 border-pink-300',
    'bg-blue-100 border-blue-300',
    'bg-green-100 border-green-300',
    'bg-purple-100 border-purple-300',
  ];

  // Load notes from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('scholar_notes');
    if (saved) {
      try {
        setNotes(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load notes:', e);
      }
    }
    setLoading(false);
  }, []);

  // Save notes to localStorage whenever they change
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('scholar_notes', JSON.stringify(notes));
    }
  }, [notes, loading]);

  const addNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      content: '',
      color: colors[Math.floor(Math.random() * colors.length)],
      x: Math.random() * 300,
      y: Math.random() * 300,
      created: Date.now(),
    };
    setNotes([...notes, newNote]);
  };

  const deleteNote = (id: string) => {
    setNotes(notes.filter((note) => note.id !== id));
  };

  const updateNote = (id: string, content: string) => {
    setNotes(
      notes.map((note) =>
        note.id === id ? { ...note, content } : note
      )
    );
  };

  const moveNote = (id: string, x: number, y: number) => {
    setNotes(
      notes.map((note) =>
        note.id === id ? { ...note, x, y } : note
      )
    );
  };

  if (loading) {
    return (
      <div className="p-6 text-center">
        <p>Loading notes...</p>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">My Notes</h1>
          <p className="text-muted-foreground">
            Drag notes around and stick them wherever you want
          </p>
        </div>
        <Button onClick={addNote} className="gap-2" size="lg">
          <Plus className="h-5 w-5" />
          Add Note
        </Button>
      </div>

      {/* Notes Container */}
      {notes.length > 0 ? (
        <div className="relative w-full bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 rounded-lg border border-border overflow-visible p-8 mb-8" style={{ minHeight: '300px' }}>
          {notes.map((note) => (
            <DraggableNote
              key={note.id}
              note={note}
              onUpdate={updateNote}
              onDelete={deleteNote}
              onMove={moveNote}
            />
          ))}
        </div>
      ) : (
        <Card className="p-12 text-center mb-8 border-dashed">
          <p className="text-muted-foreground mb-4">No notes yet</p>
          <Button onClick={addNote} className="gap-2">
            <Plus className="h-4 w-4" />
            Create your first note
          </Button>
        </Card>
      )}

      {/* Notes List Below */}
      {notes.length > 0 && (
        <div>
          <h2 className="text-xl font-bold mb-4">All Notes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {notes.map((note) => (
              <Card key={note.id} className={`p-4 ${note.color} border`}>
                <div className="flex items-start justify-between mb-2">
                  <p className="text-xs text-gray-600">
                    {new Date(note.created).toLocaleDateString()}
                  </p>
                  <button
                    onClick={() => deleteNote(note.id)}
                    className="text-red-600 hover:text-red-700 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <p className="text-sm break-words max-h-24 overflow-hidden">
                  {note.content || 'Empty note...'}
                </p>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function DraggableNote({
  note,
  onUpdate,
  onDelete,
  onMove,
}: {
  note: Note;
  onUpdate: (id: string, content: string) => void;
  onDelete: (id: string) => void;
  onMove: (id: string, x: number, y: number) => void;
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest('textarea') || (e.target as HTMLElement).closest('button')) {
      return;
    }
    setIsDragging(true);
    setOffset({
      x: e.clientX - note.x,
      y: e.clientY - note.y,
    });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const x = e.clientX - offset.x;
    const y = e.clientY - offset.y;
    onMove(note.id, Math.max(0, x), Math.max(0, y));
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      style={{
        position: 'absolute',
        left: `${note.x}px`,
        top: `${note.y}px`,
        cursor: isDragging ? 'grabbing' : 'grab',
        zIndex: isDragging ? 50 : 10,
      }}
      className="w-48"
    >
      <Card className={`${note.color} border-2 shadow-lg p-4`}>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xs font-semibold text-gray-700">Note</h3>
          <button
            onClick={() => onDelete(note.id)}
            className="text-gray-700 hover:text-red-600 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <textarea
          value={note.content}
          onChange={(e) => onUpdate(note.id, e.target.value)}
          placeholder="Write something..."
          className="w-full h-24 p-2 text-xs border border-gray-300 rounded bg-white/70 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
        />
      </Card>
    </div>
  );
}
