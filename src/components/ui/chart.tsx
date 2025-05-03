import {
  Bar,
  BarChart as ReChartsBarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
];

interface BarChartProps {
  data: any[];
  index: string;
  categories: string[];
  colors?: string[];
  valueFormatter?: (value: number) => string;
  yAxisWidth?: number;
  showAnimation?: boolean;
  showLegend?: boolean;
  showXAxis?: boolean;
  showYAxis?: boolean;
  showCartesianGrid?: boolean;
  height?: number;
  yAxisDomain?: [number, number];
}

export function BarChart({
  data,
  index,
  categories,
  colors = COLORS,
  valueFormatter = (value: number) => value.toString(),
  yAxisWidth = 50,
  showAnimation = true,
  showLegend = false,
  showXAxis = true,
  showYAxis = true,
  showCartesianGrid = true,
  height = 300,
  yAxisDomain,
}: BarChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <ReChartsBarChart
        data={data}
        layout="horizontal"
        margin={{
          top: 12,
          right: 12,
          bottom: 12,
          left: 12,
        }}
        className="[&_.recharts-cartesian-grid-horizontal_line]:stroke-border [&_.recharts-cartesian-grid-vertical_line]:stroke-border [&_.recharts-cartesian-axis-line]:stroke-border [&_.recharts-cartesian-axis-tick-line]:stroke-border [&_.recharts-cartesian-axis-tick-value]:fill-muted-foreground [&_.recharts-label]:fill-muted-foreground [&_.recharts-legend-item-text]:fill-muted-foreground [&_.recharts-tooltip]:!border-border [&_.recharts-tooltip]:!bg-background [&_.recharts-tooltip-label]:text-muted-foreground [&_.recharts-tooltip-item]:!text-foreground"
      >
        {showXAxis && (
          <XAxis
          dataKey={index}
          tickLine={false}
          axisLine={false}
          fontSize={12}
          tick={({ x, y, payload }) => {
            const date = new Date(payload.value);
            const day = date.getDate().toString().padStart(2, "0");
            const month = date.toLocaleString("default", { month: "short" });
            return (
              <g transform={`translate(${x},${y + 8})`}>
                <text textAnchor="middle" fill="currentColor" fontSize={12}>
                  <tspan x="0" dy="-0.4em">{day}</tspan>
                  <tspan x="0" dy="1.2em">{month}</tspan>
                </text>
              </g>
            );
          }}
          tickMargin={8}
        />
        )}
        {showYAxis && (
          <YAxis
            tickLine={false}
            axisLine={false}
            fontSize={12}
            width={yAxisWidth}
            tick={{ transform: "translate(-3, 0)" }}
            tickFormatter={valueFormatter}
            domain={yAxisDomain}
            ticks={[0, 1]}
          />
        )}
        {showCartesianGrid && <CartesianGrid vertical={false} />}
        <Tooltip
          content={({ active, payload, label }) => {
            if (active && payload && payload.length) {
              return (
                <div className="rounded-lg border bg-background p-2 shadow-sm">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="font-semibold">{label}</div>
                    <div className="text-right font-semibold">
                      {valueFormatter(payload[0].value as number)}
                    </div>
                  </div>
                </div>
              );
            }
            return null;
          }}
        />
        {showLegend && <Legend />}
        {categories.map((category, i) => (
          <Bar
            key={category}
            dataKey={category}
            fill={colors[i % colors.length]}
            isAnimationActive={showAnimation}
            className="[&_.recharts-rectangle]:stroke-background"
            barSize={8}
          />
        ))}
      </ReChartsBarChart>
    </ResponsiveContainer>
  );
}