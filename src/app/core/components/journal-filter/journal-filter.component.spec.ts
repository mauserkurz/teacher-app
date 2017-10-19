// angular
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
// vendor
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
// component
import { JournalFilterComponent } from './journal-filter.component';
// testing data
import { groupArr, matterArr } from "../../../helpers/data_for_tests";

@Component({
  selector: 'component-wrapper',
  template: `
    <app-journal-filter
      [groups]="storeData.groups"
      [matters]="storeData.matters"
      [initialSelectData]="storeData.filter"
      (selectedData)="filterData($event)"
    ></app-journal-filter>
  `
})

class ComponentWrapper {
  storeData: any;

  constructor () {
    this.storeData = {
      groups: groupArr,
      matters: matterArr,
      filter: {
        groupId: '',
        matterId: '',
      }
    };
  }

  filterData(data: string): boolean {
    return true;
  }
}

describe('JournalFilterComponent', () => {
  let component: JournalFilterComponent;
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
        JournalFilterComponent,
        ComponentWrapper,
      ]
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

  it('should emit selection data', () => {
    const formData: any = {
      groupId: groupArr[0].id,
      matterId: matterArr[0].id,
    };
    const expectedData: any = {
      groupId: groupArr[0].id,
      studentIds: groupArr[0].studentIds,
      matterId: matterArr[0].id,
    };
    let data: any;
    component.selectedData.subscribe(value => data = value);

    component.filterForm.setValue(formData);

    expect(data).toEqual(expectedData);
  });
});
