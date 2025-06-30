import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ReactNode } from 'react';

interface MarkdownComponents {
  h1: React.ComponentType<{ children?: ReactNode }>;
  h2: React.ComponentType<{ children?: ReactNode }>;
  p: React.ComponentType<{ children?: ReactNode }>;
  ul: React.ComponentType<{ children?: ReactNode }>;
  ol: React.ComponentType<{ children?: ReactNode }>;
  li: React.ComponentType<{ children?: ReactNode }>;
  strong: React.ComponentType<{ children?: ReactNode }>;
}

export const MarkdownRenderer = ({ content }: { content: string }) => {
  const components: MarkdownComponents = {
    h1: ({ children }) => <h1 className="text-2xl font-bold my-4 text-amber-800 dark:text-amber-200">{children}</h1>,
    h2: ({ children }) => <h2 className="text-xl font-semibold my-3 text-amber-700 dark:text-amber-300">{children}</h2>,
    p: ({ children }) => <p className="mb-4 text-gray-700 dark:text-gray-300 leading-relaxed">{children}</p>,
    ul: ({ children }) => <ul className="list-disc pl-5 mb-4 space-y-1">{children}</ul>,
    ol: ({ children }) => <ol className="list-decimal pl-5 mb-4 space-y-1">{children}</ol>,
    li: ({ children }) => <li className="text-gray-700 dark:text-gray-300">{children}</li>,
    strong: ({ children }) => <strong className="font-semibold text-amber-600 dark:text-amber-400">{children}</strong>
  };

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={components}
    >
      {content}
    </ReactMarkdown>
  );
};