import { DropdownWrapper } from './dropdown';

import { DropdownItem } from '@/components/ui/dropdown';
import { Icons } from '@/components/ui/icon';

export const Actions = (props: any) => {
  const { actions = [], record } = props;
  return (
    <DropdownWrapper icon='IconDotsVertical'>
      {actions.map((action: any, index: number) => {
        const icon = typeof action?.icon === 'function' ? action.icon(record) : action?.icon;
        const disabled =
          typeof action?.disabled === 'function' ? action.disabled(record) : action?.disabled;
        return (
          <DropdownItem
            key={index}
            onClick={() => action?.onClick?.(record)}
            disabled={disabled}
            className='flex items-center space-x-2'
          >
            {typeof icon === 'string' && <Icons name={icon} className='-ml-0.5' />}
            <span>
              {typeof action?.title === 'function'
                ? action.title(record)
                : action?.title || action?.name || action?.label}
            </span>
          </DropdownItem>
        );
      })}
    </DropdownWrapper>
  );
};
