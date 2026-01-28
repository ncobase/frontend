import { useEffect, useState } from 'react';

import { Modal } from '../modal/modal';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/forms';
import { TablerIconsNamespace, Icons } from '@/components/ui/icon';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

type IconPickerProps = {
  opened: boolean;
  // eslint-disable-next-line no-unused-vars
  onVisible?: (visible: boolean) => void;
  // eslint-disable-next-line no-unused-vars
  onSelected?: (iconName: string) => void;
  translations?: {
    title?: string;
    outline?: string;
    filled?: string;
    searchPlaceholder?: string;
  };
};

export const IconPicker = ({
  opened,
  onVisible,
  onSelected,
  translations = {
    title: 'Select Icon',
    outline: 'Outline',
    filled: 'Filled',
    searchPlaceholder: 'Search icons...'
  }
}: IconPickerProps) => {
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
          className='group p-2 hover:bg-slate-100 transition-colors'
          onClick={() => handleSelectIcon(key)}
        >
          <Icons
            name={key}
            className='text-slate-500 group-hover:text-slate-700 transition-colors'
          />
        </Button>
      ));
  };

  return (
    <Modal
      title={translations.title}
      isOpen={opened}
      onChange={() => onVisible?.(!opened)}
      className='w-[420px] max-h-[480px]'
    >
      <Tabs defaultValue='outline' className='space-y-4'>
        <div className='flex items-center space-x-4'>
          <Input
            type='text'
            placeholder={translations.searchPlaceholder}
            className='flex-1'
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
          <TabsList className='border rounded-md p-1 bg-slate-50'>
            <TabsTrigger
              value='outline'
              className='px-3 py-1 rounded data-[state=active]:bg-white data-[state=active]:text-primary-500 data-[state=active]:shadow-sm'
            >
              {translations.outline}
            </TabsTrigger>
            <TabsTrigger
              value='filled'
              className='px-3 py-1 rounded data-[state=active]:bg-white data-[state=active]:text-primary-500 data-[state=active]:shadow-sm'
            >
              {translations.filled}
            </TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value='outline'>
          <div className='grid grid-cols-6 gap-2'>{renderIcons(false)}</div>
        </TabsContent>
        <TabsContent value='filled'>
          <div className='grid grid-cols-6 gap-2'>{renderIcons(true)}</div>
        </TabsContent>
      </Tabs>
    </Modal>
  );
};
