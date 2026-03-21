import { RadarChart } from '@allcll/chart';
import { RADAR_DATA } from '../data';

export function CustomRadar() {
  return (
    <RadarChart
      data={{
        labels: RADAR_DATA.labels,
        datasets: RADAR_DATA.datasets.map(d => ({
          label: d.label,
          data: d.data,
          backgroundColor: d.color,
          borderColor: d.borderColor,
          borderWidth: 2,
          pointBackgroundColor: d.borderColor,
        })),
      }}
      options={{
        scales: { r: { suggestedMin: 0, suggestedMax: 100 } },
        plugins: { legend: { display: true } },
      }}
    />
  );
}
