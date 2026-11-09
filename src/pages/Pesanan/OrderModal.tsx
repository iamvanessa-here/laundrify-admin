import React, { useEffect, useState } from 'react';
import { authHeader } from '../../api/client';
import './OrderModal.css';

const CUSTOMERS_API_URL = 'http://localhost:3001/api/customers';
const SERVICES_API_URL = 'http://localhost:3001/api/services';

interface Customer {
  id: string;
  name: string;
  whatsapp: string;
}

interface Service {
  id: number;
  name: string;
  price: number;
  unit: string;
  minOrder: number;
  status: 'Aktif' | 'Nonaktif';
}

interface FormData {
  customerId: string;
  service: string;
  quantity: string;
  status: string;
}

interface Errors {
  customerId?: string;
  quantity?: string;
}

interface NewOrder {
  id: string;
  customerId: string;
  customer: string;
  service: string;
  weight: string;
  date: string;
  status: string;
  amount: string;
  amountRaw?: number;
}

interface OrderModalProps {
  onClose: () => void;
  onAdd: (order: NewOrder) => void | Promise<void>;
}

const formatRupiah = (amount: number): string =>
  `Rp ${amount.toLocaleString('id-ID')}`;

const OrderModal: React.FC<OrderModalProps> = ({ onClose, onAdd }) => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  const [customerSearch, setCustomerSearch] = useState('');
  const [showCustomerResults, setShowCustomerResults] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    customerId: '',
    service: '',
    quantity: '',
    status: 'Menunggu',
  });

  const [errors, setErrors] = useState<Errors>({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const loadFormOptions = async () => {
      try {
        const [customersResponse, servicesResponse] = await Promise.all([
          fetch(CUSTOMERS_API_URL, { headers: authHeader() }),
          fetch(SERVICES_API_URL, { headers: authHeader() }),
        ]);

        const [customersResult, servicesResult] = await Promise.all([
          customersResponse.json(),
          servicesResponse.json(),
        ]);

        if (!customersResponse.ok || !customersResult.success) {
          throw new Error(
            customersResult.message || 'Gagal memuat daftar pelanggan'
          );
        }

        if (!servicesResponse.ok || !servicesResult.success) {
          throw new Error(
            servicesResult.message || 'Gagal memuat daftar layanan'
          );
        }

        const customerList: Customer[] = customersResult.data || [];
        const activeServiceList: Service[] = (servicesResult.data || [])
          .filter((service: Service) => service.status === 'Aktif')
          .map((service: Service) => ({
            ...service,
            price: Number(service.price),
          }));

        setCustomers(customerList);
        setServices(activeServiceList);
        setFormData((current) => ({
          ...current,
          service: activeServiceList[0]?.name || '',
        }));
      } catch (error) {
        setLoadError(
          error instanceof Error ? error.message : 'Terjadi kesalahan'
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadFormOptions();
  }, []);

  const selectedCustomer = customers.find(
    (customer) => customer.id === formData.customerId
  );

  const matchingCustomers = customers.filter((customer) => {
    const search = customerSearch.trim().toLowerCase();

    return (
      search.length > 0 &&
      (customer.name.toLowerCase().includes(search) ||
        customer.whatsapp.includes(customerSearch.trim()))
    );
  });

  const serviceInfo = services.find(
    (service) => service.name === formData.service
  );

  const unit = serviceInfo?.unit || 'kg';
  const pricePerUnit = serviceInfo?.price || 0;
  const minOrder = serviceInfo?.minOrder || 1;

  const quantityNum = Number.parseFloat(formData.quantity.replace(',', '.'));
  const isValidNumber = Number.isFinite(quantityNum) && quantityNum > 0;
  const totalPrice = isValidNumber ? quantityNum * pricePerUnit : 0;
  const isQuantityValid = isValidNumber && quantityNum >= minOrder;

  const minOrderMessage =
    unit === 'kg'
      ? `Minimal ${minOrder} kg`
      : `Minimal ${minOrder} ${unit}`;

  const handleCustomerSearch = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;

    setCustomerSearch(value);
    setShowCustomerResults(true);
    setFormData((current) => ({ ...current, customerId: '' }));
    setErrors((current) => ({ ...current, customerId: '' }));
  };

  const handleSelectCustomer = (customer: Customer) => {
    setCustomerSearch(customer.name);
    setFormData((current) => ({ ...current, customerId: customer.id }));
    setShowCustomerResults(false);
    setErrors((current) => ({ ...current, customerId: '' }));
  };

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;

    setFormData((current) => ({ ...current, [name]: value }));

    if (name === 'quantity') {
      setErrors((current) => ({ ...current, quantity: '' }));
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const newErrors: Errors = {};

    if (!selectedCustomer) {
      newErrors.customerId =
        'Pilih pelanggan yang terdaftar dari hasil pencarian';
    }

    if (!formData.quantity || !isValidNumber) {
      newErrors.quantity = 'Jumlah pesanan wajib diisi';
    } else if (!isQuantityValid) {
      newErrors.quantity = minOrderMessage;
    }

    setErrors(newErrors);

    if (
      Object.keys(newErrors).length > 0 ||
      !selectedCustomer ||
      !serviceInfo
    ) {
      return;
    }

    setIsSaving(true);

    try {
      await onAdd({
        id: `LND-${Date.now()}`,
        customerId: selectedCustomer.id,
        customer: selectedCustomer.name,
        service: serviceInfo.name,
        weight: `${quantityNum} ${unit}`,
        date: new Date().toISOString().slice(0, 10),
        status: formData.status,
        amount: formatRupiah(totalPrice),
        amountRaw: totalPrice,
      });
    } finally {
      setIsSaving(false);
    }
  };

  const noCustomers = !isLoading && customers.length === 0;
  const noServices = !isLoading && services.length === 0;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(event) => event.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Tambah Pesanan Baru</h2>
          <button
            type="button"
            className="modal-close"
            onClick={onClose}
            aria-label="Tutup"
          >
            ✕
          </button>
        </div>

        {isLoading ? (
          <p className="text-muted">Memuat pelanggan dan layanan...</p>
        ) : loadError ? (
          <p role="alert" className="error-text">
            Gagal memuat pilihan: {loadError}
          </p>
        ) : noCustomers ? (
          <p role="alert" className="error-text">
            Belum ada pelanggan terdaftar. Tambahkan pelanggan terlebih dahulu
            melalui menu Pelanggan.
          </p>
        ) : noServices ? (
          <p role="alert" className="error-text">
            Belum ada layanan aktif. Aktifkan atau tambahkan layanan terlebih
            dahulu melalui menu Layanan.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="modal-form">
            <div className="form-group" style={{ position: 'relative' }}>
              <label className="form-label">Cari pelanggan terdaftar</label>
              <input
                type="text"
                className={`form-input ${
                  errors.customerId ? 'input-error' : ''
                }`}
                placeholder="Ketik nama atau nomor WhatsApp..."
                value={customerSearch}
                autoComplete="off"
                onChange={handleCustomerSearch}
                onFocus={() => setShowCustomerResults(true)}
              />

              {showCustomerResults &&
                customerSearch.trim() &&
                !selectedCustomer && (
                  <div
                    style={{
                      position: 'absolute',
                      zIndex: 10,
                      top: '100%',
                      left: 0,
                      right: 0,
                      maxHeight: '180px',
                      overflowY: 'auto',
                      background: '#fff',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
                    }}
                  >
                    {matchingCustomers.length > 0 ? (
                      matchingCustomers.map((customer) => (
                        <button
                          key={customer.id}
                          type="button"
                          onClick={() => handleSelectCustomer(customer)}
                          style={{
                            display: 'block',
                            width: '100%',
                            padding: '10px 12px',
                            border: 0,
                            background: '#fff',
                            textAlign: 'left',
                            cursor: 'pointer',
                          }}
                        >
                          <strong>{customer.name}</strong>
                          <span
                            style={{
                              display: 'block',
                              fontSize: '0.875rem',
                              color: '#64748b',
                            }}
                          >
                            {customer.whatsapp}
                          </span>
                        </button>
                      ))
                    ) : (
                      <p style={{ padding: '10px 12px', margin: 0 }}>
                        Pelanggan tidak ditemukan. Daftarkan dulu di menu
                        Pelanggan.
                      </p>
                    )}
                  </div>
                )}

              {selectedCustomer && (
                <small className="text-muted">
                  Pelanggan terpilih: {selectedCustomer.name}
                </small>
              )}

              {errors.customerId && (
                <span className="error-text">{errors.customerId}</span>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Jenis Layanan</label>
              <select
                name="service"
                className="form-input"
                value={formData.service}
                onChange={handleChange}
              >
                {services.map((service) => (
                  <option key={service.id} value={service.name}>
                    {service.name}
                  </option>
                ))}
              </select>

              {serviceInfo && (
                <div className="service-info">
                  Tarif: <strong>{formatRupiah(pricePerUnit)}</strong> per {unit}
                  <span className="service-info__min">
                    {' '}
                    • Min. {minOrder} {unit}
                  </span>
                </div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">
                {unit === 'kg' ? 'Berat (kg)' : `Jumlah (${unit})`}
              </label>
              <input
                type="number"
                name="quantity"
                className={`form-input ${
                  errors.quantity ? 'input-error' : ''
                }`}
                placeholder={`Masukkan jumlah dalam ${unit}`}
                value={formData.quantity}
                onChange={handleChange}
                min="0"
                step="0.1"
              />
              {errors.quantity && (
                <span className="error-text">{errors.quantity}</span>
              )}
              {!errors.quantity &&
                formData.quantity &&
                !isQuantityValid && (
                  <span className="error-text">{minOrderMessage}</span>
                )}
            </div>

            <div className="form-group">
              <label className="form-label">Status</label>
              <select
                name="status"
                className="form-input"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="Menunggu">Menunggu</option>
                <option value="Dalam Proses">Dalam Proses</option>
              </select>
            </div>

            <div className="price-summary">
              <div className="price-summary__row">
                <span className="price-summary__label">Perhitungan</span>
                <span className="price-summary__value">
                  {formatRupiah(pricePerUnit)} ×{' '}
                  {isValidNumber ? quantityNum : 0} {unit}
                </span>
              </div>
              <div className="price-summary__row price-summary__total">
                <span className="price-summary__label">Total Harga</span>
                <span className="price-summary__value">
                  {formatRupiah(totalPrice)}
                </span>
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn-secondary"
                onClick={onClose}
                disabled={isSaving}
              >
                Batal
              </button>
              <button
                type="submit"
                className="btn-primary"
                disabled={
                  !selectedCustomer ||
                  !serviceInfo ||
                  !isQuantityValid ||
                  isSaving
                }
              >
                {isSaving ? 'Menyimpan...' : 'Simpan Pesanan'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default OrderModal;
