export class Toast {
  message: string;
  type: ToastType;
}

export type ToastType = 'success' | 'info' | 'warning' | 'danger' | 'primary' | 'secondary' | 'light' | 'dark';
