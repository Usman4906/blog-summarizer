"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface UploadFormInputProps {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
}

export const UploadFormInput = forwardRef<
  HTMLFormElement,
  UploadFormInputProps
>(({ onSubmit, isLoading }, ref) => {
  return (
    <form className="flex flex-col gap-6" ref={ref} onSubmit={onSubmit}>
      <div className="flex justify-end items-center gap-1.5">
        <Input
          id="file"
          type="file"
          name="file"
          accept="application/pdf"
          required
          disabled={isLoading}
          className={cn(isLoading && "opacity-50 cursor-not-allowed")}
        />
        <Button
          disabled={isLoading}
          className="bg-rose-500 hover:bg-rose-700 text-white"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...{" "}
            </>
          ) : (
            "Upload your PDF"
          )}
        </Button>
      </div>
    </form>
  );
});

UploadFormInput.displayName = "UploadFormInput";
export default UploadFormInput;
