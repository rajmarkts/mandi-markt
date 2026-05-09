"use client";

import { useEffect, useState } from "react";
import { Cloud, CloudOff, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

interface OfflineIndicatorProps {
  className?: string;
}

export function OfflineIndicator({ className }: OfflineIndicatorProps) {
  const [isOnline, setIsOnline] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [showOfflineMessage, setShowOfflineMessage] = useState(false);

  useEffect(() => {
    // Check initial state
    setIsOnline(navigator.onLine);

    const handleOnline = () => {
      setIsOnline(true);
      setIsSyncing(true);
      // Simulate sync completion
      setTimeout(() => setIsSyncing(false), 2000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowOfflineMessage(true);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Auto-hide offline message after 5 seconds
  useEffect(() => {
    if (!isOnline && showOfflineMessage) {
      const timer = setTimeout(() => setShowOfflineMessage(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [isOnline, showOfflineMessage]);

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {/* Main Status Icon */}
      <div
        className={cn(
          "flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all",
          isOnline
            ? "bg-emerald-100 text-emerald-700"
            : "bg-amber-100 text-amber-700"
        )}
      >
        {isSyncing ? (
          <>
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            <span>Syncing...</span>
          </>
        ) : isOnline ? (
          <>
            <Cloud className="w-3.5 h-3.5" />
            <span>Online</span>
          </>
        ) : (
          <>
            <CloudOff className="w-3.5 h-3.5" />
            <span>Offline</span>
          </>
        )}
      </div>

      {/* Offline Mode Message */}
      {!isOnline && showOfflineMessage && (
        <div className="fixed top-20 left-4 right-4 z-50 bg-amber-50 border-2 border-amber-200 rounded-xl p-4 shadow-lg animate-in slide-in-from-top-2">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
              <CloudOff className="w-5 h-5 text-amber-600" />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-amber-900">Working in Offline Mode</h4>
              <p className="text-sm text-amber-700 mt-1">
                Your orders are saved locally. They will sync automatically when internet returns.
              </p>
            </div>
            <button
              onClick={() => setShowOfflineMessage(false)}
              className="p-2 hover:bg-amber-100 rounded-lg"
            >
              <span className="sr-only">Dismiss</span>
              <svg className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Hook for online status
export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    setIsOnline(navigator.onLine);

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return isOnline;
}
