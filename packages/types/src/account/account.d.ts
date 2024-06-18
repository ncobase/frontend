import { User, UserProfile } from '../core/user';

export interface Account {
  user: User;
  profile?: UserProfile;
}
