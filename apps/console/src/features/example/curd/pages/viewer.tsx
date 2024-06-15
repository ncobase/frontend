import React from 'react';

import { Role } from '@ncobase/types';

import { useQueryRole } from '@/features/system/role/service';

export const ViewerPage = ({ record }: { record: Role }) => {
  const { data = {} } = useQueryRole(record.id);
  console.log(data);

  return <></>;
};
