export class Student {
  id: string;
  firstName: string;
  lastName: string;
  groupId: string;
  scoreIds: string[];
  noteIds: string[];

  constructor (data: any) {
    this.id = data && data.id ? data.id : '';
    this.firstName = data && data.firstName ? data.firstName : '';
    this.lastName = data && data.lastName ? data.lastName : '';
    this.groupId = data && data.groupId ? data.groupId : '';
    this.scoreIds = data && data.scoreIds ? data.scoreIds : [];
    this.noteIds = data && data.noteIds ? data.noteIds : [];
  }
}
