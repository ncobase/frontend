import { Node } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';

import { ImageNode } from './components';

export interface ImageUploadOptions {
  inline: boolean;
  allowBase64: boolean;
  uploadFn?: (_file: File) => Promise<string>;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    imageUpload: {
      setImageUpload: (_options: { src: string; alt?: string; title?: string }) => ReturnType;
    };
  }
}

export const ImageUpload = Node.create<ImageUploadOptions>({
  name: 'imageUpload',

  addOptions() {
    return {
      inline: false,
      allowBase64: false,
      uploadFn: undefined
    };
  },

  inline() {
    return this.options.inline;
  },

  group() {
    return this.options.inline ? 'inline' : 'block';
  },

  draggable: true,

  addAttributes() {
    return {
      src: {
        default: null
      },
      alt: {
        default: null
      },
      title: {
        default: null
      },
      width: {
        default: null
      },
      height: {
        default: null
      },
      loading: {
        default: false,
        renderHTML: () => {
          return {};
        }
      }
    };
  },

  parseHTML() {
    return [
      {
        tag: 'img[src]'
      }
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['img', HTMLAttributes];
  },

  addCommands() {
    return {
      setImageUpload:
        options =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: options
          });
        }
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer(ImageNode);
  }
});
