import type { ReactNode, HTMLInputTypeAttribute } from 'react';

import type {
  Control,
  FieldError,
  FieldErrors,
  FieldValues,
  Path,
  RegisterOptions,
  DefaultValues
} from 'react-hook-form';

export type FormLayout = 'default' | 'single' | 'inline' | 'custom';

export interface FormContextValue<TFieldValues extends FieldValues = FieldValues> {
  control?: Control<FieldValues, any, FieldValues> | any;
  errors?: FieldErrors<TFieldValues>;
  register?: (_name: Path<TFieldValues>, _options?: RegisterOptions<TFieldValues>) => void;
}

export interface FormProps<TFieldValues extends FieldValues = FieldValues> extends Omit<
  React.FormHTMLAttributes<HTMLFormElement>,
  'onSubmit'
> {
  control?: Control<FieldValues, any, FieldValues> | any;
  errors?: FieldErrors<TFieldValues>;
  children?: ReactNode;
  fields?: FieldConfigProps<TFieldValues>[];
  defaultValues?: DefaultValues<TFieldValues>;
  layout?: FormLayout;
  onSubmit?: (_e?: React.FormEvent<HTMLFormElement>, _data?: TFieldValues) => void;
}

export interface FieldConfigProps<TFieldValues extends FieldValues = FieldValues> {
  /**
   * The title of the field
   */
  title?: string;
  /**
   * The description of the field
   * @example
   *   desc='description'
   *   desc={<div>description</div>}
   */
  desc?: ReactNode;
  /**
   * The name of the field
   * @example
   *   name='name'
   *   name='profile.name'
   */
  name: Path<TFieldValues>;
  /**
   * The placeholder of the field, if type is 'input', 'password', 'textarea', 'number'
   */
  placeholder?: string;
  /**
   * The default value of the field
   */
  defaultValue?: any;
  /**
   * The type of the field
   * valid values: 'input | text', 'password', 'textarea', 'select', 'multi-select', 'tree-select',
   * 'checkbox', 'radio', 'number', 'date', 'date-range', 'switch', 'hidden', 'color', 'icon', 'editor'
   */
  type?:
    | 'input'
    | 'text'
    | 'password'
    | 'textarea'
    | 'select'
    | 'multi-select'
    | 'tree-select'
    | 'checkbox'
    | 'radio'
    | 'number'
    | 'date'
    | 'date-range'
    | 'switch'
    | 'hidden'
    | 'color'
    | 'icon'
    | 'editor'
    | HTMLInputTypeAttribute
    | HTMLButtonElement['type'];
  /**
   * The prepend icon of the field
   */
  prependIcon?: string;
  /**
   * The click event of the prepend icon
   * @returns void
   */
  prependIconClick?: () => void;
  /**
   * The append icon of the field
   */
  appendIcon?: string;
  /**
   * The click event of the append icon
   * @returns void
   */
  appendIconClick?: () => void;
  /**
   * The rules of the field
   * @see https://react-hook-form.com/api/useform/register
   */
  rules?: RegisterOptions<TFieldValues>;
  /**
   * The errors of the form
   * @see https://react-hook-form.com/api/useform
   */
  errors?: FieldErrors<TFieldValues>;
  /**
   * The options of the field, if type is 'select', 'multi-select', 'tree-select', 'checkbox', 'radio', 'icon'
   * @example
   *   options={[{ label: 'Option 1', value: 1 }, { label: 'Option 2', value: 2 }, { label: 'Option 3', value: 3 }]}
   *   options={[{ label: 'Category 1', value: 1, children: [{ label: 'Subcategory 1', value: '1-1' }] }]}
   */
  options?: Array<{ label: string; value: any }>;
  /**
   * Whether to allow clearing the selected value, only valid when type is 'select'
   */
  allowClear?: boolean;
  /**
   * The value after clearing, only valid when type is 'select' and allowClear is true
   * @default ''
   */
  emptyValue?: any;

  /**
   * Whether to support multiple selection, only valid when type is 'tree-select'
   * @default false
   */
  multiple?: boolean;
  /**
   * If the field is required, the error message will be displayed
   */
  required?: boolean;
  /**
   * The value component of the field
   * @returns void
   * @example
   *   valueComponent={(onChange) => onChange('value')}
   */
  valueComponent?: any;
  /**
   * The className of the field
   */
  className?: string;
  /**
   * The className of the children wrapper, if type is 'checkbox', 'radio'
   */
  elementClassName?: string;
  /**
   * Additional props to be passed to the field component
   */
  [key: string]: any;
}

export interface FieldProps<
  TFieldValues extends FieldValues = FieldValues
> extends FieldConfigProps<TFieldValues> {
  error?: FieldError;
  // eslint-disable-next-line no-unused-vars
  onChange?: (...event: any[]) => void;
  value?: any;
  onBlur?: () => void;
}

export interface ColorPickerComponentProps extends Omit<FieldProps, 'type'> {
  presetColors?: string[];
  allowCustomColor?: boolean;
  format?: 'hex' | 'rgba' | 'hsla';
}

export interface IconPickerComponentProps extends Omit<FieldProps, 'type'> {
  searchable?: boolean;
  categorized?: boolean;
  recentIcons?: string[];
}

// Define interfaces for our form structure
export interface FormField extends FieldConfigProps {
  placeholderText?: {
    main?: string;
    sub?: string;
    hint?: string;
  };
}
// Define interfaces for our form structure
export interface FormSection {
  id: string;
  title: string;
  subtitle?: string;
  icon: string;
  collapsible?: boolean;
  fields: FormField[];
}
