export type TButtonVariant =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'danger'
  | 'slate'
  | 'outline-primary'
  | 'outline-secondary'
  | 'outline-success'
  | 'outline-warning'
  | 'outline-danger'
  | 'outline-slate'
  | 'link'
  | 'unstyle';

export type TButtonSizes = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'ratio';

export interface IButtonStyling {
  [key: string]: {
    default: string;
    hover: string;
    pressed: string;
    disabled: string;
  };
}

enum buttonSizeStyling {
  xs = `px-1.5 py-0.5 rounded-sm text-xs inline-flex items-center gap-1.5 whitespace-nowrap transition-all justify-center outline-none`,
  sm = `px-2 py-1 rounded-sm text-xs inline-flex items-center gap-1.5 whitespace-nowrap transition-all justify-center outline-none`,
  md = `px-3 py-1.5 rounded-md inline-flex items-center gap-1.5 whitespace-nowrap transition-all justify-center outline-none`,
  lg = `px-4 py-2 rounded-md inline-flex  items-center gap-1.5 whitespace-nowrap transition-all justify-center outline-none`,
  xl = `px-5 py-2.5 rounded-lg inline-flex items-center gap-1.5 whitespace-nowrap transition-all justify-center outline-none`,
  ratio = `px-2 py-1.5 rounded-md inline-flex items-center gap-1.5 whitespace-nowrap transition-all justify-center outline-none`
}

enum buttonIconStyling {
  xs = 'h-1.5 w-1.5 inline-flex justify-center items-center overflow-hidden my-0.5 flex-shrink-0',
  sm = 'h-2.5 w-2.5 inline-flex justify-center items-center overflow-hidden my-0.5 flex-shrink-0',
  md = 'h-3.5 w-3.5 inline-flex justify-center items-center overflow-hidden my-0.5 flex-shrink-0',
  lg = 'h-4.5 w-4.5 inline-flex justify-center items-center overflow-hidden my-0.5 flex-shrink-0',
  xl = 'h-5.5 w-5.5 inline-flex justify-center items-center overflow-hidden my-0.5 flex-shrink-0',
  ratio = `inline-flex items-center gap-1.5 whitespace-nowrap transition-all justify-center`
}

