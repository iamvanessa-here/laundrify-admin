import React, { useEffect, useState } from 'react';
import './OrderModal.css';

const SERVICES_API_URL = 'http://localhost:3001/api/services';

interface Service {
  id: number;
  name: string;
  price: number;
  unit: string;
  minOrder: number;
  status: 'Aktif' | 'Nonaktif';
}

interface FormData {
  customer: string;
  service: string;
  quantity: string;
  status: string;
}

interface Errors {
  customer?: string;
  quantity?: string;
}

interface NewOrder {
  id: string;
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
  onAdd: (order: NewOrder) => void;
}

const formatRupiah = (amount: number): string =>
  `Rp ${amount.toLocaleString('id-ID')}`;

const OrderModal: React.FC<OrderModalProps> = ({ onClose, onAdd }) => {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoadingServices, setIsLoadingServices] = useState(true);
  const [serviceError, setServiceError] = useState('');

  const [formData, setFormData] = useState<FormData>({
    customer: '',
    service: '',
    quantity: '',
    status: 'Menunggu',
  });

  const [errors, setErrors] = useState<Errors>({});

  useEffect(() => {
    const loadServices = async () => {
      try {
        const response = await fetch(SERVICES_API_URL);
        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.message || 'Gagal memuat layanan');
        }

        const activeServices: Service[] = (result.data || []).filter(
          (service: Service) => service.status === 'Aktif'
        );

        setServices(activeServices);

        setFormData((current) => ({
          ...current,
          service:
            activeServices.find((service) => service.name === current.service)
              ?.name || activeServices[0]?.name || '',
        }));
      } catch (error) {
        const message =
          error instanceof Error ? error.message : 'Terjadi kesalahan';
        setServiceError(message);
      } finally {
        setIsLoadingServices(false);
      }
    };

    loadServices();
  }, []);

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
  const isCustomerValid = formData.customer.trim().length > 0;
  const isFormValid =
    isCustomerValid &&
    isQuantityValid &&
    Boolean(serviceInfo) &&
    !isLoadingServices;

  const minOrderMessage =
    unit === 'kg'
      ? `Minimal ${minOrder} kg`
      : `Minimal ${minOrder} ${unit}`;

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;

    setFormData((current) => ({ ...current, [name]: value }));

    if (name === 'customer' || name === 'quantity') {
      setErrors((current) => ({ ...current, [name]: '' }));
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const newErrors: Errors = {};

    if (!formData.customer.trim()) {
      newErrors.customer = 'Nama pelanggan wajib diisi';
    }

    if (!formData.quantity || !isValidNumber) {
      newErrors.quantity = 'Jumlah pesanan wajib diisi';
    } else if (!isQuantityValid) {
      newErrors.quantity = minOrderMessage;
    }

    if (!serviceInfo) {
      setServiceError('Pilih layanan yang aktif terlebih dahulu');
    }

    if (Object.keys(newErrors).length > 0 || !serviceInfo) {
      setErrors(newErrors);
      return;
    }

    onAdd({
      id: `LND-${Date.now()}`,
      customer: formData.customer.trim(),
      service: serviceInfo.name,
      weight: `${quantityNum} ${unit}`,
      date: new Date().toISOString().slice(0, 10),
      status: formData.status,
      amount: formatRupiah(totalPrice),
      amountRaw: totalPrice,
    });
  };

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

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label className="form-label">Nama Pelanggan</label>
            <input
              type="text"
              name="customer"
              className={`form-input ${errors.customer ? 'input-error' : ''}`}
              placeholder="Masukkan nama pelanggan"
              value={formData.customer}
              onChange={handleChange}
            />
            {errors.customer && (
              <span className="error-text">{errors.customer}</span>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Jenis Layanan</label>
            <select
              name="service"
              className="form-input"
              value={formData.service}
              onChange={handleChange}
              disabled={isLoadingServices || services.length === 0}
            >
              {isLoadingServices ? (
                <option value="">Memuat layanan...</option>
              ) : services.length === 0 ? (
                <option value="">Tidak ada layanan aktif</option>
              ) : (
                services.map((service) => (
                  <option key={service.id} value={service.name}>
                    {service.name}
                  </option>
                ))
              )}
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

            {serviceError && (
              <span role="alert" className="error-text">
                {serviceError}
              </span>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">
              {unit === 'kg' ? 'Berat (kg)' : `Jumlah (${unit})`}
            </label>
            <input
              type="number"
              name="quantity"
              className={`form-input ${errors.quantity ? 'input-error' : ''}`}
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
            >
              Batal
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={!isFormValid}
              style={{
                opacity: isFormValid ? 1 : 0.5,
                cursor: isFormValid ? 'pointer' : 'not-allowed',
              }}
            >
              Simpan Pesanan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OrderModal;