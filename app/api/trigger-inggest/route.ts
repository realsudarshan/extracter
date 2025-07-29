// pages/api/trigger-inngest.ts
import { inngest } from "@/inngest/client"
import events from "@/inngest/constants"
import { NextRequest, NextResponse } from "next/server"

export default async function handler(req:any, res:any) {
  if (req.method !== "POST") return res.status(405).end()

  const { url, receiptId } = req.body

  try {
    await inngest.send({
      name: events.EXTRACT_DATA_FROM_PDF_AND_SAVE_TO_DATABASE,
      data: { url, receiptId },
    })
console.log("Sent sucessfully",{
      name: events.EXTRACT_DATA_FROM_PDF_AND_SAVE_TO_DATABASE,
      data: { url, receiptId },
    })
    res.status(200).json({ success: true })
  } catch (error) {
    console.error("Inngest send failed:", error)
    res.status(500).json({ error: "Inngest send failed" })
  }
}
