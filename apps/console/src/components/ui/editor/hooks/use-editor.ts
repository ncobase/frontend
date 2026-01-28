import { useCallback, useRef, useEffect } from 'react';

import Placeholder from '@tiptap/extension-placeholder';
import { useEditor as useTiptapEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

import { defaultExtensions } from '../extensions';
import type { EditorProps } from '../types';

import { debounce } from '@/components/ui/lib/utils';

export const useEditor = ({
  content = '<p></p>',
  editable = true,
  autofocus = false,
  placeholder = 'Start typing...',
  extensions = [],
  onUpdate,
  onChange,
  ...rest
}: EditorProps) => {
  // Use ref instead of state to avoid unnecessary re-renders
  const htmlRef = useRef<string>(content);
  const editorRef = useRef<any>(null);

  // Create debounced handlers to improve performance
  const debouncedOnChange = useRef(
    debounce((html: string) => {
      if (onChange) {
        onChange(html);
      }
    }, 250)
  ).current;

  const debouncedOnUpdate = useRef(
    debounce((editor: any) => {
      if (onUpdate) {
        onUpdate({ editor });
      }
    }, 250)
  ).current;

  // Clear debounced functions on unmount
  useEffect(() => {
    return () => {
      debouncedOnChange.cancel();
      debouncedOnUpdate.cancel();
    };
  }, [debouncedOnChange, debouncedOnUpdate]);

  // Handle editor updates
  const handleUpdate = useCallback(
    ({ editor }: { editor: any }) => {
      const newHtml = editor.getHTML();

      // Only update if content actually changed
      if (htmlRef.current !== newHtml) {
        htmlRef.current = newHtml;

        // Store the editor instance for external access
        editorRef.current = editor;

        // Use the debounced callbacks for better performance
        debouncedOnUpdate(editor);
        debouncedOnChange(newHtml);
      }
    },
    [debouncedOnUpdate, debouncedOnChange]
  );

  // Create the editor instance
  const editor = useTiptapEditor({
    extensions: [
      StarterKit.configure({
        // Configure StarterKit options for better performance
        history: {
          depth: 100, // Limit history depth for better memory usage
          newGroupDelay: 500 // Group history items that occur within 500ms
        }
      }),
      Placeholder.configure({
        placeholder,
        // Only show placeholder when the node is empty
        showOnlyWhenEditable: true,
        showOnlyCurrent: true
      }),
      ...defaultExtensions,
      ...extensions
    ],
    content,
    editable,
    autofocus,
    onUpdate: handleUpdate,
    // Improve update performance
    editorProps: {
      attributes: {
        class: 'focus:outline-none'
      },
      handleDOMEvents: {
        // Add custom event handlers if needed
      }
    },
    ...rest
  });

  return editor;
};
