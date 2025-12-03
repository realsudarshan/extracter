import { createNetwork, getDefaultRoutingAgent, gemini } from "@inngest/agent-kit"
import { createServer } from "http"
import { inngest } from "./client"
import events from "./constants"
import { databaseAgent } from "./agents/databaseAgent"
import { receiptScanningAgent } from "./agents/receiptScanningAgent"
import { client } from "@/lib/schematic"

const agentNetwork = createNetwork({
    name: "Agent Team",
    agents: [
        databaseAgent, receiptScanningAgent
    ],
    defaultModel: gemini({
        model: "gemini-2.0-flash-lite",
        defaultParameters: {
            generationConfig: {
                maxOutputTokens: 1000,
            }
        }
    }),
    defaultRouter: ({ network }) => {
        const savedToDatabase = network.state.kv.get("saved-to-database")
        if (savedToDatabase !== undefined) {
            //terminate the agent process if data has been saved to database
            return undefined
        }
        return getDefaultRoutingAgent()
    }

})

export const server = createServer({
    agents: [databaseAgent, receiptScanningAgent],
    network: [agentNetwork]
});

export const extractAndSavePDF = inngest.createFunction(
    { id: "Extract PDF and Save in Database" },
    { event: events.EXTRACT_DATA_FROM_PDF_AND_SAVE_TO_DATABASE },
    async ({ event }: any) => {
        console.log("📩 Received Inngest event:", event);
        const { userId } = event.data;

        const result = await agentNetwork.run(
            `Extract the key data from this pdf:${event.data.url}.
        Once the data is extracted,save it to the database using the receiptId:${event.data.receiptId}.
        Once,the recipt is sucessfully saved to database you can terminate the agent process.Start with supervisor agent`
        )

        // Track the scan event in Schematic if userId is provided
        if (userId) {
            try {
                await client.track({
                    event: "scans",
                    company: { keys: { id: userId } },
                    user: { keys: { id: userId } },
                });
                console.log("✅ Tracked scan event in Schematic for user:", userId);

                // Check AI Summary Entitlement (Pro tier only)
                const summaryAccess = await client.features.checkFlag("ai-summaries", {
                    company: { keys: { id: userId } },
                    user: { keys: { id: userId } },
                });

                if (summaryAccess.data?.value) {
                    // Track AI summary usage
                    await client.track({
                        event: "ai-summaries",
                        company: { keys: { id: userId } },
                        user: { keys: { id: userId } },
                    });
                    console.log("✅ Tracked AI summary event in Schematic for user:", userId);
                }
            } catch (error) {
                console.error("Failed to track events in Schematic:", error);
            }
        }

        return result.state.kv.get("recipt")

    },
)
