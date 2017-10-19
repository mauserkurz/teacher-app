// angular
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { Component } from "@angular/core";
// vendor
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
// component
import { ScoreFormComponent } from './score-form.component';
// model
import { Score } from "../../models/score";
// testing data
import { scoreArr } from "../../../helpers/data_for_tests";

@Component({
  selector: 'component-wrapper',
  template: `
    <app-score-form
        [score]="score"
        (updateScore$)="updateScore($event)">
    </app-score-form>
  `
})

class ComponentWrapper {
  score: Score;

  constructor () {
    this.score = scoreArr[0];
  }

  updateScore(score: Score): void {}
}


describe('ScoreFormComponent', () => {
  let component: ScoreFormComponent;
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
        ScoreFormComponent,
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

  it('should on changing value of type input emit updated score', () => {
    const type: string = 'score:3';
    const score: Score = scoreArr[0];
    let receivedScore: Score;

    component.updateScore$.subscribe(score => receivedScore = score);
    component.scoreForm.controls['type'].setValue(type);
    fixture.detectChanges();

    score.type = type;
    expect(receivedScore).toEqual(score);
  });
});
