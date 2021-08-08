export class OrderModel {
  constructor(
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
