import Charts, { Props as ChartProps } from 'react-apexcharts';

type ColumnTypes = 'bar';

type Props = ChartProps & {
  type?: ColumnTypes;
};

const ColumnChart: React.FC<Props> = ({ type = 'bar', options, series, height = 380, ...rest }) => {
  return <Charts options={options} series={series} type={type} height={height} {...rest} />;
};

export default ColumnChart;
