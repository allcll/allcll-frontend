import useUploading from '@/features/jolup/lib/useUploading.ts';

function Uploading() {
  const { progress, message } = useUploading();

  return (
    <div className="w-full max-w-md mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-4">업로드 진행 중...</h2>
      <div className="w-full bg-gray-200 rounded-full h-6 mb-4">
        <div
          className="bg-blue-600 h-6 rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <p className="text-center">{progress}% 완료</p>
      <p className="text-center mt-2">{message}</p>
    </div>
  );
}

export default Uploading;
