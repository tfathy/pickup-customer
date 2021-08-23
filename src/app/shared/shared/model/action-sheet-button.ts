export class CustomActionSheetButton {
  constructor(
    public id: number,
    public text?: string,
    public role?: string,
    public icon?: string,
    public handler?: boolean | void | Promise<boolean | void>
  ) {}
}
