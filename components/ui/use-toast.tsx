"use client";

import { toast as sonnerToast } from "sonner";

type ToastVariant = "default" | "destructive";

interface ToastOptions {
  title: string;
  description?: string;
  variant?: ToastVariant;
}

export const useToast = () => {
  // Base toast renderer
  const toast = ({ title, description, variant = "default" }: ToastOptions) => {
    sonnerToast(
      <div>
        <p
          className={`font-semibold ${
            variant === "destructive" ? "text-red-600" : "text-black"
          }`}
        >
          {title}
        </p>
        {description && (
          <p className="text-sm text-gray-600 mt-1">{description}</p>
        )}
      </div>
    );
  };

  // Shorthand error toast
  const error = (title: string, description?: string) =>
    toast({ title, description, variant: "destructive" });

  // Shorthand success/default toast
  const success = (title: string, description?: string) =>
    toast({ title, description, variant: "default" });

  return {
    toast,
    error,
    success,
  };
};
