import { cn } from '@ncobase/utils';

import { Label } from '@/components/ui/forms';
import { Icons } from '@/components/ui/icon';

export const EmptyData = ({ label = 'No data', className = '', loading = false }) => {
  const classes = cn(className, 'items-center justify-center flex flex-col');
  return (
    <div className={classes}>
      {loading ? (
        <div className='animate-spin rounded-full h-8 w-8 border-slate-300 dark:border-slate-600 border-t-slate-900 dark:border-t-slate-300'></div>
      ) : (
        <>
          <Icons
            name='IconInbox'
            size={64}
            stroke={0.5}
            className='stroke-slate-400 dark:stroke-slate-500'
          />
          <Label className='text-slate-500 dark:text-slate-400'>{label}</Label>
        </>
      )}
    </div>
  );
};
