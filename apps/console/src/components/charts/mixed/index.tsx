import Charts, { Props as ChartProps } from 'react-apexcharts';

type MixedTypes = 'line';

type Props = ChartProps & {
  type?: MixedTypes;
};

const MixedChart: React.FC<Props> = ({ type = 'line', options, series, height = 380, ...rest }) => {
  return <Charts options={options} series={series} type={type} height={height} {...rest} />;
};

export default MixedChart;
