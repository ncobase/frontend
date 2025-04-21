import { useCallback, useState } from 'react';

type Copied = string | null;

type CopyFn = (_text: string) => Promise<boolean>;

/**
 * Use copy to clipboard
 * @returns {{copied: Copied, copy: CopyFn}}
 */
export const useCopyToClipboard = (): { copied: Copied; copy: CopyFn } => {
  const [copied, setCopied] = useState<Copied>(null);

  const copy: CopyFn = useCallback(
    async (text: string) => {
      if (!navigator?.clipboard) {
        console.warn('Clipboard not supported');
        return false;
      }
      try {
        await navigator.clipboard.writeText(text);
        setCopied(text);
        return true;
      } catch (error) {
        console.warn('Copy failed:', error);
        setCopied(null);
        return false;
      }
    },
    [setCopied]
  );

  return { copied, copy };
};
