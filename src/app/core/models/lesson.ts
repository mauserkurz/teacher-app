export class Lesson {
  id: string;
  themeId: string;
  place: string;
  groupIds: string[];
  date: Date;
  subscription: string;

  constructor (data: any) {
    this.id = data && data.id ? data.id : '';
    this.themeId = data && data.themeId ? data.themeId : '';
    this.place = data && data.place ? data.place : '';
    this.groupIds = data && data.groupIds ? data.groupIds : [];
    this.date = data && data.date ? data.date : new Date;
    this.subscription = data && data.subscription ? data.subscription : '';
  }
}
