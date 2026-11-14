import { Container, Heading } from '@allcll/allcll-ui';

const isDevelopment = import.meta.env.VITE_DEV_SERVER === 'true';

function Header() {
  return (
    <header className="bg-surface shadow-xs p-4 z-header sticky top-0">
      <Container className="flex items-center justify-between">
        <Heading level={2}>올클 관리자 </Heading>
        <span className="text-sm font-semibold">{isDevelopment ? '개발모드' : 'Prod모드'} </span>
      </Container>
    </header>
  );
}

export default Header;
