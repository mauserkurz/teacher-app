export class Matter {
  id: string;
  theme: string;

  constructor (data: any) {
    this.id = data && data.id ? data.id : '';
    this.theme = data && data.theme ? data.theme : '';
  }
}
