import { CustomerModel } from './customer-model';

export class CreateUserResponseModel{
  constructor(
    public customer: CustomerModel,
    public userId?: number,
    public email?: string,
    public userType?: string,
    public accountStatus?: string
  ) {}
}
