import {
  Icons,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@ncobase/react';
import { useTranslation } from 'react-i18next';

import { Button } from './form/button';

import { filterDays } from '@/helpers/enums/filter';

export const DropdownControl = ({ onChange }: { onChange?: (value: string) => void }) => {
  const { t } = useTranslation();
  return (
    <Select defaultValue={filterDays[0].value} onValueChange={onChange}>
      <SelectTrigger className='w-auto outline-none py-1.5 px-1.5 gap-x-1.5 shadow-none border-none bg-slate-100 hover:bg-slate-100/80'>
        <Icons name='IconCalendar' />
        <SelectValue />
      </SelectTrigger>
      <SelectContent align='end'>
        {filterDays.map(item => (
          <SelectItem key={item.value} value={item.value}>
            {t(item.label)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export const LayoutControl = ({ onChange }: { onChange?: () => void }) => {
  const { t } = useTranslation();
  const wrapperStyle = 'bg-slate-100 p-1 rounded-md flex items-center justify-between gap-x-2';
  const childButtonStyle = 'rounded-md p-1 hover:bg-white';
  return (
    <div className={wrapperStyle}>
      <Button
        icon='IconLayoutCards'
        tooltip={t('table.layout.card')}
        className={childButtonStyle}
        onClick={onChange}
      />
      <Button
        icon='IconLayoutBoard'
        tooltip={t('table.layout.board')}
        className={childButtonStyle}
        onClick={onChange}
      />
      <Button
        icon='IconTable'
        tooltip={t('table.layout.table')}
        className={childButtonStyle}
        onClick={onChange}
      />
    </div>
  );
};

export const ScreenControl = ({ onChange }: { onChange?: () => void }) => {
  const { t } = useTranslation();
  const wrapperStyle = 'bg-slate-100 p-1 rounded-md flex items-center justify-between gap-x-2';
  const childButtonStyle = 'rounded-md p-1 hover:bg-white';
  return (
    <div className={wrapperStyle}>
      <Button
        icon='IconArrowsMaximize'
        tooltip={t('table.layout.fullscreen')}
        className={childButtonStyle}
        onClick={onChange}
      />
    </div>
  );
};
