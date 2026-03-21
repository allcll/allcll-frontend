import { BarChart } from '@allcll/chart';
import { BAR_DATA } from '../data';

export function CustomBar() {
  return (
    <BarChart
      data={{
        labels: BAR_DATA.labels,
        datasets: [{ data: BAR_DATA.values, backgroundColor: BAR_DATA.color }],
      }}
    />
  );
}
