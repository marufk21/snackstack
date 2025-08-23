# Zustand + React Query Setup

This project is configured with Zustand for state management and React Query (TanStack Query) for data fetching. Here's how to use them together effectively.

## 📁 File Structure

```
lib/
├── stores/
│   └── use-app-store.ts          # Main Zustand store
├── hooks/
│   └── use-api.ts               # React Query hooks
└── query-client.ts              # React Query configuration

components/
├── providers/
│   └── query-provider.tsx       # React Query provider
├── ui/
│   └── notification.tsx         # Notification component
└── examples/
    └── user-management.tsx      # Example usage

app/
└── layout.tsx                   # Providers setup
```

## 🚀 Quick Start

### 1. Zustand Store (`lib/stores/use-app-store.ts`)

The main store includes:

- **Theme management**: Light/dark/system theme
- **User state**: Authentication and user data
- **UI state**: Sidebar, loading states
- **Notifications**: Toast notifications with auto-dismiss

```typescript
import { useAppStore } from "@/lib/stores/use-app-store";

// In your component
const { theme, setTheme, user, setUser, addNotification } = useAppStore();

// Update theme
setTheme("dark");

// Add notification
addNotification({
  type: "success",
  message: "Operation completed successfully!",
});
```

### 2. React Query Hooks (`lib/hooks/use-api.ts`)

Pre-configured hooks for common API operations:

```typescript
import {
  useUsers,
  useCreateUser,
  useUpdateUser,
  useDeleteUser,
} from "@/lib/hooks/use-api";

// Fetch users
const { data: users, isLoading, error } = useUsers();

// Create user
const createUser = useCreateUser();
createUser.mutate({ name: "John", email: "john@example.com" });

// Update user
const updateUser = useUpdateUser();
updateUser.mutate({ id: "123", name: "John Updated" });

// Delete user
const deleteUser = useDeleteUser();
deleteUser.mutate("123");
```

## 🔧 Configuration

### React Query Provider

The `QueryProvider` is set up in `app/layout.tsx` and includes:

- Optimized default settings
- React Query DevTools (development only)
- Proper error handling

### Zustand Store Features

- **Persistence**: Theme and user preferences are persisted
- **TypeScript**: Full type safety
- **Middleware**: Uses persist middleware for localStorage
- **Selective updates**: Only necessary state is persisted

## 📝 Usage Examples

### Combining Zustand + React Query

```typescript
"use client";

import { useUsers, useCreateUser } from "@/lib/hooks/use-api";
import { useAppStore } from "@/lib/stores/use-app-store";

export function UserList() {
  const { data: users, isLoading } = useUsers();
  const createUser = useCreateUser();
  const { addNotification, isLoading: globalLoading } = useAppStore();

  const handleCreateUser = async (userData) => {
    try {
      await createUser.mutateAsync(userData);
      addNotification({
        type: "success",
        message: "User created successfully!",
      });
    } catch (error) {
      addNotification({
        type: "error",
        message: "Failed to create user",
      });
    }
  };

  return (
    <div>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        users?.map((user) => <div key={user.id}>{user.name}</div>)
      )}
    </div>
  );
}
```

### Notifications System

The notification system is automatically integrated:

```typescript
const { addNotification } = useAppStore();

// Success notification
addNotification({
  type: "success",
  message: "Operation completed!",
});

// Error notification
addNotification({
  type: "error",
  message: "Something went wrong",
});

// Warning notification
addNotification({
  type: "warning",
  message: "Please check your input",
});

// Info notification
addNotification({
  type: "info",
  message: "New feature available",
});
```

## 🎯 Best Practices

### 1. Query Keys

Use consistent query keys for better cache management:

```typescript
export const queryKeys = {
  users: ["users"] as const,
  user: (id: string) => ["users", id] as const,
  posts: ["posts"] as const,
  post: (id: string) => ["posts", id] as const,
};
```

### 2. Optimistic Updates

Update the cache immediately for better UX:

```typescript
const updateUser = useUpdateUser();
updateUser.mutate(
  { id: "123", name: "New Name" },
  {
    onSuccess: (updatedUser) => {
      // Update cache immediately
      queryClient.setQueryData(queryKeys.user(updatedUser.id), updatedUser);
    },
  }
);
```

### 3. Error Handling

Use the notification system for consistent error handling:

```typescript
const mutation = useMutation({
  mutationFn: apiCall,
  onError: (error) => {
    addNotification({
      type: "error",
      message: error.message || "An error occurred",
    });
  },
});
```

### 4. Loading States

Combine global and local loading states:

```typescript
const { isLoading: globalLoading } = useAppStore()
const { isLoading: queryLoading } = useQuery(...)

// Show global loading for critical operations
// Show local loading for specific queries
```

## 🔄 State Synchronization

Zustand and React Query work together seamlessly:

1. **Zustand**: Manages UI state, user preferences, and global app state
2. **React Query**: Handles server state, caching, and data synchronization
3. **Notifications**: Bridge between both for user feedback

## 🛠️ Development Tools

- **React Query DevTools**: Available in development mode
- **Zustand DevTools**: Can be added for debugging
- **TypeScript**: Full type safety across both libraries

## 📚 Additional Resources

- [Zustand Documentation](https://github.com/pmndrs/zustand)
- [React Query Documentation](https://tanstack.com/query/latest)
- [Zustand + React Query Integration Guide](https://tkdodo.eu/blog/practical-react-query#zustand)

## 🚨 Important Notes

1. **Client Components**: All components using these hooks must be client components (`'use client'`)
2. **Error Boundaries**: Consider implementing error boundaries for better error handling
3. **Performance**: Use React Query's built-in optimizations like `staleTime` and `gcTime`
4. **Testing**: Both libraries provide excellent testing utilities
