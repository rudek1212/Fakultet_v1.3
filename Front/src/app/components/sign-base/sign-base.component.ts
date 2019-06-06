import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-sign-base',
  templateUrl: './sign-base.component.html',
  styleUrls: ['./sign-base.component.scss']
})
export class SignBaseComponent {

  constructor() { }

  @Input() title: string;


}
