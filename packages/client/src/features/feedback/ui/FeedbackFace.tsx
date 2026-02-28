type FaceProps = {
  variant: 'sad' | 'neutral' | 'happy';
  size?: number;
  className?: string;
};

export const FeedbackFace = ({ variant, size = 48, className = '' }: FaceProps) => {
  const stroke = '#374151';
  const faceColor = '#fff7ed';

  const mouth = {
    sad: 'M16 34c3-4 9-6 16-0',
    neutral: 'M16 34h16',
    happy: 'M12 28c4 6 12 8 20 0',
  }[variant];

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <rect x="1" y="1" width="46" height="46" rx="12" fill={faceColor} stroke={stroke} strokeWidth="1.5" />
      <circle cx="16" cy="18" r="2" fill={stroke} />
      <circle cx="32" cy="18" r="2" fill={stroke} />
      <path d={mouth} stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
};

export default FeedbackFace;
