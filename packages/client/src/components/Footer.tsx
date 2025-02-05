import {Link} from 'react-router-dom';

function Footer() {
  return (
    <footer className="bg-white text-center text-sm text-gray-500 px-4 py-12">
      <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-6 text-center md:text-left">
        <div>
          <h5 className="font-bold mb-4">서비스</h5>
          <ul>
            <li>
              <a href="https://gleaming-clock-379.notion.site/ALLCLL-191802357b238006b813dc9792c1ce9d?pvs=4"
                 className="hover:text-blue-500 hover:underline hover:font-bold">
                ALLCLL 소개
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h5 className="font-bold mb-4">고객지원</h5>
          <ul>
            <li>
              <Link className="hover:text-blue-500 hover:underline hover:font-bold" to="/survey">
                문의하기
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h5 className="font-bold mb-4">문의</h5>
          <p>allcllclla@google.com</p>
        </div>
      </div>

      <p className="mt-16">
        © 2025 ALLCLL. All rights reserved.
      </p>
    </footer>
  );
}

export default Footer;