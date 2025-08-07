import React from "react";
import { cn } from "@/lib/utils";

interface ToastProps {
  open: boolean;
  text: string;
  type: "success" | "error" | "info";
  onClose: () => void;
}

export function Toast({ open, text, type, onClose }: ToastProps) {
  if (!open) return null;

  const typeStyles = {
    success: "bg-green-100 text-green-800 border-green-200",
    error: "bg-red-100 text-red-800 border-red-200",
    info: "bg-blue-100 text-blue-800 border-blue-200",
  };

  return (
    <div className="fixed top-4 right-4 z-50">
      <div
        className={cn(
          "px-4 py-3 rounded-lg border shadow-lg max-w-sm",
          typeStyles[type]
        )}
      >
        <div className="flex justify-between items-center">
          <p className="text-sm font-medium">{text}</p>
          <button
            onClick={onClose}
            className="ml-3 text-lg leading-none hover:opacity-70"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  );
}
