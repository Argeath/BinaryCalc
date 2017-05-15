import {
  Directive,
  Output,
  EventEmitter,
  HostListener,
  ElementRef, Input
} from '@angular/core';

@Directive({
  selector: '[copyClipboard]'
})
export class CopyClipboardDirective {

  element: Node;

  @Input() copyClipboard: string;
  @Output() onCopy = new EventEmitter();

  constructor(elm: ElementRef) {
    this.element = elm.nativeElement;
  }

  @HostListener('click', ['$event'])
  onClick(event) {
    const selection = getSelection();
    const range = document.createRange();

    const el = document.getElementById(this.copyClipboard);

    range.selectNodeContents(el);
    selection.removeAllRanges();
    selection.addRange(range);
    document.execCommand('copy');

    this.onCopy.emit(range);
    console.log(`Copied ${range} to your clipboard!`);
  }
}
