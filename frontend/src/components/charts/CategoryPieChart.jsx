import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { formatCurrency } from '../../utils/currencyFormatter';

function CategoryPieChart({ data, loading, currency }) {

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (!data || data.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                </svg>
                <p>No data available</p>
            </div>
        );
    }

    // Format data for pie chart
    const chartData = data.map(item => ({
        name: item.categoryName,
        value: parseFloat(item.total),
        count: item.count,
        percentage: parseFloat(item.percentage),
        color: item.categoryColor,
        icon: item.categoryIcon
    }));

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
                    <p className="font-semibold text-gray-800 mb-1">
                        {data.icon} {data.name}
                    </p>
                    <p className="text-sm text-gray-600">
                        Amount: <span className="font-medium">{formatCurrency(data.value, currency)}</span>
                    </p>
                    <p className="text-sm text-gray-600">
                        Transactions: <span className="font-medium">{data.count}</span>
                    </p>
                    <p className="text-sm text-gray-600">
                        Percentage: <span className="font-medium">{data.percentage}%</span>
                    </p>
                </div>
            );
        }
        return null;
    };

    const CustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
        const RADIAN = Math.PI / 180;
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        return percent > 0.05 ? (
            <text
                x={x}
                y={y}
                fill="white"
                textAnchor={x > cx ? 'start' : 'end'}
                dominantBaseline="central"
                className="text-sm font-semibold"
            >
                {`${(percent * 100).toFixed(0)}%`}
            </text>
        ) : null;
    };

    return (
        <div>
            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={CustomLabel}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                    >
                        {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                </PieChart>
            </ResponsiveContainer>

            {/* Legend */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4">
                {chartData.map((item, index) => (
                    <div key={index} className="flex items-center space-x-2 text-sm">
                        <div
                            className="w-3 h-3 rounded-full shrink-0"
                            style={{ backgroundColor: item.color }}
                        />
                        <span className="text-gray-700 truncate">
                            {item.icon} {item.name}
                        </span>
                        <span className="text-gray-500 ml-auto shrink-0">
                            {item.percentage}%
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default CategoryPieChart;