import { ID, Query, Models } from "appwrite";
import {
  databases,
  storage,
  DATABASE_ID,
  BLOGS_COLLECTION_ID,
  Blog,
  createBlogDocument,
} from "@/server/integrations/appwrite/config";
import conf from "@/server/integrations/appwrite/config";

interface BlogDocument extends Models.Document {
  title: string;
  excerpt: string;
  coverImage?: string;
  date: string;
  author: string;
  content: string;
  status: string;
}

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

export const getBlogs = async (): Promise<Blog[]> => {
  try {
    if (!DATABASE_ID || !BLOGS_COLLECTION_ID) {
      console.warn("Appwrite configuration is missing, returning empty array");
      return [];
    }

    const response = await databases.listDocuments(
      DATABASE_ID,
      BLOGS_COLLECTION_ID,
      [Query.orderDesc("date")]
    );
    return response.documents.map((doc) => mapDocumentToBlog(doc));
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return [];
  }
};

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

export const deleteBlog = async (id: string): Promise<void> => {
  try {
    const blogDoc = await databases.getDocument(
      DATABASE_ID,
      BLOGS_COLLECTION_ID,
      id
    );
    const blog = blogDoc as unknown as BlogDocument;

    const coverImageUrl = blog.coverImage;
    if (coverImageUrl) {
      try {
        const urlParts = coverImageUrl.split('/');
        const fileIdIndex = urlParts.findIndex((part: string) => part === 'files') + 1;
        const fileId = fileIdIndex > 0 ? urlParts[fileIdIndex] : null;

        if (fileId) {
          await storage.deleteFile(conf.appwriteBucketId, fileId);
        }
      } catch (error) {
        console.error("Error deleting image file:", error);
      }
    }

    await databases.deleteDocument(DATABASE_ID, BLOGS_COLLECTION_ID, id);
  } catch (error) {
    console.error("Error deleting blog:", error);
    throw error;
  }
};
