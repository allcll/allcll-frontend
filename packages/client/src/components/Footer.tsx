import {Link} from 'react-router-dom';

interface IFooterItem {
  title: string;
  children: { title: string; href?: string }[];
}

const FooterItems: IFooterItem[] = [
  {
    title: '서비스',
    children: [
      { title: 'ALLCLL 소개', href: '/about' },
      { title: '자주 묻는 질문', href: '/faq' }
    ]
  },
  {
    title: '고객지원',
    children: [
      { title: '오류 및 제안', href: '/survey' },
      { title: '오픈 채팅', href: 'https://open.kakao.com/o/g3MztXfh'},
      { title: 'allcllclla@google.com' }
    ]
  },
];

function Footer() {
  return (
    <footer className="bg-white text-center text-sm text-gray-500">
      <div className="mx-auto max-w-7xl px-4 md:px-16 py-12 grid md:grid-cols-3 gap-6 text-center md:text-left">
        <div className='flex flex-col items-center md:items-start'>
          <img src='/logo-name.svg' alt='logo' className="h-5 mb-4"/>
          <p>대학생들이 직접 만든 서비스로, 더 나은 수강신청 경험을 제공합니다. </p>
        </div>
        {FooterItems.map((item, index) => (
          <div className="mb-4" key={index}>
            <h5 className="font-bold mb-4">{item.title}</h5>
            <ul>
              {item.children.map((child, index) => (
                <li key={index} className="mb-1">
                  {!child.href ? (
                    <p>{child.title}</p>
                  ) : child.href.startsWith('http') ? (
                    <a href={child.href} className="hover:text-blue-500 hover:underline hover:font-bold">
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

      <p className="pb-12">
        © 2025 ALLCLL. All rights reserved.
      </p>
    </footer>
  );
}

export default Footer;