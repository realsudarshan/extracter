// app/api/trigger-inngest/route.ts

import { inngest } from "@/inngest/client";
import events from "@/inngest/constants";
import { NextRequest, NextResponse } from "next/server"; // Import these for App Router

export async function POST(req: NextRequest) { // Define a POST function
  console.log("Triggering inngest workflow");

  // App Router automatically parses JSON for POST requests with "Content-Type: application/json"
  const { url, receiptId } = await req.json(); // Get body using req.json()
  console.log("The data before sending event are",url,receiptId)
  try {
    await inngest.send({
      name: events.EXTRACT_DATA_FROM_PDF_AND_SAVE_TO_DATABASE,
      data: { url, receiptId },
    });
    console.log("Sent successfully", {
      name: events.EXTRACT_DATA_FROM_PDF_AND_SAVE_TO_DATABASE,
      data: { url, receiptId },
    });
    // Use NextResponse for App Router responses
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Inngest send failed:", error);
    // Use NextResponse for App Router responses
    return NextResponse.json(
      { error: "Inngest send failed" },
      { status: 500 }
    );
  }
}

// You can optionally add other HTTP methods if needed, e.g.:
// export async function GET(req: NextRequest) {
//   return NextResponse.json({ message: "GET request received" });
// }