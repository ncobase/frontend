import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { ReactNodeViewRenderer } from '@tiptap/react';
import css from 'highlight.js/lib/languages/css';
import javascript from 'highlight.js/lib/languages/javascript';
import json from 'highlight.js/lib/languages/json';
import markdown from 'highlight.js/lib/languages/markdown';
import python from 'highlight.js/lib/languages/python';
import sql from 'highlight.js/lib/languages/sql';
import typescript from 'highlight.js/lib/languages/typescript';
import html from 'highlight.js/lib/languages/xml';
import { common, createLowlight } from 'lowlight';

import { CodeBlock } from './components/code-block';

// Create a new lowlight instance
const lowlight = createLowlight(common);

// Register additional languages
lowlight.register('javascript', javascript);
lowlight.register('typescript', typescript);
lowlight.register('css', css);
lowlight.register('html', html);
lowlight.register('json', json);
lowlight.register('markdown', markdown);
lowlight.register('python', python);
lowlight.register('sql', sql);

export interface CodeHighlightOptions {
  defaultLanguage?: string;
  lowlight?: any;
}

export const CodeHighlight = CodeBlockLowlight.extend<CodeHighlightOptions>({
  addOptions() {
    return {
      ...this.parent?.(),
      lowlight,
      defaultLanguage: 'javascript',
      HTMLAttributes: {
        class: 'hljs code-block'
      }
    };
  },

  addNodeView() {
    // This is the correct way to use ReactNodeViewRenderer
    return ReactNodeViewRenderer(CodeBlock);
  }
});
