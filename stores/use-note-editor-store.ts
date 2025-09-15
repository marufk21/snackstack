import { create } from "zustand";

export interface Note {
  id?: string;
  title: string;
  content: string;
  slug: string;
  imageUrl?: string;
  userId?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

interface NoteEditorState {
  // Current note being edited
  currentNote: Note | null;
  setCurrentNote: (note: Note | null) => void;

  // Editor content
  title: string;
  content: string;
  imageUrl: string | null;
  setTitle: (title: string) => void;
  setContent: (content: string) => void;
  setImageUrl: (url: string | null) => void;

  // Editor state
  isDirty: boolean;
  setIsDirty: (dirty: boolean) => void;

  // Auto-save state
  isSaving: boolean;
  setIsSaving: (saving: boolean) => void;
  lastSaved: Date | null;
  setLastSaved: (date: Date | null) => void;

  // AI suggestions
  isGeneratingAI: boolean;
  setIsGeneratingAI: (generating: boolean) => void;
  aiSuggestion: string;
  setAiSuggestion: (suggestion: string) => void;

  // Modal states
  showAiModal: boolean;
  setShowAiModal: (show: boolean) => void;

  // Actions
  resetEditor: () => void;
  updateFromNote: (note: Note) => void;
  getSlugFromTitle: (title: string) => string;
}

export const useNoteEditorStore = create<NoteEditorState>((set, get) => ({
  // Current note
  currentNote: null,
  setCurrentNote: (note) => set({ currentNote: note }),

  // Editor content
  title: "",
  content: "",
  imageUrl: null,
  setTitle: (title) => {
    set({ title, isDirty: true });
  },
  setContent: (content) => {
    set({ content, isDirty: true });
  },
  setImageUrl: (url) => {
    set({ imageUrl: url, isDirty: true });
  },

  // Editor state
  isDirty: false,
  setIsDirty: (dirty) => set({ isDirty: dirty }),

  // Auto-save state
  isSaving: false,
  setIsSaving: (saving) => set({ isSaving: saving }),
  lastSaved: null,
  setLastSaved: (date) => set({ lastSaved: date }),

  // AI suggestions
  isGeneratingAI: false,
  setIsGeneratingAI: (generating) => set({ isGeneratingAI: generating }),
  aiSuggestion: "",
  setAiSuggestion: (suggestion) => set({ aiSuggestion: suggestion }),

  // Modal states
  showAiModal: false,
  setShowAiModal: (show) => set({ showAiModal: show }),

  // Actions
  resetEditor: () =>
    set({
      currentNote: null,
      title: "",
      content: "",
      imageUrl: null,
      isDirty: false,
      isSaving: false,
      lastSaved: null,
      aiSuggestion: "",
      showAiModal: false,
    }),

  updateFromNote: (note) =>
    set({
      currentNote: note,
      title: note.title,
      content: note.content,
      imageUrl: note.imageUrl || null,
      isDirty: false,
    }),

  getSlugFromTitle: (title) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "")
      .substring(0, 50);
  },
}));
