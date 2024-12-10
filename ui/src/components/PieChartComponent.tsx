import React from 'react';

import { ResponsiveContainer, PieChart, Tooltip, Pie, Label, Legend, PieLabelRenderProps } from 'recharts';

type Entrie = {
  name: string,
  value: number,
  fill: string
}

type PieChartProps = {
  data: Entrie[] | undefined,
  title: string
}

const renderCustomizedLabel = (props: PieLabelRenderProps) => {
  const { cx, cy, midAngle, innerRadius, outerRadius, percent } = props;

  const RADIAN = Math.PI / 180;

  const radius = (Number(innerRadius) + (Number(outerRadius) - Number(innerRadius)) * 0.2);

  const numericCx = cx !== undefined ? Number(cx) : 0;
  const numericCy = cy !== undefined ? Number(cy) : 0;
  const numericMidAngle = Number(midAngle);

  const x = numericCx + radius * Math.cos(-numericMidAngle * RADIAN);
  const y = numericCy + radius * Math.sin(-numericMidAngle * RADIAN);

  const percentFormated = percent !== undefined ? (percent * 100).toFixed(0) : 0;

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > numericCx ? 'start' : 'end'}
      dominantBaseline="central"
    >
      {`${percentFormated}%`}
    </text>
  );
};
const PieChartComponent: React.FC<PieChartProps> = ({data, title}) => {
  return(
    <div className="min-w-[200px] min-h-[200px] flex flex-col items-center">
      <p className="text-center font-semibold text-lg mb-2">{title}</p>
      <ResponsiveContainer width='100%' height='95%'>
        <PieChart>
          <Label value={title} offset={0} position="top" />
          <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={50}
            label={renderCustomizedLabel} labelLine={false} />
          <Tooltip />
          <Legend verticalAlign="bottom" height={36}/>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export {PieChartComponent};
