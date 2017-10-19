export class Score {
  id: string;
  themeId: string;
  studentId: string;
  date: Date;
  type: string;

  constructor (data: any) {
    this.id = data && data.id ? data.id : '';
    this.themeId = data && data.themeId ? data.themeId : '';
    this.studentId = data && data.studentId ? data.studentId : '';
    this.date = data && data.date ? data.date : new Date;
    this.type = data && data.type ? data.type : '';
  }
}
