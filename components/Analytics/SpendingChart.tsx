"use client";

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

interface SpendingChartProps {
    data: { month: string; amount: number }[];
}

export default function SpendingChart({ data }: SpendingChartProps) {
    return (
        <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    data={data}
                    margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip
                        formatter={(value: number) => [`$${value.toFixed(2)}`, 'Amount']}
                        labelStyle={{ color: 'black' }}
                    />
                    <Bar dataKey="amount" fill="#8884d8" name="Spending" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
