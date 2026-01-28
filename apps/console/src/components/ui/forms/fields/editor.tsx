import React, { useState, useEffect } from 'react';

import { cn } from '@ncobase/utils';

import { FieldProps } from '../types';

import { Field } from './field';

import { Editor } from '@/components/ui/editor';

export interface EditorFieldProps extends Omit<FieldProps, 'type'> {
  /**
   * Initial content of the editor
   */
  content?: string;
  /**
   * Whether the editor is editable
   */
  editable?: boolean;
  /**
   * Whether to focus the editor when it is mounted
   */
  autofocus?: boolean;
  /**
   * Placeholder text
   */
  placeholder?: string;
  /**
   * Editor theme mode
   */
  darkMode?: boolean;
  /**
   * Whether to show the bubble menu
   */
  showBubbleMenu?: boolean;
  /**
   * Whether to show the floating menu
   */
  showFloatingMenu?: boolean;
  /**
   * Function to handle image uploads
   */
  uploadImage?: (_file: File) => Promise<string>;
  /**
   * Minimum height of the editor
   */
  minHeight?: string;
  /**
   * Maximum height of the editor
   */
  maxHeight?: string;
  /**
   * Language of the editor
   */
  locale?: string;
}

export const EditorField = React.forwardRef<HTMLDivElement, EditorFieldProps>(
  (
    {
      onChange,
      defaultValue,
      value,
      className,
      content,
      editable = true,
      autofocus = false,
      placeholder,
      darkMode = false,
      showBubbleMenu = true,
      showFloatingMenu = false,
      uploadImage,
      minHeight = '200px',
      maxHeight = '500px',
      locale = 'en',
      ...rest
    },
    ref
  ) => {
    // Track editor content state
    const [editorContent, setEditorContent] = useState<string>(
      content || value || defaultValue || ''
    );

    // Update editor content when value changes
    useEffect(() => {
      if (value !== undefined && value !== editorContent) {
        setEditorContent(value);
      }
    }, [value]);

    // Handle editor content changes
    const handleEditorChange = (html: string) => {
      setEditorContent(html);
      if (onChange) {
        onChange(html);
      }
    };

    // Handle editor save (Ctrl+S)
    const handleSave = () => {
      if (onChange) {
        onChange(editorContent);
      }
    };

    return (
      <Field {...rest} ref={ref} className={className}>
        <div
          className={cn('editor-field-container rounded-md overflow-hidden', {
            dark: darkMode
          })}
          style={{
            minHeight,
            maxHeight
          }}
        >
          <Editor
            content={editorContent}
            editable={editable}
            autofocus={autofocus}
            placeholder={placeholder}
            darkMode={darkMode}
            showBubbleMenu={showBubbleMenu}
            showFloatingMenu={showFloatingMenu}
            uploadImage={uploadImage}
            onChange={handleEditorChange}
            onSave={handleSave}
            locale={locale}
            contentClassName={cn('editor-field-content', {
              'min-h-[200px]': !minHeight
            })}
          />
        </div>
      </Field>
    );
  }
);

EditorField.displayName = 'EditorField';
