import React from 'react';

import { useTranslation } from '@/components/ui/lib/i18n';
import { cn, countWords, countCharacters } from '@/components/ui/lib/utils';

interface StatusBarProps {
  editor: any;
  className?: string;
}

export const StatusBar: React.FC<StatusBarProps> = ({ editor, className = '' }) => {
  const { t } = useTranslation();

  if (!editor) return null;

  const wordCount = countWords(editor.getHTML());
  const charCount = countCharacters(editor.getHTML());

  const classes = cn('nco-editor-statusbar', className);

  return (
    <div className={classes}>
      <div>
        {wordCount} {t('editor.statusBar.words')} • {charCount} {t('editor.statusBar.characters')}
      </div>
      <div>{editor.isEditable ? t('editor.statusBar.editing') : t('editor.statusBar.reading')}</div>
    </div>
  );
};
