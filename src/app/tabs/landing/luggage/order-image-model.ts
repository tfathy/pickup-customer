export class OrderImagesModel{
  constructor(
    public ordId: number,
    public imageName?: string,
    public imageExt?: string,
    public imageSize?: string
  ) {}
}
