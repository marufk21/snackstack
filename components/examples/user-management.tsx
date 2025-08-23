"use client";

import { useState } from "react";
import {
  useUsers,
  useCreateUser,
  useUpdateUser,
  useDeleteUser,
} from "@/lib/hooks/use-api";
import { useAppStore } from "@/lib/stores/use-app-store";
import { Button } from "@/components/ui/button";
import { Loader2, Plus, Edit, Trash2, User, Users } from "lucide-react";

export function UserManagement() {
  const [isCreating, setIsCreating] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [formData, setFormData] = useState({ name: "", email: "" });

  // Zustand store
  const { isLoading: globalLoading, setIsLoading } = useAppStore();
  const { addNotification } = useAppStore();

  // React Query hooks
  const { data: users, isLoading: usersLoading, error } = useUsers();
  const createUserMutation = useCreateUser();
  const updateUserMutation = useUpdateUser();
  const deleteUserMutation = useDeleteUser();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email) {
      addNotification({
        type: "error",
        message: "Please fill in all fields",
      });
      return;
    }

    if (editingUser) {
      await updateUserMutation.mutateAsync({
        id: editingUser.id,
        ...formData,
      });
      setEditingUser(null);
    } else {
      await createUserMutation.mutateAsync(formData);
    }

    setFormData({ name: "", email: "" });
    setIsCreating(false);
  };

  const handleEdit = (user: any) => {
    setEditingUser(user);
    setFormData({ name: user.name, email: user.email });
    setIsCreating(true);
  };

  const handleDelete = async (userId: string) => {
    if (confirm("Are you sure you want to delete this user?")) {
      await deleteUserMutation.mutateAsync(userId);
    }
  };

  const handleCancel = () => {
    setIsCreating(false);
    setEditingUser(null);
    setFormData({ name: "", email: "" });
  };

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-800">Error loading users: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5" />
          <h2 className="text-xl font-semibold">User Management</h2>
        </div>
        {!isCreating && (
          <Button
            onClick={() => setIsCreating(true)}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add User
          </Button>
        )}
      </div>

      {/* Create/Edit Form */}
      {isCreating && (
        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border">
          <h3 className="text-lg font-medium mb-4">
            {editingUser ? "Edit User" : "Create New User"}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                placeholder="Enter name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                placeholder="Enter email"
              />
            </div>
            <div className="flex gap-2">
              <Button
                type="submit"
                disabled={
                  createUserMutation.isPending || updateUserMutation.isPending
                }
                className="flex items-center gap-2"
              >
                {(createUserMutation.isPending ||
                  updateUserMutation.isPending) && (
                  <Loader2 className="w-4 h-4 animate-spin" />
                )}
                {editingUser ? "Update User" : "Create User"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={
                  createUserMutation.isPending || updateUserMutation.isPending
                }
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Users List */}
      <div className="space-y-4">
        {usersLoading ? (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="w-6 h-6 animate-spin" />
            <span className="ml-2">Loading users...</span>
          </div>
        ) : users && users.length > 0 ? (
          <div className="grid gap-4">
            {users.map((user) => (
              <div
                key={user.id}
                className="p-4 border rounded-lg flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  </div>
                  <div>
                    <h4 className="font-medium">{user.name}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {user.email}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(user)}
                    disabled={deleteUserMutation.isPending}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(user.id)}
                    disabled={deleteUserMutation.isPending}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center p-8 text-gray-500">
            <Users className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p>No users found. Create your first user to get started.</p>
          </div>
        )}
      </div>

      {/* Global Loading Indicator */}
      {globalLoading && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg flex items-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Processing...</span>
          </div>
        </div>
      )}
    </div>
  );
}
