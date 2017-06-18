import {Component, Input, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'app-input-with-system',
  templateUrl: 'inputWithSystem.component.html',
  styleUrls: ['inputWithSystem.component.scss']
})
export class InputWithSystemComponent {

  @Input() value: string;
  @Input() system: number;

  @Input() public systems;
  @Input() public displaySystemNumber = false;

  @Output() public valueChange = new EventEmitter<string>();
  @Output() public systemChange = new EventEmitter<number>();

  setSystem(newSystem: number) {
    this.system = newSystem;
    this.systemChange.emit(this.system);
  }
}
