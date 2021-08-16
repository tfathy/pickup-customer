import { CreateCustomerResponseModel } from './create-customer-response-model';

export class CreateUserRequestModel{
  constructor(
    public customer: CreateCustomerResponseModel,
    public email?: string,
    public password?: string,
    public userType?: string,
    public accountStatus?: string
  ){

  }
}
