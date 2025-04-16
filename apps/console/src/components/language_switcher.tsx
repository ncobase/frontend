import {
  Button,
  Dropdown,
  DropdownContent,
  DropdownItem,
  DropdownTrigger,
  Icons
} from '@ncobase/react';
import { cn } from '@ncobase/utils';

import { AVAILABLE_LANGUAGES } from '@/helpers/constants';
import { getNavigatorLanguage, getStoredLanguage, i18n } from '@/helpers/i18n';

export const LanguageSwitcher = () => {
  const flagClasses = 'mt-0.5 text-base';
  const language = AVAILABLE_LANGUAGES.find(
    item => item.key === (getStoredLanguage() || getNavigatorLanguage())
  );

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  return (
    <Dropdown>
      <DropdownTrigger asChild>
        <Button variant='unstyle' className='p-0 text-slate-400/80 [&>svg]:stroke-slate-400/80'>
          {language.flag ? (
            <span className={flagClasses}>{language.flag}</span>
          ) : (
            <Icons name='IconWorld' />
          )}
          {/* {language.name} */}
        </Button>
      </DropdownTrigger>
      <DropdownContent align='end' alignOffset={-16}>
        {AVAILABLE_LANGUAGES.map(({ key, flag, name }) => (
          <DropdownItem
            key={key}
            className={cn('text-slate-400/90 py-1.5', key === language.key && 'text-slate-600')}
            onClick={() => {
              changeLanguage(key);
            }}
          >
            {flag && <span className={`${flagClasses} mr-2`}>{flag}</span>}
            {name}
          </DropdownItem>
        ))}
      </DropdownContent>
    </Dropdown>
  );
};
