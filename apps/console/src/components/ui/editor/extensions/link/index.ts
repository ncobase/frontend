import { Link as TiptapExtensionLink } from '@tiptap/extension-link';

export interface LinkOptions {
  openOnClick: boolean;
  linkOnPaste: boolean;
  autolink: boolean;
  protocols: string[];
  HTMLAttributes: Record<string, any>;
  validate?: (_url: string) => boolean;
  defaultProtocol: string;
}

export const Link = TiptapExtensionLink.extend<LinkOptions>({
  name: 'link',

  addOptions() {
    return {
      ...this.parent?.(),
      openOnClick: true,
      linkOnPaste: true,
      autolink: true,
      protocols: ['http', 'https', 'mailto', 'tel'],
      HTMLAttributes: {
        target: '_blank',
        rel: 'noopener noreferrer nofollow'
      },
      validate: (url: string) => {
        // Advanced URL validation
        try {
          // Parse URL to see if it's valid
          const urlObj = new URL(url);

          // Check if the protocol is allowed
          const protocol = urlObj.protocol.replace(':', '');
          if (!this['options'].protocols.includes(protocol)) {
            return false;
          }

          // Check for common URL manipulation attacks
          if (url.includes('javascript:') || url.includes('data:')) {
            return false;
          }

          // Additional security checks can be added here

          return true;
          // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
        } catch (_error) {
          // Try adding the default protocol and validate again
          if (!url.match(/^[a-z]+:\/\//i)) {
            try {
              const urlWithProtocol = `${this['options'].defaultProtocol}://${url}`;
              new URL(urlWithProtocol);
              return true;
              // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
            } catch (e) {
              return false;
            }
          }
          return false;
        }
      },
      defaultProtocol: 'https'
    };
  },

  onPaste({ editor, chain, clipboardData }) {
    // Early exit if link on paste is disabled
    if (!this['options'].linkOnPaste) {
      return false;
    }

    const text = clipboardData?.getData('text/plain') || '';

    // Check if the pasted content is a valid URL
    if (!this['options'].validate?.(text)) {
      return false;
    }

    // If text is selected, create a link
    const { empty, from } = editor.state.selection;

    if (!empty) {
      chain().setLink({ href: text }).run();
      return true;
    }

    // If no text is selected, insert the link
    let url = text;

    // Add protocol if missing
    if (!url.match(/^[a-z]+:\/\//i)) {
      url = `${this['options'].defaultProtocol}://${url}`;
    }

    chain()
      .insertContent(url)
      .setTextSelection({
        from: from,
        to: from + url.length
      })
      .setLink({ href: url })
      .run();

    return true;
  },

  addAttributes() {
    return {
      ...this.parent?.(),
      // Add target attribute
      target: {
        default: this['options'].HTMLAttributes['target'],
        parseHTML: element => element.getAttribute('target'),
        renderHTML: attributes => {
          if (!attributes['target']) {
            return {};
          }
          return { target: attributes['target'] };
        }
      },
      // Add rel attribute for security
      rel: {
        default: this['options'].HTMLAttributes['rel'],
        parseHTML: element => element.getAttribute('rel'),
        renderHTML: attributes => {
          if (!attributes['rel']) {
            return {};
          }
          return { rel: attributes['rel'] };
        }
      }
    };
  },

  addKeyboardShortcuts() {
    return {
      'Mod-k': () => this.editor.commands.toggleLink({} as any)
      // Additional shortcuts can be added here
    };
  }
});
