import React, { useState } from 'react';

import { Button, Icons, Modal } from '@ncobase/react';
import { useTranslation } from 'react-i18next';

import { ContentVersion } from '../version';

import { VersionHistory } from './version_history';

interface VersionSelectorProps {
  contentId: string;
  contentType: string;
  currentVersion?: ContentVersion;
  onVersionSelect: (_version: ContentVersion) => void;
  trigger?: React.ReactNode;
}

export const VersionSelector: React.FC<VersionSelectorProps> = ({
  contentId,
  contentType,
  currentVersion,
  onVersionSelect,
  trigger
}) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const handleVersionSelect = (version: ContentVersion) => {
    onVersionSelect(version);
    setIsOpen(false);
  };

  const defaultTrigger = (
    <Button variant='outline' size='sm' onClick={() => setIsOpen(true)}>
      <Icons name='IconHistory' size={16} className='mr-1' />
      {currentVersion ? `v${currentVersion.version_number}` : t('version.select.current')}
    </Button>
  );

  return (
    <>
      {trigger ? <div onClick={() => setIsOpen(true)}>{trigger}</div> : defaultTrigger}

      <Modal
        isOpen={isOpen}
        title={t('version.select.title')}
        onCancel={() => setIsOpen(false)}
        size='lg'
        className='max-h-[80vh]'
      >
        <VersionHistory
          contentId={contentId}
          contentType={contentType}
          onVersionSelect={handleVersionSelect}
          showActions={false}
        />
      </Modal>
    </>
  );
};
