import React, { useState } from 'react';
import { TrendingUp, BarChart2, PieChart as PieIcon, DollarSign, Package } from 'lucide-react';

// 1. Revenue Area Chart (Smooth SVG Gradient Line/Area Chart)
export className RevenueAreaChart = ({ sales = [] }) => {
    const [hoveredPoint, setHoveredPoint] = useState(null);

    // Group sales by date (or mock timeline if single/few sales for beautiful visualization)
    const dateMap = {};
    sales.forEach(sale => {
        const dateStr = new Date(sale.purchased_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        dateMap[dateStr] = (dateMap[dateStr] || 0) + parseFloat(sale.purchase_price);
    });

    let chartData = Object.keys(dateMap).map(date => ({
        date,
        amount: dateMap[date]
    }));

    // If no sales or very few sales, construct clean baseline nodes so chart renders gracefully
    if (chartData.length === 0) {
        chartData = [
            { date: 'Mon', amount: 0 },
            { date: 'Tue', amount: 0 },
            { date: 'Wed', amount: 0 },
            { date: 'Thu', amount: 0 },
            { date: 'Fri', amount: 0 },
            { date: 'Sat', amount: 0 },
            { date: 'Sun', amount: 0 }
        ];
    } else if (chartData.length === 1) {
        chartData = [
            { date: 'Start', amount: 0 },
            ...chartData,
            { date: 'Now', amount: chartData[0].amount }
        ];
    }

    const maxAmount = Math.max(...chartData.map(d => d.amount), 100);
    const width = 600;
    const height = 220;
    const padding = 35;

    // Calculate coordinates for points
    const points = chartData.map((d, index) => {
        const x = padding + (index / (chartData.length - 1 || 1)) * (width - padding * 2);
        const y = height - padding - (d.amount / maxAmount) * (height - padding * 2);
        return { x, y, ...d };
    });

    // Create SVG smooth path definition
    const pathD = points.reduce((acc, point, i, a) => {
        if (i === 0) return `M ${point.x},${point.y}`;
        const prev = a[i - 1];
        const cx1 = prev.x + (point.x - prev.x) / 2;
        const cy1 = prev.y;
        const cx2 = prev.x + (point.x - prev.x) / 2;
        const cy2 = point.y;
        return `${acc} C ${cx1},${cy1} ${cx2},${cy2} ${point.x},${point.y}`;
    }, '');

    // Area closed path
    const areaD = `${pathD} L ${points[points.length - 1].x},${height - padding} L ${points[0].x},${height - padding} Z`;

    return (
        <div className="bg-background-secondary p-6 rounded-2xl border border-border-primary shadow-sm space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="font-bold text-text-primary text-base flex items-center gap-2">
                        <TrendingUp size={18} className="text-accent-primary" /> Revenue Trend
                    </h3>
                    <p className="text-xs text-text-secondary">Gross sales income over time</p>
                </div>
                <span className="text-xs font-bold px-3 py-1 bg-accent-primary/10 text-accent-primary rounded-full border border-accent-primary/20">
                    Live Analytics
                </span>
            </div>

            <div className="relative w-full overflow-hidden pt-2">
                <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible">
                    <defs>
                        <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="var(--color-accent-primary, #3b82f6)" stopOpacity="0.4" />
                            <stop offset="100%" stopColor="var(--color-accent-primary, #3b82f6)" stopOpacity="0.0" />
                        </linearGradient>
                    </defs>

                    {/* Gridlines */}
                    {[0, 0.33, 0.66, 1].map((ratio, idx) => {
                        const y = padding + ratio * (height - padding * 2);
                        return (
                            <line
                                key={idx}
                                x1={padding}
                                y1={y}
                                x2={width - padding}
                                y2={y}
                                stroke="currentColor"
                                className="text-border-primary/60"
                                strokeDasharray="4 4"
                                strokeWidth="1"
                            />
                        );
                    })}

                    {/* Area fill */}
                    <path d={areaD} fill="url(#revenueGradient)" />

                    {/* Gradient Line */}
                    <path
                        d={pathD}
                        fill="none"
                        stroke="var(--color-accent-primary, #3b82f6)"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                    />

                    {/* Interactive Data Points */}
                    {points.map((pt, i) => (
                        <g key={i} className="cursor-pointer">
                            <circle
                                cx={pt.x}
                                cy={pt.y}
                                r={hoveredPoint?.index === i ? "7" : "4.5"}
                                fill="var(--color-background-primary, #ffffff)"
                                stroke="var(--color-accent-primary, #3b82f6)"
                                strokeWidth="3"
                                className="transition-all duration-150"
                                onMouseEnter={() => setHoveredPoint({ ...pt, index: i })}
                                onMouseLeave={() => setHoveredPoint(null)}
                            />
                        </g>
                    ))}
                </svg>

                {/* Hover Tooltip */}
                {hoveredPoint && (
                    <div
                        className="absolute bg-background-primary text-text-primary px-3 py-1.5 rounded-xl border border-border-primary shadow-lg text-xs font-bold pointer-events-none transform -translate-x-1/2 -translate-y-full mb-2 animate-in fade-in zoom-in-95 duration-150"
                        style={{
                            left: `${(hoveredPoint.x / width) * 100}%`,
                            top: `${(hoveredPoint.y / height) * 100}%`
                        }}
                    >
                        <p className="text-text-tertiary text-[10px] uppercase font-semibold">{hoveredPoint.date}</p>
                        <p className="text-emerald-600 dark:text-emerald-400 font-bold">
                            {new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(hoveredPoint.amount)}
                        </p>
                    </div>
                )}
            </div>

            <div className="flex justify-between items-center text-[11px] font-bold text-text-tertiary pt-2 border-t border-border-primary/60">
                <span>{chartData[0]?.date}</span>
                <span>{chartData[Math.floor(chartData.length / 2)]?.date}</span>
                <span>{chartData[chartData.length - 1]?.date}</span>
            </div>
        </div>
    );
};


// 2. Bar Chart Component (Top Products by Sales Volume)
export const SalesByListingBarChart = ({ sales = [] }) => {
    const listingMap = {};
    sales.forEach(s => {
        const title = s.listing.title;
        listingMap[title] = (listingMap[title] || 0) + 1;
    });

    const barData = Object.keys(listingMap).map(title => ({
        title,
        count: listingMap[title]
    })).sort((a, b) => b.count - a.count).slice(0, 5);

    const maxCount = Math.max(...barData.map(b => b.count), 1);

    return (
        <div className="bg-background-secondary p-6 rounded-2xl border border-border-primary shadow-sm space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="font-bold text-text-primary text-base flex items-center gap-2">
                        <BarChart2 size={18} className="text-emerald-500" /> Sales by Product
                    </h3>
                    <p className="text-xs text-text-secondary">Most popular software downloads</p>
                </div>
            </div>

            {barData.length === 0 ? (
                <div className="h-40 flex items-center justify-center text-xs text-text-tertiary font-medium">
                    No product sales data recorded yet.
                </div>
            ) : (
                <div className="space-y-3.5 pt-2">
                    {barData.map((item, idx) => {
                        const pct = Math.round((item.count / maxCount) * 100);
                        return (
                            <div key={idx} className="space-y-1.5">
                                <div className="flex justify-between items-center text-xs font-bold">
                                    <span className="text-text-primary truncate max-w-[200px]">{item.title}</span>
                                    <span className="text-text-secondary">{item.count} {item.count === 1 ? 'sale' : 'sales'}</span>
                                </div>
                                <div className="w-full h-3 bg-background-primary rounded-full overflow-hidden border border-border-primary/50">
                                    <div
                                        className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
                                        style={{ width: `${pct}%` }}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};


// 3. Donut / Pie Chart Component (Revenue Distribution by Product)
export const RevenuePieChart = ({ sales = [] }) => {
    const productRevenueMap = {};
    let totalRev = 0;

    sales.forEach(s => {
        const title = s.listing.title;
        const price = parseFloat(s.purchase_price);
        productRevenueMap[title] = (productRevenueMap[title] || 0) + price;
        totalRev += price;
    });

    const pieItems = Object.keys(productRevenueMap).map(title => ({
        title,
        amount: productRevenueMap[title],
        percentage: totalRev > 0 ? Math.round((productRevenueMap[title] / totalRev) * 100) : 0
    })).sort((a, b) => b.amount - a.amount).slice(0, 4);

    const colors = [
        '#3b82f6', // blue
        '#10b981', // emerald
        '#8b5cf6', // purple
        '#f59e0b', // amber
    ];

    return (
        <div className="bg-background-secondary p-6 rounded-2xl border border-border-primary shadow-sm space-y-4">
            <div>
                <h3 className="font-bold text-text-primary text-base flex items-center gap-2">
                    <PieIcon size={18} className="text-purple-500" /> Revenue Share
                </h3>
                <p className="text-xs text-text-secondary">Distribution by software product</p>
            </div>

            {pieItems.length === 0 ? (
                <div className="h-40 flex items-center justify-center text-xs text-text-tertiary font-medium">
                    No revenue data available.
                </div>
            ) : (
                <div className="flex flex-col sm:flex-row items-center gap-6 pt-2">
                    {/* SVG Donut */}
                    <div className="relative w-36 h-36 shrink-0 flex items-center justify-center">
                        <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                            {pieItems.reduce((acc, item, index) => {
                                const strokeDasharray = `${item.percentage} ${100 - item.percentage}`;
                                const strokeDashoffset = -acc.offset;
                                acc.offset += item.percentage;
                                acc.elements.push(
                                    <circle
                                        key={index}
                                        cx="18"
                                        cy="18"
                                        r="15.91549430918954"
                                        fill="transparent"
                                        stroke={colors[index % colors.length]}
                                        strokeWidth="4"
                                        strokeDasharray={strokeDasharray}
                                        strokeDashoffset={strokeDashoffset}
                                        className="transition-all duration-500"
                                    />
                                );
                                return acc;
                            }, { offset: 0, elements: [] }).elements}
                        </svg>
                        <div className="absolute text-center">
                            <span className="text-xs font-bold text-text-primary block">{pieItems.length} Products</span>
                            <span className="text-[10px] text-text-tertiary uppercase font-bold">Revenue</span>
                        </div>
                    </div>

                    {/* Legend */}
                    <div className="space-y-2 w-full">
                        {pieItems.map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between text-xs">
                                <div className="flex items-center gap-2 truncate max-w-[140px]">
                                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: colors[idx % colors.length] }}></span>
                                    <span className="font-semibold text-text-primary truncate">{item.title}</span>
                                </div>
                                <span className="font-bold text-text-secondary">{item.percentage}%</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
