import { Badge } from '@allcll/allcll-ui';

export function TargetTypeBadge({ targetType }: Readonly<{ targetType: string }>) {
  const isMajor = targetType !== 'NON_MAJOR';
  return (
    <div>
      <Badge variant={isMajor ? 'success' : 'default'}>{isMajor ? '전공자' : '비전공자'}</Badge>
    </div>
  );
}

interface ICriteriaTableRow {
  key: string;
  label: string;
  value: string;
}

export function CriteriaTable({ headers, rows }: Readonly<{ headers: [string, string]; rows: ICriteriaTableRow[] }>) {
  return (
    <div className="text-sm">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="py-2 text-left text-gray-500 font-medium">{headers[0]}</th>
            <th className="py-2 text-right text-gray-500 font-medium">{headers[1]}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(row => (
            <tr key={row.key} className="border-b border-gray-50">
              <td className="py-2 text-gray-700">{row.label}</td>
              <td className="py-2 text-right font-medium">{row.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function InfoCard({ label, value }: Readonly<{ label: string; value: string }>) {
  return (
    <div className="bg-gray-50 rounded-md p-3">
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className="text-sm font-medium">{value}</p>
    </div>
  );
}
