import { useEffect, useRef } from 'react';

import type { Editor } from '@tiptap/core';

export const useEditorContentChange = (
  editor: Editor | null,
  onChange: (_html: string) => void,
  debounceTime = 250
) => {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (!editor || !onChange) return () => {};

    const handleUpdate = ({ editor }: { editor: Editor }) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        onChange(editor.getHTML());
      }, debounceTime);
    };

    // Add event listener
    editor.on('update', handleUpdate);

    return () => {
      // Cleanup
      editor.off('update', handleUpdate);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [editor, onChange, debounceTime]);
};
