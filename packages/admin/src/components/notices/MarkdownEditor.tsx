import { useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import BoldSvg from '@/assets/bold.svg?react';
import ItalicSvg from '@/assets/italic.svg?react';
import CodeSvg from '@/assets/code.svg?react';
import LinkSvg from '@/assets/link.svg?react';
import ListSvg from '@/assets/list.svg?react';
import ListOrderedSvg from '@/assets/list-ordered.svg?react';
import QuoteSvg from '@/assets/quote.svg?react';
import { Label, Flex } from '@allcll/allcll-ui';
import ToolbarButton from '@/components/notices/ToolbarButton';

const MAX_LENGTH = 10000;
const WARN_LENGTH = 9000;

type Tab = 'write' | 'preview';

interface Props {
  content: string;
  onChange: (value: string) => void;
}

function MarkdownEditor({ content, onChange }: Props) {
  const [tab, setTab] = useState<Tab>('write');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleContentChange = (v: string) => {
    if (v.length <= MAX_LENGTH) onChange(v);
  };

  const insertMarkdown = (before: string, after = '', placeholder = '', linePrefix = false) => {
    const ta = textareaRef.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;

    if (linePrefix) {
      const lineStart = content.lastIndexOf('\n', start - 1) + 1;
      const newContent = content.slice(0, lineStart) + before + content.slice(lineStart);
      handleContentChange(newContent);
      requestAnimationFrame(() => {
        ta.focus();
        ta.setSelectionRange(start + before.length, end + before.length);
      });
      return;
    }

    const selected = content.slice(start, end) || placeholder;
    const newContent = content.slice(0, start) + before + selected + after + content.slice(end);
    handleContentChange(newContent);
    requestAnimationFrame(() => {
      ta.focus();
      ta.setSelectionRange(start + before.length, start + before.length + selected.length);
    });
  };

  const charCount = content.length;
  const charCountClass =
    charCount > MAX_LENGTH
      ? 'text-red-600 font-semibold'
      : charCount > WARN_LENGTH
        ? 'text-amber-600'
        : 'text-gray-400';

  return (
    <Flex direction="flex-col" gap="gap-1.5">
      <Label>내용</Label>

      <div className="flex flex-col border border-gray-300 rounded-lg overflow-hidden">
        {/* 탭 헤더 */}
        <div className="flex border-b border-gray-200 bg-gray-50">
          <button
            type="button"
            className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px ${
              tab === 'write'
                ? 'border-blue-500 text-blue-500 bg-white'
                : 'border-transparent text-gray-500 hover:text-blue-500'
            }`}
            onClick={() => setTab('write')}
          >
            Write
          </button>
          <button
            type="button"
            className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px ${
              tab === 'preview'
                ? 'border-blue-500 text-blue-500 bg-white'
                : 'border-transparent text-gray-500 hover:text-blue-500'
            }`}
            onClick={() => setTab('preview')}
          >
            Preview
          </button>
        </div>

        {/* Write 탭 */}
        {tab === 'write' && (
          <>
            {/* 툴바 */}
            <div className="flex items-center gap-0.5 px-2 py-1.5 bg-gray-50 border-b border-gray-200">
              <ToolbarButton title="굵게 (Bold)" onClick={() => insertMarkdown('**', '**')}>
                <BoldSvg className="w-4 h-4" />
              </ToolbarButton>
              <ToolbarButton title="기울임 (Italic)" onClick={() => insertMarkdown('*', '*')}>
                <ItalicSvg className="w-4 h-4" />
              </ToolbarButton>
              <div className="w-px h-4 bg-gray-300 mx-1" />
              <ToolbarButton title="코드 (Code)" onClick={() => insertMarkdown('`', '`')}>
                <CodeSvg className="w-4 h-4" />
              </ToolbarButton>
              <ToolbarButton title="링크 (Link)" onClick={() => insertMarkdown('[', '](url)')}>
                <LinkSvg className="w-4 h-4" />
              </ToolbarButton>
              <div className="w-px h-4 bg-gray-300 mx-1" />
              <ToolbarButton title="인용" onClick={() => insertMarkdown('> ', '', '', true)}>
                <QuoteSvg className="w-4 h-4" />
              </ToolbarButton>
              <ToolbarButton title="목록" onClick={() => insertMarkdown('- ', '', '', true)}>
                <ListSvg className="w-4 h-4" />
              </ToolbarButton>
              <ToolbarButton title="번호 목록" onClick={() => insertMarkdown('1. ', '', '', true)}>
                <ListOrderedSvg className="w-4 h-4" />
              </ToolbarButton>
            </div>
            <textarea
              ref={textareaRef}
              value={content}
              onChange={e => handleContentChange(e.target.value)}
              onKeyDown={e => {
                const ta = e.currentTarget;
                const start = ta.selectionStart;
                const end = ta.selectionEnd;

                if (e.key === 'Tab') {
                  e.preventDefault();
                  const newContent = content.slice(0, start) + '  ' + content.slice(end);
                  handleContentChange(newContent);
                  requestAnimationFrame(() => {
                    ta.setSelectionRange(start + 2, start + 2);
                  });
                }

                if (e.key === 'Enter') {
                  const lineStart = content.lastIndexOf('\n', start - 1) + 1;
                  const currentLine = content.slice(lineStart, start);

                  const unorderedMatch = currentLine.match(/^(\s*)-\s/);
                  const orderedMatch = currentLine.match(/^(\s*)(\d+)\.\s/);

                  if (unorderedMatch) {
                    const indent = unorderedMatch[1];
                    const isEmptyItem = currentLine.trim() === '-';
                    if (isEmptyItem) {
                      e.preventDefault();
                      const newContent = content.slice(0, lineStart) + content.slice(start);
                      handleContentChange(newContent);
                      requestAnimationFrame(() => {
                        ta.setSelectionRange(lineStart, lineStart);
                      });
                    } else {
                      e.preventDefault();
                      const insertion = `\n${indent}- `;
                      const newContent = content.slice(0, start) + insertion + content.slice(end);
                      handleContentChange(newContent);
                      requestAnimationFrame(() => {
                        ta.setSelectionRange(start + insertion.length, start + insertion.length);
                      });
                    }
                  } else if (orderedMatch) {
                    const indent = orderedMatch[1];
                    const num = parseInt(orderedMatch[2], 10);
                    const isEmptyItem = currentLine.trim() === `${num}.`;
                    if (isEmptyItem) {
                      e.preventDefault();
                      const newContent = content.slice(0, lineStart) + content.slice(start);
                      handleContentChange(newContent);
                      requestAnimationFrame(() => {
                        ta.setSelectionRange(lineStart, lineStart);
                      });
                    } else {
                      e.preventDefault();
                      const insertion = `\n${indent}${num + 1}. `;
                      const newContent = content.slice(0, start) + insertion + content.slice(end);
                      handleContentChange(newContent);
                      requestAnimationFrame(() => {
                        ta.setSelectionRange(start + insertion.length, start + insertion.length);
                      });
                    }
                  }
                }
              }}
              placeholder="내용을 입력하세요..."
              className="w-full px-4 py-3 text-sm text-gray-900 placeholder-gray-400 resize-none focus:outline-none leading-relaxed min-h-[480px]"
            />
          </>
        )}

        {/* Preview 탭 */}
        {tab === 'preview' && (
          <div className="min-h-[480px] px-5 py-4">
            {content.trim() ? (
              <div className="prose max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>{content}</ReactMarkdown>
              </div>
            ) : (
              <p className="text-sm text-gray-400 italic">미리보기할 내용이 없습니다.</p>
            )}
          </div>
        )}
      </div>

      <Flex align="items-center" justify="justify-end" className="text-xs">
        <span className={charCountClass}>
          {charCount.toLocaleString()} / {MAX_LENGTH.toLocaleString()}자
        </span>
      </Flex>
    </Flex>
  );
}

export default MarkdownEditor;
