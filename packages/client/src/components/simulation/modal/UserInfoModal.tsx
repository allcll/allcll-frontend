import { useState } from 'react';
import Modal from '@/components/simulation/modal/Modal.tsx';
import ModalHeader from '@/components/simulation/modal/ModalHeader.tsx';

interface FormData {
  nickname: string;
  phone: string;
  major: string;
}

function UserInfoModal() {
  const [formData, setFormData] = useState<FormData>({
    nickname: '',
    phone: '',
    major: '',
  });

  const handleChange = (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  return (
    <Modal>
      <div className="w-full max-w-3xl overflow-hidden bg-white rounded-lg border-2 border-gray-300">
        <ModalHeader title="정보를 입력해주세요" onClose={() => {}} />

        <div className=" p-6 text-center">
          <form onSubmit={() => {}} className="space-y-5">
            {/* 닉네임 */}
            <div className="text-left text-sm">
              <label className="block mb-1 text-xs font-medium text-gray-700">필수</label>
              <input
                type="text"
                placeholder="닉네임을 입력해주세요."
                value={formData.nickname}
                onChange={handleChange('nickname')}
                required
                className="w-full px-4 py-2 bg-gray-50 border rounded-md focus:outline-none focus:ring focus:ring-blue-200"
              />
            </div>

            {/* 전화번호 */}
            <div className="text-left text-sm">
              <label className="block mb-1 text-xs font-medium text-gray-700">선택</label>
              <input
                type="tel"
                placeholder="전화번호를 입력해주세요."
                value={formData.phone}
                onChange={handleChange('phone')}
                className="w-full px-4 py-2 bg-gray-50 border rounded-md focus:outline-none focus:ring focus:ring-blue-200"
              />
            </div>

            {/* 학과 */}
            <div className="text-left text-sm">
              <label className="block mb-1 text-xs font-medium text-gray-700">필수</label>
              <input
                type="text"
                placeholder="학과를 입력해주세요."
                value={formData.major}
                onChange={handleChange('major')}
                required
                className="w-full px-4 py-2 bg-gray-50 border rounded-md focus:outline-none focus:ring focus:ring-blue-200"
              />
            </div>

            {/* 제출 버튼 */}
            <div className="pt-3">
              <button
                type="submit"
                className="w-full py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md"
              >
                제출하기
              </button>
            </div>
          </form>
        </div>
      </div>
    </Modal>
  );
}

export default UserInfoModal;
