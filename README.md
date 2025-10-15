# Hava Durumu Uygulaması

Bu proje OpenWeatherMap API'sini kullanarak hava durumu bilgilerini gösteren bir React uygulamasıdır.

## Kurulum

1. Gerekli paketleri yükleyin:
   ```bash
   npm install
   ```

2. `.env` dosyasını oluşturun ve aşağıdaki içeriği ekleyin:
   ```
   VITE_APP_ID=OpenWeatherMap_API_Key
   ```

3. Uygulamayı başlatın:
   ```bash
   npm run dev
   ```

## Vercel'e Dağıtım

Uygulamayı Vercel'e dağıtmak için aşağıdaki adımları izleyin:

1. Vercel hesabınızda yeni bir proje oluşturun
2. Bu repoyu seçin
3. Ayarlar > Environment Variables sekmesine gidin
4. Aşağıdaki ortam değişkenini ekleyin:
   - KEY: `VITE_APP_ID`
   - VALUE: OpenWeatherMap API anahtarınız
   - ENVIRONMENT: Production ve Development için işaretli olmalı

## API Anahtarı Alma

1. [OpenWeatherMap](https://openweathermap.org/api) sitesine gidin
2. Ücretsiz bir hesap oluşturun
3. API anahtarınızı alın
4. Bu anahtarı Vercel ortam değişkenleri olarak ayarlayın

## Geliştirme

- Uygulama Vite ile oluşturulmuştur
- React 18 kullanılmaktadır
- Chart.js ile grafikler gösterilmektedir

## Sorun Giderme

### "Invalid API key" hatası

Bu hata genellikle aşağıdaki nedenlerden dolayı oluşur:

1. API anahtarı doğru şekilde ayarlanmamış
2. Vercel ortam değişkenleri doğru yapılandırılmamış
3. API anahtarı OpenWeatherMap tarafından devre dışı bırakılmış

Çözüm:
1. Vercel dashboard'da Environment Variables ayarlarını kontrol edin
2. `VITE_APP_ID` değişkeninin doğru API anahtarını içerdiğinden emin olun
3. API anahtarınızın OpenWeatherMap'de aktif olduğundan emin olun