import { CustomerModel } from './customer-model';

export class UserResponseData {
  constructor(
    public email?: string,
    public customer?: CustomerModel,
    public fcmToken?: string,
    public userType?: string,
    public accountStatus?: string
  ) {}
}
