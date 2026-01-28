import { useEffect } from 'react';

import type { Editor } from '@tiptap/core';

interface KeyboardShortcut {
  key: string;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  handler: () => void;
}

export const useEditorKeyboardShortcuts = (
  editor: Editor | null,
  shortcuts: KeyboardShortcut[],
  enabled = true
) => {
  useEffect(() => {
    if (!editor || !enabled) return () => {};

    const handleKeyDown = (event: KeyboardEvent) => {
      for (const shortcut of shortcuts) {
        if (
          event.key === shortcut.key &&
          (shortcut.ctrlKey === undefined || event.ctrlKey === shortcut.ctrlKey) &&
          (shortcut.shiftKey === undefined || event.shiftKey === shortcut.shiftKey) &&
          (shortcut.altKey === undefined || event.altKey === shortcut.altKey)
        ) {
          event.preventDefault();
          shortcut.handler();
          return;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [editor, shortcuts, enabled]);
};
