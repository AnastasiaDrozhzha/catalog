import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [NgIf],
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.css'
})
export class AlertComponent {
  @Input() message!: string;
  @Output() alertDismissEvent = new EventEmitter<boolean>();

  onAlertDismiss() {
    this.alertDismissEvent.emit(true);
  }

  isShown(): boolean {
    return !!this.message;
  }
}
