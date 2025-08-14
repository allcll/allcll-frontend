import { useEffect, useState } from 'react';
import remarkGfm from 'remark-gfm';
import { Helmet } from 'react-helmet';
import { useLocation } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import useFaq from '@/hooks/server/public/useFaq.ts';
import ArrowSvg from '@/assets/arrow-down-gray.svg?react';
import markdownComponents from '@/utils/markdownComponents.tsx';
import Chip from '@common/components/chip/Chip';

const Tags = {
  all: '기타',
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
  const hash = location.hash;
  const selectedIndex = hash ? parseInt(hash.replace('#', '')) : null;

  const [openIndex, setOpenIndex] = useState<number | null>(selectedIndex);
  const { data: faqItems } = useFaq();

  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const faqItemsWithTags = unique(faqItems?.map(item => item.tag) ?? []);

  const filteredFaqItems = selectedTag ? faqItems?.filter(item => item.tag === selectedTag) : faqItems;

  const toggleAnswer = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  useEffect(() => {
    if (location.hash) {
      const selectedIndex = parseInt(location.hash.replace('#', ''));

      setTimeout(() => {
        const targetElement = document.getElementById('faq-container-' + selectedIndex);
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: 'smooth' });
          setOpenIndex(selectedIndex);
        }
      }, 300);
    }
  }, [location.hash]);

  const selectTag = (tag: string | null) => {
    setSelectedTag(prev => {
      if (prev === tag) {
        return null; // Deselect if the same tag is clicked
      }
      return tag;
    });
  };

  return (
    <>
      <Helmet>
        <title>ALLCLL | 자주 묻는 질문</title>
      </Helmet>

      <div className="mx-auto max-w-7xl px-4 md:px-16 py-24">
        <h1 className="text-3xl font-bold mb-6">자주 묻는 질문</h1>

        <div className="flex flex-wrap gap-2 mb-6">
          {faqItemsWithTags.length > 0 &&
            faqItemsWithTags.map((item, index) => (
              <Chip
                label={Tags[item as keyof typeof Tags] || item}
                key={'faq-chip-' + index}
                onClick={() => selectTag(item)}
                selected={selectedTag === item}
              />
            ))}
        </div>

        {filteredFaqItems &&
          filteredFaqItems.map(item => (
            <FaqComponent
              key={item.id}
              item={item}
              index={item.id}
              isOpen={openIndex === item.id}
              toggleAnswer={toggleAnswer}
            />
          ))}
      </div>
    </>
  );
}

interface IFaqComponent {
  item: { question: string; answer: string };
  index: number;
  isOpen: boolean;
  toggleAnswer: (index: number) => void;
}

function FaqComponent({ item, index, isOpen, toggleAnswer }: IFaqComponent) {
  return (
    <div key={index} id={'faq-container-' + index} className="mb-4 rounded-md bg-white shadow-sm">
      <button
        onClick={() => toggleAnswer(index)}
        className={
          'flex items-center justify-between rounded-md w-full text-left font-semibold text-md p-4 hover:bg-blue-50 focus:outline-none cursor-pointer ' +
          (isOpen ? 'text-blue-600 font-bold' : '')
        }
      >
        {item.question}

        <ArrowSvg className={'w-4 h-4 transform transition-transform duration-150 ' + (isOpen ? 'rotate-180' : '')} />
      </button>
      {isOpen && (
        <div className="p-4 border-t border-gray-200 text-sm">
          <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
            {item.answer}
          </ReactMarkdown>
        </div>
      )}
    </div>
  );
}

export default FAQ;
