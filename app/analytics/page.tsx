"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import SpendingChart from "@/components/Analytics/SpendingChart";
import MerchantPieChart from "@/components/Analytics/MerchantPieChart";
import { Loader2 } from "lucide-react";

export default function AnalyticsPage() {
    const { user } = useUser();
    const stats = useQuery(api.analytics.getStats, {
        userId: user?.id ?? "",
    });

    if (!user) {
        return <div className="p-10 text-center">Please log in to view analytics.</div>;
    }

    if (!stats) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6 space-y-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Analytics Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Summary Cards */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Total Spent
                    </h3>
                    <p className="mt-2 text-4xl font-bold text-gray-900 dark:text-white">
                        ${stats.totalSpent.toFixed(2)}
                    </p>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Total Receipts
                    </h3>
                    <p className="mt-2 text-4xl font-bold text-gray-900 dark:text-white">
                        {stats.totalReceipts}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Monthly Spending Chart */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Monthly Spending
                    </h3>
                    {stats.monthlyData.length > 0 ? (
                        <SpendingChart data={stats.monthlyData} />
                    ) : (
                        <p className="text-gray-500 text-center py-10">No data available</p>
                    )}
                </div>

                {/* Top Merchants Chart */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Top Merchants
                    </h3>
                    {stats.merchantData.length > 0 ? (
                        <MerchantPieChart data={stats.merchantData} />
                    ) : (
                        <p className="text-gray-500 text-center py-10">No data available</p>
                    )}
                </div>
            </div>
        </div>
    );
}
