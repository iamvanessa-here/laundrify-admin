// ===== Mock Data for Laundrify Dashboard =====

export const summaryData = [
  {
    id: 1,
    title: 'Total Pesanan',
    value: '1.284',
    change: '+12.5%',
    trend: 'up',
    icon: 'orders',
    color: '#2563EB',
    bgColor: '#DBEAFE',
  },
  {
    id: 2,
    title: 'Pendapatan',
    value: 'Rp 45,8 Jt',
    change: '+8.2%',
    trend: 'up',
    icon: 'revenue',
    color: '#10B981',
    bgColor: '#D1FAE5',
  },
  {
    id: 3,
    title: 'Pelanggan Baru',
    value: '342',
    change: '+15.3%',
    trend: 'up',
    icon: 'customers',
    color: '#8B5CF6',
    bgColor: '#EDE9FE',
  },
  {
    id: 4,
    title: 'Layanan Aktif',
    value: '28',
    change: '+3',
    trend: 'up',
    icon: 'services',
    color: '#F59E0B',
    bgColor: '#FEF3C7',
  },
];

export const revenueChartData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'],
  datasets: [
    {
      label: 'Pendapatan 2026',
      data: [28, 32, 35, 30, 38, 42, 45, 48, 44, 46, 0, 0],
      color: '#2563EB',
    },
    {
      label: 'Pendapatan 2025',
      data: [22, 25, 28, 26, 30, 34, 36, 38, 35, 40, 42, 45],
      color: '#94A3B8',
    },
  ],
};

export const orderStatusData = [
  { label: 'Selesai', value: 856, color: '#10B981', percentage: 67 },
  { label: 'Dalam Proses', value: 284, color: '#2563EB', percentage: 22 },
  { label: 'Menunggu', value: 144, color: '#F59E0B', percentage: 11 },
];

export const recentOrders = [
  {
    id: 'LND-2026-0847',
    customer: 'Ahmad Fauzi',
    service: 'Cuci Reguler',
    date: '25 Okt 2026',
    status: 'Selesai',
    amount: 'Rp 45.000',
  },
  {
    id: 'LND-2026-0846',
    customer: 'Siti Nurhaliza',
    service: 'Cuci Express',
    date: '25 Okt 2026',
    status: 'Dalam Proses',
    amount: 'Rp 75.000',
  },
  {
    id: 'LND-2026-0845',
    customer: 'Budi Santoso',
    service: 'Dry Clean',
    date: '24 Okt 2026',
    status: 'Selesai',
    amount: 'Rp 120.000',
  },
  {
    id: 'LND-2026-0844',
    customer: 'Dewi Lestari',
    service: 'Cuci Setrika',
    date: '24 Okt 2026',
    status: 'Menunggu',
    amount: 'Rp 55.000',
  },
  {
    id: 'LND-2026-0843',
    customer: 'Rizky Pratama',
    service: 'Cuci Selimut',
    date: '24 Okt 2026',
    status: 'Selesai',
    amount: 'Rp 85.000',
  },
  {
    id: 'LND-2026-0842',
    customer: 'Anisa Rahma',
    service: 'Cuci Reguler',
    date: '23 Okt 2026',
    status: 'Selesai',
    amount: 'Rp 35.000',
  },
  {
    id: 'LND-2026-0841',
    customer: 'Hendra Wijaya',
    service: 'Setrika Saja',
    date: '23 Okt 2026',
    status: 'Dalam Proses',
    amount: 'Rp 25.000',
  },
];

export const popularServices = [
  { id: 1, name: 'Cuci Reguler', orders: 456, revenue: 'Rp 16.2 Jt', percentage: 85 },
  { id: 2, name: 'Cuci Express', orders: 312, revenue: 'Rp 23.4 Jt', percentage: 72 },
  { id: 3, name: 'Dry Clean', orders: 198, revenue: 'Rp 23.7 Jt', percentage: 58 },
  { id: 4, name: 'Cuci Setrika', orders: 178, revenue: 'Rp 9.8 Jt', percentage: 45 },
  { id: 5, name: 'Cuci Selimut', orders: 140, revenue: 'Rp 11.9 Jt', percentage: 38 },
];

export const customerActivity = [
  {
    id: 1,
    name: 'Ahmad Fauzi',
    email: 'ahmad.fauzi@email.com',
    totalOrders: 24,
    totalSpent: 'Rp 1.080.000',
    lastOrder: '25 Okt 2026',
    avatar: 'AF',
  },
  {
    id: 2,
    name: 'Siti Nurhaliza',
    email: 'siti.nur@email.com',
    totalOrders: 18,
    totalSpent: 'Rp 1.350.000',
    lastOrder: '25 Okt 2026',
    avatar: 'SN',
  },
  {
    id: 3,
    name: 'Budi Santoso',
    email: 'budi.s@email.com',
    totalOrders: 32,
    totalSpent: 'Rp 3.840.000',
    lastOrder: '24 Okt 2026',
    avatar: 'BS',
  },
  {
    id: 4,
    name: 'Dewi Lestari',
    email: 'dewi.l@email.com',
    totalOrders: 12,
    totalSpent: 'Rp 660.000',
    lastOrder: '24 Okt 2026',
    avatar: 'DL',
  },
  {
    id: 5,
    name: 'Rizky Pratama',
    email: 'rizky.p@email.com',
    totalOrders: 8,
    totalSpent: 'Rp 680.000',
    lastOrder: '24 Okt 2026',
    avatar: 'RP',
  },
];

export const navigationItems = [
  { id: 'ringkasan', label: 'Ringkasan', icon: 'dashboard', path: '/' },
  { id: 'pesanan', label: 'Pesanan', icon: 'orders', path: '/pesanan' },
  { id: 'pelanggan', label: 'Pelanggan', icon: 'customers', path: '/pelanggan' },
  { id: 'layanan', label: 'Layanan', icon: 'services', path: '/layanan' },
  { id: 'pembayaran', label: 'Pembayaran', icon: 'payments', path: '/pembayaran' },
  { id: 'laporan', label: 'Laporan', icon: 'reports', path: '/laporan' },
  { id: 'pengaturan', label: 'Pengaturan', icon: 'settings', path: '/pengaturan' },
];