export class Image {
  filename: string;
  filetype: string;
  value: string;

  constructor(filename: string, filetype: string, value: string) {
    this.filename = filename;
    this.filetype = filetype;
    this.value = value;
  }
}
