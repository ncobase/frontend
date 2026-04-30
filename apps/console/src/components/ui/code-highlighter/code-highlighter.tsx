import React from 'react';

import { PrismLight as SyntaxHighlighterOriginal } from 'react-syntax-highlighter';
import type { SyntaxHighlighterProps } from 'react-syntax-highlighter';
import bash from 'react-syntax-highlighter/dist/esm/languages/prism/bash';
import css from 'react-syntax-highlighter/dist/esm/languages/prism/css';
import javascript from 'react-syntax-highlighter/dist/esm/languages/prism/javascript';
import json from 'react-syntax-highlighter/dist/esm/languages/prism/json';
import markdown from 'react-syntax-highlighter/dist/esm/languages/prism/markdown';
import sql from 'react-syntax-highlighter/dist/esm/languages/prism/sql';
import typescript from 'react-syntax-highlighter/dist/esm/languages/prism/typescript';
import yaml from 'react-syntax-highlighter/dist/esm/languages/prism/yaml';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

const SyntaxHighlighter: React.FC<SyntaxHighlighterProps> = SyntaxHighlighterOriginal as any;

SyntaxHighlighterOriginal.registerLanguage('bash', bash);
SyntaxHighlighterOriginal.registerLanguage('css', css);
SyntaxHighlighterOriginal.registerLanguage('javascript', javascript);
SyntaxHighlighterOriginal.registerLanguage('json', json);
SyntaxHighlighterOriginal.registerLanguage('markdown', markdown);
SyntaxHighlighterOriginal.registerLanguage('sql', sql);
SyntaxHighlighterOriginal.registerLanguage('typescript', typescript);
SyntaxHighlighterOriginal.registerLanguage('yaml', yaml);

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
