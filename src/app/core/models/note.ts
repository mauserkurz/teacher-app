export class Note {
  id: string;
  themeId: string;
  studentId: string;
  date: Date;
  text: string;

  constructor (data: any) {
    this.id = data && data.id ? data.id : '';
    this.themeId = data && data.themeId ? data.themeId : '';
    this.studentId = data && data.studentId ? data.studentId : '';
    this.date = data && data.date ? data.date : new Date;
    this.text = data && data.text ? data.text : '';
  }
}
