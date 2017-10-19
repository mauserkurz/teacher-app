export class User {
  id: string;
  firstName: string;
  lastName: string;
  login: string;
  pathHash: string;

  constructor (data: any) {
    this.id = data && data.id ? data.id : '';
    this.firstName = data && data.firstName ? data.firstName : '';
    this.lastName = data && data.lastName ? data.lastName : '';
    this.login = data && data.login ? data.login : '';
    this.pathHash = data && data.pathHash ? data.pathHash : '';
  }
}