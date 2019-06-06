import { Component, OnInit } from '@angular/core';
import { Toast } from 'src/app/models/toast.model';
import { ToastsService } from 'src/app/services/toasts/toasts.service';

@Component({
  selector: 'app-toasts',
  templateUrl: './toasts.component.html',
  styleUrls: ['./toasts.component.scss']
})
export class ToastsComponent implements OnInit {

  toasts: Toast[] = [];

  constructor(private toastService: ToastsService) { }

  ngOnInit() {
    this.toasts = this.toastService.toasts;
  }

  removeToast(toast: Toast) {
    this.toastService.removeToast(toast);
  }

}
