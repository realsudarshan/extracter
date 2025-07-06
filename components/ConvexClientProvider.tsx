"use client";

import { ReactNode } from "react";
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { useAuth } from "@clerk/nextjs";

import { SchematicProvider } from "@schematichq/schematic-react";
const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export default function ConvexClientProvider({
  children,
}: {
  children: ReactNode;
}) {
 
  return (
    <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
       <SchematicProvider publishableKey={process.env.NEXT_PUBLIC_PUBLISHABLE_KEY!}>

       
     
     <main>
      {children}
     </main>
     </SchematicProvider>
    </ConvexProviderWithClerk>
  );
}
