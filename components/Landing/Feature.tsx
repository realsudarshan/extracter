import { BarChart3, Brain, FileText, Scan, Smartphone, Zap } from "lucide-react"

export default function Feature() {
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
    <section id="features" className="py-24 bg-gray-50 dark:bg-gray-900/50">
      <div className="container px-4 mx-auto">
        <div className="max-w-2xl mx-auto text-center mb-16">
          <span className="inline-block py-1 px-3 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-sm font-semibold mb-4">
            Features
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Everything you need to manage receipts
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Stop manual data entry. Let our AI handle the boring work while you focus on what matters.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group p-8 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 hover:border-purple-500/50 dark:hover:border-purple-500/50 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <feature.icon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
