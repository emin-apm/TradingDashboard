import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from "recharts";

type SparklineProps = {
  data: number[];
  positive?: boolean;
};

export default function Sparkline({ data, positive = true }: SparklineProps) {
  const strokeColor = positive ? "lime" : "red";

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={data.map((v, i) => ({ value: v, index: i }))}
        margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
      >
        <XAxis dataKey="index" hide />
        <YAxis
          hide
          domain={["dataMin - 0.05 * dataMin", "dataMax + 0.05 * dataMax"]}
        />
        <defs>
          <linearGradient id={`sparkline-gradient`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={strokeColor} stopOpacity={0.4} />
            <stop offset="100%" stopColor="transparent" stopOpacity={0} />
          </linearGradient>
        </defs>
        <Line
          type="monotone"
          dataKey="value"
          stroke={strokeColor}
          strokeWidth={2}
          fill="url(#sparkline-gradient)"
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
