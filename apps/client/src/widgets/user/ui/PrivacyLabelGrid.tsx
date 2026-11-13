import { Flex, Grid, Heading, SupportingText } from '@allcll/allcll-ui';
import { LABELS } from '../model/privacy';

function PrivacyLabelGrid() {
  return (
    <div className="bg-surface border border-line rounded-xl overflow-hidden mb-10">
      <Flex justify="center" className="bg-surface-subtle px-6 py-4 border-b border-line">
        <Heading level={2}>주요 개인정보 처리 사항 안내</Heading>
      </Flex>
      <Grid columns={{ base: 1, md: 3 }} className="divide-x divide-y divide-line-subtle">
        {LABELS.map(item => (
          <Flex key={item.title} direction="column" align="center" className="px-4 py-6">
            <SupportingText className="font-semibold text-fg-secondary text-lg">{item.title}</SupportingText>
            <SupportingText className="text-fg-muted text-xs leading-relaxed text-center">{item.desc}</SupportingText>
          </Flex>
        ))}
      </Grid>
    </div>
  );
}

export default PrivacyLabelGrid;
