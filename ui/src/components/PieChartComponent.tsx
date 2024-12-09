import React from 'react';

import { ResponsiveContainer, PieChart, Tooltip, Pie, Label } from 'recharts';

type Entrie = {
  name: string,
  value: number,
  fill: string
}

type PieChartProps = {
  data: Entrie[],
  title: string
}

const PieChartComponent: React.FC<PieChartProps> = ({data, title}) => {
  return(
    <div className="min-w-[150px] min-h-[150px] flex flex-col items-center">
      <p className="text-center font-semibold text-lg mb-2">{title}</p>
      <ResponsiveContainer width='100%' height='95%'>
        <PieChart>
          <Label value={title} offset={0} position="top" />
          <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={50} />
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export {PieChartComponent};
