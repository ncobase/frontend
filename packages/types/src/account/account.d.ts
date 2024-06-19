import { User, UserProfile } from '../core/user';
import { Role } from '../system/role';
import { Tenant } from '../system/tenant';

export interface Account {
  user: User;
  profile?: UserProfile;
  roles?: Role[];
  tenants?: Tenant[];
}
