import conf from "@/conf/config";
import { Client, ID, Databases, Storage, Query, Models } from "appwrite";

// Initialize Appwrite client
const client = new Client()
  .setEndpoint(conf.appwriteUrl)
  .setProject(conf.appwriteProjectId);

// Initialize Appwrite services
export const databases = new Databases(client);
export const storage = new Storage(client);

// Database and collection IDs
export const DATABASE_ID = conf.appwriteDatabaseId;
export const BLOGS_COLLECTION_ID = conf.appwriteCollectionId;

// Define blog type
export interface Blog {
  id: string;
  title: string;
  excerpt: string;
  coverImage: string;
  date: string;
  author: string;
  content: string;
  status: string;
}

// Helper function to create a new blog document
export const createBlogDocument = (blog: Omit<Blog, "id" | "date">) => {
  return {
    title: blog.title,
    excerpt: blog.excerpt,
    coverImage: blog.coverImage,
    author: blog.author,
    content: blog.content,
    status: blog.status,
    date: new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
  };
};

// Define interfaces for better type safety
interface PostData {
  title: string;
  slug: string;
  content: string;
  featuredImage: string;
  status: string;
  userId: string;
}

interface UpdatePostData {
  title: string;
  content: string;
  featuredImage: string;
  status: string;
}

interface PostDocument extends Models.Document {
  title: string;
  content: string;
  featuredImage: string;
  status: string;
  userId: string;
}

export class Service {
  client = new Client();
  databases: Databases;
  bucket: Storage;

  constructor() {
    this.client
      .setEndpoint(conf.appwriteUrl)
      .setProject(conf.appwriteProjectId);
    this.databases = new Databases(this.client);
    this.bucket = new Storage(this.client);
  }

  async createPost({
    title,
    slug,
    content,
    featuredImage,
    status,
    userId,
  }: PostData): Promise<PostDocument | undefined> {
    try {
      return (await this.databases.createDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        slug,
        {
          title,
          content,
          featuredImage,
          status,
          userId,
        }
      )) as PostDocument;
    } catch (error) {
      console.log("Appwrite service :: createPost :: error", error);
      return undefined;
    }
  }

  async updatePost(
    slug: string,
    { title, content, featuredImage, status }: UpdatePostData
  ): Promise<PostDocument | undefined> {
    try {
      return (await this.databases.updateDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        slug,
        {
          title,
          content,
          featuredImage,
          status,
        }
      )) as PostDocument;
    } catch (error) {
      console.log("Appwrite service :: updatePost :: error", error);
      return undefined;
    }
  }

  async deletePost(slug: string): Promise<boolean> {
    try {
      await this.databases.deleteDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        slug
      );
      return true;
    } catch (error) {
      console.log("Appwrite service :: deletePost :: error", error);
      return false;
    }
  }

  async getPost(slug: string): Promise<PostDocument | false> {
    try {
      return (await this.databases.getDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        slug
      )) as PostDocument;
    } catch (error) {
      console.log("Appwrite service :: getPost :: error", error);
      return false;
    }
  }

  async getPosts(
    queries: string[] = [Query.equal("status", "active")]
  ): Promise<Models.DocumentList<PostDocument> | false> {
    try {
      return (await this.databases.listDocuments(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        queries
      )) as Models.DocumentList<PostDocument>;
    } catch (error) {
      console.log("Appwrite service :: getPosts :: error", error);
      return false;
    }
  }

  // File upload service
  async uploadFile(file: File): Promise<Models.File | false> {
    try {
      return await this.bucket.createFile(
        conf.appwriteBucketId,
        ID.unique(),
        file
      );
    } catch (error) {
      console.log("Appwrite service :: uploadFile :: error", error);
      return false;
    }
  }

  async deleteFile(fileId: string): Promise<boolean> {
    try {
      await this.bucket.deleteFile(conf.appwriteBucketId, fileId);
      return true;
    } catch (error) {
      console.log("Appwrite service :: deleteFile :: error", error);
      return false;
    }
  }

  getFilePreview(fileId: string): URL {
    return new URL(this.bucket.getFilePreview(conf.appwriteBucketId, fileId));
  }
}

const service = new Service();
export default service;
