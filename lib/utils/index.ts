import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// NOTE: Do NOT export from "./notes" here because it contains server-only database code
// Import directly from "@/lib/utils/notes" in server components/API routes instead
