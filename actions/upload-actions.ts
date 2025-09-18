"use server";

import { fetchAndExtractPdfText } from "@/lib/langchain";
import { generateSummaryFromOpenAI } from "@/lib/openai";
import { generateSummaryFromGemini } from "@/lib/geminiai";
import { auth } from "@clerk/nextjs/server";
import { getDbConnection } from "@/lib/db";
import { formatFileNameAsTitle } from "@/utils/format-utils";
import { revalidatePath } from "next/cache";

interface PdfSummaryType {
  userId?: string;
  fileUrl: string;
  summary: string;
  title: string;
  fileName: string;
}

export async function generatePdfSummary({fileUrl,fileName}: {fileUrl: string; fileName: string}) {
  if (!fileUrl) {
    return {
      success: false,
      message: "File upload failed",
      data: null,
    };
  }

  

  if (!fileUrl) {
    return {
      success: false,
      message: "File upload failed",
      data: null,
    };
  }

  try {
    const pdfText = await fetchAndExtractPdfText(fileUrl);
    let summary;

    try {
      summary = await generateSummaryFromGemini(pdfText);
    } catch (error) {
      console.log("Gemini failed, trying fallback...", error);
      try {
        summary = await generateSummaryFromOpenAI(pdfText);
      } catch (fallbackError) {
        console.error("Both AI providers failed", fallbackError);
        return {
          success: false,
          message: "Failed to generate summary",
          data: null,
        };
      }
    }

    if (!summary) {
      return {
        success: false,
        message: "Summary generation returned empty",
        data: null,
      };
    }

    const formattedFileName = formatFileNameAsTitle(fileName);

    return {
      success: true,
      message: "Summary generated successfully",
      data: {
        fileUrl: fileUrl,
        summary,
        title: formattedFileName,
        fileName,
      },
    };
  } catch (err) {
    console.error("PDF processing failed", err);
    return {
      success: false,
      message: "Something went wrong while processing the PDF",
      data: null,
    };
  }
}

async function savePdfSummary({
  userId,
  fileUrl,
  summary,
  title,
  fileName,
}: PdfSummaryType) {
  try {
    const sql = await getDbConnection();
    const [savedSummary] = await sql`INSERT INTO pdf_summaries (
      user_id,
      original_file_url,
      summary_text,
      title,
      file_name
    ) VALUES (
      ${userId},
      ${fileUrl},
      ${summary},
      ${title},
      ${fileName}
    ) RETURNING id, summary_text`;
    return savedSummary;
  } catch (error) {
    console.error("Error saving PDF summary", error);
    return false;
  }
}

export async function storePdfSummaryAction({
  fileUrl,
  summary,
  title,
  fileName,
}: Omit<PdfSummaryType, "userId">) {
  let savedSummary: any;
  try {
    const { userId } = await auth();

    if (!userId) {
      return {
        success: false,
        message: "User not authenticated",
      };
    }

    savedSummary = await savePdfSummary({
      userId,
      fileUrl,
      summary,
      title,
      fileName,
    });

    if (!savedSummary) {
      return {
        success: false,
        message: "Failed to save PDF summary, please try again.",
      };
    }
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Unexpected error occurred",
    };
  }

  // revalidatePath(`/summaries/${savedSummary.id}`)
  revalidatePath(`/summaries/${savedSummary.id}`);
  return {
    success: true,
    message: "PDF summary saved successfully",
    data: {
      id: savedSummary.id,
    },
  };
}
