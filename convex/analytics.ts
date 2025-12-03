import { v } from "convex/values";
import { query } from "./_generated/server";

export const getStats = query({
    args: {
        userId: v.string(),
    },
    handler: async (ctx, args) => {
        const receipts = await ctx.db
            .query("recipts")
            .filter((q) => q.eq(q.field("userId"), args.userId))
            .collect();

        let totalSpent = 0;
        let totalReceipts = receipts.length;

        // Group by month: "YYYY-MM" -> amount
        const monthlySpending: Record<string, number> = {};

        // Group by merchant: "Merchant Name" -> amount
        const merchantSpending: Record<string, number> = {};

        for (const receipt of receipts) {
            if (receipt.transactionAmount) {
                // Simple parsing, assuming format like "123.45" or "$123.45"
                // We might need more robust parsing depending on how data is stored
                const amountStr = receipt.transactionAmount.replace(/[^0-9.-]+/g, "");
                const amount = parseFloat(amountStr);

                if (!isNaN(amount)) {
                    totalSpent += amount;

                    // Monthly Spending
                    if (receipt.transactionDate) {
                        try {
                            const date = new Date(receipt.transactionDate);
                            // Ensure valid date
                            if (!isNaN(date.getTime())) {
                                const monthKey = date.toISOString().slice(0, 7); // YYYY-MM
                                monthlySpending[monthKey] = (monthlySpending[monthKey] || 0) + amount;
                            }
                        } catch (e) {
                            console.error("Error parsing date:", receipt.transactionDate);
                        }
                    }

                    // Merchant Spending
                    if (receipt.merchantName) {
                        const merchant = receipt.merchantName;
                        merchantSpending[merchant] = (merchantSpending[merchant] || 0) + amount;
                    }
                }
            }
        }

        // Convert maps to arrays for Recharts
        const monthlyData = Object.entries(monthlySpending)
            .map(([month, amount]) => ({ month, amount }))
            .sort((a, b) => a.month.localeCompare(b.month)); // Sort by date

        const merchantData = Object.entries(merchantSpending)
            .map(([merchant, amount]) => ({ merchant, amount }))
            .sort((a, b) => b.amount - a.amount) // Sort by amount desc
            .slice(0, 5); // Top 5 merchants

        return {
            totalSpent,
            totalReceipts,
            monthlyData,
            merchantData,
        };
    },
});
