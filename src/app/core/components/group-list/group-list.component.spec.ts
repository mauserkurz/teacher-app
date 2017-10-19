// angular
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { Component } from "@angular/core";
// vendor
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
// component
import { GroupListComponent } from './group-list.component';
// model
import { Group } from "../../models/group";
// testing data
import { groupArr } from "../../../helpers/data_for_tests";

@Component({
  selector: 'component-wrapper',
  template: `
    <app-group-list [groups]="groups" (selectedGroupId)="filterLessons($event)"></app-group-list>
  `
})

class ComponentWrapper {
  groups: Group[];

  constructor () {
    this.groups = groupArr;
  }

  filterLessons(selectId: string): void {}
}

describe('GroupListComponent', () => {
  let component: GroupListComponent;
  let wrapper: ComponentWrapper;
  let fixture: ComponentFixture<ComponentWrapper>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        NgbModule.forRoot(),
      ],
      declarations: [
        ComponentWrapper,
        GroupListComponent,
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComponentWrapper);
    wrapper = fixture.componentInstance;
    component = fixture.debugElement.children[0].componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should output id of selected group on radio change', () => {
    const sendId: string = '1';
    let id: string = '0';

    component.selectedGroupId.subscribe(value => id = value);
    component.groupId.setValue(sendId);

    expect(id).toEqual(sendId);
  });
});
