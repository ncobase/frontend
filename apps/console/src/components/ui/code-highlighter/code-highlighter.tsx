import React from 'react';

import {
  PrismAsync as SyntaxHighlighterOriginal,
  SyntaxHighlighterProps
} from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';

const SyntaxHighlighter: React.FC<SyntaxHighlighterProps> = SyntaxHighlighterOriginal as any;

interface CodeHighlighterProps extends Omit<SyntaxHighlighterProps, 'children'> {
  children: string;
  language?: string;
}

export const CodeHighlighter: React.FC<CodeHighlighterProps> = ({
  children,
  language = 'text',
  ...rest
}) => {
  return (
    <SyntaxHighlighter showLineNumbers style={atomDark} language={language} wrapLongLines {...rest}>
      {typeof children === 'string' ? children.trim() : ''}
    </SyntaxHighlighter>
  );
};
