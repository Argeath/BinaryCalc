import { Component, Input, Output, EventEmitter } from '@angular/core';
import { throttle } from '../../utils/throttle';

@Component({
  selector: 'app-input-with-system',
  templateUrl: 'inputWithSystem.component.html',
  styleUrls: ['inputWithSystem.component.scss']
})
export class InputWithSystemComponent {

  @Input() public value: string;
  @Input() public system: number;

  @Input() public systems;
  @Input() public bitsArray: number[];
  @Input() public displaySystemNumber: boolean = false;

  @Input() public hasBitSelect: boolean = false;
  @Input() public bits: number;

  @Input() public placeholder: string = 'Your value';

  @Output() public valueChange = new EventEmitter<string>();
  @Output() public systemChange = new EventEmitter<number>();
  @Output() public bitsChange = new EventEmitter<number>();

  @throttle()
  public setValue() {
    this.valueChange.emit(this.value);
  }

  public setSystem(newSystem: number) {
    this.system = newSystem;
    this.systemChange.emit(this.system);
  }
}
