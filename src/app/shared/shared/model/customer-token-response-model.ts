import { CustomerModel } from './customer-model';

export class CustomerTokenResponseModel {
  constructor(
    public userId: string,
    public email: string,
    public encryptedPassword: string,
    public userType: string,
    public accountStatus: string,
    public fcmToken: string,
    public id: number,
    public customer: CustomerModel
  ) {}
}
