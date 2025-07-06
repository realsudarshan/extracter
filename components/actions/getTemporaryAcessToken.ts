'use server'
import { ClerkProvider } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import { SchematicClient } from "@schematichq/schematic-typescript-node";
const apiKey=process.env.SCHEMATIC_API_KEY;
const client = new SchematicClient({ apiKey });

export async function getTemporaryAccessToken(companyId: string) {
    const user=await currentUser()
    if(!user){
        console.log("No user found");
        return null
    }
  const resp = await client.accesstokens.issueTemporaryAccessToken({
    resourceType: "company",
    lookup: { user:user.id }, // The lookup will vary depending on how you have configured your company keys
  });
  return resp.data?.token;
}