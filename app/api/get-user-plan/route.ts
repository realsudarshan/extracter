import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { client } from "@/lib/schematic";

export async function GET() {
    try {
        const   user = await currentUser();
        console.log("The user", user);
        
        if (!user) {
            return NextResponse.json({ plan: "Free" }, { status: 200 });
        }

        let planName = "Free";
        try {
            // First, lookup the user to get their company memberships
            const userResponse = await client.companies.lookupUser({
                keys: { id: user.id }
            });
            
            console.log("User response:", JSON.stringify(userResponse.data, null, 2));
            
            // Get the first company membership
            const firstMembership = userResponse.data?.companyMemberships?.[0];
            
            if (firstMembership?.companyId) {
                // Fetch the full company details including the plan
                const companyResponse = await client.companies.getCompany(
                     firstMembership.companyId
                );
                
                console.log("Company response:", JSON.stringify(companyResponse.data, null, 2));
                
                // Extract the plan name
                planName = companyResponse.data?.plan?.name || "No plan";
            }
            
            console.log("Extracted plan name:", planName);
        } catch (e) {
            console.error("Failed to lookup user's company:", e);
        }

        return NextResponse.json({ plan: planName }, { status: 200 });
    } catch (error) {
        console.error("Error fetching user plan:", error);
        return NextResponse.json({ plan: "Free" }, { status: 200 });
    }
}