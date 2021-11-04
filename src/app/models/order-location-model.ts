import { OrderModel } from './order-model';

export class OrderLocationModel {
  constructor(
    public id?: number,
    public lng?: string,
    public lat?: string,
    public locationDate?: Date,
    public status?: string,
    public slOrder?: OrderModel
  ) {}
}
