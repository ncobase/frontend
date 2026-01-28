import { useEffect, useRef } from 'react';

import type { Editor } from '@tiptap/core';

export const useEditorAutosave = (
  editor: Editor | null,
  saveFunction: (_content: string) => void,
  interval = 30000, // Default: 30 seconds
  enabled = true
) => {
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastContentRef = useRef<string>('');

  useEffect(() => {
    if (!editor || !saveFunction || !enabled) return () => {};

    // Initial save
    lastContentRef.current = editor.getHTML();

    const performSave = () => {
      const currentContent = editor.getHTML();

      // Only save if content has changed
      if (currentContent !== lastContentRef.current) {
        saveFunction(currentContent);
        lastContentRef.current = currentContent;
      }
    };

    // Set up interval
    intervalRef.current = setInterval(performSave, interval);

    // Also save on editor blur
    const handleBlur = () => {
      performSave();
    };

    editor.on('blur', handleBlur);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      editor.off('blur', handleBlur);
    };
  }, [editor, saveFunction, interval, enabled]);

  // Manually trigger a save
  const triggerSave = () => {
    if (editor && saveFunction) {
      saveFunction(editor.getHTML());
      lastContentRef.current = editor.getHTML();
    }
  };

  return { triggerSave };
};
