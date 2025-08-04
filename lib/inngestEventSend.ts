// // utils/sendInngestEvent.t
// export const sendInngestEvent = async ({ url, receiptId }:any) => {
//  try {
//   const response = await fetch("/api/test", {
//   method: "POST",
//   headers: { "Content-Type": "application/json" },
//   body: JSON.stringify({ name: "Code", role: "developer" }),
// });
// const testdata = await response.json();
// console.log("Testing sucessfull",testdata);
// const donerequest=testdata

//   const res = await fetch("/api/trigger-inngest", {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ url, receiptId }),
//   });

//   if (!res.ok) throw new Error("Failed to trigger Inngest");
//   const data = await res.json();
//   console.log("Success:", data);
//   return data;
// } catch (err) {
//   console.error("Trigger failed:", err);
// }

// }
