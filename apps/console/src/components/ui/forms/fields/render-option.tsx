import React from 'react';

import { Checkbox, Label, RadioGroupItem } from '../components';

export const RenderOption = React.forwardRef<HTMLDivElement, any>(
  ({ option, type, onChange, defaultValue, ...rest }, ref) => {
    const { label, value } = typeof option === 'object' ? option : { label: option, value: option };
    const id = `${rest['name']}-${value}`.replace(/\./g, '-');

    return (
      <div className='inline-flex items-center space-x-2 hover:[&>label]:cursor-pointer' ref={ref}>
        {type === 'checkbox' ? (
          <Checkbox
            id={id}
            onCheckedChange={checked => {
              const updatedValue = checked
                ? [...(defaultValue || []), value]
                : (defaultValue || []).filter((val: any) => val !== value);
              onChange?.(updatedValue);
            }}
            defaultChecked={defaultValue?.includes(value)}
            {...rest}
          />
        ) : (
          <RadioGroupItem id={id} value={String(value)} />
        )}
        <Label htmlFor={id}>{label}</Label>
      </div>
    );
  }
);

RenderOption.displayName = 'RenderOption';
