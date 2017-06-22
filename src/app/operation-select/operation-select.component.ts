import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-operation-select',
  templateUrl: './operation-select.component.html',
  styleUrls: ['operation-select.component.scss']
})
export class OperationSelectComponent {

  @Input() public operations;
  @Input() public operation;

  @Output() public operationChange = new EventEmitter();
}
