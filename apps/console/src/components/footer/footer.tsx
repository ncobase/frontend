import { useCurrentTime } from '@/hooks/use_current_time';

export const Footer = () => {
  const { currentTime } = useCurrentTime();
  const year = currentTime.getFullYear();
  return (
    <div className='py-5 text-center text-gray-400'>
      Copyright ©{year} Ncobase. All Rights Reserved.
    </div>
  );
};
