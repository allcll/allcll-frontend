import TokenSetting from '@/components/clawlers/TokenSetting';
import SessionAdmin from '@/components/clawlers/SessionAdmin';
import Control from '@/components/clawlers/Control';

function CrawlerSettings() {
  return (
    <div className="p-6 space-y-10">
      <h1 className="text-lg text-gray-700 font-bold mb-4">크롤러 설정</h1>

      <div className="flex flex-col gap-4">
        <TokenSetting />
        <SessionAdmin />
        <Control />
      </div>
    </div>
  );
}

export default CrawlerSettings;
