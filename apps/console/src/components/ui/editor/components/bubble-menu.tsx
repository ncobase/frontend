import React from 'react';

import { BubbleMenu as TiptapBubbleMenu } from '@tiptap/react/menus';

import { type BubbleMenuProps } from '../types';

export const BubbleMenu: React.FC<BubbleMenuProps> = ({ editor, className = '', children }) => {
  if (!editor) {
    return null;
  }

  const classes = `nco-editor-bubble-menu ${className}`;

  return (
    <TiptapBubbleMenu editor={editor} className={classes}>
      {children}
    </TiptapBubbleMenu>
  );
};
