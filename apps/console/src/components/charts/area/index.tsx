import Charts, { Props as ChartProps } from 'react-apexcharts';

type AreaTypes = 'area';

type Props = ChartProps & {
  type?: AreaTypes;
};

const AreaChart: React.FC<Props> = ({ type = 'area', options, series, height = 380, ...rest }) => {
  return <Charts options={options} series={series} type={type} height={height} {...rest} />;
};

export default AreaChart;
