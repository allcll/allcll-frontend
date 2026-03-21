const PageLoader = () => {
  return (
    <div className="flex items-center justify-center w-full min-h-[50vh]">
      <div className="flex flex-col items-center gap-3">
        <img
          src="/ci.svg"
          alt="페이지를 불러오는 중"
          style={{
            width: 64,
            height: 64,
            animation: 'spin 1.5s linear infinite',
          }}
        />
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
        <p className="text-gray-500 text-sm">페이지를 불러오는 중...</p>
      </div>
    </div>
  );
};

export default PageLoader;
