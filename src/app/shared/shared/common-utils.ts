/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable prefer-arrow/prefer-arrow-functions */
import { Storage } from '@capacitor/storage';

export async function readStorage(key: string): Promise<any> {
  const item = await Storage.get({ key });
  return JSON.parse(item.value);
}

export function generatedRandomString(length) {
  const characters ='0123456789';
    let result = '';
    const charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
}

export interface customerAuthToken {
  userId: string;
  token: string;
  tokenExpirationDate: string;
  email: string;
  fullnameEn: string;
  fullNameAr: string;
  userType: string;
  accountStatus: string;
}
