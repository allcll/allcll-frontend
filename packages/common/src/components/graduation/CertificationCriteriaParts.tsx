import { Badge } from '@allcll/allcll-ui';

export function TargetTypeBadge({ targetType }: Readonly<{ targetType: string }>) {
  const isMajor = targetType !== 'NON_MAJOR';
  return (
    <div>
      <Badge color={isMajor ? 'success' : 'gray'}>{isMajor ? '전공자' : '비전공자'}</Badge>
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
          <tr className="border-b border-line">
            <th className="py-2 text-left text-fg-muted font-medium">{headers[0]}</th>
            <th className="py-2 text-right text-fg-muted font-medium">{headers[1]}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(row => (
            <tr key={row.key} className="border-b border-line-subtle">
              <td className="py-2 text-fg-secondary">{row.label}</td>
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
    <div className="bg-surface-subtle rounded-md p-3">
      <p className="text-xs text-fg-muted mb-1">{label}</p>
      <p className="text-sm font-medium">{value}</p>
    </div>
  );
}
