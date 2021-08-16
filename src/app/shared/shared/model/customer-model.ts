export class CustomerModel {
  constructor(
    public id: number,
    public fullNameAr: string,
    public fullNameEn: string,
    public gender: string,
    public phoneNumber: string,
    public birthDate: Date,
    public email: string,
    public homeCity: string,
    public facebookLink: string,
    public fbPhotoLink: string,
    public fbId: string,
    public payCardType: string
  ) {}
}
