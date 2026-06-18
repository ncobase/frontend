import { UserMeshes } from '@/features/system/user/user';

export interface Account extends UserMeshes {}

export interface RegisterProps {
  username: string;
  email: string;
  password: string;
  confirm_password: string;
  verification_code: string;
  terms: boolean;
}

export interface RegisterAccountPayload {
  username: string;
  display_name: string;
  email?: string;
  phone?: string;
  short_bio?: string;
  space?: string;
  password: string;
  confirm_password: string;
  register_token: string;
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
  token_type?: string;
}

export interface ForgetPasswordProps {
  username_or_email: string;
}

export interface PasswordPolicy {
  min_length: number;
  require_uppercase: boolean;
  require_lowercase: boolean;
  require_numbers: boolean;
  require_symbols: boolean;
}

export interface ChangePasswordPayload {
  old_password: string;
  new_password: string;
  confirm: string;
}

export interface SendCodeReply {
  registered?: boolean;
}
