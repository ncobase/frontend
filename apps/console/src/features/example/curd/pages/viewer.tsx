import React from 'react';

import { useQueryRole } from '@/features/system/role/service';

export const ViewerPage = ({ record }) => {
  const { data = {} } = useQueryRole(record);
  console.log(data);
  return <></>;
};
