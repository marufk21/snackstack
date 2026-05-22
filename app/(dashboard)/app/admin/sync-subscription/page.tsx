"use client";

import { useState } from "react";

export default function SyncSubscriptionPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSync = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("/api/subscription/sync", {
        method: "POST",
        credentials: "include",
      });

      const data: any = await response.json();

      if (response.ok) {
        setResult(data);
        // Redirect to subscription page after 2 seconds
        setTimeout(() => {
          window.location.href = "/app/subscription";
        }, 2000);
      } else {
        // Show detailed error message
        const errorMsg = data.details || data.error || "Failed to sync subscription";
        setError(errorMsg);
        console.error("Sync failed:", data);
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Network error occurred";
      setError(errorMsg);
      console.error("Sync error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-50 to-blue-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🔄 Sync Subscription
          </h1>
          <p className="text-gray-600">
            Click the button below to sync your subscription status from Stripe
          </p>
        </div>

        <button
          onClick={handleSync}
          disabled={loading}
          className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-semibold py-4 px-6 rounded-xl hover:from-cyan-700 hover:to-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg
                className="animate-spin h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Syncing...
            </span>
          ) : (
            "Sync Now"
          )}
        </button>

        {error && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 font-medium">❌ Error</p>
            <p className="text-red-600 text-sm mt-1">{error}</p>
          </div>
        )}

        {result && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-800 font-medium">✅ Success!</p>
            <p className="text-green-600 text-sm mt-1">{result.message}</p>
            {result.active !== undefined && (
              <p className="text-green-600 text-sm mt-1">
                Status: {result.active ? "Active" : "Inactive"}
              </p>
            )}
            <p className="text-green-600 text-sm mt-2 italic">
              Redirecting to subscription page...
            </p>
          </div>
        )}

        <div className="mt-6 text-center">
          <a
            href="/app/subscription"
            className="text-sm text-gray-500 hover:text-gray-700 underline"
          >
            Go to Subscription Page
          </a>
        </div>

        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-blue-800 font-medium text-sm">ℹ️ What does this do?</p>
          <ul className="text-blue-600 text-xs mt-2 space-y-1 list-disc list-inside">
            <li>Fetches your subscription from Stripe</li>
            <li>Updates the database with correct status</li>
            <li>Fixes "incomplete" → "active" status mismatch</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
