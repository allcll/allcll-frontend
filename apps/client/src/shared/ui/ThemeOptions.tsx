import { Select } from '@allcll/allcll-ui';
import { type ThemePreference, useThemeStore } from '@allcll/common';

const THEME_OPTIONS: { value: ThemePreference; label: string }[] = [
  { value: 'system', label: '기기 설정을 따름' },
  { value: 'light', label: '라이트 모드' },
  { value: 'dark', label: '다크 모드' },
];

function ThemeOptions() {
  const preference = useThemeStore(s => s.preference);
  const setPreference = useThemeStore(s => s.setPreference);

  return (
    <Select
      variant="plain"
      aria-label="화면 모드"
      value={preference}
      onChange={e => setPreference(e.target.value as ThemePreference)}
    >
      {THEME_OPTIONS.map(({ value, label }) => (
        <option key={value} value={value}>
          {label}
        </option>
      ))}
    </Select>
  );
}

export default ThemeOptions;
