import { ManagerModel } from './manager-model';

export class TeamModel {
  constructor(
    public id?: number,
    public descAr?: string,
    public descEn?: string,
    public manager?: ManagerModel
  ) {}
}
