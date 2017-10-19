import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Score } from "../../models/score";
import { AbstractControl, FormBuilder, FormGroup } from "@angular/forms";

@Component({
  selector: 'app-score-form',
  templateUrl: './score-form.component.html',
  styleUrls: ['./score-form.component.scss']
})
export class ScoreFormComponent implements OnInit {
  @Input() score: Score;
  @Output() updateScore$: EventEmitter<Score> = new EventEmitter();
  types: string[] = [
    'not present',
    'present',
    'score:1',
    'score:2',
    'score:3',
    'score:4',
    'score:5',
  ];
  scoreForm: FormGroup;
  type: AbstractControl;

  constructor(private _formBuilder: FormBuilder) { }

  ngOnInit() {
    this.scoreForm = this._formBuilder.group({
      'type': [this.score.type],
    });
    this.type = this.scoreForm.controls['type'];
    this.type.valueChanges.subscribe(value => {
      this.score.type = value;
      this.updateScore$.next(this.score);
    });

  }
}
