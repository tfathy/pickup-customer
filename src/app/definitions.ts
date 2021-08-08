import type { PermissionState } from '@capacitor/core';
export interface PermissionStatus {
    // TODO: change 'location' to the actual name of your alias!
    geolocation: PermissionState;
  }

  export interface EchoPlugin {
    echo(options: { value: string }): Promise<{ value: string }>;
   checkPermissions(): Promise<PermissionStatus>;
   requestPermissions(): Promise<PermissionStatus>;
  }
