import { useId } from "react";

import { Label } from "@/components/ui/label";
import { LucideIcon } from "lucide-react";
interface FeatureCardprops {
  icon: LucideIcon;
  title: string;
  description: string;
}
export default function FeatureCard({ icon: Icon, title, description }: FeatureCardprops) {
  const id = useId()
  return (
    <div className="border-input has-data-[state=checked]:border-primary/50 relative flex w-full items-start gap-5 rounded-md border p-4 shadow-xs outline-none ">

      <div className="flex grow items-start gap-3">
        <Icon />
        <div className="grid gap-2">
          <Label htmlFor={id}>
            {title}{" "}

          </Label>
          <p id={`${id}-description`} className="text-muted-foreground text-xs">
            {description}
          </p>
        </div>
      </div>
    </div>
  )
}
