import Charts, { Props as ChartProps } from 'react-apexcharts';

type RangeAreaTypes = 'rangeArea';

type Props = ChartProps & {
  type?: RangeAreaTypes;
};

const RangeAreaChart: React.FC<Props> = ({
  type = 'rangeArea',
  options,
  series,
  height = 380,
  ...rest
}) => {
  return <Charts options={options} series={series} type={type} height={height} {...rest} />;
};

export default RangeAreaChart;
