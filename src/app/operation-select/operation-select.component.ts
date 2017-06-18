import {Component, Input, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'app-operation-select',
  templateUrl: './operation-select.component.html',
  styleUrls: ['operation-select.component.scss']
})
export class OperationSelectComponent {

  @Input() operations;
  @Input() operation;

  @Output() operationChange = new EventEmitter();
}
