import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAppStore } from "@/stores/use-app-store";

// Example API types
interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface Post {
  id: string;
  title: string;
  content: string;
  authorId: string;
  createdAt: string;
}

// Example API functions (replace with your actual API calls)
const api = {
  // Users
  getUsers: async (): Promise<User[]> => {
    const response = await fetch("/api/users");
    if (!response.ok) throw new Error("Failed to fetch users");
    return response.json();
  },

  getUser: async (id: string): Promise<User> => {
    const response = await fetch(`/api/users/${id}`);
    if (!response.ok) throw new Error("Failed to fetch user");
    return response.json();
  },

  createUser: async (user: Omit<User, "id">): Promise<User> => {
    const response = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    });
    if (!response.ok) throw new Error("Failed to create user");
    return response.json();
  },

  updateUser: async ({
    id,
    ...user
  }: Partial<User> & { id: string }): Promise<User> => {
    const response = await fetch(`/api/users/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    });
    if (!response.ok) throw new Error("Failed to update user");
    return response.json();
  },

  deleteUser: async (id: string): Promise<void> => {
    const response = await fetch(`/api/users/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete user");
  },

  // Posts
  getPosts: async (): Promise<Post[]> => {
    const response = await fetch("/api/posts");
    if (!response.ok) throw new Error("Failed to fetch posts");
    return response.json();
  },

  getPost: async (id: string): Promise<Post> => {
    const response = await fetch(`/api/posts/${id}`);
    if (!response.ok) throw new Error("Failed to fetch post");
    return response.json();
  },

  createPost: async (post: Omit<Post, "id" | "createdAt">): Promise<Post> => {
    const response = await fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(post),
    });
    if (!response.ok) throw new Error("Failed to create post");
    return response.json();
  },
};

// Query keys
export const queryKeys = {
  users: ["users"] as const,
  user: (id: string) => ["users", id] as const,
  posts: ["posts"] as const,
  post: (id: string) => ["posts", id] as const,
};

// User hooks
export function useUsers() {
  return useQuery({
    queryKey: queryKeys.users,
    queryFn: api.getUsers,
  });
}

export function useUser(id: string) {
  return useQuery({
    queryKey: queryKeys.user(id),
    queryFn: () => api.getUser(id),
    enabled: !!id,
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();
  const addNotification = useAppStore((state) => state.addNotification);

  return useMutation({
    mutationFn: api.createUser,
    onSuccess: (newUser) => {
      // Invalidate and refetch users list
      queryClient.invalidateQueries({ queryKey: queryKeys.users });

      // Optimistically update the cache
      queryClient.setQueryData(queryKeys.users, (old: User[] | undefined) => {
        return old ? [...old, newUser] : [newUser];
      });

      addNotification({
        type: "success",
        message: "User created successfully!",
      });
    },
    onError: (error) => {
      addNotification({
        type: "error",
        message: error.message || "Failed to create user",
      });
    },
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();
  const addNotification = useAppStore((state) => state.addNotification);

  return useMutation({
    mutationFn: api.updateUser,
    onSuccess: (updatedUser) => {
      // Update the specific user in cache
      queryClient.setQueryData(queryKeys.user(updatedUser.id), updatedUser);

      // Invalidate users list to refetch
      queryClient.invalidateQueries({ queryKey: queryKeys.users });

      addNotification({
        type: "success",
        message: "User updated successfully!",
      });
    },
    onError: (error) => {
      addNotification({
        type: "error",
        message: error.message || "Failed to update user",
      });
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();
  const addNotification = useAppStore((state) => state.addNotification);

  return useMutation({
    mutationFn: api.deleteUser,
    onSuccess: (_, deletedId) => {
      // Remove from users list cache
      queryClient.setQueryData(queryKeys.users, (old: User[] | undefined) => {
        return old ? old.filter((user) => user.id !== deletedId) : [];
      });

      // Remove individual user cache
      queryClient.removeQueries({ queryKey: queryKeys.user(deletedId) });

      addNotification({
        type: "success",
        message: "User deleted successfully!",
      });
    },
    onError: (error) => {
      addNotification({
        type: "error",
        message: error.message || "Failed to delete user",
      });
    },
  });
}

// Post hooks
export function usePosts() {
  return useQuery({
    queryKey: queryKeys.posts,
    queryFn: api.getPosts,
  });
}

export function usePost(id: string) {
  return useQuery({
    queryKey: queryKeys.post(id),
    queryFn: () => api.getPost(id),
    enabled: !!id,
  });
}

export function useCreatePost() {
  const queryClient = useQueryClient();
  const addNotification = useAppStore((state) => state.addNotification);

  return useMutation({
    mutationFn: api.createPost,
    onSuccess: (newPost) => {
      // Invalidate and refetch posts list
      queryClient.invalidateQueries({ queryKey: queryKeys.posts });

      // Optimistically update the cache
      queryClient.setQueryData(queryKeys.posts, (old: Post[] | undefined) => {
        return old ? [...old, newPost] : [newPost];
      });

      addNotification({
        type: "success",
        message: "Post created successfully!",
      });
    },
    onError: (error) => {
      addNotification({
        type: "error",
        message: error.message || "Failed to create post",
      });
    },
  });
}
