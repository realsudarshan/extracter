"use client"

import { useSchematicEntitlement } from "@schematichq/schematic-react"
import { Sparkles, Lock } from "lucide-react"
import Link from "next/link"

interface AISummaryProps {
    summary?: string;
}

export default function AISummary({ summary }: AISummaryProps) {
    const { value: hasAccess } = useSchematicEntitlement("ai-summaries") as any;

    if (!summary) {
        return null; // No summary generated yet
    }

    return (
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 border border-purple-200 dark:border-purple-800 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                    AI Summary
                </h3>
                {!hasAccess && (
                    <span className="ml-auto bg-purple-600 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                        <Lock className="w-3 h-3" />
                        Pro Only
                    </span>
                )}
            </div>

            {hasAccess ? (
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {summary}
                </p>
            ) : (
                <div className="relative">
                    {/* Blurred summary */}
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed blur-sm select-none">
                        {summary}
                    </p>

                    {/* Upgrade overlay */}
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-white/90 to-transparent dark:from-gray-900/90">
                        <Link
                            href="/#pricing"
                            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium shadow-lg transition-all hover:scale-105 flex items-center gap-2"
                        >
                            <Lock className="w-4 h-4" />
                            Upgrade to Pro for AI Summaries
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}
