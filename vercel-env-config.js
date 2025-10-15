// Vercel ortam değişkenleri yapılandırması
console.log('Vercel Environment Variables Configuration');

// Geliştirme ortamında .env dosyasından oku
if (process.env.NODE_ENV === 'development') {
  require('dotenv').config();
}

// Ortam değişkenlerinin kontrolü
const requiredEnvVars = ['VITE_APP_ID'];

requiredEnvVars.forEach(envVar => {
  if (!process.env[envVar]) {
    console.warn(`Warning: ${envVar} is not set`);
  }
});

module.exports = {
  env: {
    VITE_APP_ID: process.env.VITE_APP_ID || ''
  }
};