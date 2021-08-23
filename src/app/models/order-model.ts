import { CustomerModel } from '../shared/shared/model/customer-model';
import { LocationTypeModel } from '../shared/shared/model/location-type-model';
import { TeamModel } from '../shared/shared/model/team-model';
import { VclSizeModel } from '../shared/shared/model/vcl-size-model';

export class OrderModel {
  constructor(
    public customer: CustomerModel,
    public vehicleSize: VclSizeModel,
    public destLocationType?: LocationTypeModel,
    public sourceLocationType?: LocationTypeModel,
    public team?: TeamModel,
    public id?: number,
    public requestDate?: Date,
    public reservationDate?: Date,
    public ordExecDate?: Date,
    public ordStatus?: string,
    public sourceElvFlag?: string,
    public sourceFloorNum?: number,
    public sourceLong?: number,
    public sourceLat?: number,
    public sourceMapImage?: string,
    public sourceFormattedAddress?: string,
    public destElvFlag?: string,
    public destFloorNum?: number,
    public destMapImage?: string,
    public destFormatedAddress?: string,
    public destLong?: number,
    public destLat?: number,
    public estimateCost?: number,
    public actualCost?: number,
    public customerNotes?: string,
    public teamNotes?: string,

  ) {}
}
