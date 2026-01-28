import React, { useState, useEffect, useCallback } from 'react';

import { NodeViewWrapper, NodeViewContent, NodeViewProps } from '@tiptap/react';

import { Button } from '@/components/ui/button';
import { Icons } from '@/components/ui/icon';
import { useTranslation } from '@/components/ui/lib/i18n';
import { useToastMessage } from '@/components/ui/toast';
import { Tooltip } from '@/components/ui/tooltip';

const CodeBlock = ({ node, updateAttributes, extension }: NodeViewProps) => {
  const { t } = useTranslation();
  const toast = useToastMessage();

  const language = node.attrs['language'] || extension?.options?.defaultLanguage || '';

  const [selectedLanguage, setSelectedLanguage] = useState<string>(language);
  const [copied, setCopied] = useState(false);
  const [codeContent, setCodeContent] = useState<string>('');
  const [showToast, setShowToast] = useState(false);

  const supportedLanguages = extension?.options?.lowlight?.languages
    ? Object.keys(extension.options.lowlight.languages).sort()
    : ['javascript', 'typescript', 'css', 'html', 'json'];

  const handleLanguageChange = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      const newLanguage = event.target.value;
      setSelectedLanguage(newLanguage);
      updateAttributes({ language: newLanguage });
    },
    [updateAttributes]
  );

  useEffect(() => {
    const observer = new MutationObserver(() => {
      const codeElement = document.querySelector('.code-block-content code');
      if (codeElement) {
        setCodeContent(codeElement.textContent || '');
      }
    });

    const codeBlockContent = document.querySelector('.code-block-content');
    if (codeBlockContent) {
      observer.observe(codeBlockContent, {
        childList: true,
        subtree: true,
        characterData: true
      });
    }

    const codeElement = document.querySelector('.code-block-content code');
    if (codeElement) {
      setCodeContent(codeElement.textContent || '');
    }

    return () => observer.disconnect();
  }, []);

  // Copy code to clipboard
  const copyToClipboard = useCallback(() => {
    navigator.clipboard
      .writeText(codeContent)
      .then(() => {
        setCopied(true);
        setShowToast(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(() => {
        const textarea = document.createElement('textarea');
        textarea.value = codeContent;
        textarea.style.position = 'fixed';
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        try {
          document.execCommand('copy');
          setCopied(true);
          setShowToast(true);
          setTimeout(() => setCopied(false), 2000);
        } catch (err) {
          console.error('Failed to copy text:', err);
        }
        document.body.removeChild(textarea);
      });
  }, [codeContent]);

  // Show toast for copied content
  useEffect(() => {
    if (showToast) {
      toast[copied ? 'success' : 'info'](t('editor.codeBlock.codeCopied'), {
        description: t('editor.codeBlock.codeSuccessfullyCopied')
      });
    }
  }, [showToast, copied, t, toast]);

  return (
    <NodeViewWrapper className='code-block-wrapper'>
      <div className='code-block-header'>
        <select
          className='code-language-selector'
          value={selectedLanguage}
          onChange={handleLanguageChange}
          aria-label={t('editor.codeBlock.language')}
        >
          <option value=''>{t('editor.codeBlock.selectLanguage')}</option>
          {supportedLanguages.map(language => (
            <option key={language} value={language}>
              {language}
            </option>
          ))}
        </select>

        <Tooltip content={copied ? t('editor.codeBlock.copied') : t('editor.codeBlock.copy')}>
          <Button
            variant='ghost'
            size='sm'
            onClick={copyToClipboard}
            aria-label={t('editor.codeBlock.copy')}
            className='copy-button'
          >
            <Icons name={copied ? 'IconCheck' : 'IconCopy'} className='w-4 h-4' />
          </Button>
        </Tooltip>
      </div>

      <pre className={`language-${selectedLanguage}`}>
        <NodeViewContent className='code-block-content' />
      </pre>
    </NodeViewWrapper>
  );
};

export { CodeBlock };
