import React, { useEffect, useState } from 'react';

import {
  Button,
  Icons,
  Input,
  TablerIconsNamespace,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@ncobase/react';
import { useTranslation } from 'react-i18next';

import { Modal } from './modal';

type IconSelectorProps = {
  opened: boolean;
  onVisible?: (visible: boolean) => void;
  onSelected?: (iconName: string) => void;
};

export const IconSelector = ({ opened, onVisible, onSelected }: IconSelectorProps) => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 150);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  const handleSelectIcon = (iconName: string) => {
    onSelected?.(iconName);
    onVisible?.(false);
  };

  const renderIcons = (isFilled: boolean) => {
    return Object.keys(TablerIconsNamespace)
      .filter(key => {
        const isIconFilled = key.endsWith('Filled');
        const matchesSearch = key.toLowerCase().includes(debouncedSearchTerm.toLowerCase());
        return isFilled === isIconFilled && matchesSearch;
      })
      .map(key => (
        <Button
          key={key}
          variant='outline-slate'
          size='ratio'
          title={key}
          onClick={() => handleSelectIcon(key)}
        >
          <Icons name={key} />
        </Button>
      ));
  };

  return (
    <Modal
      title={t('icon_selector.title')}
      isOpen={opened}
      onChange={() => onVisible(!opened)}
      className='w-[390px] max-h-[420px]'
    >
      <Tabs defaultValue='outline'>
        <TabsList className='flex items-center justify-end -mt-3'>
          <TabsTrigger
            value='outline'
            className='data-[state=active]:border-primary-500 data-[state=active]:text-primary-500'
          >
            {t('icon_selector.outline')}
          </TabsTrigger>
          <TabsTrigger
            value='filled'
            className='data-[state=active]:border-red-500 data-[state=active]:text-red-500'
          >
            {t('icon_selector.filled')}
          </TabsTrigger>
        </TabsList>
        <Input
          type='text'
          placeholder={t('icon_selector.search_placeholder')}
          className='py-1.5 my-3.5'
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
        <TabsContent value='outline'>
          <div className='flex flex-wrap gap-[12.2px]'>{renderIcons(false)}</div>
        </TabsContent>
        <TabsContent value='filled'>
          <div className='flex flex-wrap gap-[12.2px]'>{renderIcons(true)}</div>
        </TabsContent>
      </Tabs>
    </Modal>
  );
};
