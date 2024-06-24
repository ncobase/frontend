import React from 'react';

import { useQueryRole } from '@/features/system/role/service';
import { Role } from '@/types';

export const ViewerPage = ({ record }: { record: Role }) => {
  const { data = {} } = useQueryRole(record);
  console.log(data);

  return <></>;
};
