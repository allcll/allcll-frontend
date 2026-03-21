import { DoughnutChart } from '@allcll/chart';
import { DOUGHNUT_DATA } from '../data';

export function CustomDoughnut() {
  return (
    <DoughnutChart
      data={{
        labels: DOUGHNUT_DATA.labels,
        datasets: [{ data: DOUGHNUT_DATA.values, backgroundColor: DOUGHNUT_DATA.colors, cutout: '60%' }],
      }}
    />
  );
}
