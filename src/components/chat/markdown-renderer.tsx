'use client'

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import rehypeRaw from 'rehype-raw'
// Image component removed to simplify markdown rendering
import { cn } from '@/lib/utils'

// Import highlight.js styles
import 'highlight.js/styles/github.css'

interface MarkdownRendererProps {
  content: string
  className?: string
}

export function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
  return (
    <div className={cn('markdown-content', className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight, rehypeRaw]}
        components={{
          // Headings
          h1: ({ children, ...props }) => (
            <h1 className="text-2xl font-bold text-gray-900 mt-6 mb-4 first:mt-0" {...props}>
              {children}
            </h1>
          ),
          h2: ({ children, ...props }) => (
            <h2 className="text-xl font-bold text-gray-900 mt-5 mb-3 first:mt-0" {...props}>
              {children}
            </h2>
          ),
          h3: ({ children, ...props }) => (
            <h3 className="text-lg font-semibold text-gray-900 mt-4 mb-2 first:mt-0" {...props}>
              {children}
            </h3>
          ),
          h4: ({ children, ...props }) => (
            <h4 className="text-base font-semibold text-gray-900 mt-3 mb-2 first:mt-0" {...props}>
              {children}
            </h4>
          ),
          h5: ({ children, ...props }) => (
            <h5 className="text-sm font-semibold text-gray-900 mt-3 mb-1 first:mt-0" {...props}>
              {children}
            </h5>
          ),
          h6: ({ children, ...props }) => (
            <h6 className="text-sm font-medium text-gray-900 mt-3 mb-1 first:mt-0" {...props}>
              {children}
            </h6>
          ),
          
          // Paragraphs
          p: ({ children, ...props }) => (
            <p className="text-gray-900 leading-7 mb-4 last:mb-0" {...props}>
              {children}
            </p>
          ),
          
          // Lists
          ul: ({ children, ...props }) => (
            <ul className="list-disc pl-6 mb-4 space-y-1" {...props}>
              {children}
            </ul>
          ),
          ol: ({ children, ...props }) => (
            <ol className="list-decimal pl-6 mb-4 space-y-1" {...props}>
              {children}
            </ol>
          ),
          li: ({ children, ...props }) => (
            <li className="text-gray-900 leading-6" {...props}>
              {children}
            </li>
          ),
          
          // Links
          a: ({ children, href, ...props }) => (
            <a 
              href={href} 
              className="text-blue-600 hover:text-blue-800 underline" 
              target="_blank" 
              rel="noopener noreferrer"
              {...props}
            >
              {children}
            </a>
          ),
          
          // Code blocks
          pre: ({ children, ...props }) => (
            <pre className="bg-gray-900 text-gray-100 rounded-lg p-4 mb-4 overflow-x-auto text-sm" {...props}>
              {children}
            </pre>
          ),
          code: ({ children, className, ...props }) => {
            // Check if this is an inline code element
            const isInline = !className?.includes('language-')
            
            if (isInline) {
              return (
                <code 
                  className="bg-gray-100 text-gray-900 px-1.5 py-0.5 rounded text-sm font-mono" 
                  {...props}
                >
                  {children}
                </code>
              )
            }
            return (
              <code className={cn('font-mono text-sm', className)} {...props}>
                {children}
              </code>
            )
          },
          
          // Blockquotes
          blockquote: ({ children, ...props }) => (
            <blockquote className="border-l-4 border-gray-300 pl-4 italic text-gray-700 mb-4" {...props}>
              {children}
            </blockquote>
          ),
          
          // Tables
          table: ({ children, ...props }) => (
            <div className="overflow-x-auto mb-4">
              <table className="min-w-full border border-gray-300 rounded-lg" {...props}>
                {children}
              </table>
            </div>
          ),
          thead: ({ children, ...props }) => (
            <thead className="bg-gray-50" {...props}>
              {children}
            </thead>
          ),
          tbody: ({ children, ...props }) => (
            <tbody className="divide-y divide-gray-200" {...props}>
              {children}
            </tbody>
          ),
          tr: ({ children, ...props }) => (
            <tr className="hover:bg-gray-50" {...props}>
              {children}
            </tr>
          ),
          th: ({ children, ...props }) => (
            <th className="px-4 py-2 text-left font-semibold text-gray-900 border-b border-gray-300" {...props}>
              {children}
            </th>
          ),
          td: ({ children, ...props }) => (
            <td className="px-4 py-2 text-gray-900 border-b border-gray-200" {...props}>
              {children}
            </td>
          ),
          
          // Horizontal rule
          hr: ({ ...props }) => (
            <hr className="border-t border-gray-300 my-6" {...props} />
          ),
          
          // Strong and emphasis
          strong: ({ children, ...props }) => (
            <strong className="font-bold text-gray-900" {...props}>
              {children}
            </strong>
          ),
          em: ({ children, ...props }) => (
            <em className="italic text-gray-900" {...props}>
              {children}
            </em>
          ),
          
          // Images
          img: ({ src, alt, ...props }) => {
            if (!src) return null
            return (
              // eslint-disable-next-line @next/next/no-img-element
              <img 
                src={typeof src === 'string' ? src : ''}
                alt={alt || 'Image'}
                className="max-w-full h-auto rounded-lg mb-4" 
                {...props} 
              />
            )
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
