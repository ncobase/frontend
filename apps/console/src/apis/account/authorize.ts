import { request } from '@/apis/request';
import { LoginProps, LoginReply, RegisterProps } from '@/types';

const ENDPOINT = '/iam';

// login
export const loginAccount = async (payload: LoginProps): Promise<LoginReply> => {
  return request.post(`${ENDPOINT}/login`, { ...payload });
};

// register
export const registerAccount = async (payload: RegisterProps): Promise<LoginReply> => {
  return request.post(`${ENDPOINT}/register`, { ...payload });
};

// logout
export const logoutAccount = async (): Promise<void> => {
  return request.post(`${ENDPOINT}/logout`);
};
