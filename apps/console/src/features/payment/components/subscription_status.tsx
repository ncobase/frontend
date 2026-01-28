import { Badge } from '@ncobase/react';

const statusConfig: Record<
  string,
  { variant: 'success' | 'warning' | 'danger' | 'secondary'; label: string }
> = {
  active: { variant: 'success', label: 'Active' },
  trialing: { variant: 'success', label: 'Trialing' },
  past_due: { variant: 'warning', label: 'Past Due' },
  cancelled: { variant: 'secondary', label: 'Cancelled' },
  expired: { variant: 'danger', label: 'Expired' }
};

interface SubscriptionStatusProps {
  status: string;
  size?: 'xs' | 'sm' | 'md';
}

export const SubscriptionStatus = ({ status, size = 'xs' }: SubscriptionStatusProps) => {
  const config = statusConfig[status] || { variant: 'secondary' as const, label: status };
  return (
    <Badge variant={config.variant} size={size}>
      {config.label}
    </Badge>
  );
};
