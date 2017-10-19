import { Component, EventEmitter, HostBinding, Input, OnInit, Output, OnChanges } from '@angular/core';
import { Group } from "../../models/group";
import { AbstractControl, FormBuilder, FormGroup } from "@angular/forms";
import { Matter } from "../../models/matter";
import { IFilterJournalData } from "../../../store/reducer";

@Component({
  selector: 'app-journal-filter',
  templateUrl: './journal-filter.component.html',
  styleUrls: ['./journal-filter.component.scss']
})
export class JournalFilterComponent implements OnInit, OnChanges {
  @HostBinding('class.raw') raw: boolean = true;
  @Input() groups: Group[];
  @Input() matters: Matter[];
  @Input() initialSelectData: any;
  @Output() selectedData: EventEmitter<IFilterJournalData> = new EventEmitter();
  filterForm: FormGroup;
  groupId: AbstractControl;
  matterId: AbstractControl;
  dataReceived: boolean = false;

  constructor(private _formBuilder: FormBuilder) { }

  ngOnInit() {
    const groupId = (this.initialSelectData && this.initialSelectData.groupId) || (this.groups[0] && this.groups[0].id) || '';
    const matterId = (this.initialSelectData && this.initialSelectData.matterId) || (this.matters[0] && this.matters[0].id) || '';

    this.filterForm = this._formBuilder.group({
      'groupId': [groupId],
      'matterId': [matterId],
    });
    this.groupId = this.filterForm.controls['groupId'];
    this.matterId = this.filterForm.controls['matterId'];

    this.filterForm.valueChanges
      .subscribe(value => {
        this.selectedData.next(
          Object.assign(
            value,
            this._getStudentIds( value.groupId )
          )
        );
      });
  }

  ngOnChanges() {
    this._updateFormOnReceivedData();
  }

  private _getStudentIds (groupId: string): any {
    return {
      studentIds: [...this.groups.find(group => group.id === groupId).studentIds]
    };
  }

  private _updateFormOnReceivedData() {
    if(!this.dataReceived && this.filterForm && this.groups.length && this.matters.length) {
      this.filterForm.setValue({
        groupId: this.initialSelectData.groupId || this.groups[0].id,
        matterId: this.initialSelectData.matterId || this.matters[0].id,
      });
      this.dataReceived = true;
    }
  }
}
