import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { client } from "@/lib/schematic";
import { AnyZodType, createAgent, createTool, gemini } from "@inngest/agent-kit";
import { useMutation } from "convex/react";
import {z} from "zod"
const saveToDatabaseTool=createTool({
    name:"save-to-database",
    description:"Saves the given data to convex database",
  parameters: z.object({
    
  receiptId: z.string().describe("The ID of the receipt to update"),
   fileDisplayName: z
    .string()
    .describe(
      "The readable display name of the receipt to show in the UI. If the file name is not human readable, use this to give a more readable name.",
    ),
  merchantName: z.string(),
  merchantAddress: z.string(),
  merchantContact: z.string(),
  transactionDate: z.string(),
  transactionAmount: z
    .string()
    .describe(
      "The total amount of the transaction, summing all the items on the receipt.",
    ),
  recieptSummary: z
    .string()
    .describe(
      `A summary of the receipt, including the merchant name, address, contact, transaction date, 
      transaction amount, and currency. Include a human readable summary of the receipt.
       Mention both invoice number and receipt number if both are present. 
       Include some key details about the items on the receipt, this is a special featured summary so it should include some key details about the items on the receipt with some context.`,
    ),
    currency: z.string(),
items: z.array(
  z.object({
    name: z.string(),
    quantity: z.number(),
    unitPrice: z.number(),
    totalPrice: z.number(),
  }).describe(
    "An array of items on the receipt. Include the name, quantity, unit price, and total price of each item.",
  )
)}) ,
handler: async (params, context) => {
  const {
    receiptId,
    fileDisplayName,
    merchantName,
    merchantAddress,
    merchantContact,
    transactionDate,
    transactionAmount,
    recieptSummary,
    currency,
    items,
  } = params;
  const result=await context.step?.run(
    "save-reciept-to-database",
    async()=>{
try {
    // Call the Convex mutation to update the receipt with extracted data
const updateReceiptWithExtractData=  useMutation(
  api.recipts.updateReceiptWithExtractData)
  const {userId}=await updateReceiptWithExtractData({
    id: receiptId as Id<"recipts">,
    fileDisplayName,
    merchantName,
    merchantAddress,
    merchantContact,
    transactionDate,
    transactionAmount,
    recieptSummary,
    currency,
    items,
  }
);
//track event in schematic
await client.track({
    event:"scan",
    company:{
        id:userId
    },
    user:{
        id:userId
    }
})
return {
  addedToDb: "Success",
  receiptId,
  fileDisplayName,
  merchantName,
  merchantAddress,
  merchantContact,
  transactionDate,
  transactionAmount,
  currency,
  recieptSummary,
  items,
};

} catch (error) {
    return{
        addedToDb:"failed",
        error:error instanceof Error?error.message:"Unknown error"
    }
}
    }
  );
  if(result?.addedToDb==="Success"){
    //only set kv values if the oeprations was sucessfull
    context.network?.state.kv.set("saved-to-database",true);
    context.network?.state.kv.set("receipt",receiptId)
  }
  return result
}
})
        



export const databaseAgent=createAgent({
    name:"Database agent",
    description:"responsible for taking key information regarding receipts and saving it to the convex database",
    system:"You are helpful assistant that takes key information regarding reciepts and saves it to the convex database",
    model:gemini({
            model:"gemini-2.0-flash-lite",
            defaultParameters:{
                generationConfig:{
                    maxOutputTokens:1000,
                }
            }
        }),
        tools:[saveToDatabaseTool]
})