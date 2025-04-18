import React from 'react';
import ReactMarkdown, {Components} from "react-markdown";
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter';
import {oneDark} from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

type MarkdownProps = {
    children: string,
    header1ClassName?: string,
    paragraph1ClassName?: string,
}
const Markdown = ({
                      children,
                      header1ClassName = "",
                      paragraph1ClassName = "",
                  }: MarkdownProps) => {
    const markdownComponents: Components = {
        h1: ({node, ...props}) => (
            <h1 className={`text-4xl font-bold mb-2 ${header1ClassName}`} {...props} />
        ),
        h2: ({node, ...props}) => (
            <h2 className="text-3xl font-semibold mt-6 mb-3" {...props} />
        ),
        h3: ({node, ...props}) => (
            <h3 className="text-2xl font-semibold mt-5 mb-2" {...props} />
        ),
        h4: ({node, ...props}) => (
            <h4 className="text-xl font-medium mt-4 mb-2" {...props} />
        ),
        h5: ({node, ...props}) => (
            <h5 className="text-lg font-medium mt-4 mb-2" {...props} />
        ),
        h6: ({node, ...props}) => (
            <h6 className="text-base font-medium mt-4 mb-2" {...props} />
        ),
        ul: ({node, ...props}) => (
            <ul className="list-disc pl-6 mb-4" {...props} />
        ),
        ol: ({node, ...props}) => (
            <ol className="list-decimal pl-6 mb-4" {...props} />
        ),
        li: ({node, ...props}) => (
            <li className="mb-1" {...props} />
        ),
        p: ({node, ...props}) => (
            <p className={`${paragraph1ClassName}`} {...props} />
        ),
        img: ({node, ...props}) => (
            <img className={"max-h-[50vh] my-4 mx-auto"} {...props}  />
        ),
        blockquote: ({node, ...props}) => (
            <blockquote className={"border-l-4 pl-4 italic text-gray-400"} {...props}  />
        ),
        table: ({node, ...props}) => (
            <div className="overflow-x-auto my-8 rounded">
                <table className="w-full border-collapse bg-[#0A0F1C]" {...props} />
            </div>
        ),
        thead: ({node, ...props}) => (
            <thead className="bg-slate-800/50 border-b border-slate-700" {...props} />
        ),
        tbody: ({node, ...props}) => (
            <tbody className="divide-y divide-slate-800" {...props} />
        ),
        tr: ({node, ...props}) => (
            <tr className="hover:bg-slate-800/30 transition-colors" {...props} />
        ),
        th: ({node, ...props}) => (
            <th className="px-6 py-4 text-left text-sm font-semibold text-white" {...props} />
        ),
        td: ({node, ...props}) => (
            <td className="px-6 py-4 text-sm text-slate-300" {...props} />
        ),
        small: ({node, ...props}) => (
            <small className="text-sm" {...props} />
        ),
        code: ({node, className, children, ...props}) => {
            const match = /language-(\w+)/.exec(className || '');
            const code = String(children).replace(/\n$/, '')
            return match ? (
                <SyntaxHighlighter
                    style={oneDark as any}
                    language={match[1]}
                    PreTag="div"
                >
                    {code}
                </SyntaxHighlighter>
            ) : (
                <code className={`${className} bg-gray-950 block p-4 border-2 border-gray-700 rounded`} {...props}>
                    {children}
                </code>
            )
        },
    };
    return (
        <ReactMarkdown components={markdownComponents}
                       remarkPlugins={[remarkGfm]}
                       rehypePlugins={[rehypeRaw]}
        >
            {children}
        </ReactMarkdown>
    );
};

export default Markdown;