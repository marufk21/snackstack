import { ID, Query, Models } from "appwrite";
import {
  databases,
  DATABASE_ID,
  BLOGS_COLLECTION_ID,
  Blog,
  createBlogDocument,
  storage,
} from "./config";
import conf from "@/config/appwrite";

// Define BlogDocument interface that extends Models.Document with blog-specific properties
interface BlogDocument extends Models.Document {
  title: string;
  excerpt: string;
  coverImage?: string;
  date: string;
  author: string;
  content: string;
  status: string;
}

// Helper to map Appwrite Document to Blog type
const mapDocumentToBlog = (doc: Models.Document): Blog => {
  const blogDoc = doc as unknown as BlogDocument;
  return {
    id: blogDoc.$id,
    title: blogDoc.title,
    excerpt: blogDoc.excerpt,
    coverImage: blogDoc.coverImage,
    date: blogDoc.date,
    author: blogDoc.author,
    content: blogDoc.content,
    status: blogDoc.status,
  };
};

// Get all blogs
export const getBlogs = async (): Promise<Blog[]> => {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      BLOGS_COLLECTION_ID,
      [Query.orderDesc("date")]
    );
    return response.documents.map((doc) => mapDocumentToBlog(doc));
  } catch (error) {
    console.error("Error fetching blogs:", error);
    throw error;
  }
};

// Get a single blog by ID
export const getBlogById = async (id: string): Promise<Blog> => {
  try {
    const response = await databases.getDocument(
      DATABASE_ID,
      BLOGS_COLLECTION_ID,
      id
    );
    return mapDocumentToBlog(response);
  } catch (error) {
    console.error("Error fetching blog:", error);
    throw error;
  }
};

// Create a new blog
export const createBlog = async (
  blog: Omit<Blog, "id" | "date">
): Promise<Blog> => {
  try {
    const blogDoc = createBlogDocument(blog);
    const response = await databases.createDocument(
      DATABASE_ID,
      BLOGS_COLLECTION_ID,
      ID.unique(),
      blogDoc
    );
    return mapDocumentToBlog(response);
  } catch (error) {
    console.error("Error creating blog:", error);
    throw error;
  }
};

// Update an existing blog
export const updateBlog = async (
  id: string,
  blog: Omit<Blog, "id" | "date">
): Promise<Blog> => {
  try {
    const blogDoc = createBlogDocument(blog);
    const response = await databases.updateDocument(
      DATABASE_ID,
      BLOGS_COLLECTION_ID,
      id,
      blogDoc
    );
    return mapDocumentToBlog(response);
  } catch (error) {
    console.error("Error updating blog:", error);
    throw error;
  }
};

// Delete a blog
export const deleteBlog = async (id: string): Promise<void> => {
  try {
    // First get the blog to get the image file ID
    const blogDoc = await databases.getDocument(
      DATABASE_ID,
      BLOGS_COLLECTION_ID,
      id
    );
    const blog = blogDoc as unknown as BlogDocument;

    // Extract file ID from the coverImage URL
    const coverImageUrl = blog.coverImage;
    if (coverImageUrl) {
      try {
        // Extract file ID from the URL
        // Appwrite storage URLs are in format: https://cloud.appwrite.io/v1/storage/buckets/{bucketId}/files/{fileId}/view
        const urlParts = coverImageUrl.split('/');
        const fileIdIndex = urlParts.findIndex((part: string) => part === 'files') + 1;
        const fileId = fileIdIndex > 0 ? urlParts[fileIdIndex] : null;

        if (fileId) {
          // Delete the file from storage
          await storage.deleteFile(conf.appwriteBucketId, fileId);
        }
      } catch (error) {
        console.error("Error deleting image file:", error);
        // Continue with blog deletion even if image deletion fails
      }
    }

    // Delete the blog document
    await databases.deleteDocument(DATABASE_ID, BLOGS_COLLECTION_ID, id);
  } catch (error) {
    console.error("Error deleting blog:", error);
    throw error;
  }
};
