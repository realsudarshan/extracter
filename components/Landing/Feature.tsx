import { Scan, Zap, Brain, FileText, Shield, Smartphone, BarChart3, Clock } from "lucide-react"
import FeatureCard from "../comp-145"


export default function Feaure() {
  const features = [
    {
      icon: Brain,
      title: "AI-Powered Recognition",
      description:
        "Advanced machine learning algorithms automatically identify and extract key information from any receipt format.",
    },
    {
      icon: Zap,
      title: "Lightning Fast Processing",
      description: "Scan and process receipts in seconds, not minutes. Get instant results with 99.9% accuracy.",
    },
    {
      icon: FileText,
      title: "Smart Data Extraction",
      description: "Automatically captures merchant names, dates, amounts, tax details, and line items with precision.",
    },
    {
      icon: Smartphone,
      title: "Mobile & Desktop Ready",
      description: "Scan receipts anywhere with our mobile app or upload bulk receipts from your desktop.",
    },
 
    {
      icon: BarChart3,
      title: "Expense Analytics",
      description: "Transform receipt data into actionable insights with automated categorization and reporting.",
    },
    {
      icon: Scan,
      title: "Multi-Format Support",
      description: "Works with photos, PDFs, and scanned images. Supports receipts from any country or language.",
    },
    
  ]

  return (
    <>

      <div id="features" className="p-10 flex-col justify-center items-center gap-10">
        <h1 className="text-center">Features</h1>
        {features.map((feature, index) => (

          <FeatureCard key={index} icon={feature.icon} title={feature.title} description={feature.description} />

        ))}
      </div>


    </>
  )
}
