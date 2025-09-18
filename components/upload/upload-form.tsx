"use client";

import UploadFormInput from "./upload-form-input";
import { z } from "zod";
import { useUploadThing } from "@/utils/uploadthing";
import { useToast } from "@/components/ui/use-toast";
import {
  generatePdfSummary,
  storePdfSummaryAction,
} from "@/actions/upload-actions";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

const schema = z.object({
  file: z
    .instanceof(File, { message: "Invalid file" })
    .refine(
      (file) => file.size <= 20 * 1024 * 1024,
      "File size must be less than 20MB"
    )
    .refine(
      (file) => file.type.startsWith("application/pdf"),
      "File must be a PDF"
    ),
});

export default function UploadForm() {
  const { toast, error } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { startUpload, routeConfig } = useUploadThing("pdfUploader", {
    onClientUploadComplete: () => {
      console.log("Uploaded successfully!");
    },
    onUploadError: (err) => {
      console.error("Error occurred while uploading", err);
      error("❌ Error occurred while uploading", err.message);
    },
    onUploadBegin: (data) => {
      console.log("Upload has begun for", data);
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      const formData = new FormData(e.currentTarget);
      const file = formData.get("file") as File;

      const validatedFields = schema.safeParse({ file });

      if (!validatedFields.success) {
        toast({
          title: "❌ Something went wrong",
          variant: "destructive",
          description:
            validatedFields.error.flatten().fieldErrors.file?.[0] ??
            "Invalid file",
        });
        setIsLoading(false);
        return;
      }

      toast({
        title: "📃 Uploading PDF",
        description: "Hold tight, We are uploading your PDF!✨",
      });

      const uploadResponse = await startUpload([file]);
      if (
        !uploadResponse ||
        !uploadResponse[0] ||
        !uploadResponse[0].serverData ||
        !uploadResponse[0].serverData.fileUrl
      ) {
        toast({
          title: "Something went wrong",
          description: "File upload failed. Please try again.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      toast({
        title: "📃 Processing PDF",
        description: "Hold tight, Our AI is reading through your document!✨",
      });
      const result = await generatePdfSummary({
        fileUrl: uploadResponse[0].serverData.fileUrl,
        fileName: file.name,
      });
      const { data = null, message = null } = result || {};

      if (data) {
        let storeResult: any;
        toast({
          title: "📃 Saving PDF",
          description: "Hang tight, We are saving your summary!✨",
        });

        if (data.summary) {
          storeResult = await storePdfSummaryAction({
            summary: data.summary,
            fileUrl: uploadResponse[0].serverData.fileUrl,
            title: data.title,
            fileName: file.name,
          });
          toast({
            title: "✨ Summary Generated",
            description:
              "Your PDF has been successfully summarized and saved!✨",
          });

          formRef.current?.reset();
          router.push(`/summaries/${storeResult.data.id}`);
        }
      }

      console.log("Upload response:", uploadResponse);
    } catch (error) {
      setIsLoading(false);
      console.error("Error occurred:", error);
      formRef.current?.reset();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 w-full max-w-2xl mx-auto">
      <UploadFormInput
        isLoading={isLoading}
        ref={formRef}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
