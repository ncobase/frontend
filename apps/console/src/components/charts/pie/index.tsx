import React from 'react';

import Charts, { Props as ChartProps } from 'react-apexcharts';

type PieTypes = 'pie' | 'donut';

type Props = ChartProps & {
  type?: PieTypes;
};

const PieChart: React.FC<Props> = ({ type = 'pie', options, series, height = 380, ...rest }) => {
  return <Charts options={options} series={series} type={type} height={height} {...rest} />;
};

export default PieChart;
