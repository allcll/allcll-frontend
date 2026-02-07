import { Flex, Grid, Heading, SupportingText } from '@allcll/allcll-ui';
import { LABELS } from '../model/privacy';

function PrivacyLabelGrid() {
  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden mb-10">
      <Flex justify="justify-center" className="bg-gray-50 px-6 py-4 border-b border-gray-200">
        <Heading level={2}>주요 개인정보 처리 사항 안내</Heading>
      </Flex>
      <Grid columns={{ base: 2, md: 3 }} className="divide-x divide-y divide-gray-100">
        {LABELS.map(item => (
          <Flex key={item.title} direction="flex-col" align="items-center" className="px-4 py-6 gap-2">
            <SupportingText className="font-semibold text-gray-700 text-lg">{item.title}</SupportingText>
            <SupportingText className="text-gray-500 text-xs leading-relaxed text-center">{item.desc}</SupportingText>
          </Flex>
        ))}
      </Grid>
    </div>
  );
}

export default PrivacyLabelGrid;
