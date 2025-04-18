import { UserMeshes } from '@/features/system/user/user';

export interface Account extends UserMeshes {}

export interface RegisterProps {
  username: string;
  email: string;
  password: string;
  confirm_password: string;
  terms: boolean;
}

export interface LoginProps {
  username: string;
  password: string;
  remember: boolean;
}

export interface LoginReply {
  user: string;
  access_token?: string;
  refresh_token?: string;
  register_token?: string;
}

export interface ForgetPasswordProps {
  username_or_email: string;
}
