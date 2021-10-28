export class ManagerModel {
  constructor(
    public id?: number,
    public fullNameAr?: string,
    public fullNameEn?: string,
    public gender?: string,
    public birthDate?: Date,
    public imageFileName?: string,
    public drivingLicnExpDate?: Date,
    public phoneNum?: string,
    public email?: string,
    public hireDate?: Date,
    public terminatedFlag?: string
  ) {}
}
