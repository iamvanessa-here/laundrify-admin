export interface Customer {
  id: string;
  name: string;
  email: string;
  whatsapp: string;
  address?: string;
  regDate: string;
}

export type OrderStatus = 'Selesai' | 'Dalam Proses' | (string & {});

export interface Order {
  id: string;
  customerId?: string;
  service?: string;
  date: string;
  status: string;
  amount: number;
}

export interface ToastState {
  type: 'success' | 'error';
  message: string;
}