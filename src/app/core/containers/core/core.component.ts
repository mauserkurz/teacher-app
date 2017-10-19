import { Component, HostBinding, OnInit } from '@angular/core';

@Component({
  selector: 'app-core',
  templateUrl: './core.component.html',
  styleUrls: ['./core.component.scss']
})
export class CoreComponent implements OnInit {
  @HostBinding('class.container') container: boolean = true;

  constructor() { }

  ngOnInit() {
  }

}
