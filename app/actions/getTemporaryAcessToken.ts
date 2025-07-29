'use server'
import { ClerkProvider } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import { SchematicClient } from "@schematichq/schematic-typescript-node";
const apiKey=process.env.SCHEMATIC_SECRET_KEY;
const client = new SchematicClient({ apiKey });

export async function getTemporaryAccessToken() {
    const user=await currentUser()
    
    if(!user){
        console.log("No user found");
        return null
    }
    
 try {
  console.log(user.id)
   const resp = await client.accesstokens.issueTemporaryAccessToken({
     resourceType: "company",
     lookup: { id:user.id }, // The lookup will vary depending on how you have configured your company keys
   });
   console.log("the token is",resp)
   return resp.data?.token;
 } catch (error) {
  console.log("The error is",error)
  return "abcde"
  
 }
}