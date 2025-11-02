import { Client, Databases, Storage } from "appwrite";

// Blog type definition - re-export from lib for backward compatibility
export type { Blog } from "@/lib/appwrite/config";

// Appwrite configuration
const conf = {
  appwriteUrl: String(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT),
  appwriteProjectId: String(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID),
  appwriteDatabaseId: String(process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID),
  appwriteCollectionId: String(process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ID),
  appwriteBucketId: String(process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID),
};

// Initialize Appwrite client (only on client side)
let client: Client | null = null;
let databases: Databases | null = null;
let storage: Storage | null = null;

export const getAppwriteClient = () => {
  if (typeof window === "undefined") {
    // Server-side: return null or handle server-side initialization
    return null;
  }

  if (!client) {
    if (!conf.appwriteUrl || !conf.appwriteProjectId) {
      throw new Error(
        "NEXT_PUBLIC_APPWRITE_ENDPOINT and NEXT_PUBLIC_APPWRITE_PROJECT_ID must be set"
      );
    }
    client = new Client();
    client.setEndpoint(conf.appwriteUrl).setProject(conf.appwriteProjectId);
  }
  return client;
};

export const getAppwriteDatabases = () => {
  if (typeof window === "undefined") {
    return null;
  }

  if (!databases) {
    const client = getAppwriteClient();
    if (!client) return null;
    databases = new Databases(client);
  }
  return databases;
};

export const getAppwriteStorage = () => {
  if (typeof window === "undefined") {
    return null;
  }

  if (!storage) {
    const client = getAppwriteClient();
    if (!client) return null;
    storage = new Storage(client);
  }
  return storage;
};

export default conf;
