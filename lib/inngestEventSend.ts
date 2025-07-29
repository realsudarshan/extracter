// utils/sendInngestEvent.ts
export const sendInngestEvent = async ({ url, receiptId }:any) => {
  return fetch("/api/trigger-inngest", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url, receiptId }),
  })
}
