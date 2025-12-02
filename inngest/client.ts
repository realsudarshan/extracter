import { Inngest } from "inngest"
export const inngest = new Inngest({
    id: "reciept-tracker",
    eventKey: process.env.INNGEST_EVENT_KEY!
})