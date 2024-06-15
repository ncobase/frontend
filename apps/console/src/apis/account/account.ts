import { Account } from '@ncobase/types';

import { request } from '../request';

const ENDPOINT = '/v1/account';

// current user
export const getCurrentUser = async (): Promise<Account> => {
  return request.get(`${ENDPOINT}`);
};
