import { ConvexHttpClient } from "convex/browser";
//use for server side action
const convex=new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_UR!)
export default convex