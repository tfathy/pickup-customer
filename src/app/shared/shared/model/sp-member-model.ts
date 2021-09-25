import { ServiceProviderModel } from './service-provider-model';

export interface SpMemberModel {
  id: number;
  fullNameAr: string;
  fullNameEn: string;
  sp: ServiceProviderModel;
  email: string;
  hireDate: Date;
  terminatedFlag: string;
  jobId: number;
}
