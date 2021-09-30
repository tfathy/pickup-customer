import { SysUserModel } from './sys-user-model';

export interface SysUserLogin {
  id: number;
  sysUser: SysUserModel;
  loginDate: Date;
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
}
