import { Injectable } from '@angular/core';
import { Toast } from 'src/app/models/toast.model';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ToastsService {

  private toastsStorage: Toast[] = [];
  private readonly autoCloseTime = 5000;

  constructor() { }

  get toasts(): Toast[] {
    return this.toastsStorage;
  }

  addToast(toast: Toast) {
    this.toasts.push(toast);
    of('')
      .pipe(
        delay(this.autoCloseTime)
      )
      .subscribe(() => {
        this.removeToast(toast);
      });
  }

  removeToast(toast: Toast) {
    const index = this.toasts.indexOf(toast);
    this.toasts.splice(index, 1);
  }
}
