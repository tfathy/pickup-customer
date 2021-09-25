import { ServiceProviderModel } from './service-provider-model';
import { SpMemberModel } from './sp-member-model';

export interface SysUserModel {
  userId: string;
  email: string;
  userType: string;
  accountStatus: string;
  sp: ServiceProviderModel;
  member: SpMemberModel;
  fcmToken: string;
  id: number;
}
