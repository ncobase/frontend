import React from 'react';

export const Spinner: React.FC = () => {
  return (
    <div className='flex items-center justify-center h-screen'>
      <div className='animate-spin rounded-full h-8 w-8 border-t-4 border-blue-500 border-solid border-transparent'></div>
    </div>
  );
};
