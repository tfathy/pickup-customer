export class PushNotificationMessage{
  constructor(public token: string,public notification: PickUpNotification){}
}

interface PickUpNotification{
  body: string;
  title: string;
}
