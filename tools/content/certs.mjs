// Meira Kozmetik'in yönetim sistemi sertifikaları (latest_content/sertifikalar, IQM Belgelendirme).
// Değerler sertifikalardan aynen alınmıştır. PDF yayınlanmaz; sayfada önizleme (<image>.jpg/.webp, 720 px) ve
// tıklayınca açılan büyük görsel (<image>-buyuk.jpg/.webp, 1240 px) kullanılır (site/images/certs/).
// ISO 14001 belgesinde numara "IQM- UK-E-100136" olarak (boşluklu) yazılmıştır; burada boşluksuz verilir.

export const CERT_INFO = {
  holder: 'Meira Kozmetik İthalat İhracat Sanayi ve Ticaret Ltd. Şti.',
  issuer: 'IQM Belgelendirme (IQM International Certification Ltd.)',
  scope: 'Başka yerde sınıflandırılmamış diğer makine ve ekipmanların toptan ticareti',
  issued: '05.10.2026',
  validUntil: '04.10.2027',
  verifyEmail: 'info@iqmglobal.uk'
};

export const CERTS = [
  {
    id: 'iso-9001',
    standard: 'ISO 9001:2015',
    short: 'ISO 9001',
    name: 'Kalite Yönetim Sistemi',
    number: 'IQM-UK-Q-100136',
    image: 'images/certs/meira-iso-9001-2015'
  },
  {
    id: 'iso-14001',
    standard: 'ISO 14001:2015',
    short: 'ISO 14001',
    name: 'Çevre Yönetim Sistemi',
    number: 'IQM-UK-E-100136',
    image: 'images/certs/meira-iso-14001-2015'
  },
  {
    id: 'iso-22716',
    standard: 'ISO 22716:2007',
    short: 'ISO 22716',
    name: 'Kozmetik İyi Üretim Uygulamaları (GMP)',
    number: 'IQM-UK-G-100136',
    image: 'images/certs/meira-iso-22716-2007-gmp'
  }
];
