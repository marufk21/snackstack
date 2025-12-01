"use client";

import { useEffect, useState } from "react";

export default function SubscriptionDebugPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStatus();
  }, []);

  const fetchStatus = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/subscription/status");
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading subscription data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <p className="text-red-800 font-medium">❌ Error</p>
          <p className="text-red-600 text-sm mt-1">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            🔍 Subscription Debug Info
          </h1>

          {/* User Info */}
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h2 className="text-lg font-semibold text-blue-900 mb-2">
              👤 User Information
            </h2>
            <div className="space-y-1 text-sm">
              <p>
                <span className="font-medium">Email:</span>{" "}
                {data?.user?.email || "N/A"}
              </p>
              <p>
                <span className="font-medium">User ID:</span>{" "}
                {data?.user?.id || "N/A"}
              </p>
              <p>
                <span className="font-medium">Is Subscribed:</span>{" "}
                <span
                  className={
                    data?.user?.isSubscribed
                      ? "text-green-600 font-semibold"
                      : "text-red-600 font-semibold"
                  }
                >
                  {data?.user?.isSubscribed ? "✅ Yes" : "❌ No"}
                </span>
              </p>
            </div>
          </div>

          {/* Subscription Info */}
          {data?.subscription ? (
            <div className="mb-6 p-4 bg-purple-50 border border-purple-200 rounded-lg">
              <h2 className="text-lg font-semibold text-purple-900 mb-2">
                💳 Subscription Details
              </h2>
              <div className="space-y-1 text-sm">
                <p>
                  <span className="font-medium">Status:</span>{" "}
                  <span
                    className={`font-semibold ${
                      data.subscription.status === "active"
                        ? "text-green-600"
                        : data.subscription.status === "incomplete"
                        ? "text-yellow-600"
                        : "text-red-600"
                    }`}
                  >
                    {data.subscription.status.toUpperCase()}
                  </span>
                </p>
                <p>
                  <span className="font-medium">Plan:</span>{" "}
                  {data.subscription.planType?.toUpperCase() || "N/A"}
                </p>
                <p>
                  <span className="font-medium">Stripe Subscription ID:</span>{" "}
                  <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                    {data.subscription.stripeSubscriptionId}
                  </code>
                </p>
                <p>
                  <span className="font-medium">Stripe Customer ID:</span>{" "}
                  <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                    {data.subscription.stripeCustomerId}
                  </code>
                </p>
                <p>
                  <span className="font-medium">Current Period:</span>{" "}
                  {new Date(
                    data.subscription.currentPeriodStart
                  ).toLocaleDateString()}{" "}
                  -{" "}
                  {new Date(
                    data.subscription.currentPeriodEnd
                  ).toLocaleDateString()}
                </p>
              </div>
            </div>
          ) : (
            <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-yellow-800">
                ⚠️ No subscription found in database
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-4">
            <button
              onClick={fetchStatus}
              className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              🔄 Refresh
            </button>
            <a
              href="/admin/sync-subscription"
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors inline-block"
            >
              🔧 Sync from Stripe
            </a>
            <a
              href="/app/subscription"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors inline-block"
            >
              📊 View Subscription Page
            </a>
          </div>

          {/* Raw Data */}
          <details className="mt-6">
            <summary className="cursor-pointer text-sm font-medium text-gray-700 hover:text-gray-900">
              🔍 View Raw Data (for debugging)
            </summary>
            <pre className="mt-2 p-4 bg-gray-900 text-green-400 rounded-lg overflow-auto text-xs">
              {JSON.stringify(data, null, 2)}
            </pre>
          </details>
        </div>
      </div>
    </div>
  );
}
