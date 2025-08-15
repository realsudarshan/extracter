import {createNetwork,getDefaultRoutingAgent,gemini} from "@inngest/agent-kit"
import { createServer } from "http"
import { inngest } from "./client"
import events from "./constants"
import { databaseAgent } from "./agents/databaseAgent"
import { receiptScanningAgent } from "./agents/receiptScanningAgent"
const agentNetwork=createNetwork({
    name:"Agent Team",
    agents:[
        databaseAgent,receiptScanningAgent
    ],
    defaultModel:gemini({
        model:"gemini-2.0-flash-lite",
        defaultParameters:{
            generationConfig:{
                maxOutputTokens:1000,
            }
        }
    }),
    defaultRouter:({network})=>{
        const savedToDatabase=network.state.kv.get("saved-to-database")
        if(savedToDatabase!==undefined){
            //terminate the agent process if data has been saved to database
            return undefined
        }
        return getDefaultRoutingAgent()
    }

})

export const server=createServer({
    agents:[databaseAgent,receiptScanningAgent],
    network:[agentNetwork]
});
export const extractAndSavePDF=inngest.createFunction(
    {id:"Extract PDF and Save in Database"},
{event:events.EXTRACT_DATA_FROM_PDF_AND_SAVE_TO_DATABASE},
async({event}:any)=>{
    console.log("📩 Received Inngest event:", event);
    const result=await agentNetwork.run(
        `Extract the key data from this pdf:${event.data.url}.
        Once the data is extracted,save it to the database using the receiptId:${event.data.receiptId}.
        Once,the recipt is sucessfully saved to database you can terminate the agent process.Start with supervisor agent`
    )
    return result.state.kv.get("recipt") 

},
)