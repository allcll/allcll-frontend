const Base = (import.meta.env.VITE_BASE ?? '').replace(/\/$/, '');

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
}

function Image({ src, ...props }: ImageProps) {
  const resolvedSrc = src.startsWith('http://') || src.startsWith('https://') || src.startsWith('//') ? src : Base + src;
  return <img src={resolvedSrc} {...props} />;
}

export default Image;
