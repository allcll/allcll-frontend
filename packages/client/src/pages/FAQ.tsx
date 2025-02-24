import { useState } from 'react';
import useFaq from '@/hooks/server/public/useFaq.ts';

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
        <div key={index} className="mb-4 bg-white border border-gray-200 rounded-md">
          <button
            onClick={() => toggleAnswer(index)}
            className="w-full text-left font-semibold text-lg bg-gray-100 p-4 rounded-md focus:outline-none cursor-pointer"
          >
            {item.question}
          </button>
          {openIndex === index && (
            <div className="mt-2 p-4">
              {item.answer}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default FAQ;