import { createTool, createAgent, gemini } from "@inngest/agent-kit";
import { z } from "zod";


const parsePdfTool = createTool({
  name: "parse-pdf",
  description: "Analyze the given PDF or image",
  parameters: z.object({
    pdfUrl: z.string(),
  }) ,
  handler: async ({ pdfUrl }, { step }) => {
    console.log("working reciept is scanning")
    console.log(pdfUrl)
    try {
      // Download and convert Convex file to base64
      const response = await fetch(pdfUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch file: ${response.statusText}`);
      }
      
      // Check file size (Gemini has limits - typically 20MB for inline data)
      const contentLength = response.headers.get('content-length');
      if (contentLength && parseInt(contentLength) > 20 * 1024 * 1024) {
        throw new Error('File too large for inline processing (max 20MB)');
      }
      
      const arrayBuffer = await response.arrayBuffer();
      const base64Data = Buffer.from(arrayBuffer).toString('base64');
      
      // Determine MIME type from response headers or URL extension
      let contentType = response.headers.get('content-type');
      if (!contentType) {
        // Fallback: guess from URL extension
        const url = new URL(pdfUrl);
        const extension = url.pathname.split('.').pop()?.toLowerCase();
        switch (extension) {
          case 'pdf': contentType = 'application/pdf'; break;
          case 'jpg': case 'jpeg': contentType = 'image/jpeg'; break;
          case 'png': contentType = 'image/png'; break;
          case 'webp': contentType = 'image/webp'; break;
          default: contentType = 'application/pdf'; // Default assumption
        }
      }
      
      return await step?.ai.infer("parse-pdf", {
        model: step.ai.models.gemini({ model: "gemini-2.0-flash-lite" }),
        body: {
          contents: [{
            parts: [
              {
                inlineData: {
                  mimeType: contentType,
                  data: base64Data
                }
              },
              {
                text: `Extract the data from the receipt and return the structured output as follows:

{
  "merchant": {
    "name": "Store Name",
    "address": "123 Main St, City, Country",
    "contact": "+123456789"
  },
  "transaction": {
    "date": "YYYY-MM-DD",
    "receipt_number": "ABC123456",
    "payment_method": "Credit Card"
  },
  "items": [
    {
      "name": "Item 1",
      "quantity": 2,
      "unit_price": 10.00,
      "total_price": 20.00
    }
  ],
  "totals": {
    "subtotal": 20.00,
    "tax": 2.00,
    "total": 22.00,
    "currency": "USD"
  }
}`
              }
            ]
          }],
          generationConfig: {
            maxOutputTokens: 1000,
          }
        },
      });
    } catch (error) {
      throw error instanceof Error ? error : new Error("parsePdf error");
    }
  },
});

export const receiptScanningAgent = createAgent({
  name: "Receipt Scanning Agent",
  description: `
  Processes receipt images and PDFs to extract key information such as vendor names, dates, amounts, and line items.
  You are an AI-powered receipt scanning assistant. Your primary role is to accurately extract and structure relevant
  information from scanned receipts. Your task includes recognizing and parsing details such as:
  - Merchant Information: Store name, address, contact details
  - Transaction Details: Date, time, receipt number, payment method
  - Itemized Purchases: Product names, quantities, individual prices, discounts
  - Total Amounts: Subtotal, taxes, total paid, and any applied discounts
  - Ensure high accuracy by detecting OCR errors and correcting misread text when possible.
  - Normalize dates, currency values, and formatting for consistency.
  - If any key details are missing or unclear, return a structured response indicating incomplete data.
  - Handle multiple formats, languages, and varying receipt layouts efficiently.
  - Maintain a structured JSON output for easy integration with databases or expense tracking systems.
  `,
  system: "You are a helpful assistant that processes receipt images and PDFs and extracts key details.",
  model: gemini({
    model: "gemini-2.0-flash-lite",
    defaultParameters: {
      generationConfig: {
        maxOutputTokens: 1000,
      }
    }
  }),
  tools: [parsePdfTool],
});