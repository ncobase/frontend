import { Badge, Icons } from '@ncobase/react';

const statusConfig: Record<string, { variant: 'success' | 'danger' | 'secondary'; icon: string }> =
  {
    active: { variant: 'success', icon: 'IconCircleCheck' },
    inactive: { variant: 'secondary', icon: 'IconCirclePause' },
    error: { variant: 'danger', icon: 'IconAlertCircle' }
  };

interface ChannelStatusProps {
  status: string;
  showIcon?: boolean;
}

export const ChannelStatus = ({ status, showIcon = true }: ChannelStatusProps) => {
  const config = statusConfig[status] || { variant: 'secondary' as const, icon: 'IconCircle' };
  return (
    <Badge variant={config.variant} size='xs'>
      {showIcon && <Icons name={config.icon} className='w-3 h-3 mr-1' />}
      {status}
    </Badge>
  );
};
