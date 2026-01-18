import { Link, NavLink } from 'react-router-dom';
import { HeaderContents } from '@/shared/ui/Header.tsx';
import GithubSvg from '@/assets/icon-github.svg?react';
import InstagramSvg from '@/assets/icon-instagram.svg?react';
import KakaoSvg from '@/assets/icon-kakao.svg?react';

interface IFooterItem {
  title: string;
  children: { title: string; href?: string }[];
}

const FooterItems: IFooterItem[] = [
  {
    title: '고객지원',
    children: [
      { title: 'ALLCLL 소개', href: '/about' },
      { title: '자주 묻는 질문', href: '/faq' },
      { title: '오류 및 제안', href: 'https://forms.gle/bCDTVujEHunnvHe88' },
      { title: 'allcllclla@google.com' },
    ],
  },
];

const OuterLinks = [
  { icon: <GithubSvg className="w-8 h-8 m-2" />, title: '올클 github', href: 'https://github.com/allcll' },
  { icon: <KakaoSvg className="w-8 h-8 m-2" />, title: '올클 오픈채팅', href: 'https://open.kakao.com/o/g3MztXfh' },
  {
    icon: <InstagramSvg className="w-8 h-8 m-2" />,
    title: '올클 instagram',
    href: 'https://www.instagram.com/sejong_allcll',
  },
];

function Footer() {
  return (
    <footer className="bg-white text-center text-sm text-gray-500">
      <div className="mx-auto max-w-7xl px-4 md:px-16 py-12 grid md:grid-cols-3 gap-6 text-center md:text-left">
        <div className="mx-auto md:mx-0">
          <div className="flex items-center mb-2 h-fit justify-center md:justify-start">
            <img src="/ci.svg" className="w-6 h-6 mr-2" alt="ci" />
            <img src="/logo-name.svg" alt="logo" className="h-5" />
          </div>

          <ul className="flex items-center">
            {OuterLinks.map(({ icon, title, href }) => (
              <li key={title}>
                <a href={href} className="h-fit rounded-md hover:bg-gray-200" aria-label={title} title={title}>
                  {icon}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-bold mb-4">서비스</h3>
          <ul>
            {HeaderContents.map(({ title, path, end }) => (
              <li key={title} className="mb-1">
                <NavLink to={path} end={end} className="hover:text-blue-500 hover:underline hover:font-bold">
                  {title}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        {FooterItems.map((item, index) => (
          <div className="mb-4" key={index}>
            <h3 className="font-bold mb-4">{item.title}</h3>
            <ul>
              {item.children.map((child, index) => (
                <li key={index} className="mb-1">
                  {!child.href ? (
                    <p>{child.title}</p>
                  ) : child.href.startsWith('http') ? (
                    <a
                      className="hover:text-blue-500 hover:underline hover:font-bold"
                      href={child.href}
                      target="_blank"
                    >
                      {child.title}
                    </a>
                  ) : (
                    <Link to={child.href} className="hover:text-blue-500 hover:underline hover:font-bold">
                      {child.title}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <p className="pb-12">© 2025 ALLCLL. All rights reserved.</p>
    </footer>
  );
}

export default Footer;