export const buttonStyling: IButtonStyling = {
  primary: {
    default: `bg-primary-600 text-white [&>svg]:stroke-white`,
    hover: `hover:bg-primary-600/85 [&>svg]:hover:stroke-white/85`,
    pressed: `focus:bg-primary-700/90 [&>svg]:hover:stroke-white/85`,
    disabled: `cursor-not-allowed !opacity-75`
  },
  'outline-primary': {
    default: `border border-primary-600 text-primary-600 [&>svg]:stroke-primary-600`,
    hover: `hover:border-primary-600/65 hover:bg-primary-50 [&>svg]:hover:stroke-primary-600/65`,
    pressed: `focus:border-primary-700/90 foucs:text-primary-700/90 [&>svg]:hover:stroke-primary-700/90`,
    disabled: `cursor-not-allowed !opacity-75`
  },
  secondary: {
    default: `bg-secondary-100/45 text-secondary-400`,
    hover: `hover:bg-secondary-100/85 hover:text-secondary-500 [&>svg]:hover:stroke-secondary-400`,
    pressed: `focus:bg-secondary-100/90 [&>svg]:hover:stroke-secondary-400`,
    disabled: `cursor-not-allowed !opacity-75 [&>svg]:stroke-secondary-400/65`
  },
  'outline-secondary': {
    default: `border border-secondary-200/65 text-secondary-500/65 [&>svg]:stroke-secondary-400/65`,
    hover: `hover:border-secondary-100/65 hover:text-secondary-500 hover:bg-secondary-50 [&>svg]:hover:stroke-secondary-400`,
    pressed: `focus:border-secondary-200/90 foucs:text-secondary-600/90 [&>svg]:hover:stroke-secondary-400`,
    disabled: `cursor-not-allowed !opacity-75`
  },
  success: {
    default: `bg-success-500 text-white [&>svg]:stroke-white`,
    hover: `hover:bg-success-500/85 [&>svg]:hover:stroke-white/85`,
    pressed: `focus:bg-success-600/90 [&>svg]:hover:stroke-white/85`,
    disabled: `cursor-not-allowed !opacity-75`
  },
  'outline-success': {
    default: `border border-success-500 text-success-500 [&>svg]:stroke-success-500`,
    hover: `hover:border-success-500/65 hover:bg-success-50 [&>svg]:hover:stroke-success-500/65`,
    pressed: `focus:border-success-600/90 foucs:text-success-600/90 [&>svg]:hover:stroke-success-600/90`,
    disabled: `cursor-not-allowed !opacity-75`
  },
  warning: {
    default: `bg-warning-500 text-white [&>svg]:stroke-white`,
    hover: `hover:bg-warning-500/85 [&>svg]:hover:stroke-white/85`,
    pressed: `focus:bg-warning-600/90 [&>svg]:hover:stroke-white/85`,
    disabled: `cursor-not-allowed !opacity-75`
  },
  'outline-warning': {
    default: `border border-warning-500 text-warning-500 [&>svg]:stroke-warning-500`,
    hover: `hover:border-warning-500/65 hover:bg-warning-50 [&>svg]:hover:stroke-warning-500/65`,
    pressed: `focus:border-warning-600/90 foucs:text-warning-600/90 [&>svg]:hover:stroke-warning-600/90`,
    disabled: `cursor-not-allowed !opacity-75`
  },
  danger: {
    default: `bg-danger-500 text-white [&>svg]:stroke-white`,
    hover: `hover:bg-danger-500/85 [&>svg]:hover:stroke-white/85`,
    pressed: `focus:bg-danger-600/90 [&>svg]:hover:stroke-white/85`,
    disabled: `cursor-not-allowed !opacity-75`
  },
  'outline-danger': {
    default: `border border-danger-500 text-danger-500 [&>svg]:stroke-danger-500`,
    hover: `hover:border-danger-500/65 hover:bg-danger-50 [&>svg]:hover:stroke-danger-500/65`,
    pressed: `focus:border-danger-600/90 foucs:text-danger-600/90 [&>svg]:hover:stroke-danger-600/90`,
    disabled: `cursor-not-allowed !opacity-75`
  },
  slate: {
    default: `bg-slate-100/45 text-slate-400`,
    hover: `hover:bg-slate-100/85 hover:text-slate-500 [&>svg]:hover:stroke-slate-400`,
    pressed: `focus:bg-slate-100/90 [&>svg]:hover:stroke-slate-400`,
    disabled: `cursor-not-allowed !opacity-75 [&>svg]:stroke-slate-400/65`
  },
  'outline-slate': {
    default: `border border-slate-200/65 text-slate-500/65 [&>svg]:stroke-slate-400/65`,
    hover: `hover:border-slate-100/65 hover:text-slate-500 hover:bg-slate-50 [&>svg]:hover:stroke-slate-400`,
    pressed: `focus:border-slate-200/90 foucs:text-slate-600/90 [&>svg]:hover:stroke-slate-400`,
    disabled: `cursor-not-allowed !opacity-75`
  },
  link: {
    default: `text-primary-500 hover:text-primary-600 [&>svg]:stroke-primary-500 hover:[&>svg]:text-primary-500/65 [data-state=checked]:text-primary-600 [data-state=checked]:hover:text-primary-600 [data-state=checked]:[&>svg]:stroke-primary-600 [data-state=checked]:hover:[&>svg]:stroke-primary-600`,
    hover: `hover:text-primary-500/95 [data-state=checked]:text-primary-500/95 [data-state=checked]:hover:text-primary-500/95 [data-state=checked]:[&>svg]:stroke-primary-500/95 [data-state=checked]:hover:[&>svg]:stroke-primary-500/95`,
    pressed: `focus:text-primary-600/90 [data-state=checked]:text-primary-600/90 [data-state=checked]:hover:text-primary-600/90 [data-state=checked]:[&>svg]:stroke-primary-600/90 [data-state=checked]:hover:[&>svg]:stroke-primary-600/90`,
    disabled: `cursor-not-allowed !text-primary-400 !opacity-75`
  },
  unstyle: {
    default: `bg-transparent text-slate-500 [&>svg]:stroke-slate-400/65 hover:[&>svg]:stroke-slate-400 focus:[&>svg]:stroke-slate-400`,
    hover: `hover:opacity-80 [data-state=checked]:opacity-80 [data-state=checked]:hover:opacity-80 [data-state=checked]:[&>svg]:stroke-slate-400 [data-state=checked]:hover:[&>svg]:stroke-slate-400 [&>svg]:stroke-slate-400`,
    pressed: `focus:opacity-90 [data-state=checked]:opacity-90 [data-state=checked]:hover:opacity-90 [data-state=checked]:[&>svg]:stroke-slate-400 [data-state=checked]:hover:[&>svg]:stroke-slate-400 [&>svg]:stroke-slate-400`,
    disabled: `cursor-not-allowed !opacity-75 [&>svg]:stroke-slate-400/65`
  }
};

export const getButtonStyling = (
  variant: TButtonVariant,
  size: TButtonSizes,
  disabled: boolean = false
): string => {
  let _variant: string = ``;
  const currentVariant = buttonStyling[variant];

  _variant = `${currentVariant.default} ${disabled ? currentVariant.disabled : currentVariant.hover} ${
    currentVariant.pressed
  }`;

  let _size: string = ``;
  if (size) _size = buttonSizeStyling[size];
  return `${_variant} ${_size}`;
};

export const getIconStyling = (size: TButtonSizes): string => {
  let icon: string = ``;
  if (size) icon = buttonIconStyling[size];
  return icon;
};
