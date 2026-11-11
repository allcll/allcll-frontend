import { useEffect, useState } from 'react';
import remarkGfm from 'remark-gfm';
import { Helmet } from 'react-helmet';
import { useLocation } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import useFaq from '@/entities/faq/model/useFaq.ts';
import { Accordion, Chip, EmptyState, Flex, LoadingState } from '@allcll/allcll-ui';
import markdownComponents from '@/shared/config/markdownComponents.tsx';
import PageContainer from '@/shared/ui/PageContainer';
import PageHeader from '@/shared/ui/PageHeader';

const Tags = {
  all: '일반',
  timetable: '시간표',
  wishes: '관심과목',
  simulation: '올클연습',
  live: '실시간',
};

function unique(array: string[]) {
  return Array.from(new Set(array));
}

function FAQ() {
  const location = useLocation();
  const hashId = location.hash ? location.hash.replace('#', '') : null;

  const [openId, setOpenId] = useState<string | null>(hashId);
  const { data: faqItems, isPending, isError } = useFaq();

  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const faqItemsWithTags = unique(faqItems?.map(item => item.tag) ?? []);

  const filteredFaqItems = selectedTag ? faqItems?.filter(item => item.tag === selectedTag) : faqItems;

  // 질문 목록이 그려진 뒤에 스크롤해야 링크로 지정한 질문 위치를 찾을 수 있음
  useEffect(() => {
    if (!hashId || !faqItems) return;

    setOpenId(hashId);
    document.getElementById('faq-container-' + hashId)?.scrollIntoView({ behavior: 'smooth' });
  }, [hashId, faqItems]);

  return (
    <>
      <Helmet>
        <title>ALLCLL | 자주 묻는 질문</title>
        <meta name="description" content="자주 묻는 질문과 답변을 확인해보세요." />
      </Helmet>

      <PageContainer>
        <PageHeader title="자주 묻는 질문" description="ALLCLL을 이용하면서 자주 묻는 질문과 답변을 모았어요." />

        <Flex direction="column" gap={4}>
          {faqItemsWithTags.length > 0 && (
            <Flex wrap gap={2} className="mb-6">
              <Chip label="전체" onClick={() => setSelectedTag(null)} selected={selectedTag === null} />
              {faqItemsWithTags.map(tag => (
                <Chip
                  label={Tags[tag as keyof typeof Tags] || tag}
                  key={'faq-chip-' + tag}
                  onClick={() => setSelectedTag(tag)}
                  selected={selectedTag === tag}
                />
              ))}
            </Flex>
          )}

          {isPending ? (
            <LoadingState title="질문을 불러오는 중이에요." className="py-16" />
          ) : isError ? (
            <EmptyState title="질문을 불러오지 못했어요." description="잠시 후 다시 시도해주세요." className="py-16" />
          ) : (
            <Accordion value={openId} onValueChange={setOpenId}>
              {filteredFaqItems?.map(item => (
                <Accordion.Item
                  key={item.id}
                  value={String(item.id)}
                  id={'faq-container-' + item.id}
                  title={item.question}
                >
                  <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                    {item.answer}
                  </ReactMarkdown>
                </Accordion.Item>
              ))}
            </Accordion>
          )}
        </Flex>
      </PageContainer>
    </>
  );
}

export default FAQ;
