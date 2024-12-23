import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';

@Component({
  selector: 'app-success-dialog',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dialog-overlay">
      <div class="dialog-container">
        <h2 class="dialog-title">{{data.title}}</h2>
        <p class="dialog-message">{{data.message}}</p>
        <div class="dialog-actions">
          <button class="confirm-btn" (click)="dialogRef.close()">OK</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dialog-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .dialog-container {
      background: white;
      padding: 24px;
      border-radius: 8px;
      min-width: 320px;
    }
    .dialog-title { margin-bottom: 16px; }
    .dialog-actions {
      display: flex;
      justify-content: flex-end;
      margin-top: 24px;
    }
    .confirm-btn {
      padding: 8px 16px;
      background: #4CAF50;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
  `]
})
export class SuccessDialogComponent {
  constructor(
    public dialogRef: DialogRef<void>,
    @Inject(DIALOG_DATA) public data: { title: string; message: string; }
  ) {}
} 