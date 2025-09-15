import { apiClient } from "../axios";

export interface Note {
  id: string;
  title: string;
  content: string;
  slug: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateNoteData {
  title: string;
  content: string;
  imageUrl?: string;
}

export interface UpdateNoteData {
  title?: string;
  content?: string;
  imageUrl?: string;
}

// Get all notes for the authenticated user
export const getNotes = async (): Promise<Note[]> => {
  const response = await apiClient.get("/notes");
  return response.data.notes;
};

// Get a specific note by ID
export const getNoteById = async (id: string): Promise<Note> => {
  const response = await apiClient.get(`/notes/${id}`);
  return response.data.note;
};

// Create a new note
export const createNote = async (data: CreateNoteData): Promise<Note> => {
  const response = await apiClient.post("/notes", data);
  return response.data.note;
};

// Update an existing note
export const updateNote = async (
  id: string,
  data: UpdateNoteData
): Promise<Note> => {
  const response = await apiClient.put(`/notes/${id}`, data);
  return response.data.note;
};

// Delete a note
export const deleteNote = async (id: string): Promise<void> => {
  await apiClient.delete(`/notes/${id}`);
};
