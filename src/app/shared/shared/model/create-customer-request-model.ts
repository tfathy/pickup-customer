export class CreateCustomerRequestModel {
  constructor(
    public email: string,
    public id?: number,
    public fullNameAr?: string,
    public fullNameEn?: string,
    public gender?: string,
    public phoneNumber?: string,
    public birthDate?: Date,
    public homeCity?: string,
    public facebookLink?: string,
    public fbPhotoLink?: string,
    public fbId?: string,
    public payCardType?: string
  ) {}
}
