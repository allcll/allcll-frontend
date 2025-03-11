import { useState } from 'react';
import remarkGfm from "remark-gfm";
import ReactMarkdown from "react-markdown";
import useFaq from '@/hooks/server/public/useFaq.ts';
import ArrowSvg from "@/assets/arrow-down-gray.svg?react";
import markdownComponents from '@/utils/markdownComponents.tsx';

function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const {data: faqItems} = useFaq();

  const toggleAnswer = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 md:px-16 py-24">
      <h1 className="text-3xl font-bold mb-6">자주 묻는 질문</h1>
      {faqItems && faqItems.map((item, index) => (
        <FaqComponent key={index} item={item} index={index} isOpen={openIndex === index} toggleAnswer={toggleAnswer}/>
      ))}
    </div>
  );
}

interface IFaqComponent {
  item: { question: string, answer: string };
  index: number;
  isOpen: boolean;
  toggleAnswer: (index: number) => void;
}

function FaqComponent({ item, index, isOpen, toggleAnswer }: IFaqComponent) {
  return (
    <div key={index} className="mb-4 rounded-md bg-white shadow-sm">
      <button
        onClick={() => toggleAnswer(index)}
        className="flex items-center justify-between rounded-md w-full text-left font-semibold text-sm p-4 hover:bg-gray-50 focus:outline-none cursor-pointer"
      >
        {item.question}

        <ArrowSvg className={'w-4 h-4 transform transition-transform duration-150 ' + (isOpen ? 'rotate-180' : '')}/>
      </button>
      {isOpen && (
        <div className="p-4 border-t border-gray-200 text-sm">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={markdownComponents}>
            {item.answer}
          </ReactMarkdown>
        </div>
      )}
    </div>
  );
}

export default FAQ;