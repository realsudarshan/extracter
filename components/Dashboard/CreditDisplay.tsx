"use client"

import { useSchematicEntitlement } from "@schematichq/schematic-react";
import { Scan } from "lucide-react";
import Link from "next/link";

export default function CreditDisplay() {
    const {
        featureUsageExceeded,
        featureAllocation,
        featureUsage,
    } = useSchematicEntitlement("scans");

    if (featureAllocation === undefined) {
        return null; // Loading state
    }

    // Calculate remaining scans
    const usedScans = featureUsage || 0;
    const remainingScans = Math.max(0, featureAllocation - usedScans);

    return (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-3">
                <div className="bg-blue-500 dark:bg-blue-600 p-2 rounded-lg">
                    <Scan className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                        Scan Credits
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        {featureUsageExceeded ? (
                            <span className="text-red-600 dark:text-red-400 font-medium">
                                Limit reached - Upgrade to continue
                            </span>
                        ) : (
                            <span>
                                <span className="font-bold text-blue-600 dark:text-blue-400">
                                    {remainingScans}
                                </span>{" "}
                                scans remaining this month
                                <span className="text-xs ml-2 text-gray-500">
                                    ({usedScans}/{featureAllocation} used)
                                </span>
                            </span>
                        )}
                    </p>
                </div>
                {featureUsageExceeded && (
                    <Link
                        href="/#pricing"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                        Upgrade Plan
                    </Link>
                )}
            </div>
        </div>
    );
}
