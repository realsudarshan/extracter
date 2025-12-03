"use client";
import { useState } from "react";
import Pricing from "./Pricing";


export default function PricingSection() {

  const [isAnnual, setIsAnnual] = useState(true);

  return (
    <div id="pricing">
      <Pricing isAnnual={isAnnual} onToggle={() => setIsAnnual(!isAnnual)} />
    </div>
  );
}
