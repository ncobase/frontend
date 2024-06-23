import React from 'react';

import Charts, { Props as ChartProps } from 'react-apexcharts';

type BarTypes = 'bar';

type Props = ChartProps & {
  type?: BarTypes;
};

const BarChart: React.FC<Props> = ({ type = 'bar', options, series, height = 380, ...rest }) => {
  return <Charts options={options} series={series} type={type} height={height} {...rest} />;
};

export default BarChart;
