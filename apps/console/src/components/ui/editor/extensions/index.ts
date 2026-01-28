import { Extension } from '@tiptap/core';
import CharacterCount from '@tiptap/extension-character-count';
import Color from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import TableRow from '@tiptap/extension-table-row';
import TaskItem from '@tiptap/extension-task-item';
import TaskList from '@tiptap/extension-task-list';
import TextAlign from '@tiptap/extension-text-align';
import { TextStyle } from '@tiptap/extension-text-style';

import { CodeHighlight } from './code-highlight';
import { MentionExtension } from './mention';
import { CustomTable } from './table';

// Default extensions for editor
export const defaultExtensions = [
  // Core extensions
  Link.configure({
    openOnClick: false,
    validate: (href: string) => /^https?:\/\//.test(href),
    HTMLAttributes: {
      rel: 'noopener noreferrer'
    }
  }),

  // Image handling
  Image.configure({
    inline: true,
    allowBase64: true,
    HTMLAttributes: {
      class: 'rounded-md max-w-full'
    }
  }),

  // Table handling
  CustomTable.configure({
    resizable: true
  }),
  TableRow,
  TableCell,
  TableHeader,

  // Code blocks with syntax highlighting
  CodeHighlight.configure({
    defaultLanguage: 'javascript'
  }),

  // Text formatting
  Highlight.configure({
    multicolor: true
  }),

  // Text alignment
  TextAlign.configure({
    types: ['heading', 'paragraph'],
    alignments: ['left', 'center', 'right', 'justify']
  }),

  // Text styling
  TextStyle,
  Color,

  // Task lists
  TaskList,
  TaskItem.configure({
    nested: true
  }),

  // Mention support
  MentionExtension,

  // Utilities
  CharacterCount.configure({
    limit: 10000
  })
];

// Create a custom extension
export const CustomExtension = Extension.create({
  name: 'custom'
  // Add your custom extension logic here
});

// Export all extensions
export * from './image';
export * from './table';
export * from './code-highlight';
export * from './mention';
