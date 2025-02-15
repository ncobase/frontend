import { cn } from '@ncobase/utils';

import { Full } from '@/components/logo/full';
import { Min } from '@/components/logo/min';

export interface Props extends React.HtmlHTMLAttributes<HTMLDivElement> {
  logoColor?: string;
  color?: string;
  width?: number | string;
  height?: number | string;
  type?: 'min' | 'full';
  hidden?: boolean;
}

export const Logo: React.FC<Props> = ({
  className,
  type = 'min',
  height,
  logoColor,
  color,
  ...rest
}) => {
  const LogoComponent = type === 'min' ? Min : Full;

  if (rest.hidden) return undefined;

  return (
    <div className={cn('flex items-center justify-center', className)} {...rest}>
      <LogoComponent logoColor={logoColor} height={height} color={color} />
    </div>
  );
};
