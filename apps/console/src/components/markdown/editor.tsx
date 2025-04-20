import React, { useState, useRef, useEffect } from 'react';

import { Tabs, Button, Icons, TabsList, TabsTrigger, TabsContent } from '@ncobase/react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import remarkGfm from 'remark-gfm';

interface MarkdownEditorProps {
  value?: string;
  // eslint-disable-next-line no-unused-vars
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  minHeight?: string;
}

export const MarkdownEditor: React.FC<MarkdownEditorProps> = ({
  value = '',
  onChange,
  placeholder = 'Write your content here...',
  className = '',
  minHeight = '300px'
}) => {
  const [content, setContent] = useState(value);
  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setContent(value);
  }, [value]);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setContent(newValue);
    onChange?.(newValue);
  };

  const insertMarkdown = (prefix: string, suffix: string = '') => {
    if (!textareaRef.current) return;

    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);

    const beforeText = textarea.value.substring(0, start);
    const afterText = textarea.value.substring(end);

    const newText = `${beforeText}${prefix}${selectedText}${suffix}${afterText}`;

    // Update value and save cursor position
    setContent(newText);
    onChange?.(newText);

    // Set focus back to textarea and position cursor after insertion
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + prefix.length + selectedText.length + suffix.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  const toolbar = (
    <div className='flex flex-wrap items-center gap-1 p-2 border-b'>
      <Button
        variant='unstyle'
        size='sm'
        title='Bold'
        onClick={() => insertMarkdown('**', '**')}
        className='p-1 hover:bg-gray-100 rounded-sm'
      >
        <Icons name='IconBold' size={16} />
      </Button>
      <Button
        variant='unstyle'
        size='sm'
        title='Italic'
        onClick={() => insertMarkdown('*', '*')}
        className='p-1 hover:bg-gray-100 rounded-sm'
      >
        <Icons name='IconItalic' size={16} />
      </Button>
      <Button
        variant='unstyle'
        size='sm'
        title='Heading'
        onClick={() => insertMarkdown('## ')}
        className='p-1 hover:bg-gray-100 rounded-sm'
      >
        <Icons name='IconHeading' size={16} />
      </Button>
      <Button
        variant='unstyle'
        size='sm'
        title='Link'
        onClick={() => insertMarkdown('[', '](url)')}
        className='p-1 hover:bg-gray-100 rounded-sm'
      >
        <Icons name='IconLink' size={16} />
      </Button>
      <Button
        variant='unstyle'
        size='sm'
        title='Image'
        onClick={() => insertMarkdown('![alt text](', ')')}
        className='p-1 hover:bg-gray-100 rounded-sm'
      >
        <Icons name='IconPhoto' size={16} />
      </Button>
      <Button
        variant='unstyle'
        size='sm'
        title='Bulleted List'
        onClick={() => insertMarkdown('- ')}
        className='p-1 hover:bg-gray-100 rounded-sm'
      >
        <Icons name='IconList' size={16} />
      </Button>
      <Button
        variant='unstyle'
        size='sm'
        title='Numbered List'
        onClick={() => insertMarkdown('1. ')}
        className='p-1 hover:bg-gray-100 rounded-sm'
      >
        <Icons name='IconListNumbers' size={16} />
      </Button>
      <Button
        variant='unstyle'
        size='sm'
        title='Code'
        onClick={() => insertMarkdown('`', '`')}
        className='p-1 hover:bg-gray-100 rounded-sm'
      >
        <Icons name='IconCode' size={16} />
      </Button>
      <Button
        variant='unstyle'
        size='sm'
        title='Code Block'
        onClick={() => insertMarkdown('```\n', '\n```')}
        className='p-1 hover:bg-gray-100 rounded-sm'
      >
        <Icons name='IconBraces' size={16} />
      </Button>
      <Button
        variant='unstyle'
        size='sm'
        title='Blockquote'
        onClick={() => insertMarkdown('> ')}
        className='p-1 hover:bg-gray-100 rounded-sm'
      >
        <Icons name='IconQuote' size={16} />
      </Button>
      <Button
        variant='unstyle'
        size='sm'
        title='Horizontal Rule'
        onClick={() => insertMarkdown('\n---\n')}
        className='p-1 hover:bg-gray-100 rounded-sm'
      >
        <Icons name='IconSeparator' size={16} />
      </Button>
    </div>
  );

  return (
    <div className={`border rounded-md overflow-hidden ${className}`}>
      {toolbar}

      <Tabs
        defaultValue='write'
        onValueChange={value => setActiveTab(value as 'write' | 'preview')}
      >
        <TabsList className='px-2 border-b bg-gray-50'>
          <TabsTrigger value='write' className='px-4 py-2'>
            <Icons name='IconEdit' size={14} className='mr-1' />
            Write
          </TabsTrigger>
          <TabsTrigger value='preview' className='px-4 py-2'>
            <Icons name='IconEye' size={14} className='mr-1' />
            Preview
          </TabsTrigger>
        </TabsList>

        <TabsContent value='write' className='p-0'>
          <textarea
            ref={textareaRef}
            value={content}
            onChange={handleContentChange}
            placeholder={placeholder}
            className='w-full p-4 focus:outline-hidden resize-y'
            style={{ minHeight }}
          />
        </TabsContent>

        <TabsContent value='preview' className='p-4 prose max-w-none' style={{ minHeight }}>
          {content ? (
            <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw, rehypeSanitize]}>
              {content}
            </ReactMarkdown>
          ) : (
            <div className='text-gray-400'>{placeholder}</div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
