export const navigationItems = [
  { id: 'pesanan', label: 'Pesanan', icon: 'orders', path: '/pesanan' },
  { id: 'layanan', label: 'Layanan', icon: 'services', path: '/layanan' },
  { id: 'pelanggan', label: 'Pelanggan', icon: 'customers', path: '/pelanggan' },
];

export interface Customer {
  id: string;
  name: string;
  email: string;
  whatsapp: string;
  address: string;
  regDate: string;
}
// Tambahkan di bagian bawah src/data/mockData.js

export const mockCustomers: Customer[] = [
  { id: 'CUST-001', name: 'Ahmad Fauzi', email: 'ahmad.fauzi@email.com', whatsapp: '081234567890', address: 'Jl. Merdeka No. 12, Jakarta', regDate: '2026-01-15' },
  { id: 'CUST-002', name: 'Siti Nurhaliza', email: 'siti.nur@email.com', whatsapp: '081298765432', address: 'Jl. Sudirman No. 45, Bandung', regDate: '2026-02-20' },
  { id: 'CUST-003', name: 'Budi Santoso', email: 'budi.s@email.com', whatsapp: '081311223344', address: 'Jl. Gatot Subroto No. 8, Surabaya', regDate: '2026-03-10' },
  { id: 'CUST-004', name: 'Dewi Lestari', email: 'dewi.l@email.com', whatsapp: '081455667788', address: 'Jl. Asia Afrika No. 22, Bandung', regDate: '2026-04-05' },
  { id: 'CUST-005', name: 'Rizky Pratama', email: 'rizky.p@email.com', whatsapp: '081599887766', address: 'Jl. Malioboro No. 1, Yogyakarta', regDate: '2026-05-12' },
  { id: 'CUST-006', name: 'Anisa Rahma', email: 'anisa.r@email.com', whatsapp: '081612345678', address: 'Jl. Diponegoro No. 15, Semarang', regDate: '2026-06-18' },
  { id: 'CUST-007', name: 'Hendra Wijaya', email: 'hendra.w@email.com', whatsapp: '081787654321', address: 'Jl. Pemuda No. 33, Surabaya', regDate: '2026-07-22' },
  { id: 'CUST-008', name: 'Maya Sari', email: 'maya.s@email.com', whatsapp: '081822334455', address: 'Jl. Imam Bonjol No. 7, Medan', regDate: '2026-08-30' },
  { id: 'CUST-009', name: 'Doni Setiawan', email: 'doni.s@email.com', whatsapp: '081966778899', address: 'Jl. Ahmad Yani No. 19, Makassar', regDate: '2026-09-14' },
  { id: 'CUST-010', name: 'Lina Marlina', email: 'lina.m@email.com', whatsapp: '082111223344', address: 'Jl. Pahlawan No. 5, Malang', regDate: '2026-10-01' },
  { id: 'CUST-011', name: 'Fajar Nugroho', email: 'fajar.n@email.com', whatsapp: '082255667788', address: 'Jl. Veteran No. 11, Solo', regDate: '2026-10-15' },
  { id: 'CUST-012', name: 'Rina Wati', email: 'rina.w@email.com', whatsapp: '082399887766', address: 'Jl. Cendrawasih No. 4, Bali', regDate: '2026-10-20' },
];

export interface MockOrder {
  id: string;
  customerId: string;
  service: string;
  date: string;
  status: string;
  amount: number;
}

export const mockOrders: MockOrder[] = [
  // Orders for CUST-001 (3 orders, 1 active)
  { id: 'LND-0847', customerId: 'CUST-001', service: 'Cuci Reguler', date: '2026-10-25', status: 'Selesai', amount: 45000 },
  { id: 'LND-0800', customerId: 'CUST-001', service: 'Cuci Express', date: '2026-09-10', status: 'Selesai', amount: 75000 },
  { id: 'LND-0750', customerId: 'CUST-001', service: 'Dry Clean', date: '2026-08-05', status: 'Dalam Proses', amount: 120000 },
  // Orders for CUST-002 (2 orders)
  { id: 'LND-0846', customerId: 'CUST-002', service: 'Cuci Express', date: '2026-10-25', status: 'Dalam Proses', amount: 75000 },
  { id: 'LND-0790', customerId: 'CUST-002', service: 'Cuci Reguler', date: '2026-07-15', status: 'Selesai', amount: 45000 },
  // Orders for CUST-003 (1 order)
  { id: 'LND-0845', customerId: 'CUST-003', service: 'Dry Clean', date: '2026-10-24', status: 'Selesai', amount: 120000 },
  // Orders for CUST-005 (2 orders)
  { id: 'LND-0843', customerId: 'CUST-005', service: 'Cuci Selimut', date: '2026-10-24', status: 'Selesai', amount: 85000 },
  { id: 'LND-0700', customerId: 'CUST-005', service: 'Cuci Reguler', date: '2026-06-01', status: 'Selesai', amount: 45000 },
  // Orders for CUST-010 (1 order, active)
  { id: 'LND-0850', customerId: 'CUST-010', service: 'Cuci Setrika', date: '2026-10-28', status: 'Dalam Proses', amount: 55000 },
];

// ===== Pricelist Layanan =====
export interface ServicePrice {
  price: number;
  unit: 'kg' | 'lembar' | 'pasang' | 'item';
  minOrder: number;
}

export const SERVICE_PRICES: Record<string, ServicePrice> = {
  'Cuci Setrika': { price: 8000, unit: 'kg', minOrder: 3 },
  'Cuci Lipat': { price: 6000, unit: 'kg', minOrder: 3 },
  'Setrika Saja': { price: 5000, unit: 'kg', minOrder: 3 },
  'Seprai': { price: 15000, unit: 'lembar', minOrder: 1 },
  'Cuci Kilat': { price: 14000, unit: 'kg', minOrder: 3 },
};

export const SERVICE_LIST = Object.keys(SERVICE_PRICES);