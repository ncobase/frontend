import React from 'react';

import {
  Dropdown,
  DropdownTrigger,
  DropdownContent,
  DropdownItem,
  Button,
  Icons
} from '@ncobase/react';
import { cn } from '@ncobase/utils';

import { useLanguage } from '@/hooks/use_language';

/**
 * Language Switcher Component
 * Provides a dropdown menu for language selection
 */
export const LanguageSwitcher: React.FC = () => {
  const { currentLanguage, switchLanguage, availableLanguages } = useLanguage();

  /**
   * Render language trigger button
   * Display current language flag or global icon
   */
  const renderLanguageTrigger = () => (
    <Button variant='icon' className='text-muted-foreground hover:bg-transparent'>
      {currentLanguage.flag ? (
        <span className='text-base'>{currentLanguage.flag}</span>
      ) : (
        <Icons name='IconWorld' />
      )}
    </Button>
  );

  return (
    <Dropdown>
      <DropdownTrigger asChild>{renderLanguageTrigger()}</DropdownTrigger>
      <DropdownContent align='end' className='min-w-[120px]'>
        {availableLanguages.map(({ key, flag, name }) => (
          <DropdownItem
            key={key}
            onSelect={() => switchLanguage(key)}
            className={cn(
              'flex items-center gap-2 cursor-pointer',
              key === currentLanguage.key && 'bg-accent text-accent-foreground'
            )}
          >
            {flag && <span className='text-base'>{flag}</span>}
            <span>{name}</span>
          </DropdownItem>
        ))}
      </DropdownContent>
    </Dropdown>
  );
};
