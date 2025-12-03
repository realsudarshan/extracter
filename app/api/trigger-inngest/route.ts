import { inngest } from "@/inngest/client";
import events from "@/inngest/constants";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  console.log("Triggering inngest workflow");

  const { url, receiptId } = await req.json();
  console.log("The data before sending event are", url, receiptId);

  try {
    await inngest.send({
      name: events.EXTRACT_DATA_FROM_PDF_AND_SAVE_TO_DATABASE,
      data: { url, receiptId },
    });
    console.log("Sent successfully", {
      name: events.EXTRACT_DATA_FROM_PDF_AND_SAVE_TO_DATABASE,
      data: { url, receiptId },
    });
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Inngest send failed:", error);
    return NextResponse.json(
      { error: "Inngest send failed" },
      { status: 500 }
    );
  }
}
