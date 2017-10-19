import { Component, EventEmitter, HostBinding, Input, OnInit, Output } from '@angular/core';
import { Group } from "../../models/group";
import { AbstractControl, FormBuilder, FormGroup } from "@angular/forms";

@Component({
  selector: 'app-group-list',
  templateUrl: './group-list.component.html',
  styleUrls: ['./group-list.component.scss']
})
export class GroupListComponent implements OnInit {
  @HostBinding('class.raw') raw: boolean = true;
  @Input() groups: Group[];
  @Output() selectedGroupId: EventEmitter<string> = new EventEmitter();
  radioGroupForm: FormGroup;
  groupId: AbstractControl;
  allGroupValue: string = '0';

  constructor(
    private _formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.radioGroupForm = this._formBuilder.group({
      'groupId': [this.allGroupValue],
    });
    this.groupId = this.radioGroupForm.controls['groupId'];
    this.selectedGroupId.emit(this.groupId.value);
    this.groupId.valueChanges.subscribe(value => this.selectedGroupId.emit(value));
  }

}
