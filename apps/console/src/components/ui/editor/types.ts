import type { ReactNode } from 'react';

import type { Editor } from '@tiptap/core';

import { Locale } from '../lib/i18n';

export interface EditorProps {
  locale?: Locale;
  direction?: 'ltr' | 'rtl';
  // Core props
  content?: string;
  editable?: boolean;
  autofocus?: boolean;
  placeholder?: string;
  extensions?: any[];
  onUpdate?: (_editor: { editor: Editor }) => void;
  className?: string;
  contentClassName?: string;
  children?: ReactNode;

  // Feature flags
  showBubbleMenu?: boolean;
  showFloatingMenu?: boolean;
  darkMode?: boolean;
  readOnly?: boolean;

  // Custom handlers
  uploadImage?: (_file: File) => Promise<string>;
  onSave?: () => void;
  onChange?: (_html: string) => void;
}

export interface ToolbarProps {
  editor: Editor | null;
  className?: string;
  onSave?: () => void;
}

export interface MenuBarProps {
  editor: Editor | null;
  className?: string;
}

export interface BubbleMenuProps {
  editor: Editor | null;
  className?: string;
  children: ReactNode;
}

export interface FloatingMenuProps {
  editor: Editor | null;
  className?: string;
  children: ReactNode;
}

export interface LinkButtonProps {
  editor: Editor;
  isOpen: boolean;
  onClose: () => void;
}

export interface ColorButtonProps {
  editor: Editor;
}

export interface ImageButtonProps {
  editor: Editor;
  uploadFn?: (_file: File) => Promise<string>;
}

export interface ImageAttributes {
  src: string;
  alt?: string;
  title?: string;
  width?: string;
  height?: string;
  loading?: boolean;
}

export interface TableButtonProps {
  editor: Editor;
}
