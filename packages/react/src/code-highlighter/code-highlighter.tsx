import React from 'react';

import { PrismAsync as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface IProps extends React.ComponentProps<typeof SyntaxHighlighter> {}

export const CodeHighlighter: React.FC<IProps> = ({ children, ...rest }) => {
  return (
    <SyntaxHighlighter showLineNumbers style={atomDark} {...rest} language='javascript'>
      {children}
    </SyntaxHighlighter>
  );
};
