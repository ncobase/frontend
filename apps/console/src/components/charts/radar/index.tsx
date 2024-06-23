import React from 'react';

import Charts, { Props as ChartProps } from 'react-apexcharts';

type RadarTypes = 'radar';

type Props = ChartProps & {
  type?: RadarTypes;
};

const RadarChart: React.FC<Props> = ({
  type = 'radar',
  options,
  series,
  height = 380,
  ...rest
}) => {
  return <Charts options={options} series={series} type={type} height={height} {...rest} />;
};

export default RadarChart;
