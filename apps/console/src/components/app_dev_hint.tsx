import { cn, getInitials } from '@ncobase/utils';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

export const AppDevHint = () => {
  const isProd = import.meta.env.PROD;
  const envName = !isProd && import.meta.env.MODE;

  if (!envName || isProd) {
    return null;
  }

  const classess = cn(
    'fixed top-0 left-0 w-4 h-4 text-white rounded-br-[0.375rem] z-999 flex items-center justify-center uppercase bg-warning-400'
  );

  return (
    <>
      <div className={classess}>{getInitials(envName)}</div>
      <ReactQueryDevtools buttonPosition='bottom-left' />
    </>
  );
};
