import { SysUserModel } from './sys-user-model';

export interface AvailabeDriver{
  sysUser: SysUserModel;
  loginDate: Date;
  logoutDate: Date;
  status: string;
  longitude: string;
  latitude: string;
  vclId: number;
  vclCode: string;
  vclDescEn: string;
  vclSizeId: number;
  vclSizeDescEn: string;
  vclSizeDescAr: string;
  teamDescEn: string;
  teamId: number;
  driverNameAr: string;
  driverNameEn: string;
  driverId: number;
  spNameAr: string;
  spNameEn: string;
  spId: number;
  id: number;
  }
  /*
  [
    {
        "sysUser": {
            "userId": "ca9fab25-868e-4d35-9193-a6bd6e03ce20",
            "email": "tarek.devops@gmail.com",
            "userType": "SP_MEMBER",
            "accountStatus": "VERIFIED",
            "sp": null,
            "member": {
                "id": 2,
                "fullNameAr": "اسامة الشعراوي",
                "fullNameEn": "Osama El Sharawy",
                "sp": {
                    "id": 11,
                    "descEn": "ابو خالد للنقل",
                    "descAr": "ابو خالد للنقل",
                    "accountStatus": "VALID",
                    "orderVatPrcnt": null,
                    "companyNameAr": "ابو خالد للنقل",
                    "companyNameEn": "ابو خالد للنقل",
                    "contactPersonNameAr": "السيد احمد عبد الجواد",
                    "contactPersonNameEn": "السيد احمد عبد الجواد",
                    "contactPersonEmail": "tarekfathi_2@hotmail.com",
                    "commNumber": "565656656",
                    "address": "الرياض"
                },
                "email": "tarek.devops@gmail.com",
                "hireDate": "2019-07-31T21:00:00.000+00:00",
                "terminatedFlag": "N",
                "jobId": 3
            },
            "fcmToken": "sdsdsdsd",
            "id": 36
        },
        "loginDate": "2021-09-08T17:00:24.000+00:00",
        "logoutDate": null,
        "status": "AVALIABLE",
        "longitude": "29",
        "latitude": "47",
        "vclId": 5,
        "vclCode": "SM2020",
        "vclDescEn": "Small pickup",
        "vclSizeId": 3,
        "vclSizeDescEn": "Smaall pickup",
        "vclSizeDescAr": "??? ????",
        "teamDescEn": "Osama Pickup",
        "teamId": 22,
        "driverNameAr": "????? ????????",
        "driverNameEn": "Osama El Sharawy",
        "driverId": 2,
        "spNameAr": "??? ???? ?????",
        "spNameEn": "??? ???? ?????",
        "spId": 11,
        "id": 5
    },
    {
        "sysUser": {
            "userId": "ca9fab25-868e-4d35-9193-a6bd6e03ce20",
            "email": "tarek.devops@gmail.com",
            "userType": "SP_MEMBER",
            "accountStatus": "VERIFIED",
            "sp": null,
            "member": {
                "id": 2,
                "fullNameAr": "اسامة الشعراوي",
                "fullNameEn": "Osama El Sharawy",
                "sp": {
                    "id": 11,
                    "descEn": "ابو خالد للنقل",
                    "descAr": "ابو خالد للنقل",
                    "accountStatus": "VALID",
                    "orderVatPrcnt": null,
                    "companyNameAr": "ابو خالد للنقل",
                    "companyNameEn": "ابو خالد للنقل",
                    "contactPersonNameAr": "السيد احمد عبد الجواد",
                    "contactPersonNameEn": "السيد احمد عبد الجواد",
                    "contactPersonEmail": "tarekfathi_2@hotmail.com",
                    "commNumber": "565656656",
                    "address": "الرياض"
                },
                "email": "tarek.devops@gmail.com",
                "hireDate": "2019-07-31T21:00:00.000+00:00",
                "terminatedFlag": "N",
                "jobId": 3
            },
            "fcmToken": "sdsdsdsd",
            "id": 36
        },
        "loginDate": "2021-09-08T17:22:23.000+00:00",
        "logoutDate": null,
        "status": "AVALIABLE",
        "longitude": "29",
        "latitude": "47",
        "vclId": 5,
        "vclCode": "SM2020",
        "vclDescEn": "Small pickup",
        "vclSizeId": 3,
        "vclSizeDescEn": "Smaall pickup",
        "vclSizeDescAr": "??? ????",
        "teamDescEn": "Osama Pickup",
        "teamId": 22,
        "driverNameAr": "????? ????????",
        "driverNameEn": "Osama El Sharawy",
        "driverId": 2,
        "spNameAr": "??? ???? ?????",
        "spNameEn": "??? ???? ?????",
        "spId": 11,
        "id": 6
    },
    {
        "sysUser": {
            "userId": "ca9fab25-868e-4d35-9193-a6bd6e03ce20",
            "email": "tarek.devops@gmail.com",
            "userType": "SP_MEMBER",
            "accountStatus": "VERIFIED",
            "sp": null,
            "member": {
                "id": 2,
                "fullNameAr": "اسامة الشعراوي",
                "fullNameEn": "Osama El Sharawy",
                "sp": {
                    "id": 11,
                    "descEn": "ابو خالد للنقل",
                    "descAr": "ابو خالد للنقل",
                    "accountStatus": "VALID",
                    "orderVatPrcnt": null,
                    "companyNameAr": "ابو خالد للنقل",
                    "companyNameEn": "ابو خالد للنقل",
                    "contactPersonNameAr": "السيد احمد عبد الجواد",
                    "contactPersonNameEn": "السيد احمد عبد الجواد",
                    "contactPersonEmail": "tarekfathi_2@hotmail.com",
                    "commNumber": "565656656",
                    "address": "الرياض"
                },
                "email": "tarek.devops@gmail.com",
                "hireDate": "2019-07-31T21:00:00.000+00:00",
                "terminatedFlag": "N",
                "jobId": 3
            },
            "fcmToken": "sdsdsdsd",
            "id": 36
        },
        "loginDate": "2021-09-08T17:32:09.000+00:00",
        "logoutDate": null,
        "status": "AVALIABLE",
        "longitude": "29",
        "latitude": "47",
        "vclId": 5,
        "vclCode": "SM2020",
        "vclDescEn": "Small pickup",
        "vclSizeId": 3,
        "vclSizeDescEn": "Smaall pickup",
        "vclSizeDescAr": "??? ????",
        "teamDescEn": "Osama Pickup",
        "teamId": 22,
        "driverNameAr": "????? ????????",
        "driverNameEn": "Osama El Sharawy",
        "driverId": 2,
        "spNameAr": "??? ???? ?????",
        "spNameEn": "??? ???? ?????",
        "spId": 11,
        "id": 7
    }
]
  */

