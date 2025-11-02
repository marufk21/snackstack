/**
 * CKEditor 5 License Configuration
 * This file must be imported before any CKEditor components
 */

if (typeof window !== "undefined") {
  // Set CKEditor license key (GPL for open source/non-commercial use)
  // You can override this with NEXT_PUBLIC_CKEDITOR_LICENSE environment variable
  (window as any).CKEDITOR_LICENSE =
    process.env.NEXT_PUBLIC_CKEDITOR_LICENSE || "GPL";
}

