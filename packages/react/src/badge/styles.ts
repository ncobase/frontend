export type TBadgeVariant =
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
  | 'outline-slate';

export type TBadgeSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface IBadgeStyling {
  [key: string]: {
    default: string;
    hover: string;
  };
}

enum badgeSizeStyling {
  xs = 'h-1 w-1 rounded-full inline-flex items-center justify-center text-xs [&>svg]:w-1 [&>svg]:h-1 [&>svg]:my-0.5',
  sm = 'h-2 w-2 rounded-full inline-flex items-center justify-center text-xs [&>svg]:w-2 [&>svg]:h-2 [&>svg]:my-0.5',
  md = 'h-3 w-3 rounded-full inline-flex items-center justify-center text-xs [&>svg]:w-3 [&>svg]:h-3 [&>svg]:my-0.5',
  lg = 'h-4 w-4 rounded-full inline-flex items-center justify-center text-sm [&>svg]:w-3 [&>svg]:h-3 [&>svg]:my-0.5',
  xl = 'h-5 w-5 rounded-full inline-flex items-center justify-center text-md [&>svg]:w-4 [&>svg]:h-4 [&>svg]:my-0.5'
}

export const badgeStyling: IBadgeStyling = {
  primary: {
    default: 'bg-primary-600 text-white [&>svg]:stroke-white',
    hover: 'hover:bg-opacity-85 &[data-state=checked]:bg-opacity-85 [&>svg]:stroke-white/95'
  },
  secondary: {
    default: 'bg-secondary-500 text-white [&>svg]:stroke-white',
    hover: 'hover:bg-opacity-85 &[data-state=checked]:bg-opacity-85 [&>svg]:stroke-white/95'
  },
  success: {
    default: 'bg-success-500 text-white [&>svg]:stroke-white',
    hover: 'hover:bg-opacity-85 &[data-state=checked]:bg-opacity-85 [&>svg]:stroke-white/95'
  },
  warning: {
    default: 'bg-warning-500 text-white [&>svg]:stroke-white',
    hover: 'hover:bg-opacity-85 &[data-state=checked]:bg-opacity-85 [&>svg]:stroke-white/95'
  },
  danger: {
    default: 'bg-danger-500 text-white [&>svg]:stroke-white',
    hover: 'hover:bg-opacity-85 &[data-state=checked]:bg-opacity-85 [&>svg]:stroke-white/95'
  },
  slate: {
    default: 'bg-slate-500 text-white [&>svg]:stroke-white',
    hover: 'hover:bg-opacity-85 &[data-state=checked]:bg-opacity-85 [&>svg]:stroke-white/95'
  },
  'outline-primary': {
    default: 'text-primary-600 border border-primary-600 [&>svg]:stroke-primary-600',
    hover:
      'hover:text-primary-600/95 hover:border-opacity-85 [data-state=checked]:text-primary-600/95 [&>svg]:stroke-primary-600/95'
  },
  'outline-secondary': {
    default: 'text-secondary-500 border border-secondary-500 &[>svg]:stroke-secondary-500',
    hover:
      'hover:text-secondary-500/95 hover:border-opacity-85 [data-state=checked]:text-secondary-500/95 [&>svg]:stroke-secondary-500/95'
  },
  'outline-success': {
    default: 'text-success-500 border border-success-500 [&>svg]:stroke-success-500',
    hover:
      'hover:text-success-500/95 hover:border-opacity-85 [data-state=checked]:text-success-500/95 [&>svg]:stroke-success-500/95'
  },
  'outline-warning': {
    default: 'text-warning-500 border border-warning-500 &[>svg]:stroke-warning-500',
    hover:
      'hover:text-warning-500/95 hover:border-opacity-85 [data-state=checked]:text-warning-500/95 [&>svg]:stroke-warning-500/95'
  },
  'outline-danger': {
    default: 'text-danger-500 border border-danger-500 [&>svg]:stroke-danger-500',
    hover:
      'hover:text-danger-500/95 hover:border-opacity-85 [data-state=checked]:text-danger-500/95 [&>svg]:stroke-danger-500/95'
  },
  'outline-slate': {
    default: 'text-slate-500 border border-slate-500 [&>svg]:stroke-slate-500',
    hover:
      'hover:text-slate-500/95 hover:border-opacity-85 [data-state=checked]:text-slate-500/95 [&>svg]:stroke-slate-500/95'
  }
};

export const getBadgeStyle = (variant: TBadgeVariant, size: TBadgeSize) => {
  let _variant: string = ``;
  const currentVariant = badgeStyling[variant];

  _variant = `${currentVariant.default} ${currentVariant.hover}`;

  let _size: string = ``;
  if (size) _size = badgeSizeStyling[size];
  return `${_variant} ${_size}`;
};
