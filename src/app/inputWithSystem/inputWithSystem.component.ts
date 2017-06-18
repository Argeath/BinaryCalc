import {Component, Input, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'app-input-with-system',
  templateUrl: 'inputWithSystem.component.html',
  styleUrls: ['inputWithSystem.component.scss']
})
export class InputWithSystemComponent {

  @Input() value: string;
  @Input() system: number;

  @Input() systems;
  @Input() bitsArray: number[];
  @Input() displaySystemNumber: boolean = false;

  @Input() hasBitSelect: boolean = false;
  @Input() bits: number;

  @Input() placeholder: string = "Your value";


  @Output() valueChange = new EventEmitter<string>();
  @Output() systemChange = new EventEmitter<number>();
  @Output() bitsChange = new EventEmitter<number>();

  setSystem(newSystem: number) {
    this.system = newSystem;
    this.systemChange.emit(this.system);
  }
}
