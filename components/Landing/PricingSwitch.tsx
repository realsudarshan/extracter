"use client";
import { useState } from "react";
import Pricing from "./Pricing";
import { useUser } from "@clerk/clerk-react";


export default function PricingSection() {

  const [isAnnual, setIsAnnual] = useState(true);

  return (
    <Pricing isAnnual={isAnnual} onToggle={() => setIsAnnual(!isAnnual)} />
  );
}
