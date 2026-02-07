import { JSX } from 'react';

const markdownComponents = {
  h1: (props: JSX.IntrinsicElements['h1']) => (
    <h1 {...props} className="text-2xl md:text-3xl font-bold mb-4 tracking-wide" />
  ),
  h2: (props: JSX.IntrinsicElements['h2']) => <h2 {...props} className="text-lg font-bold mt-8 mb-4 tracking-wide" />,
  h3: (props: JSX.IntrinsicElements['h3']) => <h3 {...props} className="text-base font-bold mt-6 mb-4 tracking-wide" />,
  a: (props: JSX.IntrinsicElements['a']) => <a {...props} className="text-blue-500 underline" />,
  p: (props: JSX.IntrinsicElements['p']) => (
    <p {...props} className="mb-5 md:text-md text-sm text-gray-700 leading-loose tracking-normal" />
  ),
  ul: (props: JSX.IntrinsicElements['ul']) => (
    <ul
      {...props}
      className="list-disc list-inside space-y-3 mb-6 ml-2 md:text-md text-sm text-gray-700 tracking-normal"
    />
  ),
  ol: (props: JSX.IntrinsicElements['ol']) => (
    <ol
      {...props}
      className="list-decimal list-inside space-y-3 mb-6 ml-2 md:text-md text-sm text-gray-700 tracking-normal"
    />
  ),
  li: (props: JSX.IntrinsicElements['li']) => <li {...props} className="leading-loose tracking-normal" />,
  blockquote: (props: JSX.IntrinsicElements['blockquote']) => (
    <blockquote
      {...props}
      className="bg-gray-50 border-l-4 border-gray-300 rounded md:text-md text-sm text-gray-600 tracking-normal"
    />
  ),
  strong: (props: JSX.IntrinsicElements['strong']) => <strong {...props} className="font-semibold text-gray-800" />,
  hr: () => <hr className="my-8 border-gray-200" />,
  table: (props: JSX.IntrinsicElements['table']) => (
    <div className="overflow-x-auto mb-6">
      <table {...props} className="w-full border-collapse md:text-md text-sm" />
    </div>
  ),
  thead: (props: JSX.IntrinsicElements['thead']) => <thead {...props} className="bg-gray-50" />,
  th: (props: JSX.IntrinsicElements['th']) => (
    <th {...props} className="border border-gray-200 px-3 py-2 text-left font-semibold text-gray-800 tracking-normal" />
  ),
  td: (props: JSX.IntrinsicElements['td']) => (
    <td {...props} className="border border-gray-200 px-3 py-2 tracking-normal" />
  ),
};

export default markdownComponents;
