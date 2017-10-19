export class Group {
  id: string;
  name: string;
  lessonsIds: string[];
  studentIds: string[];

  constructor (data: any) {
    this.id = data && data.id ? data.id : '';
    this.name = data && data.name ? data.name : '';
    this.lessonsIds = data && data.lessonsIds ? data.lessonsIds : [];
    this.studentIds = data && data.studentIds ? data.studentIds : [];
  }
}
