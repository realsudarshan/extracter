import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useUser } from "@clerk/clerk-react";
import { Bot, Scan } from "lucide-react";
import { toast } from "sonner";




export default function Pricing({ isAnnual, onToggle }: {
  isAnnual: boolean;
  onToggle: () => void
}) {
  const { isSignedIn, isLoaded } = useUser();
  const handleClick = (plan: 'free' | 'basic' | 'pro') => {
    if (!isLoaded) return
    if (isSignedIn) {
      switch (plan) {
        case "free":

          window.location.href = "/manage-plan";
          break;

        case "basic":
          window.location.href = "/manage-plan";
          break;
        case "pro":
          window.location.href = "/manage-plan";
          break;
        default:
          break;

      }
    }
    else {
      toast.error("Sign up to continue")
    }
  }
  const getButtonText = (plan: 'free' | 'basic' | 'pro'): string | null => {
    if (plan === "free") return "Get Free";
    if (plan == "basic") return "Purchase"
    if (plan == "pro") return "Purchase"
    return null
  }
  return (
    <>
      {/* Pricing */}
      <div className="container mx-auto px-4 md:px-6 2xl:max-w-[1400px] py-24 lg:py-32">
        {/* Title */}
        <div className="max-w-2xl mx-auto text-center mb-10 lg:mb-14">
          <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
            Pricing
          </h2>
          <p className="mt-1 text-muted-foreground">
            Whatever your status, our offers evolve according to your needs.
          </p>
        </div>
        {/* End Title */}
        {/* Switch */}
        <div className="flex justify-center items-center">
          <Label htmlFor="payment-schedule" className="me-3">
            Monthly
          </Label>
          <Switch id="payment-schedule" checked={isAnnual} onCheckedChange={onToggle} />
          <Label htmlFor="payment-schedule" className="relative ms-3">
            Annual
            <span className="absolute -top-10 start-auto -end-28">
              <span className="flex items-center">
                <svg
                  className="w-14 h-8 -me-6"
                  width={45}
                  height={25}
                  viewBox="0 0 45 25"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M43.2951 3.47877C43.8357 3.59191 44.3656 3.24541 44.4788 2.70484C44.5919 2.16427 44.2454 1.63433 43.7049 1.52119L43.2951 3.47877ZM4.63031 24.4936C4.90293 24.9739 5.51329 25.1423 5.99361 24.8697L13.8208 20.4272C14.3011 20.1546 14.4695 19.5443 14.1969 19.0639C13.9242 18.5836 13.3139 18.4152 12.8336 18.6879L5.87608 22.6367L1.92723 15.6792C1.65462 15.1989 1.04426 15.0305 0.563943 15.3031C0.0836291 15.5757 -0.0847477 16.1861 0.187863 16.6664L4.63031 24.4936ZM43.7049 1.52119C32.7389 -0.77401 23.9595 0.99522 17.3905 5.28788C10.8356 9.57127 6.58742 16.2977 4.53601 23.7341L6.46399 24.2659C8.41258 17.2023 12.4144 10.9287 18.4845 6.96211C24.5405 3.00476 32.7611 1.27399 43.2951 3.47877L43.7049 1.52119Z"
                    fill="currentColor"
                    className="text-muted-foreground"
                  />
                </svg>
                <Badge className="mt-3 uppercase">Save up to 10%</Badge>
              </span>
            </span>
          </Label>
        </div>
        {/* End Switch */}
        {/* Grid */}
        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:items-center">
          {/* Free Card */}
          <Card className="flex flex-col h-full">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="h-4 w-4 rounded-full bg-gray-300" />
                <CardTitle className="text-xl">Free</CardTitle>
              </div>
              <div className="space-y-2 text-sm text-muted-foreground">

                <div className={`flex justify-between items-center ${isAnnual ? 'opacity-50' : 'font-bold'}`}>
                  <span>Monthly Price:</span>
                  <div className="flex items-center gap-1">
                    <span className="bg-blue-100 text-blue-600 rounded-full p-0.5 text-[10px] font-bold px-1.5">S</span>
                    <span className="text-foreground font-medium">$0.00/mo</span>
                  </div>
                </div>
                <div className={`flex justify-between items-center ${isAnnual ? 'font-bold' : 'opacity-50'}`}>
                  <span>Yearly Price:</span>
                  <div className="flex items-center gap-1">
                    <span className="bg-blue-100 text-blue-600 rounded-full p-0.5 text-[10px] font-bold px-1.5">S</span>
                    <span className="text-foreground font-medium">$0.00/yr</span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <div className="border-t my-4" />
            <CardContent className="flex-1">
              <ul className="space-y-2.5 text-sm">
                <li className="flex space-x-2">
                  <Scan className="flex-shrink-0 mt-0.5 h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">2 Scans per month</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full" variant={"outline"} onClick={() => handleClick('free')}>
                {getButtonText("free") || "Get free"}
              </Button>
            </CardFooter>
          </Card>
          {/* End Free Card */}

          {/* Basic Card */}
          <Card className="flex flex-col h-full border-primary relative overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="h-4 w-4 rounded-full bg-pink-500" />
                <CardTitle className="text-xl">Basic</CardTitle>
              </div>
              <div className="space-y-2 text-sm text-muted-foreground">

                <div className={`flex justify-between items-center ${isAnnual ? 'opacity-50' : 'font-bold'}`}>
                  <span>Monthly Price:</span>
                  <div className="flex items-center gap-1">
                    <span className="bg-blue-100 text-blue-600 rounded-full p-0.5 text-[10px] font-bold px-1.5">S</span>
                    <span className="text-foreground font-medium">$4.00/mo</span>
                  </div>
                </div>
                <div className={`flex justify-between items-center ${isAnnual ? 'font-bold' : 'opacity-50'}`}>
                  <span>Yearly Price:</span>
                  <div className="flex items-center gap-1">
                    <span className="bg-blue-100 text-blue-600 rounded-full p-0.5 text-[10px] font-bold px-1.5">S</span>
                    <span className="text-foreground font-medium">$40.00/yr</span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <div className="border-t my-4" />
            <CardContent className="flex-1">
              <ul className="space-y-2.5 text-sm">
                <li className="flex space-x-2">
                  <Scan className="flex-shrink-0 mt-0.5 h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">50 Scans per month</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={() => handleClick('basic')}>
                {getButtonText("basic") || "Purchase"}
              </Button>
            </CardFooter>
          </Card>
          {/* End Basic Card */}

          {/* Pro Card */}
          <Card className="flex flex-col h-full">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="h-4 w-4 rounded-full bg-yellow-400" />
                <CardTitle className="text-xl">Pro</CardTitle>
              </div>
              <div className="space-y-2 text-sm text-muted-foreground">

                <div className={`flex justify-between items-center ${isAnnual ? 'opacity-50' : 'font-bold'}`}>
                  <span>Monthly Price:</span>
                  <div className="flex items-center gap-1">
                    <span className="bg-blue-100 text-blue-600 rounded-full p-0.5 text-[10px] font-bold px-1.5">S</span>
                    <span className="text-foreground font-medium">$7.00/mo</span>
                  </div>
                </div>
                <div className={`flex justify-between items-center ${isAnnual ? 'font-bold' : 'opacity-50'}`}>
                  <span>Yearly Price:</span>
                  <div className="flex items-center gap-1">
                    <span className="bg-blue-100 text-blue-600 rounded-full p-0.5 text-[10px] font-bold px-1.5">S</span>
                    <span className="text-foreground font-medium">$70.00/yr</span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <div className="border-t my-4" />
            <CardContent className="flex-1">
              <ul className="space-y-2.5 text-sm">
                <li className="flex space-x-2">
                  <Scan className="flex-shrink-0 mt-0.5 h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">300 Scans per month</span>
                </li>
                <li className="flex space-x-2">
                  <Bot className="flex-shrink-0 mt-0.5 h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">AI summaries</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full" variant={"outline"} onClick={() => handleClick("pro")}>
                {getButtonText("pro") || "Purchase"}
              </Button>
            </CardFooter>
          </Card>
          {/* End Pro Card */}
        </div>
        {/* End Grid */}



      </div>
      {/* End Pricing */}
    </>
  );
}
