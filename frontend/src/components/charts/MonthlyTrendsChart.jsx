import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '../../utils/currencyFormatter';

function MonthlyTrendsChart({ data, loading, isDaily = false, currency }) {

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (!data || data.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400 dark:text-gray-500">
                <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                </svg>
                <p>No data available</p>
            </div>
        );
    }

    // Format data for chart
    const chartData = data.map(item => {
        const label = isDaily ? formatDate(item?.date) : formatMonth(item?.month || item?.date);
        return {
            label,
            income: toNumber(item?.income),
            expense: toNumber(item?.expense),
            balance: toNumber(item?.balance)
        };
    });

    function formatDate(dateValue) {
        if (!dateValue) {
            return 'N/A';
        }

        const date = new Date(dateValue);

        if (Number.isNaN(date.getTime())) {
            return typeof dateValue === 'string' ? dateValue : 'N/A';
        }

        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }

    function formatMonth(monthValue) {
        if (!monthValue) {
            return 'N/A';
        }

        const monthStr = typeof monthValue === 'string' ? monthValue : String(monthValue);
        const parts = monthStr.split('-');

        if (parts.length < 2) {
            return monthStr;
        }

        const [yearPart, monthPart] = parts;
        const year = parseInt(yearPart, 10);
        const month = parseInt(monthPart, 10);

        if (Number.isNaN(year) || Number.isNaN(month)) {
            return monthStr;
        }

        const date = new Date(year, month - 1);

        if (Number.isNaN(date.getTime())) {
            return monthStr;
        }

        return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    }

    function toNumber(value) {
        const numeric = typeof value === 'number' ? value : parseFloat(value);
        return Number.isNaN(numeric) ? 0 : numeric;
    }

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
                    <p className="font-semibold text-gray-800 dark:text-gray-100 mb-2">{label}</p>
                    {payload.map((entry, index) => (
                        <p key={index} className="text-sm" style={{ color: entry.color }}>
                            {entry.name}: <span className="font-medium">{formatCurrency(entry.value, currency)}</span>
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    return (
        <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis
                    dataKey="label"
                    stroke="#666"
                    style={{ fontSize: '12px' }}
                    angle={isDaily && chartData.length > 15 ? -45 : 0}
                    textAnchor={isDaily && chartData.length > 15 ? 'end' : 'middle'}
                    height={isDaily && chartData.length > 15 ? 80 : 60}
                />
                <YAxis
                    stroke="#666"
                    style={{ fontSize: '12px' }}
                    tickFormatter={(value) => `${value}`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                    wrapperStyle={{ fontSize: '14px' }}
                    iconType="line"
                />
                <Line
                    type="monotone"
                    dataKey="income"
                    stroke="#10b981"
                    strokeWidth={2}
                    name="Income"
                    dot={{ fill: '#10b981', r: 4 }}
                    activeDot={{ r: 6 }}
                />
                <Line
                    type="monotone"
                    dataKey="expense"
                    stroke="#ef4444"
                    strokeWidth={2}
                    name="Expense"
                    dot={{ fill: '#ef4444', r: 4 }}
                    activeDot={{ r: 6 }}
                />
                <Line
                    type="monotone"
                    dataKey="balance"
                    stroke="#6366f1"
                    strokeWidth={2}
                    name="Balance"
                    dot={{ fill: '#6366f1', r: 4 }}
                    activeDot={{ r: 6 }}
                />
            </LineChart>
        </ResponsiveContainer>
    );
}

export default MonthlyTrendsChart;
