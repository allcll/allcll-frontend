function Footer() {
  return (
    <footer className="bg-white text-center text-sm text-gray-500 px-4 py-12">
      <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-6 text-center md:text-left">
        <div>
          <h5 className="font-bold mb-4">서비스</h5>
          <ul>
            <li>이용안내</li>
            <li>자주 묻는 질문</li>
          </ul>
        </div>
        <div>
          <h5 className="font-bold mb-4">고객지원</h5>
          <ul>
            <li>문의하기</li>
            <li>피드백</li>
          </ul>
        </div>
        <div>
          <h5 className="font-bold mb-4">문의</h5>
          <p>support@example.com</p>
        </div>
      </div>

      <p className="mt-16">
        © 2025 ALLCLL. All rights reserved.
      </p>
    </footer>
  );
}

export default Footer;