import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// export const sendImage = mutation({
//   args: { storageId: v.id("_storage"), author: v.string() },
//   handler: async (ctx, args) => {
//     await ctx.db.insert("recipts", {
//       body: args.storageId,
//       author: args.author,
//       format: "image",
//     });
//   },
// });

export const generateUploadUrl = mutation({
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});
//storeReciepts store reciepts file and add it to database
//while saving,also initilize extracted data field as null
export const storeReciepts=mutation({
  args:{
    userId:v.string(),
    fileId:v.id("_storage"),
    fileName:v.string(),
    size:v.number(),
    mimeType:v.string(),
  },
  handler:async (ctx,args)=>{
const recieptId=await ctx.db.insert("recipts",{
  userId:args.userId,
  fileName:args.fileName,
  fileId:args.fileId,
  uploadedAt:Date.now(),
  size:args.size,
  mimeType:args.mimeType,
  status:"pending",
  //Initalize extracted data as well
  merchantName:undefined,
  merchantAddress:undefined,
  merchantContact:undefined,
  transactionDate:undefined,
  transactionAmount:undefined,
  currency:undefined,
  items:[]
})
return recieptId
  }
})


//get all reciepts
export const getRecipts=query({
  args:{
    userId:v.string(),
  },
  handler:async(ctx,args)=>{
    //only return reciepts for the authenticated user
    return await ctx.db
    .query("recipts")
    .filter((q)=>q.eq(q.field("userId"),args.userId))
    .order("desc")
    .collect()
  }
})


//get a single recipts by id
export const getReceiptById=query({
  args:{
    id:v.id("recipts"),
  },
  handler:async(ctx,args)=>{
    const receipt=await ctx.db.get(args.id);

    //verify user has acess to this receipt
    if(receipt){
      const identity=await ctx.auth.getUserIdentity();
      if(!identity){
        throw new Error("Not authenticated");
      }
      const userId=identity.subject;
    if(receipt.userId!==userId){
      throw new Error("Not autherized to acess this reciepts")
    }
    }
    return receipt;
  }
})
//generate a url to download a reciepts file
export const getReceiptDownloadUrl=query({
  args:{
    fileId:v.id("_storage"),
  },
  handler:async(ctx,args)=>{
    //Get a temporary Url that can be used to download the reciept
    return await ctx.storage.getUrl(args.fileId) 
  }
})

//update the status of reciepts
export const updateReceiptsStatus=mutation({
  args:{
    id:v.id("recipts"),
    status:v.string(),
  },
  handler:async (ctx,args)=>{
    const receipt=await ctx.db.get(args.id);
    if(!receipt){
      throw new Error("Not authenticated")
    }
    const identity=await ctx.auth.getUserIdentity();
    if(!identity){
      throw new Error("Not authenticated");
    }
    const userId=identity.subject;
    if(receipt.userId!==userId){
      throw new Error("Not authorized to update this reciepts")
    }
    await ctx.db.patch(args.id,{
      status:args.status,
    })
return true;
  }
})

//delete reciepts and its file
export const deleteReciept=mutation({
  args:{
    id:v.id("recipts"),
  },
  handler:async(ctx,args)=>{
    const receipt=await ctx.db.get(args.id);
if(!receipt){
  throw new Error("Reciepts not found")
}
const identity=await ctx.auth.getUserIdentity();
if(!identity){
  throw new Error("Not authenticated");
}
const userId=identity.subject;
if(receipt.userId!==userId){
  throw new Error("Not authenticated to delete this receipts")
}
//Delete file from storage
await ctx.storage.delete(receipt.fileId);
//deelete the receipts record
await ctx.db.delete(args.id);
return true;
  }
})



//update Reciepts with extracted data
export const updateReceiptWithExtractData=mutation({
  args:{
    id:v.id("recipts"),
    fileDisplayName:v.string(),
    merchantName:v.string(),
    merchantAddress:v.string(),
    merchantContact:v.string(),
    transactionDate:v.string(),
    transactionAmount:v.string(),
    currency:v.string(),
    recieptSummary:v.string(),
    items:v.array(
      v.object({
        name:v.string(),
        quantity:v.number(),
        unitPrice:v.number(),
        totalPrice:v.number()
      })
    )
  },
  handler:async(ctx,args)=>{
    //verify the reciept exists
    const receipt=await ctx.db.get(args.id);
    if(!receipt){
      throw new Error("reciepts not found")
    }
    //update the receipt with extracted data
await ctx.db.patch(args.id,{
  fileDisplayName:args.fileDisplayName,
  merchantName:args.merchantName,
  merchantAddress:args.merchantAddress,
  merchantContact:args.merchantContact,
  transactionDate:args.transactionDate,
  transactionAmount:args.transactionAmount,
  currency:args.currency,
  reciptSummary:args.recieptSummary,
  items:args.items,
  status:"proceed"
})
return {
  userId:receipt.userId,
}
  }
})


